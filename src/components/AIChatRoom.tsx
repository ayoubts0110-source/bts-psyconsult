import React, { useState, useEffect, useRef } from "react";
import { Language, ChatMessage } from "../types";
import { Send, Sparkles, MessageSquareText, ShieldAlert, RefreshCw, AlertCircle } from "lucide-react";

interface AIChatRoomProps {
  lang: Language;
  messages: ChatMessage[];
  isGenerating: boolean;
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  activeContext: { title: string; category: string; details: any } | null;
  onClearContext: () => void;
}

export default function AIChatRoom({
  lang,
  messages,
  isGenerating,
  onSendMessage,
  onClearHistory,
  activeContext,
  onClearContext
}: AIChatRoomProps) {
  const isAr = lang === "ar";
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const englishChips = [
    "Explain DSM-5 Major Depressive Episode Criteria A",
    "What is the difference between normal grief and depression in DSM-5?",
    "Explain GAD criteria and typical differential diagnosis",
    "How does DSM-5 define adult ADHD?"
  ];

  const arabicChips = [
    "اشرح لي المعيار (أ) لاضطراب الاكتئاب الجسيم في DSM-5",
    "ما الفرق بين الحزن الطبيعي واكتئاب الدليل الخامس؟",
    "ما هي معايير تشخيص القلق المعمم والتشخيص الفارق؟",
    "كيف يعرّف الدليل الخامس اضطراب فرط الحركة وتشتت الانتباه لدى البالغين؟"
  ];

  const suggestionChips = isAr ? arabicChips : englishChips;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleChipClick = (chipText: string) => {
    if (isGenerating) return;
    onSendMessage(chipText);
  };

  // Helper to detect Arabic in a text string to align RTL dynamically
  const isArabicText = (text: string): boolean => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  // Safe and clean text formatting helper (converts simple markdown bold, lines, lists)
  const formatMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Bold formatter (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parsedLine = trimmed.replace(boldRegex, "<strong>$1</strong>");

      // Check for headers (### or ## or #)
      if (trimmed.startsWith("###")) {
        return (
          <h5
            key={idx}
            className="text-xs font-black text-blue-900 mt-3 mb-1.5"
            dangerouslySetInnerHTML={{ __html: parsedLine.replace("###", "") }}
          />
        );
      }
      if (trimmed.startsWith("##") || trimmed.startsWith("#")) {
        return (
          <h4
            key={idx}
            className="text-sm font-black text-blue-900 mt-4 mb-2 border-b border-blue-100 pb-1"
            dangerouslySetInnerHTML={{ __html: parsedLine.replace(/#+/g, "") }}
          />
        );
      }

      // Check for bullet lists
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li
            key={idx}
            className="list-disc list-inside text-xs leading-relaxed text-zinc-900 pl-2 mb-1"
            dangerouslySetInnerHTML={{ __html: parsedLine.substring(1).trim() }}
          />
        );
      }

      // Check for empty line
      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p
          key={idx}
          className="text-xs leading-relaxed text-zinc-900 mb-1.5 font-medium"
          dangerouslySetInnerHTML={{ __html: parsedLine }}
        />
      );
    });
  };

  return (
    <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-sm h-[600px] flex flex-col justify-between" id="ai-chat-module">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-black flex items-center gap-1">
              {isAr ? "مستشار DSM-5 الذكي" : "DSM-5 AI Consultant"}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold">
              {isAr ? "مساعد تعليمي ذكي للمصطلحات والمعايير السريرية" : "Interactive reference & diagnostic explanation partner"}
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          disabled={messages.length === 0}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-blue-600 disabled:opacity-40 focus:outline-none cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          {isAr ? "مسح المحادثة" : "Clear Chat"}
        </button>
      </div>

      {/* Clinical Active Handoff Context Banner */}
      {activeContext && (
        <div className="bg-blue-50/50 border-b border-blue-100 p-3 flex items-center justify-between gap-4" id="ai-context-banner">
          <div className="flex items-start gap-2 text-[11px] text-blue-900">
            <MessageSquareText className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
            <div className={isAr ? "text-right" : "text-left"}>
              <span className="font-bold">
                {isAr ? "سياق نشط:" : "Active Context:"}{" "}
              </span>
              <span>
                {isAr
                  ? `أعراض فحص "${activeContext.title}" (${activeContext.category})`
                  : `Results for "${activeContext.title}" (${activeContext.category})`}
              </span>
            </div>
          </div>
          <button
            onClick={onClearContext}
            className="text-[10px] text-blue-500 hover:text-blue-700 hover:underline shrink-0 focus:outline-none cursor-pointer"
          >
            {isAr ? "إلغاء السياق" : "Dismiss Context"}
          </button>
        </div>
      )}

      {/* Messages Scrolling Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1.5 custom-scrollbar bg-blue-50/10 rounded-xl my-3 p-3 border border-blue-50">
        {/* Diagnostic disclaimer inside chat scroll */}
        <div className="bg-white p-3 rounded-xl border-2 border-blue-100 flex gap-2.5 text-[10px] text-zinc-700 leading-relaxed mb-2" id="chat-disclaimer">
          <ShieldAlert className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
          <p className={isAr ? "text-right" : "text-left"}>
            {isAr
              ? "مرحباً بك! أنا مساعد ذكاء اصطناعي مدرب على معايير الدليل التشخيصي الخامس (DSM-5). تذكر أن ردودي للأغراض التثقيفية والتعليمية فقط، ولا تشكل تشخيصاً سريرياً رسمياً."
              : "Welcome! I am an AI assistant trained on DSM-5 diagnostic frameworks. My role is strictly educational. I cannot diagnose, but I can help you understand clinical criteria, codes, and differentials."}
          </p>
        </div>

        {/* Dynamic message bubbles list */}
        {messages.map((m) => {
          const isBot = m.role === "assistant";
          const alignAr = isArabicText(m.content);

          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${
                isBot ? "self-start" : "self-end items-end"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl shadow-sm border-2 text-xs leading-relaxed ${
                  isBot
                    ? "bg-white border-blue-100 text-black font-medium"
                    : "bg-blue-600 border-blue-600 text-white font-bold"
                }`}
                style={{ direction: alignAr ? "rtl" : "ltr" }}
              >
                {isBot ? formatMessageContent(m.content) : <p>{m.content}</p>}
              </div>
              <span className="text-[9px] font-mono text-zinc-500 font-bold mt-1 px-1.5">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {/* Generating indicator */}
        {isGenerating && (
          <div className="flex flex-col self-start max-w-[85%] animate-pulse">
            <div className="bg-white border-2 border-blue-100 p-4 rounded-2xl text-blue-600 flex items-center gap-2 text-xs">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              <span className="font-bold">
                {isAr ? "يقوم مستشار DSM-5 بمراجعة المعايير..." : "DSM-5 companion is referencing diagnostic criteria..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips (when chat is empty) */}
      {messages.length <= 1 && !isGenerating && (
        <div className="mb-3 space-y-2 animate-fade-in" id="suggestion-chips">
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {isAr ? "أسئلة شائعة للدليل الخامس" : "Common DSM-5 Questions"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="text-[10px] text-zinc-800 bg-white hover:bg-blue-50 border-2 border-blue-100 rounded-xl px-2.5 py-1.5 text-left transition-all focus:outline-none cursor-pointer font-bold"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Box */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0">
        <input
          type="text"
          placeholder={isAr ? "اسأل عن الرموز التشخيصية، المعايير الطبية، أو صف مشاعرك..." : "Ask about DSM codes, clinical criteria, or describe symptom context..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isGenerating}
          className="flex-1 bg-white border-2 border-blue-200 rounded-xl py-2.5 px-4 text-xs text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-50 disabled:text-blue-300 text-white rounded-xl py-2.5 px-4 shrink-0 transition-all flex items-center justify-center focus:outline-none cursor-pointer shadow-md shadow-blue-500/15"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
