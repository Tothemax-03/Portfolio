import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { requestChatReply } from "@/lib/chat-api";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const WELCOME_MESSAGE =
  "Hi! I'm Paul's AI assistant. You can ask me about his skills, projects, experience, or background in web development.";

const PortfolioChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", text: userText },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const assistantText = await requestChatReply(nextMessages);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: assistantText,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.trim()
          ? error.message
          : "I couldn't reach the chat service right now. Please try again in a moment.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-6 lg:mt-8 border border-neutral-700 rounded-2xl bg-black text-white p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-white">
          AI Portfolio Assistant
        </h3>
        <span className="text-[11px] sm:text-xs text-neutral-300">
          Powered by Gemini
        </span>
      </div>

      <div className="h-[360px] sm:h-[420px] overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 p-3 sm:p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-line transition-colors ${
                message.role === "user"
                  ? "bg-white text-black rounded-br-md"
                  : "bg-neutral-100 text-black rounded-bl-md border border-neutral-300"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3 text-xs sm:text-sm bg-neutral-800 text-white border border-neutral-700">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Paul's skills, projects, or experience..."
          className="flex-1 h-11 px-4 rounded-xl border border-neutral-700 bg-neutral-900 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="h-11 min-w-11 px-3 sm:px-4 rounded-xl bg-white hover:bg-neutral-200 disabled:bg-neutral-500 text-black text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
        >
          <HiOutlinePaperAirplane className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </section>
  );
};

export default PortfolioChatbot;
