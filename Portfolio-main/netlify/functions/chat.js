import {
  NO_ANSWER_REPLY,
  findKnowledgeMatches,
  buildKnowledgeContext,
  buildFallbackReplyFromMatches,
} from "./knowledge-base.js";

const MODEL_NAME = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

const RESPONSE_HEADERS = {
  "Content-Type": "application/json",
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 12;

const rateLimitStore = globalThis.__chatRateLimitStore || new Map();
globalThis.__chatRateLimitStore = rateLimitStore;

const SYSTEM_PROMPT = `You are an AI portfolio assistant.
Rules:
- Answer ONLY using the provided knowledge base context.
- If the answer is not in the context, reply exactly: "${NO_ANSWER_REPLY}"
- Keep replies short, accurate, and relevant.
- Do not invent facts.`;

const toResponse = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    ...RESPONSE_HEADERS,
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

const getHeader = (headers, key) => {
  if (!headers || typeof headers !== "object") return "";

  const direct = headers[key];
  if (typeof direct === "string") return direct;

  const lower = headers[key.toLowerCase()];
  if (typeof lower === "string") return lower;

  const upper = headers[key.toUpperCase()];
  if (typeof upper === "string") return upper;

  return "";
};

const getClientIdentifier = (event) => {
  const forwardedFor = getHeader(event.headers, "x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const netlifyIp = getHeader(event.headers, "x-nf-client-connection-ip");
  if (netlifyIp) return netlifyIp.trim();

  const realIp = getHeader(event.headers, "x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown-client";
};

const pruneRateLimitStore = (now) => {
  for (const [clientId, timestamps] of rateLimitStore.entries()) {
    const recent = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recent.length > 0) {
      rateLimitStore.set(clientId, recent);
    } else {
      rateLimitStore.delete(clientId);
    }
  }
};

const checkRateLimit = (clientId) => {
  const now = Date.now();
  pruneRateLimitStore(now);

  const timestamps = rateLimitStore.get(clientId) || [];
  const recent = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - recent[0])) / 1000)
    );

    return {
      limited: true,
      retryAfterSeconds,
    };
  }

  recent.push(now);
  rateLimitStore.set(clientId, recent);

  return {
    limited: false,
    retryAfterSeconds: 0,
  };
};

const parseBody = (rawBody) => {
  try {
    return JSON.parse(rawBody ?? "{}");
  } catch {
    return null;
  }
};

const sanitizeMessage = (message) => {
  if (!message || typeof message !== "object") return null;

  const role = message.role === "assistant" ? "assistant" : "user";
  const text = typeof message.text === "string" ? message.text.trim() : "";

  if (!text) return null;

  return {
    role,
    text: text.slice(0, 4000),
  };
};

const buildMessageList = (payload) => {
  if (Array.isArray(payload?.messages)) {
    const fromMessages = payload.messages
      .map(sanitizeMessage)
      .filter(Boolean)
      .slice(-20);

    if (fromMessages.length > 0) return fromMessages;
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return [{ role: "user", text: payload.message.trim().slice(0, 4000) }];
  }

  return [];
};

const extractReply = (data) => {
  const firstCandidate = Array.isArray(data?.candidates)
    ? data.candidates[0]
    : null;
  const parts = Array.isArray(firstCandidate?.content?.parts)
    ? firstCandidate.content.parts
    : [];

  const text = parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || null;
};

const requestGeminiReply = async ({ apiKey, question, context }) => {
  const userPrompt = `Question:\n${question}\n\nKnowledge Base Context:\n${context}`;

  const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: RESPONSE_HEADERS,
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 320,
      },
    }),
  });

  const geminiData = await geminiResponse.json().catch(() => ({}));

  if (!geminiResponse.ok) {
    const providerError =
      typeof geminiData?.error?.message === "string"
        ? geminiData.error.message
        : "Gemini request failed.";
    throw new Error(providerError);
  }

  return extractReply(geminiData);
};

const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return toResponse(405, { error: "Method not allowed." });
  }

  const clientId = getClientIdentifier(event);
  const rateLimit = checkRateLimit(clientId);

  if (rateLimit.limited) {
    return toResponse(
      429,
      {
        error: `Too many requests. Please wait ${rateLimit.retryAfterSeconds} seconds and try again.`,
      },
      {
        "Retry-After": String(rateLimit.retryAfterSeconds),
      }
    );
  }

  const decodedBody =
    event.isBase64Encoded && typeof event.body === "string"
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;

  const payload = parseBody(decodedBody);
  if (!payload) {
    return toResponse(400, { error: "Invalid JSON body." });
  }

  const messages = buildMessageList(payload);
  if (messages.length === 0) {
    return toResponse(400, { error: "Missing message content." });
  }

  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!latestUserMessage || !latestUserMessage.text) {
    return toResponse(400, { error: "Missing user question." });
  }

  const matches = findKnowledgeMatches(latestUserMessage.text, 5);
  if (matches.length === 0) {
    return toResponse(200, { reply: NO_ANSWER_REPLY });
  }

  const fallbackReply = buildFallbackReplyFromMatches(matches);
  const knowledgeContext = buildKnowledgeContext(matches);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return toResponse(200, { reply: fallbackReply });
  }

  try {
    const reply = await requestGeminiReply({
      apiKey,
      question: latestUserMessage.text,
      context: knowledgeContext,
    });

    if (!reply) {
      return toResponse(200, { reply: fallbackReply });
    }

    return toResponse(200, { reply: reply.slice(0, 1200) });
  } catch (error) {
    console.error("Gemini request failed:", error);
    return toResponse(200, { reply: fallbackReply });
  }
};

export { handler };
