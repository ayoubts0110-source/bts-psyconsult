import React, { useState, useEffect } from "react";
import { Language, SavedResult, ChatMessage, DailyMoodLog } from "./types";
import DisclaimerBanner from "./components/DisclaimerBanner";
import DiagnosticLibrary from "./components/DiagnosticLibrary";
import InteractiveQuiz from "./components/InteractiveQuiz";
import SymptomChart from "./components/SymptomChart";
import AIChatRoom from "./components/AIChatRoom";
import AboutDeveloper from "./components/AboutDeveloper";
import { Brain, BookOpen, MessageSquare, TrendingUp, HelpCircle, Activity, Globe, User, Download } from "lucide-react";

// Standard UI copy translation dictionary
const dictionary = {
  ar: {
    title: "BTS PsyConsult",
    tagline: "أدوات تقييم سريرية ومستشار ذكي قائم على الدليل التشخيصي الخامس",
    tabTests: "الفحوصات الذاتية",
    tabLibrary: "دليل معايير DSM-5",
    tabAI: "المستشار الذكي",
    tabTracker: "مراقبة الأعراض والاتجاهات",
    tabDeveloper: "حول المطور",
    credit: "مرجع تشخيصي يعتمد على الدليل التشخيصي والإحصائي للاضطرابات النفسية (DSM-5)",
    historyTitle: "سجل التقييمات المحفوظة",
    noHistory: "لا توجد تقييمات محفوظة بعد في سجلك المحلي.",
    scoreLabel: "الدرجة:",
    dateLabel: "التاريخ:",
    resultCategory: "التشخيص المبدئي:",
    consultButton: "استشر الذكاء الاصطناعي حول النتيجة",
    sessionLabel: "وقت الجلسة الحالي:",
    clearAll: "مسح كافة البيانات المخزنة"
  },
  en: {
    title: "BTS PsyConsult",
    tagline: "Interactive screening tests & AI companion based on the DSM-5",
    tabTests: "Screening Center",
    tabLibrary: "DSM-5 Reference Library",
    tabAI: "AI Companion",
    tabTracker: "Symptom Tracker & Diary",
    tabDeveloper: "About Developer",
    credit: "Sourced from the Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition",
    historyTitle: "Saved Historical Assessments",
    noHistory: "No assessments saved in your local history yet.",
    scoreLabel: "Score:",
    dateLabel: "Date Taken:",
    resultCategory: "Indication Category:",
    consultButton: "Consult AI about this",
    sessionLabel: "Current Session Time:",
    clearAll: "Clear All Local Data"
  }
};

export default function App() {
  // Default to Arabic ("ar") since the user asked in Arabic ("هل تتكلم لعربية")
  const [lang, setLang] = useState<Language>("ar");
  const [activeTab, setActiveTab] = useState<"tests" | "library" | "ai" | "tracker" | "developer">("tests");
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyMoodLog[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeHandoffContext, setActiveHandoffContext] = useState<{
    title: string;
    category: string;
    details: any;
  } | null>(null);

  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState<boolean>(false);

  const isAr = lang === "ar";
  const t = dictionary[lang];

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's automatic mini-infobar prompt
      e.preventDefault();
      // Store the event so it can be triggered on user action
      setDeferredPrompt(e);
      // Update UI to let user know they can install the app
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Hide button if the app is already running as a standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBtn(false);
    }

    const handleAppInstalled = () => {
      console.log("BTS PsyConsult has been installed successfully!");
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the browser installation dialog prompt
    deferredPrompt.prompt();
    // Wait for response
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User decision on installing the app:", outcome);
    // Clear prompt state since it can only be prompted once
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Initialize and load data from LocalStorage on mount
  useEffect(() => {
    const results = localStorage.getItem("dsm_saved_results");
    const logs = localStorage.getItem("dsm_daily_logs");
    const chat = localStorage.getItem("dsm_chat_history");
    const savedLang = localStorage.getItem("dsm_preferred_language") as Language;

    if (savedLang) {
      setLang(savedLang);
    }

    if (results) {
      setSavedResults(JSON.parse(results));
    }

    if (chat) {
      setChatMessages(JSON.parse(chat));
    } else {
      // Set default friendly system greeting
      setChatMessages([
        {
          id: "welcome",
          role: "assistant",
          content: isAr
            ? "مرحباً بك في المستشار الذكي المعتمد على الدليل التشخيصي الخامس (DSM-5). كيف يمكنني مساعدتك اليوم؟ يمكنك وصْف أعراضك، أو الاستفسار عن كود تشخيصي معين، أو الاستفسار عن تشخيص فارق لمرض نفسي."
            : "Hello! Welcome to your interactive DSM-5 Diagnostic Assistant. How can I assist you today? Feel free to describe symptoms, ask about clinical criteria, or explore differential diagnostics.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    // Load or seed daily logs so charts aren't completely empty
    if (logs) {
      setDailyLogs(JSON.parse(logs));
    } else {
      const today = new Date();
      const seedLogs: DailyMoodLog[] = [
        {
          id: "seed_1",
          date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          mood: 3,
          anxiety: 3,
          sleep: 6,
          notes: "أشعر بالتوتر الشديد والتعب الجسدي."
        },
        {
          id: "seed_2",
          date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          mood: 4,
          anxiety: 2,
          sleep: 8,
          notes: "نوم أفضل بكثير، وشعرت بإنتاجية أعلى ونشاط ممتاز."
        },
        {
          id: "seed_3",
          date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          mood: 2,
          anxiety: 4,
          sleep: 5,
          notes: "توتر وقلق شديد قبل انتهاء المهلة، وصعوبة بالغة في النوم المتواصل."
        },
        {
          id: "seed_4",
          date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          mood: 3,
          anxiety: 3,
          sleep: 7,
          notes: "استقرار نسبي في الحالة المزاجية، وقمت ببعض تمارين التنفس واليوغا الاسترخائية."
        }
      ];
      setDailyLogs(seedLogs);
      localStorage.setItem("dsm_daily_logs", JSON.stringify(seedLogs));
    }
  }, []);

  // Update language preference and reload initial message if chat is empty
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("dsm_preferred_language", newLang);

    // If chat has only the greeting, translate it
    if (chatMessages.length <= 1) {
      const greeting = newLang === "ar"
        ? "مرحباً بك في المستشار الذكي المعتمد على الدليل التشخيصي الخامس (DSM-5). كيف يمكنني مساعدتك اليوم؟ يمكنك وصْف أعراضك، أو الاستفسار عن كود تشخيصي معين، أو الاستفسار عن تشخيص فارق لمرض نفسي."
        : "Hello! Welcome to your interactive DSM-5 Diagnostic Assistant. How can I assist you today? Feel free to describe symptoms, ask about clinical criteria, or explore differential diagnostics.";

      setChatMessages([
        {
          id: "welcome",
          role: "assistant",
          content: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Save assessment screening result
  const handleSaveAssessmentResult = (result: Omit<SavedResult, "id" | "date">) => {
    const newRecord: SavedResult = {
      ...result,
      id: "res_" + Date.now(),
      date: new Date().toISOString()
    };
    const updated = [...savedResults, newRecord];
    setSavedResults(updated);
    localStorage.setItem("dsm_saved_results", JSON.stringify(updated));
  };

  // Save new daily mood log
  const handleAddDailyLog = (logData: { mood: number; anxiety: number; sleep: number; notes: string }) => {
    const newLog: DailyMoodLog = {
      id: "log_" + Date.now(),
      date: new Date().toISOString(),
      ...logData
    };
    const updated = [...dailyLogs, newLog];
    setDailyLogs(updated);
    localStorage.setItem("dsm_daily_logs", JSON.stringify(updated));
  };

  // Send message to Server-Side Gemini API
  const handleSendChatMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      content: text,
      timestamp
    };

    const updatedHistory = [...chatMessages, userMessage];
    setChatMessages(updatedHistory);
    localStorage.setItem("dsm_chat_history", JSON.stringify(updatedHistory));

    setIsGenerating(true);

    try {
      // Build the history payload mapping role & content
      const apiMessages = updatedHistory.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/dsm5/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          screeningResult: activeHandoffContext
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the server diagnostic API.");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: "msg_" + Date.now() + "_bot",
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalHistory = [...updatedHistory, assistantMsg];
      setChatMessages(finalHistory);
      localStorage.setItem("dsm_chat_history", JSON.stringify(finalHistory));

      // Clear the handoff context once AI has referenced it
      if (activeHandoffContext) {
        setActiveHandoffContext(null);
      }

    } catch (err: any) {
      console.error("AI Assistant communication error:", err);
      const errorMsg: ChatMessage = {
        id: "msg_" + Date.now() + "_err",
        role: "assistant",
        content: isAr
          ? "عذراً، واجهت مشكلة في الاتصال بمستشار الذكاء الاصطناعي. يرجى التحقق من مفتاح API ومحاولة الاتصال مرة أخرى."
          : "Sorry, I encountered an error communicating with the DSM-5 companion. Please verify the Gemini API key is configured.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages([...updatedHistory, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Triggered when clicking "Consult AI about this result" in InteractiveQuiz
  const handleConsultHandoff = (contextData: { title: string; category: string; details: any }) => {
    setActiveHandoffContext(contextData);

    const isArabic = contextData.title.match(/[\u0600-\u06FF]/);

    const consultationPrompt = isArabic
      ? `لقد انتهيت للتو من إجراء فحص ذاتي لـ "${contextData.title}". النتيجة تقع في فئة: "${contextData.category}". يرجى إعطائي تفصيلاً تعليمياً حول هذا التقييم بناءً على معايير DSM-5.`
      : `I just took a screening assessment for "${contextData.title}". The result category indicates: "${contextData.category}". Can you provide an educational DSM-5 aligned explanation of this result?`;

    // Direct transition to Chat Tab and inject prompt
    setActiveTab("ai");
    handleSendChatMessage(consultationPrompt);
  };

  const handleClearHistory = () => {
    const greeting = isAr
      ? "مرحباً بك في المستشار الذكي المعتمد على الدليل التشخيصي الخامس (DSM-5). كيف يمكنني مساعدتك اليوم؟ يمكنك وصْف أعراضك، أو الاستفسار عن كود تشخيصي معين، أو الاستفسار عن تشخيص فارق لمرض نفسي."
      : "Hello! Welcome to your interactive DSM-5 Diagnostic Assistant. How can I assist you today? Feel free to describe symptoms, ask about clinical criteria, or explore differential diagnostics.";

    const defaultMessages: ChatMessage[] = [
      {
        id: "welcome",
        role: "assistant",
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setChatMessages(defaultMessages);
    localStorage.removeItem("dsm_chat_history");
  };

  const handleResetAllData = () => {
    if (confirm(isAr ? "هل أنت متأكد من رغبتك في مسح كافة الفحوصات والملاحظات اليومية المخزنة؟" : "Are you sure you want to delete all saved assessment history and daily logs?")) {
      localStorage.clear();
      setSavedResults([]);
      setDailyLogs([]);
      handleClearHistory();
      alert(isAr ? "تم مسح البيانات بنجاح." : "Data cleared successfully.");
    }
  };

  return (
    <div
      className="min-h-screen bg-white font-sans text-black flex flex-col justify-between"
      dir={isAr ? "rtl" : "ltr"}
      id="app-container"
    >
      {/* Dynamic Navigation Top-Bar Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/10 animate-pulse-slow">
              <Brain className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-black leading-none">
                {t.title}
              </h1>
              <span className="text-[10px] text-zinc-700 font-medium">
                {t.tagline}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Install Application Button (PWA) */}
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-1.5 px-3 focus:outline-none transition-all cursor-pointer shadow-sm shadow-blue-500/25 border-2 border-blue-500 hover:scale-[1.02] active:scale-[0.98]"
                title={isAr ? "تثبيت التطبيق على جهازك" : "Install BTS PsyConsult on your device"}
                id="pwa-install-button"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isAr ? "تثبيت التطبيق" : "Install App"}</span>
              </button>
            )}

            {/* Language Selection switch */}
            <button
              onClick={() => handleLanguageChange(isAr ? "en" : "ar")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-blue-600 bg-blue-50 border-2 border-blue-100 rounded-xl py-1.5 px-3 focus:outline-none transition-all cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              <span>{isAr ? "English" : "العربية"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stage Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Urgent medical disclaimer banner */}
        <DisclaimerBanner lang={lang} />

        {/* Tab Navigation Menu (Bento-grid styled tabs with Blue Accent & White BG) */}
        <div className="flex bg-blue-50/50 p-1.5 rounded-2xl border border-blue-200/80 gap-1 mb-6 max-w-2xl mx-auto" id="main-navigation-bar">
          <button
            onClick={() => setActiveTab("tests")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              activeTab === "tests"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-zinc-700 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">{t.tabTests}</span>
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              activeTab === "library"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-zinc-700 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t.tabLibrary}</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              activeTab === "ai"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-zinc-700 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">{t.tabAI}</span>
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              activeTab === "tracker"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-zinc-700 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t.tabTracker}</span>
          </button>

          <button
            onClick={() => setActiveTab("developer")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer ${
              activeTab === "developer"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                : "text-zinc-700 hover:text-blue-600 hover:bg-blue-50/50"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t.tabDeveloper}</span>
          </button>
        </div>

        {/* Tab Panel Render Grid */}
        <div className="min-h-[450px]">
          {activeTab === "tests" && (
            <div className="space-y-6">
              <InteractiveQuiz
                lang={lang}
                onSaveResult={handleSaveAssessmentResult}
                onConsultAI={handleConsultHandoff}
              />

              {/* Assessment results logs list (shows up underneath selection if tests are inactive) */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm mt-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-3">
                  {t.historyTitle}
                </h3>
                {savedResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="saved-results-history">
                    {[...savedResults].reverse().map((res) => (
                      <div
                        key={res.id}
                        className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                            <span>{t.dateLabel} {new Date(res.date).toLocaleDateString(isAr ? "ar-EG" : "en-US")}</span>
                            <span className="font-bold text-indigo-600">{t.scoreLabel} {res.score}</span>
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {isAr ? res.testTitleAr : res.testTitleEn}
                          </h4>
                          <p className="text-[11px] text-zinc-500">
                            {t.resultCategory} <span className="font-bold text-indigo-500">{isAr ? res.categoryAr : res.categoryEn}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => handleConsultHandoff({
                            title: isAr ? res.testTitleAr : res.testTitleEn,
                            category: isAr ? res.categoryAr : res.categoryEn,
                            details: { score: res.score, individualAnswers: [] }
                          })}
                          className="mt-3 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 text-left border-t border-zinc-200/30 dark:border-zinc-800/30 pt-2 flex items-center gap-1 focus:outline-none"
                        >
                          <MessageSquare className="h-3 w-3" />
                          {t.consultButton}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    {t.noHistory}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "library" && <DiagnosticLibrary lang={lang} />}

          {activeTab === "ai" && (
            <AIChatRoom
              lang={lang}
              messages={chatMessages}
              isGenerating={isGenerating}
              onSendMessage={handleSendChatMessage}
              onClearHistory={handleClearHistory}
              activeContext={activeHandoffContext}
              onClearContext={() => setActiveHandoffContext(null)}
            />
          )}

          {activeTab === "tracker" && (
            <SymptomChart
              lang={lang}
              logs={dailyLogs}
              onAddLog={handleAddDailyLog}
            />
          )}

          {activeTab === "developer" && (
            <AboutDeveloper lang={lang} />
          )}
        </div>
      </main>

      {/* Footer Area with APA citation & clear data */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/60 py-6 mt-12 text-zinc-500 dark:text-zinc-400 text-center text-[10px] space-y-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            {t.credit}
          </p>

          <button
            onClick={handleResetAllData}
            className="text-[10px] text-zinc-400 hover:text-rose-600 transition-colors font-semibold underline focus:outline-none"
          >
            {t.clearAll}
          </button>
        </div>
        <p className="font-mono text-[9px] text-zinc-400">
          BTS PsyConsult Educational Tool • {t.sessionLabel} 2026-06-24
        </p>
      </footer>
    </div>
  );
}
