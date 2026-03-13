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
  const rawText =
    payload === null ? (await response.text().catch(() => "")).trim() : "";

  if (!response.ok) {
    const errorMessage =
      payload && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : rawText || `Chat service request failed (${response.status}).`;
    throw new Error(errorMessage);
  }

  const reply =
    payload && "reply" in payload && typeof payload.reply === "string"
      ? payload.reply.trim()
      : "";

  if (!reply) {
    throw new Error("Chat service returned an empty reply.");
  }

  return reply;
};
