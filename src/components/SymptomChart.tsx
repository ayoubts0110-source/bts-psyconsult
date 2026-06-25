import React, { useState } from "react";
import { Language, DailyMoodLog } from "../types";
import { TrendingUp, PlusCircle, Smile, AlertCircle, Sparkles, Moon, BarChart } from "lucide-react";

interface SymptomChartProps {
  lang: Language;
  logs: DailyMoodLog[];
  onAddLog: (log: { mood: number; anxiety: number; sleep: number; notes: string }) => void;
}

export default function SymptomChart({ lang, logs, onAddLog }: SymptomChartProps) {
  const isAr = lang === "ar";
  const [activeMetric, setActiveMetric] = useState<"mood" | "anxiety" | "sleep">("mood");

  // Local state for symptom logger form
  const [formMood, setFormMood] = useState(3);
  const [formAnxiety, setFormAnxiety] = useState(2);
  const [formSleep, setFormSleep] = useState(7);
  const [formNotes, setFormNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLog({
      mood: formMood,
      anxiety: formAnxiety,
      sleep: formSleep,
      notes: formNotes
    });
    setFormNotes("");
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // SVG Chart rendering calculations
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 20;

  const getMetricValue = (log: DailyMoodLog, metric: typeof activeMetric): number => {
    return log[metric];
  };

  const getMetricMax = (metric: typeof activeMetric): number => {
    if (metric === "sleep") return 12; // Sleep hours range 0-12
    return 5; // Mood & Anxiety range 1-5
  };

  const getMetricMin = (metric: typeof activeMetric): number => {
    if (metric === "sleep") return 0;
    return 1;
  };

  // Sort logs by date ascending
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7); // Last 7 records

  // Compute SVG Points
  const maxVal = getMetricMax(activeMetric);
  const minVal = getMetricMin(activeMetric);

  const points = sortedLogs.map((log, index) => {
    const val = getMetricValue(log, activeMetric);
    // X position spread across width
    const x = padding + (index * (chartWidth - padding * 2)) / Math.max(1, sortedLogs.length - 1);
    // Y position (flipped since 0 is top)
    const valRange = Math.max(1, maxVal - minVal);
    const normalizedY = (val - minVal) / valRange;
    const y = chartHeight - padding - normalizedY * (chartHeight - padding * 2);
    return { x, y, value: val, date: log.date };
  });

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="symptom-diary-hub">
      {/* Logger input form */}
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5 border-b border-blue-100 pb-3">
          <PlusCircle className="h-4.5 w-4.5 text-blue-600" />
          {isAr ? "تسجيل الأعراض والمزاج اليومي" : "Log Daily Symptoms & Mood"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mood Selector (1-5) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
              <span>{isAr ? "الحالة المزاجية العامة:" : "Overall Mood:"}</span>
              <span className="font-mono text-[10px] text-zinc-500 font-extrabold">
                {formMood}/5 ({formMood === 5 ? (isAr ? "ممتاز" : "Excellent") : formMood === 1 ? (isAr ? "سيئ جداً" : "Very Bad") : (isAr ? "متوسط" : "Average")})
              </span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setFormMood(val)}
                  className={`flex-1 py-1.5 rounded-lg border-2 text-xs font-bold font-mono transition-all focus:outline-none cursor-pointer ${
                    formMood === val
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-blue-100 text-zinc-700 hover:bg-blue-50/50"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Anxiety Selector (1-5) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
              <span>{isAr ? "مستوى القلق والتوتر الجسدي:" : "Anxiety & Tension Level:"}</span>
              <span className="font-mono text-[10px] text-zinc-500 font-extrabold">
                {formAnxiety}/5 ({formAnxiety === 5 ? (isAr ? "شديد" : "Severe") : formAnxiety === 1 ? (isAr ? "منعدم" : "None") : (isAr ? "متوسط" : "Moderate")})
              </span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setFormAnxiety(val)}
                  className={`flex-1 py-1.5 rounded-lg border-2 text-xs font-bold font-mono transition-all focus:outline-none cursor-pointer ${
                    formAnxiety === val
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-white border-blue-100 text-zinc-700 hover:bg-blue-50/50"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep hours (numeric input range) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
              <span>{isAr ? "ساعات النوم الليلة الماضية:" : "Sleep Last Night (Hours):"}</span>
              <span className="font-mono text-[10px] text-blue-600 font-bold">
                {formSleep} {isAr ? "ساعات" : "hours"}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="14"
              step="1"
              value={formSleep}
              onChange={(e) => setFormSleep(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-blue-50 rounded-lg cursor-pointer"
            />
          </div>

          {/* Daily clinical notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-800">
              {isAr ? "ملاحظات الأعراض اليومية:" : "Daily Clinical Notes / Symptoms:"}
            </label>
            <textarea
              placeholder={isAr ? "سجل أي تفاصيل مثل نوبات هلع، أرق، أفكار اجترارية..." : "Record any details like panic, insomnia, focus details..."}
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full min-h-[60px] bg-white border-2 border-blue-100 rounded-xl p-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-4 text-xs font-bold transition-all shadow-md shadow-blue-500/15 focus:outline-none cursor-pointer"
          >
            {isAr ? "حفظ الملاحظة اليومية للأعراض" : "Save Daily Symptom Log"}
          </button>

          {successMsg && (
            <div className="text-center text-[11px] font-extrabold text-emerald-600 animate-fade-in">
              ✓ {isAr ? "تم حفظ الأعراض اليومية بنجاح!" : "Symptom logged successfully!"}
            </div>
          )}
        </form>
      </div>

      {/* Visual trends graph */}
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-blue-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              {isAr ? "اتجاهات ومؤشرات الأعراض السريرية" : "Clinical Symptom Trend Charts"}
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5 font-bold">
              {isAr ? "مراقبة مستويات المزاج، القلق والنوم بناءً على آخر 7 أيام." : "Monitor changes in symptoms across the last 7 daily entries."}
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex bg-blue-50 p-1 rounded-xl border border-blue-100 shrink-0">
            {(["mood", "anxiety", "sleep"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg capitalize transition-all focus:outline-none cursor-pointer ${
                  activeMetric === m
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                {m === "mood" ? (isAr ? "المزاج" : "Mood") : m === "anxiety" ? (isAr ? "القلق" : "Anxiety") : (isAr ? "النوم" : "Sleep")}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Rendering */}
        <div className="flex-1 flex items-center justify-center min-h-[160px]" id="chart-canvas-container">
          {sortedLogs.length >= 2 ? (
            <div className="w-full space-y-4">
              <div className="relative">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                >
                  {/* Fill Area Gradient */}
                  <defs>
                    <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map((grid, index) => {
                    const y = padding + (index * (chartHeight - padding * 2)) / 4;
                    return (
                      <line
                        key={grid}
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        className="stroke-blue-100"
                        strokeDasharray="4"
                      />
                    );
                  })}

                  {/* Area fill */}
                  <path d={areaD} className="fill-[url(#gradient-glow)]" />

                  {/* Line path */}
                  <path
                    d={pathD}
                    fill="none"
                    className="stroke-blue-600"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {points.map((p, index) => (
                    <g key={index} className="group cursor-pointer">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        className="fill-blue-600 stroke-white"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        className="fill-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"
                      />
                    </g>
                  ))}
                </svg>
              </div>

              {/* X Axis Dates */}
              <div className="flex justify-between px-5 text-[9px] font-mono font-bold text-zinc-500">
                {points.map((p, idx) => {
                  const d = new Date(p.date);
                  const label = `${d.getMonth() + 1}/${d.getDate()}`;
                  return <span key={idx}>{label}</span>;
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart className="h-9 w-9 text-blue-200 mx-auto mb-2" />
              <h5 className="text-xs font-bold text-black">
                {isAr ? "تحتاج لتسجيل يومين على الأقل لرسم المخطط" : "Insufficient trend data"}
              </h5>
              <p className="text-[10px] text-zinc-500 mt-0.5 font-bold">
                {isAr
                  ? "سجل حالتك اليوم عبر الخيارات الجانبية للبدء بمراقبة الاتجاهات."
                  : "Submit at least 2 daily entries using the logger to populate trends."}
              </p>
            </div>
          )}
        </div>

        {/* History Checklist Logs list */}
        <div className="border-t border-blue-100 pt-4" id="recent-logs-list">
          <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider mb-2">
            {isAr ? "الملاحظات المسجلة حديثاً" : "Recent Symptom Logs"}
          </h4>
          {logs.length > 0 ? (
            <div className="max-h-[110px] overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
              {[...logs].reverse().slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="bg-white border-2 border-blue-100 rounded-xl p-2.5 flex items-start gap-2.5 justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold text-zinc-500">
                      {new Date(log.date).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <p className={`text-xs text-black font-semibold ${isAr ? "text-right" : "text-left"}`}>
                      {log.notes ? log.notes : (isAr ? "(لا توجد ملاحظة كتابية)" : "(No written notes)")}
                    </p>
                  </div>

                  <div className="flex gap-1 shrink-0 font-mono text-[9px] font-bold">
                    <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-200">
                      <Smile className="h-2.5 w-2.5" />
                      {log.mood}
                    </span>
                    <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-rose-200">
                      <AlertCircle className="h-2.5 w-2.5" />
                      {log.anxiety}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-blue-200">
                      <Moon className="h-2.5 w-2.5" />
                      {log.sleep}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[11px] text-zinc-500 italic font-bold">
              {isAr ? "لا توجد سجلات بعد" : "No symptom records captured yet"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
