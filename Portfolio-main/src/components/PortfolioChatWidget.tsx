import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
} from "react-icons/hi2";
import { getKnowledgeBaseReply } from "@/constants/knowledgeBase";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type PortfolioChatWidgetProps = {
  isThemeTransitioning?: boolean;
};

const WELCOME_MESSAGE =
  "Hi! I'm Paul's AI assistant. You can ask me about his skills, projects, experience, or background in web development.";

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
- Answer questions only about Paul's skills, projects, experience, education, contact, and portfolio
- If asked "Who are you?" respond that you are Paul's AI portfolio assistant
- If asked "What is Paul's name?" answer correctly
- If asked about skills, experience, projects, or background, answer using the provided information only
- If the answer is unavailable in the provided information, reply exactly: "I can only answer based on the available knowledge base information."
- Keep responses short, clear, and professional`;

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const PortfolioChatWidget = ({
  isThemeTransitioning = false,
}: PortfolioChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: makeId(), role: "assistant", text: WELCOME_MESSAGE },
  ]);

  const isOpenRef = useRef(isOpen);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  const ai = useMemo(() => {
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }, [apiKey]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (!isOpen) return;
    inputRef.current?.focus();
    setHasUnread(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: makeId(), role: "user", text: userText },
    ];

    setMessages(nextMessages);
    setInput("");

    if (!ai) {
      const fallbackText = getKnowledgeBaseReply(userText);
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", text: fallbackText },
      ]);
      if (!isOpenRef.current) setHasUnread(true);
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

      const assistantText =
        response.text?.trim() ||
        "I couldn't generate a response right now. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", text: assistantText },
      ]);

      if (!isOpenRef.current) setHasUnread(true);
    } catch {
      const fallbackText = getKnowledgeBaseReply(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          text: fallbackText,
        },
      ]);
      if (!isOpenRef.current) setHasUnread(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`fixed right-4 sm:right-6 bottom-20 z-50 w-[calc(100vw-2rem)] sm:w-[390px] max-w-[420px] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        } ${isThemeTransitioning && isOpen ? "theme-widget-switching" : ""}`}
      >
        <section className="theme-card rounded-2xl border border-neutral-700 bg-black text-white shadow-2xl overflow-hidden transition-[background-color,color,border-color,box-shadow,transform,filter,opacity] duration-500">
          <header className="px-4 py-3 border-b border-neutral-700 bg-black">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  Paul&apos;s AI Assistant
                </h3>
                <p className="text-xs text-neutral-300">
                  Ask about skills, projects, or experience
                </p>
                <p className="mt-1 text-[11px] text-neutral-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  AI assistant online
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg border border-neutral-700 text-neutral-100 hover:bg-neutral-800 transition-colors inline-flex items-center justify-center"
                aria-label="Close chat"
              >
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="h-[360px] sm:h-[420px] overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 bg-neutral-900 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[86%] whitespace-pre-line rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-white text-black rounded-br-md"
                      : "bg-neutral-100 text-black border border-neutral-300 rounded-bl-md"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-2.5 text-xs sm:text-sm bg-neutral-800 border border-neutral-700 text-white">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="px-3 py-3 sm:px-4 border-t border-neutral-700 bg-black flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isLoading}
              placeholder="Type your message..."
              className="flex-1 h-11 px-4 rounded-xl border border-neutral-700 bg-neutral-900 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-11 min-w-11 px-3 rounded-xl bg-white hover:bg-neutral-200 disabled:bg-neutral-500 text-black transition-colors inline-flex items-center justify-center"
              aria-label="Send message"
            >
              <HiOutlinePaperAirplane className="w-4 h-4" />
            </button>
          </form>
        </section>
      </div>

      <div className="fixed right-4 sm:right-6 bottom-4 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleWidget}
          className={`h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
            isThemeTransitioning ? "theme-widget-switching" : ""
          }`}
          aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        >
          Any questions?
        </button>

        <button
          type="button"
          onClick={toggleWidget}
          className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white hover:bg-neutral-100 text-black border border-black/10 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl inline-flex items-center justify-center ${
            isThemeTransitioning ? "theme-widget-switching" : ""
          }`}
          aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        >
          <HiOutlineChatBubbleLeftRight className="w-5 h-5 sm:w-6 sm:h-6" />
          {hasUnread && !isOpen && (
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-70 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-200 border border-white/90" />
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default PortfolioChatWidget;
