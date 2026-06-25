import React from "react";
import { Language } from "../types";
import { AlertTriangle, ShieldAlert, PhoneCall } from "lucide-react";

interface DisclaimerBannerProps {
  lang: Language;
}

export default function DisclaimerBanner({ lang }: DisclaimerBannerProps) {
  const isAr = lang === "ar";

  const t = {
    title: isAr ? "تنبيه إخلاء مسؤولية طبي سريري" : "Clinical Educational Disclaimer",
    body: isAr
      ? "المعلومات والاختبارات المتاحة في هذا التطبيق تستند بالكامل إلى معايير الدليل التشخيصي والإحصائي الخامس للاضطرابات النفسية (DSM-5) وهي للأغراض التعليمية والتوعوية فقط. هذا التطبيق ليس بديلاً عن التشخيص الطبي أو الاستشارة المهنية من قبل طبيب نفسي أو أخصائي مرخص. إذا كنت تمر بظروف نفسية صعبة أو تفكر في إيذاء نفسك، يرجى التواصل مع قنوات الدعم المختصة فوراً."
      : "All information, reference criteria, and screening tests in this application are directly sourced from the DSM-5 (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition) and are provided solely for educational and self-screening purposes. This tool is NOT a formal clinical diagnosis and does not replace consultation with a licensed psychologist, psychiatrist, or medical professional. If you are experiencing a mental health emergency, please contact professional services.",
    crisisTitle: isAr ? "خطوط المساندة والطوارئ النفسية" : "Emergency & Crisis Helplines",
    helplines: [
      { nameEn: "International (USA)", nameAr: "الولايات المتحدة (دولي)", number: "988 (Crisis Lifeline)" },
      { nameEn: "Saudi Arabia (Mental Health)", nameAr: "المملكة العربية السعودية (مركز اتصال 937)", number: "937 / 920033360" },
      { nameEn: "Egypt (Mental Health)", nameAr: "مصر (الخط الساخن للصحة النفسية)", number: "08008880700 / 0220816831" },
      { nameEn: "United Kingdom", nameAr: "المملكة المتحدة (NHS)", number: "111 / 999" }
    ]
  };

  const [showCrisis, setShowCrisis] = React.useState(false);

  return (
    <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50/60 p-4 shadow-sm" id="disclaimer-banner">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className={`text-sm font-extrabold text-amber-900 flex items-center gap-2 ${isAr ? "text-right" : "text-left"}`}>
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            {t.title}
          </h4>
          <p className={`text-xs leading-relaxed text-amber-900 font-medium ${isAr ? "text-right" : "text-left"}`}>
            {t.body}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowCrisis(!showCrisis)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 underline hover:text-amber-950 focus:outline-none cursor-pointer"
            >
              <PhoneCall className="h-3 w-3" />
              {isAr ? "عرض أرقام المساعدة الفورية والخطوط الساخنة" : "Show immediate crisis & help resources"}
            </button>
          </div>
        </div>
      </div>

      {showCrisis && (
        <div className="mt-4 border-t border-amber-200 pt-3" id="crisis-resources">
          <h5 className={`text-xs font-extrabold text-amber-900 mb-2 ${isAr ? "text-right" : "text-left"}`}>
            {t.crisisTitle}
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {t.helplines.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded bg-white p-2.5 border-2 border-amber-100 font-bold"
              >
                <span className="text-amber-900">
                  {isAr ? item.nameAr : item.nameEn}
                </span>
                <span className="font-mono text-amber-800">
                  {item.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
