import { getKnowledgeBaseReply } from "./chat-fallback";

export type ChatApiMessage = {
  role: "user" | "assistant";
  text: string;
};

type ChatApiSuccess = {
  reply: string;
};

type ChatApiError = {
  error?: string;
};

const CHAT_FUNCTION_PATH = "/api/chat";

export const requestChatReply = async (
  messages: ChatApiMessage[]
): Promise<string> => {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.text;
  const fallbackReply = getKnowledgeBaseReply(latestUserMessage ?? "");

  try {
    const response = await fetch(CHAT_FUNCTION_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = (contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : null) as
      | ChatApiSuccess
      | ChatApiError
      | null;

    if (!response.ok) {
      return fallbackReply;
    }

    const reply =
      payload && "reply" in payload && typeof payload.reply === "string"
        ? payload.reply.trim()
        : "";

    return reply || fallbackReply;
  } catch {
    return fallbackReply;
  }
};
