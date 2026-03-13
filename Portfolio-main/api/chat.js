const MODEL_NAME = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

const SYSTEM_PROMPT = `You are an AI assistant on the personal portfolio website of Paul Czar F. Cataylo.

About Paul:
- Full Name: Paul Czar F. Cataylo
- Role: BSIT Student | Web Developer | UI/UX Designer
- Location: Siaton, Negros Oriental, Philippines
- Field of Study: Bachelor of Science in Information Technology (BSIT)
- Passion: Building modern, responsive, and user-focused web applications

Skills:
- HTML
- CSS
- JavaScript
- TypeScript
- React
- Tailwind CSS
- Node.js
- Git
- GitHub
- VS Code
- UI/UX Design with Figma

Experience:
- Freelance Data Annotator at Remotask
- Worked on 2D and 3D data annotation for AI training
- Tasks included bounding boxes, segmentation, and LiDAR labeling

Projects:
- RigNation - an e-commerce website for a gaming community
- Heart Banana Fries - a website for a food business
- Personal Portfolio Website

Instructions for the AI:
- Answer questions about Paul's skills, projects, experience, and portfolio
- If asked "Who are you?" respond that you are Paul's AI portfolio assistant
- If asked "What is Paul's name?" answer correctly
- If asked about skills, experience, projects, or background, answer using the provided information
- If the question is unrelated, still respond like a helpful AI assistant
- Keep responses clear, friendly, and professional`;

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

const sendJson = (res, status, body) => {
  res.status(status).json(body);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  const payload =
    typeof req.body === "string" ? parseBody(req.body) : req.body ?? null;
  if (!payload) {
    return sendJson(res, 400, { error: "Invalid JSON body." });
  }

  const messages = buildMessageList(payload);
  if (messages.length === 0) {
    return sendJson(res, 400, { error: "Missing message content." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, {
      error: "Server is missing GEMINI_API_KEY.",
    });
  }

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.text }],
  }));

  try {
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    const geminiData = await geminiResponse.json().catch(() => ({}));

    if (!geminiResponse.ok) {
      const providerError =
        typeof geminiData?.error?.message === "string"
          ? geminiData.error.message
          : "Gemini request failed.";
      return sendJson(res, 502, { error: providerError });
    }

    const reply = extractReply(geminiData);
    if (!reply) {
      return sendJson(res, 502, {
        error: "Gemini returned no text response.",
      });
    }

    return sendJson(res, 200, { reply });
  } catch {
    return sendJson(res, 500, {
      error: "Failed to contact Gemini.",
    });
  }
}
