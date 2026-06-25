import React, { useState, useEffect } from "react";
import { Language } from "../types";
import { DSM_REFERENCE_LIBRARY } from "../data/dsmData";
import {
  Search,
  BookOpen,
  ShieldAlert,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Type,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Moon,
  Compass
} from "lucide-react";

interface DiagnosticLibraryProps {
  lang: Language;
}

export default function DiagnosticLibrary({ lang }: DiagnosticLibraryProps) {
  const isAr = lang === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  // Classification System Tabs state
  const [activeTab, setActiveTab] = useState<"dsm" | "icd">("dsm");
  // Subcategory specific active system toggle: Record<disorderName, system>
  const [criteriaSystem, setCriteriaSystem] = useState<Record<string, "dsm" | "icd">>({});

  // Focus Mode State Variables
  const [focusedSub, setFocusedSub] = useState<any | null>(null);
  const [focusedParentAr, setFocusedParentAr] = useState<string>("");
  const [focusedParentEn, setFocusedParentEn] = useState<string>("");
  const [focusedSubParentId, setFocusedSubParentId] = useState<string>("");
  const [focusedTheme, setFocusedTheme] = useState<"light" | "sepia" | "dark">("sepia");
  const [focusedFontSize, setFocusedFontSize] = useState<"sm" | "base" | "lg" | "xl" | "2xl">("lg");
  const [focusedFontFamily, setFocusedFontFamily] = useState<"sans" | "serif">("serif");
  const [readingProgress, setReadingProgress] = useState(0);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const toggleSub = (name: string) => {
    setExpandedSub(expandedSub === name ? null : name);
  };

  const toggleCriteriaSystem = (subName: string, system: "dsm" | "icd") => {
    setCriteriaSystem((prev) => ({ ...prev, [subName]: system }));
  };

  const getActiveSystem = (subName: string, parentId: string) => {
    if (parentId === "cim10") return "icd";
    return criteriaSystem[subName] || (activeTab === "icd" ? "icd" : "dsm");
  };

  const getCriteriaList = (sub: any, parentId: string) => {
    const system = getActiveSystem(sub.nameEn, parentId);
    if (system === "dsm") {
      return isAr ? sub.criteriaAr : sub.criteriaEn;
    } else {
      const icdList = isAr ? sub.icdCriteriaAr : sub.icdCriteriaEn;
      if (icdList && icdList.length > 0) {
        return icdList;
      } else {
        return isAr
          ? [
              `الرمز الدولي المطابق: ${sub.code.includes("(") ? sub.code.split("(")[1].replace(")", "") : sub.code}`,
              "تتطابق المعايير السريرية للتصنيف الدولي ICD-10 بشكل كبير مع معايير الدليل التشخيصي DSM-5 لهذا الاضطراب.",
              "يمكن استخدام الرمز التشخيصي المذكور أعلاه لأغراض الترميز الطبي الدولي، وإعداد الفواتير الصحية، والتوثيق الإحصائي في منظمة الصحة العالمية.",
              "قد تختلف متطلبات المدة الزمنية أو شدة الأعراض بشكل طفيف بين النظامين، ولكن التقييم الإكلينيكي الشامل يغطي كلاهما."
            ]
          : [
              `Equivalent ICD-10 Code: ${sub.code.includes("(") ? sub.code.split("(")[1].replace(")", "") : sub.code}`,
              "The clinical criteria under ICD-10 (CIM-10) are substantially aligned with the DSM-5 standards for this disorder.",
              "The diagnostic code listed above is official for international medical coding, clinical billing, and statistical reporting.",
              "While minor differences in duration or symptom thresholds exist, a comprehensive clinical evaluation typically addresses both standards."
            ];
      }
    }
  };

  const startFocusMode = (sub: any, parentAr: string, parentEn: string, parentId: string) => {
    setFocusedSub(sub);
    setFocusedParentAr(parentAr);
    setFocusedParentEn(parentEn);
    setFocusedSubParentId(parentId);
    setReadingProgress(0);
  };

  const closeFocusMode = () => {
    setFocusedSub(null);
  };

  // Prevent background scrolling when Focus Mode is active
  useEffect(() => {
    if (focusedSub) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [focusedSub]);

  // Track scrolling inside the focus modal to calculate exact progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setReadingProgress(Math.min(100, Math.max(0, progress)));
  };

  // Perform search across titles, subcategory names, criteria, and codes
  const filteredLibrary = DSM_REFERENCE_LIBRARY.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const matchesCategory =
      cat.titleEn.toLowerCase().includes(q) ||
      cat.titleAr.includes(q) ||
      cat.code.toLowerCase().includes(q);

    const matchesSubcategories = cat.subcategories.some((sub) => {
      const matchesSubName =
        sub.nameEn.toLowerCase().includes(q) ||
        sub.nameAr.includes(q) ||
        sub.code.toLowerCase().includes(q);

      const matchesCriteria =
        sub.criteriaEn.some((c) => c.toLowerCase().includes(q)) ||
        sub.criteriaAr.some((c) => c.includes(q)) ||
        (sub.icdCriteriaEn && sub.icdCriteriaEn.some((c) => c.toLowerCase().includes(q))) ||
        (sub.icdCriteriaAr && sub.icdCriteriaAr.some((c) => c.includes(q)));

      const matchesDifferentials =
        sub.differentialEn.some((d) => d.toLowerCase().includes(q)) ||
        sub.differentialAr.some((d) => d.includes(q));

      return matchesSubName || matchesCriteria || matchesDifferentials;
    });

    return matchesCategory || matchesSubcategories;
  });

  // Filter and sort categories based on selected standard (DSM-5 vs ICD-10)
  const displayLibrary = filteredLibrary.filter((cat) => {
    if (activeTab === "dsm") {
      return cat.id !== "cim10";
    }
    return true;
  });

  const sortedLibrary = [...displayLibrary].sort((a, b) => {
    if (activeTab === "icd") {
      if (a.id === "cim10") return -1;
      if (b.id === "cim10") return 1;
    }
    return 0;
  });

  // Dynamic style themes mapping for Focus Mode UI
  const themeClasses = {
    light: {
      bg: "bg-[#fbfaf7]",
      text: "text-zinc-800",
      secondaryText: "text-zinc-500",
      accentBg: "bg-zinc-100",
      accentText: "text-blue-600",
      headerBg: "bg-[#fbfaf7]/90 border-zinc-200/80",
      badgeBg: "bg-zinc-100 text-zinc-700",
      cardBg: "bg-white border-zinc-200/50",
      divider: "border-zinc-200/80",
      controlBtn: "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
    },
    sepia: {
      bg: "bg-[#f5ebd5]",
      text: "text-[#443525]",
      secondaryText: "text-[#7b654f]",
      accentBg: "bg-[#ecdcb7]",
      accentText: "text-[#a05a2c]",
      headerBg: "bg-[#f5ebd5]/90 border-[#e5d5b0]",
      badgeBg: "bg-[#e9dab4] text-[#5d4630]",
      cardBg: "bg-[#fbf6e9] border-[#e8d7af]",
      divider: "border-[#ecdcb8]",
      controlBtn: "bg-[#ebdcb9] border-[#d7c298] text-[#443525] hover:bg-[#ebdcb7]"
    },
    dark: {
      bg: "bg-[#0f1115]",
      text: "text-[#e2e4e9]",
      secondaryText: "text-zinc-400",
      accentBg: "bg-[#18191e]",
      accentText: "text-blue-400",
      headerBg: "bg-[#0f1115]/90 border-zinc-800",
      badgeBg: "bg-zinc-800 text-zinc-300",
      cardBg: "bg-[#18191e] border-zinc-800/80",
      divider: "border-zinc-800",
      controlBtn: "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
    }
  }[focusedTheme];

  const fontSizeClass = {
    sm: "text-xs md:text-sm",
    base: "text-sm md:text-base",
    lg: "text-base md:text-lg",
    xl: "text-lg md:text-xl",
    "2xl": "text-xl md:text-2xl"
  }[focusedFontSize];

  const fontFamilyClass = focusedFontFamily === "serif" ? "font-serif" : "font-sans";

  return (
    <div className="space-y-6 text-zinc-950" id="diagnostic-library">
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-sm space-y-4 text-black">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              {isAr ? "دليل المعايير والرموز التشخيصية" : "Diagnostic Standards & Coding Manual"}
            </h3>
            <p className="text-xs text-zinc-700 mt-1">
              {isAr
                ? "تصفح معايير التشخيص الرسمية للدليل التشخيصي DSM-5 والتصنيف الدولي للأمراض ICD-10."
                : "Explore standard diagnostic criteria checklists and official international classification codes."}
            </p>
          </div>

          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={isAr ? "ابحث عن اضطراب، رمز تشخيصي، أو معيار..." : "Search disorders, codes, or symptoms..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-blue-200 rounded-xl py-2 pl-9 pr-4 text-sm text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Diagnostic System Selector Tabs */}
        <div className="flex border-t border-blue-100 pt-3" id="library-system-tabs">
          <div className="flex bg-blue-50 p-1 rounded-xl w-full max-w-lg border-2 border-blue-200">
            <button
              type="button"
              onClick={() => setActiveTab("dsm")}
              className={`flex-1 py-2 text-center text-xs sm:text-sm font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${
                activeTab === "dsm"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-700 hover:text-blue-600"
              }`}
            >
              {isAr ? "الدليل التشخيصي والترميز الأمريكي (DSM-5)" : "DSM-5 Diagnostic Criteria"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("icd")}
              className={`flex-1 py-2 text-center text-xs sm:text-sm font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${
                activeTab === "icd"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-700 hover:text-blue-600"
              }`}
            >
              {isAr ? "التصنيف والترميز الدولي (ICD-10)" : "ICD-10 International Coding"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedLibrary.length > 0 ? (
          sortedLibrary.map((cat) => {
            const isCatExpanded = expandedCategory === cat.id || searchQuery.length > 0;

            return (
              <div
                key={cat.id}
                className="bg-white border-2 border-blue-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between p-5 text-left bg-blue-50/30 hover:bg-blue-50/75 transition-colors focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-500 font-mono">
                      {cat.code}
                    </span>
                    <h4 className="text-base font-semibold text-black">
                      {isAr ? cat.titleAr : cat.titleEn}
                    </h4>
                  </div>
                  <div className="text-blue-500">
                    {isCatExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {/* Subcategories (Disorders) */}
                {isCatExpanded && (
                  <div className="border-t border-blue-100 divide-y divide-blue-100">
                    {cat.subcategories.map((sub) => {
                      const isSubExpanded = expandedSub === sub.nameEn || searchQuery.length > 0;

                      return (
                        <div key={sub.nameEn} className="p-5 space-y-4">
                          {/* Disorder Title */}
                          <button
                            onClick={() => toggleSub(sub.nameEn)}
                            className="w-full flex items-center justify-between group text-left focus:outline-none"
                          >
                            <div className="space-y-1">
                              <h5 className="text-sm font-bold text-blue-600 group-hover:underline flex items-center gap-2">
                                <span className="bg-blue-50 text-[10px] font-mono px-1.5 py-0.5 rounded text-blue-700 border border-blue-100">
                                  {sub.code}
                                </span>
                                {isAr ? sub.nameAr : sub.nameEn}
                              </h5>
                            </div>
                            <div className="text-blue-500">
                              {isSubExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </button>

                          {isSubExpanded && (
                            <div className="space-y-4 animate-fade-in" id={`info-${sub.nameEn}`}>
                              {/* Focus Mode Introduction & Activation Card with White BG and Blue Border */}
                              <div className="bg-blue-50/40 border-2 border-blue-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                                <div className="flex items-start gap-2.5 text-zinc-900">
                                  <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                                  <div className="space-y-0.5">
                                    <span className="font-bold text-blue-900">
                                      {isAr ? "ميزة وضع القراءة الهادئة (Focus Mode)" : "Focus Mode Reader Feature"}
                                    </span>
                                    <p className="text-[11px] text-zinc-700 leading-normal">
                                      {isAr
                                        ? "افتح المعايير التشخيصية في بيئة هادئة كاملة الشاشة خالية من أي مشتتات مع مظهر ورقي مريح للعين."
                                        : "Display these complex diagnostic criteria in a pristine, full-screen distraction-free layout with warm customizable themes."}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => startFocusMode(sub, cat.titleAr, cat.titleEn, cat.id)}
                                  className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all focus:outline-none shrink-0 cursor-pointer shadow-md shadow-blue-500/15 active:scale-95"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {isAr ? "تشغيل وضع القراءة الهادئة" : "Enter Focus Mode"}
                                </button>
                              </div>

                              {/* DSM vs ICD-10 Criterion Switcher */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-3 rounded-xl border-2 border-blue-100" id={`toggle-system-${sub.nameEn}`}>
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-bold text-zinc-600 block">
                                    {isAr ? "نظام التصنيف الفعّال للمقارنة:" : "Active Classification System for Comparison:"}
                                  </span>
                                  <span className="text-xs font-bold text-black">
                                    {getActiveSystem(sub.nameEn, cat.id) === "dsm"
                                      ? (isAr ? "الدليل التشخيصي والإحصائي الأمريكي الخامس (DSM-5)" : "Diagnostic and Statistical Manual of Mental Disorders (DSM-5)")
                                      : (isAr ? "التصنيف الدولي العاشر للأمراض - منظمة الصحة العالمية (ICD-10)" : "WHO International Classification of Diseases (ICD-10 / CIM-10)")
                                    }
                                  </span>
                                </div>
                                <div className="flex bg-blue-50 p-0.5 rounded-lg border border-blue-200 shrink-0">
                                  {cat.id !== "cim10" && (
                                    <button
                                      type="button"
                                      onClick={() => toggleCriteriaSystem(sub.nameEn, "dsm")}
                                      className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                        getActiveSystem(sub.nameEn, cat.id) === "dsm"
                                          ? "bg-blue-600 text-white shadow-sm"
                                          : "text-zinc-700 hover:text-blue-600"
                                      }`}
                                    >
                                      DSM-5
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => toggleCriteriaSystem(sub.nameEn, "icd")}
                                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                                      getActiveSystem(sub.nameEn, cat.id) === "icd"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-zinc-700 hover:text-blue-600"
                                    }`}
                                  >
                                    ICD-10 / CIM-10
                                  </button>
                                </div>
                              </div>

                              {/* Standard view grid */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                                {/* Clinical Criteria checklist */}
                                <div className="space-y-3">
                                  <h6 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5 border-b border-blue-100 pb-2">
                                    <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                                    {getActiveSystem(sub.nameEn, cat.id) === "dsm"
                                      ? (isAr ? "معايير التشخيص السريرية (DSM-5)" : "DSM-5 Diagnostic Criteria Checklist")
                                      : (isAr ? "المعايير والخطوط الإرشادية (ICD-10)" : "ICD-10 Clinical Guidelines Checklist")
                                    }
                                    {getActiveSystem(sub.nameEn, cat.id) === "icd" && (
                                      <span className="bg-blue-100 text-blue-700 text-[10px] font-mono px-1 rounded">
                                        {sub.icdCode || (sub.code.includes("(") ? sub.code.split("(")[1].replace(")", "") : sub.code)}
                                      </span>
                                    )}
                                  </h6>
                                  <ul className="space-y-2">
                                    {getCriteriaList(sub, cat.id).map((criteria, index) => (
                                      <li key={index} className="flex gap-2.5 items-start text-xs leading-relaxed text-zinc-900">
                                        <span className="inline-flex items-center justify-center h-4.5 w-4.5 rounded bg-blue-50 text-[10px] text-blue-600 font-mono font-extrabold shrink-0">
                                          {index + 1}
                                        </span>
                                        <span className={isAr ? "text-right flex-1" : "text-left flex-1"}>
                                          {criteria}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Differential Diagnoses */}
                                <div className="space-y-3">
                                  <h6 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5 border-b border-blue-100 pb-2">
                                    <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
                                    {isAr ? "التشخيص الفارق (لاستبعاد الحالات الأخرى)" : "Clinical Differential Diagnoses"}
                                  </h6>
                                  <p className="text-[11px] text-zinc-600 italic leading-normal">
                                    {isAr
                                      ? "قبل تأكيد التشخيص، يجب استبعاد الاضطرابات المتداخلة التالية طبيّاً ونفسيّاً:"
                                      : "Before confirming diagnosis, clinical standards require ruling out these overlapping conditions:"}
                                  </p>
                                  <ul className="space-y-2">
                                    {(isAr ? sub.differentialAr : sub.differentialEn).map((diff, index) => (
                                      <li key={index} className="flex gap-2 items-center text-xs text-black bg-blue-50/10 p-2 border border-blue-100 rounded-lg">
                                        <AlertCircle className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                        <span className={isAr ? "text-right flex-1" : "text-left flex-1"}>
                                          {diff}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <BookOpen className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
              {isAr ? "لم نجد نتائج مطابقة لبحثك" : "No clinical criteria matched your query"}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {isAr ? "تأكد من كتابة الكلمة بشكل صحيح، أو ابحث عن فئة رئيسية." : "Try adjusting your search terms or keywords."}
            </p>
          </div>
        )}
      </div>

      {/* Focus Mode Full-Screen Immersive Overlay */}
      {focusedSub && (
        <div
          id="focus-modal-container"
          onScroll={handleScroll}
          className={`fixed inset-0 z-[100] overflow-y-auto h-full w-full transition-all duration-300 animate-fade-in ${themeClasses.bg} flex flex-col`}
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Scroll Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1.5 z-[110] bg-zinc-200/10">
            <div
              className="h-full bg-indigo-600 transition-all duration-75"
              style={{ width: `${readingProgress}%` }}
            />
          </div>

          {/* Immersive Controls Top bar */}
          <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 py-3.5 flex items-center justify-between shadow-sm transition-colors duration-200 ${themeClasses.headerBg}`}>
            {/* Left controls: Typography adjustments */}
            <div className="flex items-center gap-2">
              {/* Font Style Select (Serif vs Sans) */}
              <button
                onClick={() => setFocusedFontFamily(focusedFontFamily === "serif" ? "sans" : "serif")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all focus:outline-none ${themeClasses.controlBtn}`}
                title={isAr ? "تبديل نوع الخط" : "Toggle Font Family"}
              >
                <Type className="h-3.5 w-3.5 text-indigo-500" />
                <span>{focusedFontFamily === "serif" ? "Sans" : "Serif"}</span>
              </button>

              {/* Font Size decrease & increase buttons */}
              <div className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: themeClasses.divider }}>
                <button
                  onClick={() => {
                    const sizes: ("sm" | "base" | "lg" | "xl" | "2xl")[] = ["sm", "base", "lg", "xl", "2xl"];
                    const idx = sizes.indexOf(focusedFontSize);
                    if (idx > 0) setFocusedFontSize(sizes[idx - 1]);
                  }}
                  className={`px-2.5 py-1.5 text-xs font-bold focus:outline-none border-r ${themeClasses.controlBtn}`}
                  style={{ borderColor: themeClasses.divider }}
                  title={isAr ? "تصغير الخط" : "Decrease Font Size"}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    const sizes: ("sm" | "base" | "lg" | "xl" | "2xl")[] = ["sm", "base", "lg", "xl", "2xl"];
                    const idx = sizes.indexOf(focusedFontSize);
                    if (idx < sizes.length - 1) setFocusedFontSize(sizes[idx + 1]);
                  }}
                  className={`px-2.5 py-1.5 text-xs font-bold focus:outline-none ${themeClasses.controlBtn}`}
                  title={isAr ? "تكبير الخط" : "Increase Font Size"}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Theme Selector for Larger screens */}
              <div className="hidden sm:flex items-center gap-2 border-l pl-3 ml-1" style={{ borderColor: themeClasses.divider }}>
                <button
                  onClick={() => setFocusedTheme("light")}
                  className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${
                    focusedTheme === "light" ? "border-indigo-600 scale-110 shadow-sm" : "border-zinc-300"
                  } bg-[#fbfaf7]`}
                  title={isAr ? "المظهر الورقي الأبيض" : "White Paper Theme"}
                />
                <button
                  onClick={() => setFocusedTheme("sepia")}
                  className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${
                    focusedTheme === "sepia" ? "border-indigo-600 scale-110 shadow-sm" : "border-amber-700/50"
                  } bg-[#f5ebd5]`}
                  title={isAr ? "مظهر الكُتب الدافئ" : "Warm Sepia Theme"}
                />
                <button
                  onClick={() => setFocusedTheme("dark")}
                  className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${
                    focusedTheme === "dark" ? "border-indigo-500 scale-110 shadow-sm" : "border-zinc-800"
                  } bg-[#0f1115]`}
                  title={isAr ? "المظهر الليلي الداكن" : "Dark Obsidian Theme"}
                />
              </div>
            </div>

            {/* Mobile quick theme swapper and exit */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const themes: ("light" | "sepia" | "dark")[] = ["light", "sepia", "dark"];
                  const next = themes[(themes.indexOf(focusedTheme) + 1) % themes.length];
                  setFocusedTheme(next);
                }}
                className={`sm:hidden px-3 py-1.5 rounded-lg text-xs ${themeClasses.controlBtn}`}
              >
                {focusedTheme === "light" ? "📄" : focusedTheme === "sepia" ? "📜" : "🌙"}
              </button>

              <button
                onClick={closeFocusMode}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>{isAr ? "إغلاق" : "Close"}</span>
              </button>
            </div>
          </header>

          {/* Centered Document Body content area */}
          <div className="flex-1">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-10">
              {/* Header Title Information */}
              <div className="space-y-3 border-b pb-8" style={{ borderColor: themeClasses.divider }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full ${themeClasses.badgeBg}`}>
                    {focusedSub.code}
                  </span>
                  <span className={`text-xs font-semibold tracking-wide uppercase ${themeClasses.secondaryText}`}>
                    {isAr ? focusedParentAr : focusedParentEn}
                  </span>
                </div>

                <h1 className={`text-3xl md:text-5xl font-black tracking-tight leading-tight transition-all duration-200 ${fontFamilyClass} ${themeClasses.text}`}>
                  {isAr ? focusedSub.nameAr : focusedSub.nameEn}
                </h1>

                <p className={`text-xs flex items-center gap-1.5 ${themeClasses.secondaryText}`}>
                  <Compass className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>
                    {isAr
                      ? "أنت تقرأ الآن في وضع القراءة الهادئة (Focus Mode) المُحسّن للتركيز السريري والتعليمي."
                      : "You are currently reading in Focus Mode, optimized for concentrated clinical study."}
                  </span>
                </p>
              </div>

              {/* Clinical Diagnostic Criteria Section */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4" style={{ borderColor: themeClasses.divider }}>
                  <h2 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${themeClasses.text}`}>
                    <BookOpen className="h-5.5 w-5.5 text-indigo-500 shrink-0" />
                    <span>
                      {getActiveSystem(focusedSub.nameEn, focusedSubParentId) === "dsm"
                        ? (isAr ? "معايير التشخيص السريرية (DSM-5)" : "Official DSM-5 Diagnostic Criteria")
                        : (isAr ? "معايير التشخيص والتصنيف الدولي (ICD-10)" : "Official ICD-10 Clinical Guidelines")
                      }
                    </span>
                  </h2>

                  {/* Immersive Focus Mode Tab Switcher */}
                  <div className="flex p-0.5 rounded-lg border shrink-0" style={{ backgroundColor: themeClasses.accentBg, borderColor: themeClasses.divider }}>
                    {focusedSubParentId !== "cim10" && (
                      <button
                        type="button"
                        onClick={() => toggleCriteriaSystem(focusedSub.nameEn, "dsm")}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all focus:outline-none cursor-pointer ${
                          getActiveSystem(focusedSub.nameEn, focusedSubParentId) === "dsm"
                            ? `${themeClasses.bg} ${themeClasses.accentText} shadow-sm`
                            : `${themeClasses.secondaryText} hover:${themeClasses.text}`
                        }`}
                      >
                        DSM-5
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleCriteriaSystem(focusedSub.nameEn, "icd")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all focus:outline-none cursor-pointer ${
                        getActiveSystem(focusedSub.nameEn, focusedSubParentId) === "icd"
                          ? `${themeClasses.bg} ${themeClasses.accentText} shadow-sm`
                          : `${themeClasses.secondaryText} hover:${themeClasses.text}`
                      }`}
                    >
                      ICD-10 / CIM-10
                    </button>
                  </div>
                </div>

                {getActiveSystem(focusedSub.nameEn, focusedSubParentId) === "icd" && (
                  <div className={`p-4 rounded-xl border text-xs ${themeClasses.cardBg} flex items-center gap-2`} style={{ borderColor: themeClasses.divider }}>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${themeClasses.badgeBg}`}>
                      {focusedSub.icdCode || (focusedSub.code.includes("(") ? focusedSub.code.split("(")[1].replace(")", "") : focusedSub.code)}
                    </span>
                    <span className={themeClasses.secondaryText}>
                      {isAr ? "الرمز الدولي لتصنيف الأمراض والمشكلات الصحية ذات الصلة." : "Official International Classification of Diseases code reference."}
                    </span>
                  </div>
                )}

                <div className={`space-y-4 ${fontFamilyClass} ${fontSizeClass} leading-relaxed transition-all duration-200`}>
                  {getCriteriaList(focusedSub, focusedSubParentId).map((criteria: string, idx: number) => (
                    <div
                      key={idx}
                      className={`flex gap-4 p-5 rounded-2xl border ${themeClasses.cardBg} transition-all duration-150 shadow-sm`}
                      style={{ borderColor: themeClasses.divider }}
                    >
                      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-mono text-sm font-bold shrink-0 shadow-sm ${themeClasses.badgeBg}`}>
                        {idx + 1}
                      </span>
                      <div className="space-y-1 pt-0.5 flex-1">
                        <p className={`${themeClasses.text} leading-relaxed`}>
                          {criteria}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentials and Rule-outs Section */}
              <div className="space-y-6 pt-6">
                <h2 className={`text-lg md:text-xl font-bold flex items-center gap-2 ${themeClasses.text}`}>
                  <ShieldAlert className="h-5.5 w-5.5 text-amber-500 shrink-0" />
                  <span>{isAr ? "التشخيص الفارق واستبعاد الاضطرابات الأخرى" : "Clinical Differential Diagnoses"}</span>
                </h2>

                <p className={`text-xs md:text-sm italic leading-normal ${themeClasses.secondaryText}`}>
                  {isAr
                    ? "يتطلب التقييم المهني السليم مطابقة واستبعاد المعايير وتفريق الحالات النفسية والطبية المتداخلة التالية:"
                    : "Accurate evaluation requires carefully distinguishing and ruling out these overlapping conditions:"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(isAr ? focusedSub.differentialAr : focusedSub.differentialEn).map((diff: string, idx: number) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border flex gap-3 items-start transition-all ${themeClasses.cardBg}`}
                    >
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className={`text-xs md:text-sm leading-relaxed ${themeClasses.text}`}>
                        {diff}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* End of Section / Navigation back to top */}
              <div className={`text-center py-12 border-t mt-12 ${themeClasses.divider}`}>
                <p className={`text-xs font-semibold ${themeClasses.secondaryText}`}>
                  {isAr
                    ? "انتهت معايير التشخيص والتشخيصات الفارقة لهذه الفئة."
                    : "Diagnostic criteria and clinical differentials checklist concluded."}
                </p>
                <button
                  onClick={() => {
                    const modal = document.getElementById("focus-modal-container");
                    if (modal) modal.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 font-bold hover:underline transition-all cursor-pointer"
                >
                  <ChevronUp className="h-4 w-4" />
                  <span>{isAr ? "العودة إلى الأعلى" : "Scroll to Top"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Elegant Floating Breathing Guide / Calm Anchor */}
          <div
            className={`fixed bottom-6 ${
              isAr ? "left-6" : "right-6"
            } z-50 p-3.5 rounded-2xl border shadow-xl flex items-center gap-3 animate-fade-in ${themeClasses.cardBg}`}
          >
            <div className="relative flex items-center justify-center h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-45"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </div>
            <div className="text-[10px]">
              <p className={`font-black ${themeClasses.text}`}>
                {isAr ? "تنفس بهدوء" : "Peaceful breath"}
              </p>
              <p className={themeClasses.secondaryText}>
                {isAr ? "شهيق.. زفير" : "Inhale.. Exhale"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
