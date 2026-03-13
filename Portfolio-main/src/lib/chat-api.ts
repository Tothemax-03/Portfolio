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

const CHAT_FUNCTION_PATH = "/.netlify/functions/chat";

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

  const payload = (await response.json().catch(() => null)) as
    | ChatApiSuccess
    | ChatApiError
    | null;

  if (!response.ok) {
    const errorMessage =
      payload && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Chat service request failed.";
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
