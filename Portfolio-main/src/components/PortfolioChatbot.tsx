import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { GoogleGenAI } from "@google/genai";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const WELCOME_MESSAGE =
  "Hi! I'm Paul's AI assistant. You can ask me about his skills, projects, experience, or background in web development.";

const SYSTEM_PROMPT = `You are an AI assistant on the personal portfolio website of Paul Czar F. Cataylo.

About Paul:
- Full Name: Paul Czar F. Cataylo
- Role: BSIT Student | Web Developer | UI/UX Designer
- Location: Siaton, Negros Oriental, Philippines
- Field of Study: Bachelor of Science in Information Technology (BSIT)
- Passion: Building modern, responsive, and user-focused web applications.

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
Freelance Data Annotator - Remotask (Remote)
- Worked on 2D and 3D data annotation for AI training
- Tasks included bounding boxes, segmentation, and LiDAR labeling

Projects:
- RigNation - An e-commerce website for a gaming community
- Heart Banana Fries - A website for a food business
- Personal Portfolio Website

Instructions for the AI assistant:
- Answer questions about Paul's skills, experience, projects, and portfolio.
- If the user asks "What is your name?" answer that you are Paul's AI portfolio assistant.
- If the user asks about Paul, answer based on the information above.
- If the question is unrelated, respond like a helpful AI assistant.`;

const PortfolioChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const ai = useMemo(() => {
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }, [apiKey]);

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

    if (!ai) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Missing VITE_GEMINI_API_KEY. Add it in your .env file to enable chat.",
        },
      ]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: nextMessages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.text }],
        })),
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            response.text?.trim() ||
            "I couldn't generate a response right now. Please try again.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I couldn't reach Gemini right now. Please try again in a moment.",
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
