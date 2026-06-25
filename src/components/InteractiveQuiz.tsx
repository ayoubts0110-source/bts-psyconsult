import React, { useState } from "react";
import { Language, ScreeningTest } from "../types";
import { DSM_ASSESSMENTS } from "../data/dsmData";
import { Brain, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, AlertCircle, Save, MessageSquareText } from "lucide-react";

function ProjectiveStimulus({ testId, index, isAr }: { testId: string; index: number; isAr: boolean }) {
  if (testId === "rorschach") {
    return (
      <div className="w-full max-w-md mx-auto aspect-[4/3] bg-zinc-50 border-2 border-zinc-200/80 rounded-2xl flex flex-col items-center justify-center p-6 mb-6 shadow-inner relative overflow-hidden" id="rorschach-stimulus">
        <span className="absolute top-2.5 right-3 text-[9px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
          {isAr ? `لوح روشاخ ${index + 1}` : `Rorschach Plate ${index + 1}`}
        </span>
        <svg viewBox="0 0 200 150" className="w-full h-full max-h-[180px] drop-shadow-md transition-all duration-300">
          {index === 0 && (
            <g fill="#27272a" opacity="0.9">
              <path d="M100 75 C85 55, 45 40, 20 60 C10 68, 15 85, 35 90 C55 95, 80 85, 100 75 Z" />
              <path d="M100 75 C90 85, 60 110, 35 110 C20 110, 25 95, 45 90 Z" />
              <path d="M100 75 C115 55, 155 40, 180 60 C190 68, 185 85, 165 90 C145 95, 120 85, 100 75 Z" />
              <path d="M100 75 C110 85, 140 110, 165 110 C180 110, 175 95, 155 90 Z" />
              <ellipse cx="100" cy="75" rx="4" ry="25" fill="#18181b" />
              <path d="M95 45 C98 35, 102 35, 105 45 L100 55 Z" fill="#18181b" />
            </g>
          )}
          {index === 1 && (
            <g>
              <path d="M100 75 C80 60, 50 60, 45 80 C40 100, 70 120, 100 95 Z" fill="#27272a" />
              <path d="M100 75 C120 60, 150 60, 155 80 C160 100, 130 120, 100 95 Z" fill="#27272a" />
              <circle cx="70" cy="40" r="12" fill="#ef4444" opacity="0.85" />
              <circle cx="130" cy="40" r="12" fill="#ef4444" opacity="0.85" />
              <path d="M100 100 C90 120, 70 135, 100 135 C130 135, 110 120, 100 100 Z" fill="#ef4444" opacity="0.9" />
            </g>
          )}
          {index === 2 && (
            <g>
              <path d="M70 45 C70 38, 62 38, 62 45 C62 55, 75 65, 75 75 C75 90, 55 105, 50 125 C58 125, 68 115, 70 100 C72 85, 82 70, 70 45 Z" fill="#27272a" />
              <path d="M130 45 C130 38, 138 38, 138 45 C138 55, 125 65, 125 75 C125 90, 145 105, 150 125 C142 125, 132 115, 130 100 C128 85, 118 70, 130 45 Z" fill="#27272a" />
              <path d="M100 80 C90 70, 85 90, 100 85 C115 90, 110 70, 100 80 Z" fill="#ef4444" />
              <circle cx="100" cy="82.5" r="3" fill="#ef4444" />
              <path d="M30 40 C20 45, 15 65, 25 65 C35 65, 35 45, 30 40 Z" fill="#ef4444" opacity="0.8" />
              <path d="M170 40 C180 45, 185 65, 175 65 C165 65, 165 45, 170 40 Z" fill="#ef4444" opacity="0.8" />
            </g>
          )}
          {index === 3 && (
            <g fill="#18181b" opacity="0.95">
              <path d="M100 25 C85 45, 75 75, 70 115 C85 130, 115 130, 130 115 C125 75, 115 45, 100 25 Z" />
              <path d="M80 65 C55 60, 30 75, 45 105 C55 115, 75 100, 80 85 Z" />
              <path d="M120 65 C145 60, 170 75, 155 105 C145 115, 125 100, 120 85 Z" />
              <path d="M70 115 C55 120, 40 135, 60 140 C80 140, 80 125, 70 115 Z" />
              <path d="M130 115 C145 120, 160 135, 140 140 C120 140, 120 125, 130 115 Z" />
            </g>
          )}
          {index === 4 && (
            <g fill="#27272a">
              <path d="M100 75 C70 50, 30 45, 10 65 C10 75, 30 80, 50 85 C70 90, 90 85, 100 75 Z" />
              <path d="M100 75 C130 50, 170 45, 190 65 C190 75, 170 80, 150 85 C130 90, 110 85, 100 75 Z" />
              <path d="M90 80 L80 120 L95 90 Z" />
              <path d="M110 80 L120 120 L105 90 Z" />
              <path d="M97 50 L93 25 L99 45 Z" />
              <path d="M103 50 L107 25 L101 45 Z" />
              <ellipse cx="100" cy="70" rx="6" ry="25" fill="#09090b" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (testId === "blackfoot") {
    return (
      <div className="w-full max-w-md mx-auto aspect-[4/3] bg-blue-50/50 border-2 border-blue-100 rounded-2xl flex flex-col items-center justify-center p-5 mb-6 shadow-inner relative overflow-hidden" id="blackfoot-stimulus">
        <span className="absolute top-2.5 right-3 text-[9px] font-mono font-bold text-blue-500 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
          {isAr ? `البطاقة الإسقاطية ${index + 1}` : `Projective Card ${index + 1}`}
        </span>
        <svg viewBox="0 0 200 150" className="w-full h-full max-h-[180px] drop-shadow-md">
          <path d="M0 120 Q50 90, 100 115 T200 100 L200 150 L0 150 Z" fill="#dcfce7" />
          <path d="M0 135 Q70 125, 140 135 T200 130 L200 150 L0 150 Z" fill="#bbf7d0" />

          {index === 0 && (
            <g>
              <ellipse cx="120" cy="115" rx="35" ry="22" fill="#fda4af" />
              <circle cx="145" cy="100" r="10" fill="#f43f5e" opacity="0.3" />
              <path d="M152 100 C155 100, 155 106, 152 106 Z" fill="#fda4af" />
              
              <circle cx="100" cy="125" r="6" fill="#fecdd3" />
              <circle cx="115" cy="127" r="6" fill="#fecdd3" />
              <circle cx="130" cy="125" r="6" fill="#fecdd3" />

              <g transform="translate(45, 120)">
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <circle cx="12" cy="-6" r="6" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <ellipse cx="15" cy="-6" rx="2" ry="3" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <ellipse cx="-6" cy="10" rx="3" ry="2.5" fill="#1f2937" />
                <ellipse cx="6" cy="10" rx="3" ry="2.5" fill="#fbcfe8" />
                <circle cx="11" cy="-8" r="1" fill="#db2777" />
              </g>
              <path d="M52 110 Q50 105, 48 110 Z" fill="#3b82f6" />
            </g>
          )}

          {index === 1 && (
            <g>
              <g transform="translate(130, 95)">
                <ellipse cx="0" cy="0" rx="32" ry="24" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                <circle cx="28" cy="-12" r="14" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                <rect x="36" y="-14" width="8" height="8" rx="2" fill="#fda4af" stroke="#e11d48" strokeWidth="2" />
                <ellipse cx="-18" cy="22" rx="6" ry="10" fill="#e11d48" />
                <ellipse cx="10" cy="22" rx="6" ry="10" fill="#e11d48" />
                <path d="M-30 -5 Q-40 -15, -35 -2" stroke="#fda4af" strokeWidth="3" fill="none" />
              </g>

              <g transform="translate(60, 115)">
                <ellipse cx="0" cy="0" rx="15" ry="11" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <circle cx="12" cy="-8" r="7" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <ellipse cx="-5" cy="11" rx="3.5" ry="2.5" fill="#1f2937" />
                <ellipse cx="5" cy="11" rx="3.5" ry="2.5" fill="#fbcfe8" />
                <circle cx="14" cy="-10" r="1" fill="#db2777" />
              </g>
            </g>
          )}

          {index === 2 && (
            <g>
              <g transform="translate(100, 100)">
                <ellipse cx="0" cy="0" rx="20" ry="14" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <ellipse cx="-16" cy="14" rx="4" ry="3" fill="#1f2937" />
                <ellipse cx="-4" cy="14" rx="4" ry="3" fill="#fbcfe8" />
                <path d="M20 -2 Q35 -15, 25 10 T30 -5" stroke="#db2777" strokeWidth="2" fill="none" />
              </g>
              <path d="M0 0 L150 0 C120 40, 80 80, 50 150 L0 150 Z" fill="#1e1b4b" opacity="0.35" />
              <path d="M10 10 L130 10 C105 45, 75 75, 45 140 L10 140 Z" fill="#1e1b4b" opacity="0.15" />
              <g transform="translate(60, 45)" fill="#ef4444">
                <circle cx="0" cy="15" r="2.5" />
                <path d="M-2 -10 L2 -10 L1 8 L-1 8 Z" />
              </g>
            </g>
          )}

          {index === 3 && (
            <g>
              <rect x="20" y="70" width="160" height="70" rx="10" fill="#fef3c7" opacity="0.6" />
              <g transform="translate(100, 105)">
                <ellipse cx="0" cy="0" rx="40" ry="25" fill="#fda4af" />
                <circle cx="-35" cy="-8" r="12" fill="#fda4af" />
                <path d="M-5 -25 C-15 -30, -10 -20, -10 -20" stroke="#fda4af" strokeWidth="3" fill="none" />
              </g>
              <g transform="translate(110, 92)">
                <ellipse cx="0" cy="0" rx="15" ry="11" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <circle cx="-12" cy="-6" r="6.5" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <ellipse cx="-4" cy="11" rx="3.5" ry="2.5" fill="#1f2937" />
                <path d="M-14 -6 Q-12 -8, -10 -6" stroke="#db2777" strokeWidth="1" fill="none" />
              </g>
              <text x="50" y="80" className="fill-pink-500 font-mono text-xs font-bold">z</text>
              <text x="40" y="95" className="fill-pink-400 font-mono text-sm font-bold">Z</text>
            </g>
          )}

          {index === 4 && (
            <g>
              <ellipse cx="100" cy="120" rx="65" ry="25" fill="#78350f" opacity="0.8" />
              <ellipse cx="105" cy="118" rx="55" ry="18" fill="#451a03" opacity="0.9" />

              <g transform="translate(70, 115)">
                <circle cx="0" cy="0" r="10" fill="#fecdd3" />
                <ellipse cx="-6" cy="5" rx="3" ry="2" fill="#fecdd3" />
              </g>

              <g transform="translate(115, 110)">
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <circle cx="10" cy="-6" r="6" fill="#fbcfe8" stroke="#db2777" strokeWidth="1" />
                <ellipse cx="-5" cy="10" rx="3" ry="2.5" fill="#1f2937" />
                <ellipse cx="5" cy="10" rx="3" ry="2.5" fill="#fbcfe8" />
                <path d="M10 -6 Q12 -8, 14 -6" stroke="#db2777" strokeWidth="1" fill="none" />
              </g>

              <circle cx="85" cy="105" r="2" fill="#451a03" />
              <circle cx="130" cy="108" r="3" fill="#451a03" />
              <circle cx="55" cy="120" r="2.5" fill="#451a03" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  return null;
}

interface InteractiveQuizProps {
  lang: Language;
  onSaveResult: (result: {
    testId: string;
    testTitleEn: string;
    testTitleAr: string;
    score: number;
    categoryEn: string;
    categoryAr: string;
    answers: Record<string, number>;
  }) => void;
  onConsultAI: (result: {
    title: string;
    category: string;
    details: any;
  }) => void;
}

export default function InteractiveQuiz({ lang, onSaveResult, onConsultAI }: InteractiveQuizProps) {
  const isAr = lang === "ar";
  const [selectedTest, setSelectedTest] = useState<ScreeningTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const startTest = (test: ScreeningTest) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizFinished(false);
    setSavedSuccess(false);
  };

  const handleSelectOption = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Auto advance after short delay for better UX
    setTimeout(() => {
      if (selectedTest && currentQuestionIndex < selectedTest.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 250);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (selectedTest && currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const calculateTotalScore = (): number => {
    if (!selectedTest) return 0;
    return selectedTest.questions.reduce((sum, q) => {
      const ansVal = answers[q.id];
      return sum + (ansVal !== undefined ? ansVal : 0);
    }, 0);
  };

  const getInterpretation = () => {
    if (!selectedTest) return { categoryEn: "", categoryAr: "", feedbackEn: "", feedbackAr: "" };
    const score = calculateTotalScore();
    return selectedTest.interpretScore(score, answers);
  };

  const handleSave = () => {
    if (!selectedTest) return;
    const score = calculateTotalScore();
    const interp = getInterpretation();

    onSaveResult({
      testId: selectedTest.id,
      testTitleEn: selectedTest.titleEn,
      testTitleAr: selectedTest.titleAr,
      score,
      categoryEn: interp.categoryEn,
      categoryAr: interp.categoryAr,
      answers
    });

    setSavedSuccess(true);
  };

  const handleConsultAIAction = () => {
    if (!selectedTest) return;
    const score = calculateTotalScore();
    const interp = getInterpretation();

    onConsultAI({
      title: isAr ? selectedTest.titleAr : selectedTest.titleEn,
      category: isAr ? interp.categoryAr : interp.categoryEn,
      details: {
        score,
        totalQuestions: selectedTest.questions.length,
        individualAnswers: selectedTest.questions.map((q) => ({
          question: isAr ? q.textAr : q.textEn,
          answerValue: answers[q.id] || 0,
          answerText: isAr
            ? q.options.find((o) => o.value === answers[q.id])?.textAr || ""
            : q.options.find((o) => o.value === answers[q.id])?.textEn || ""
        }))
      }
    });
  };

  if (!selectedTest) {
    return (
      <div className="space-y-6" id="test-list-screen">
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-extrabold text-blue-600 flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              {isAr ? "مركز فحص ومعايير التشخيص DSM-5" : "DSM-5 Interactive Screening Center"}
            </h3>
            <p className="text-sm text-zinc-700 mt-2 leading-relaxed">
              {isAr
                ? "اختر أحد الاختبارات والتقييمات المعتمدة سريرياً لإجراء فحص ذاتي مبدئي. جميع الاختبارات مبنية بدقة على معايير الدليل التشخيصي الخامس للأمراض النفسية."
                : "Select a clinically approved assessment below to conduct an initial screening. Every diagnostic questionnaire is mapped precisely to standard DSM-5 assessment dimensions."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DSM_ASSESSMENTS.map((test) => (
            <div
              key={test.id}
              className="bg-white border-2 border-blue-100 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-blue-100">
                    {test.dsmCode.split(":")[0]}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 font-semibold">
                    {test.questions.length} {isAr ? "أسئلة" : "questions"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-black">
                  {isAr ? test.titleAr : test.titleEn}
                </h4>
                <p className="text-xs text-zinc-700 leading-relaxed line-clamp-3">
                  {isAr ? test.descriptionAr : test.descriptionEn}
                </p>
              </div>

              <div className="pt-5 border-t border-blue-50 mt-4">
                <button
                  onClick={() => startTest(test)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-xs font-bold shadow-sm transition-colors focus:outline-none cursor-pointer"
                >
                  {isAr ? "ابدأ الفحص التشخيصي" : "Start Screening Assessment"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active quiz screen
  if (!quizFinished) {
    const q = selectedTest.questions[currentQuestionIndex];
    const progressPercent = Math.round(((currentQuestionIndex + 1) / selectedTest.questions.length) * 100);
    const selectedOptionValue = answers[q.id];

    return (
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto" id="active-quiz">
        {/* Quiz Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <button
            onClick={() => setSelectedTest(null)}
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-blue-600 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            {isAr ? "العودة للقائمة" : "Back to Assessments"}
          </button>
          <span className="text-xs font-mono font-bold text-blue-600">
            {currentQuestionIndex + 1} / {selectedTest.questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-50 h-2 rounded-full mb-6 overflow-hidden border border-blue-100">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Projective Image / Visual Canvas stimulus if applicable */}
        <ProjectiveStimulus testId={selectedTest.id} index={currentQuestionIndex} isAr={isAr} />

        {/* Question Area */}
        <div className="min-h-[140px] flex flex-col justify-center py-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-500 mb-2 block">
            {isAr ? "السؤال التشخيصي" : "Diagnostic Item"} {currentQuestionIndex + 1}
          </span>
          <h4 className={`text-lg font-bold text-black leading-relaxed ${isAr ? "text-right" : "text-left"}`}>
            {isAr ? q.textAr : q.textEn}
          </h4>
        </div>

        {/* Answers Options Grid */}
        <div className="grid grid-cols-1 gap-2.5 mt-6">
          {q.options.map((opt) => {
            const isSelected = selectedOptionValue === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(q.id, opt.value)}
                className={`w-full flex items-center justify-between text-left p-4 rounded-xl border-2 transition-all duration-150 focus:outline-none cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 text-black shadow-sm font-extrabold"
                    : "bg-white hover:bg-blue-50/40 border-blue-100 text-zinc-800"
                }`}
              >
                <span className={`text-xs ${isAr ? "text-right flex-1" : "text-left flex-1"}`}>
                  {isAr ? opt.textAr : opt.textEn}
                </span>
                {selectedTest.id !== "iq" && selectedTest.id !== "rorschach" && selectedTest.id !== "blackfoot" && (
                  <span className="font-mono text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded ml-2 shrink-0 font-bold">
                    {opt.value}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* DSM Reference Information Footnote */}
        <div className="mt-8 pt-4 border-t border-blue-100 flex items-start gap-2 text-[11px] text-zinc-600 leading-relaxed">
          <AlertCircle className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p className={isAr ? "text-right" : "text-left"}>
            {isAr
              ? "يجب مراعاة أن معايير DSM-5 تتطلب تقييم ما إذا كانت هذه الأعراض تسبب ضيقاً كبيراً أو خللاً في الأداء الاجتماعي والمهني."
              : "DSM-5 guidelines emphasize evaluating whether these symptoms cause clinically significant distress or social/occupational impairment."}
          </p>
        </div>

        {/* Bottom Nav Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-100">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-1 text-xs font-bold py-2 px-4 rounded-xl border-2 border-blue-200 text-zinc-700 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent focus:outline-none cursor-pointer"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
            {isAr ? "السابق" : "Previous"}
          </button>

          <button
            onClick={handleNext}
            disabled={selectedOptionValue === undefined}
            className="inline-flex items-center gap-1 text-xs font-bold py-2 px-4 rounded-xl border-2 border-blue-200 text-zinc-700 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent focus:outline-none cursor-pointer"
          >
            {isAr ? "التالي" : "Next"}
            <ArrowRight className={`h-3.5 w-3.5 ${isAr ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    );
  }

  // Quiz completed and results screen
  const totalScore = calculateTotalScore();
  const interp = getInterpretation();
  const maxPossibleScore = selectedTest.questions.reduce((sum, q) => {
    const maxVal = Math.max(...q.options.map((o) => o.value));
    return sum + maxVal;
  }, 0);

  return (
    <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto" id="quiz-result">
      <div className="text-center space-y-3 pb-6 border-b border-blue-100">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500 font-mono">
            {selectedTest.dsmCode}
          </span>
          <h3 className="text-xl font-black text-black">
            {isAr ? "اكتمل فحص " + selectedTest.titleAr : selectedTest.titleEn + " Completed"}
          </h3>
        </div>
      </div>

      {/* Score Visual Gauge */}
      <div className="py-6 flex flex-col items-center justify-center">
        {selectedTest.id === "rorschach" || selectedTest.id === "blackfoot" ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600 border-2 border-blue-100 mb-4" id="projective-profile-indicator">
            <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center" id="score-gauge">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-blue-50 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-blue-600 fill-none transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={339.292}
                strokeDashoffset={339.292 - (339.292 * totalScore) / maxPossibleScore}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black font-mono text-black">
                {totalScore}
              </span>
              <span className="text-[10px] block font-mono text-zinc-500 font-bold">
                / {maxPossibleScore} {isAr ? "درجة" : "pts"}
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="text-xs text-zinc-500 uppercase tracking-wide block font-bold">
            {selectedTest.id === "rorschach" || selectedTest.id === "blackfoot"
              ? (isAr ? "النمط الإسقاطي المهيمن" : "Dominant Projective Style")
              : (isAr ? "فئة النتيجة المبدئية" : "Clinical Severity Category")}
          </span>
          <span className="text-lg font-black text-blue-600 mt-0.5 inline-block">
            {isAr ? interp.categoryAr : interp.categoryEn}
          </span>
        </div>
      </div>

      {/* Clinical Guidance Text */}
      <div className="bg-white p-4 rounded-xl border-2 border-blue-100 space-y-2">
        <h5 className="text-xs font-extrabold text-black flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
          {isAr ? "التفسير الإكلينيكي المعتمد على DSM-5:" : "DSM-5 Aligned Interpretation:"}
        </h5>
        <p className={`text-xs leading-relaxed text-zinc-800 font-medium ${isAr ? "text-right" : "text-left"}`}>
          {isAr ? interp.feedbackAr : interp.feedbackEn}
        </p>
      </div>

      {/* Specific Criteria DSM Note */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50/40 border border-blue-100 text-[11px] text-zinc-800 leading-relaxed font-medium">
        <span className="font-extrabold text-blue-900 block mb-1">
          {isAr ? "المعيار المرجعي للدليل التشخيصي الخامس:" : "DSM-5 Criteria Context:"}
        </span>
        {isAr ? selectedTest.dsmCriteriaAr : selectedTest.dsmCriteriaEn}
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-blue-100">
        <button
          onClick={handleSave}
          disabled={savedSuccess}
          className={`inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 px-4 rounded-xl border-2 shadow-sm transition-all focus:outline-none cursor-pointer ${
            savedSuccess
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-white border-blue-200 text-zinc-800 hover:bg-blue-50"
          }`}
        >
          <Save className="h-4 w-4" />
          {savedSuccess
            ? isAr
              ? "تم حفظ النتيجة في السجل بنجاح"
              : "Saved successfully to log"
            : isAr
            ? "حفظ النتيجة في سجلاتي"
            : "Save screening results"}
        </button>

        <button
          onClick={handleConsultAIAction}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/15 transition-all focus:outline-none cursor-pointer"
        >
          <MessageSquareText className="h-4 w-4" />
          {isAr ? "استشارة الذكاء الاصطناعي حول النتيجة" : "Consult AI about this result"}
        </button>
      </div>

      {/* Restart Test Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => startTest(selectedTest)}
          className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-600 focus:outline-none cursor-pointer font-bold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {isAr ? "إعادة إجراء الفحص" : "Retake Assessment"}
        </button>
      </div>
    </div>
  );
}
