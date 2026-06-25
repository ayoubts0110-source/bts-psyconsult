import React, { useState } from "react";
import { User, Award, BookOpen, Mail, Send, Heart, MapPin, CheckCircle, ShieldAlert, Lock, Trash2, Camera, Loader2 } from "lucide-react";
import { Language } from "../types";

interface AboutDeveloperProps {
  lang: Language;
}

// A beautiful, highly-polished default avatar representing Clinical Health Psychologist Boutaous Ayoub
const DefaultAvatar = () => (
  <svg viewBox="0 0 128 128" className="h-full w-full object-cover bg-blue-50">
    <defs>
      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
    </defs>
    <rect width="128" height="128" fill="url(#avatarGrad)" />
    {/* Shoulders / Suit */}
    <path d="M18 128c0-22 18-40 40-40h12c22 0 40 18 40 40v0H18z" fill="#0f172a" />
    {/* Tie and Shirt */}
    <path d="M52 88l12 20 12-20H52z" fill="#f8fafc" />
    <path d="M60 92l4 24 4-24h-8z" fill="#ef4444" /> {/* Red tie */}
    {/* Head */}
    <circle cx="64" cy="50" r="22" fill="#ffedd5" />
    {/* Hair */}
    <path d="M42 48c0-12 10-22 22-22s22 10 22 22c0 1.5-1 3-3 3s-3-1.5-3-3c0-6-5-10-11-10s-11 4-11 10c0 1.5-1.5 3-3 3s-4-1.5-4-3z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
    <path d="M42 42c2-8 10-14 22-14s20 6 22 14c-4-4-12-6-22-6s-18 2-22 6z" fill="#0f172a" />
    {/* Glasses */}
    <rect x="49" y="45" width="11" height="7" rx="1.5" fill="none" stroke="#1e293b" strokeWidth="2" />
    <rect x="68" y="45" width="11" height="7" rx="1.5" fill="none" stroke="#1e293b" strokeWidth="2" />
    <path d="M60 48h8" stroke="#1e293b" strokeWidth="2" />
    {/* Smile */}
    <path d="M58 63c4 3 8 3 12 0" stroke="#b45309" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export default function AboutDeveloper({ lang }: AboutDeveloperProps) {
  const isAr = lang === "ar";
  
  // Profile Photo State with persistence
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    return "/developer_photo.png";
  });
  const [photoError, setPhotoError] = useState(false);

  // Identity verification states
  const [isDeveloperVerified, setIsDeveloperVerified] = useState(() => {
    return sessionStorage.getItem("dsm_is_dev_verified") === "true";
  });
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVerify = () => {
    if (passkey === "ayoub0110") {
      setIsDeveloperVerified(true);
      sessionStorage.setItem("dsm_is_dev_verified", "true");
      setShowVerifyDialog(false);
      setPasskey("");
      setVerifyError(null);
    } else {
      setVerifyError(isAr ? "رمز المرور غير صحيح" : "Incorrect passcode");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(isAr ? "حجم الصورة كبير جداً. الحد الأقصى هو 10 ميغابايت." : "Image size is too large. Maximum is 10MB.");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const response = await fetch("/api/developer/photo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64data,
            passcode: "ayoub0110"
          })
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setProfilePhoto(result.url);
          setPhotoError(false);
        } else {
          alert(result.error || "Failed to upload image");
        }
        setIsUploading(false);
      };
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to read image file");
      setIsUploading(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!window.confirm(isAr ? "هل أنت متأكد من رغبتك في حذف الصورة الشخصية؟" : "Are you sure you want to delete the profile photo?")) {
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("/api/developer/photo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passcode: "ayoub0110"
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setProfilePhoto(null);
        setPhotoError(true);
      } else {
        alert(result.error || "Failed to delete image");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete image");
    } finally {
      setIsUploading(false);
    }
  };

  // Contact Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "consultation",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedInquiries, setSavedInquiries] = useState<any[]>(() => {
    const saved = localStorage.getItem("dsm_developer_inquiries");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const newInquiry = {
      id: "inq_" + Date.now(),
      date: new Date().toISOString(),
      ...formData
    };

    const updated = [newInquiry, ...savedInquiries];
    setSavedInquiries(updated);
    localStorage.setItem("dsm_developer_inquiries", JSON.stringify(updated));
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      inquiryType: "consultation",
      message: ""
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const translations = {
    ar: {
      title: "حول المطور والمسؤول العلمي",
      subtitle: "البطاقة المهنية والأكاديمية للأخصائي النفساني المشرف على التطبيق",
      name: "بوطاوس أيوب",
      role: "أخصائي نفساني عيادي في علم النفس الصحة",
      degree: "شهادة الماستر في علم النفس الصحة - الجزائر",
      location: "الجزائر",
      bio: "أخصائي نفساني عيادي متخصص في علم النفس الصحة، مهتم بدمج التكنولوجيا الحديثة مع الممارسات الإكلينيكية القائمة على الدليل العلمي. يسعى لتطوير أدوات رقمية مساعدة تساهم في تسهيل عملية التشخيص الأولي وتقديم الدعم النفسي الأكاديمي والمهني للأطباء، الأخصائيين، والجمهور العام، بالاعتماد على معايير الدليل التشخيصي والإحصائي الخامس (DSM-5) والتصنيف الدولي للأمراض (ICD-10).",
      specialtiesTitle: "مجالات التخصص والممارسة العيادية",
      spec1Title: "المساندة النفسية للمرضى المزمنين",
      spec1Desc: "مساعدة الأفراد على التكيف النفسي مع الأمراض المزمنة (كالسكري، السرطان، وأمراض القلب) وإدارة الضغوط المرافقة لها.",
      spec2Title: "العلاج المعرفي السلوكي (CBT)",
      spec2Desc: "تطبيق بروتوكولات عيادية لعلاج اضطرابات القلق، نوبات الاكتئاب، والمخاوف السلوكية المحددة.",
      spec3Title: "إدارة الضغوط ونمط الحياة الصحي",
      spec3Desc: "تصميم برامج وقائية لتعزيز جودة الحياة، التوجيه الغذائي النفسي، وتطوير عادات النوم والاسترخاء الصحي الصحيحة.",
      academicTitle: "المسار الأكاديمي والعلمي",
      acad1: "شهادة ماستر أكاديمي في علم النفس الصحة (الجزائر).",
      acad2: "تكوين تطبيقي مكثف في المؤسسات الاستشفائية العمومية والمصالح العيادية لعلاج الأمراض المزمنة والسرطانية.",
      acad3: "تطوير بحوث ودراسات عيادية حول جودة الحياة وعلاقة الضغط النفسي بظهور وتطور الأعراض السلوكية والجسدية.",
      contactTitle: "بوابة التواصل والطلب العيادي المباشر",
      contactDesc: "يمكنك إرسال استفسار أكاديمي، طلب تواصل مهني، أو ملاحظة علمية حول أداء هذه الأداة التشخيصية مباشرة للأخصائي، أو الاتصال به مباشرة عبر البريد الإلكتروني: ayoubts0110@gmail.com",
      formName: "الاسم الكامل",
      formEmail: "البريد الإلكتروني",
      formType: "نوع الاستفسار",
      typeConsult: "طلب استشارة أو توجيه مهني",
      typeInquiry: "استفسار أكاديمي / علمي",
      typeFeedback: "ملاحظة تقنية أو تطويرية للتطبيق",
      formMsg: "رسالتك العيادية / الأكاديمية",
      formSubmit: "إرسال الرسالة للأخصائي",
      successMsg: "تم إرسال رسالتك بنجاح! سيقوم الأخصائي بوطاوس أيوب بمراجعة استفسارك الأكاديمي والرد عليك قريباً.",
      historyTitle: "رسائلك المرسلة عيادياً (محفوظة محلياً)",
      noHistory: "لم تقم بإرسال أي رسائل تواصل بعد.",
      disclaimer: "ملاحظة هامة: هذه الأداة مخصصة للأغراض التعليمية والإرشادية فقط. لا تعتبر بديلاً عن الفحص العيادي الشخصي المباشر لدى الأخصائي النفساني أو الطبيب العقلي المعتمد عيادياً.",
      uploadPhoto: "إضافة صورتي الشخصية",
      changePhoto: "تغيير الصورة",
      removePhoto: "حذف الصورة",
      uploadPrompt: "انقر لرفع صورة شخصية",
      verifyTitle: "التحقق من هوية المطور",
      verifyDesc: "تعديل أو حذف صورة الأخصائي بوطاوس أيوب محمي برمز مرور لمنع التغييرات غير المصرح بها من طرف المستخدمين الآخرين.",
      passkeyPlaceholder: "أدخل رمز المرور المخصص للمطور...",
      verifyBtn: "تأكيد الهوية كأخصائي",
      cancelBtn: "إلغاء",
      developerVerified: "تم تأكيد الهوية كمطور بنجاح!",
      hintText: "ملاحظة للمطور: يرجى إدخال الرمز الخاص بك (مثال: ayoub0110)",
    },
    en: {
      title: "About the Developer & Clinical Advisor",
      subtitle: "Professional & Academic Profile of the Supervising Health Psychologist",
      name: "Boutaous Ayoub",
      role: "Clinical Health Psychologist",
      degree: "Master's Degree in Health Psychology - Algeria",
      location: "Algeria",
      bio: "A clinical psychologist specialized in Health Psychology, dedicated to integrating modern technology with evidence-based clinical practices. Aiming to develop digital screening assistants that simplify preliminary assessments and provide structured academic support for practitioners, students, and the general public, strictly conforming to DSM-5 and ICD-10 criteria.",
      specialtiesTitle: "Specialties & Clinical Focus Areas",
      spec1Title: "Chronic Disease Adaptation",
      spec1Desc: "Supporting individuals in psychologically adapting to chronic illnesses (such as diabetes, cancer, and heart conditions) and managing related mental distress.",
      spec2Title: "Cognitive Behavioral Therapy (CBT)",
      spec2Desc: "Applying clinical protocols to treat generalized anxiety, depressive episodes, stress, and behavioral challenges.",
      spec3Title: "Stress Management & Healthy Lifestyles",
      spec3Desc: "Designing preventative programs to enhance quality of life, nutritional psychology, and healthy sleep/relaxation habits.",
      academicTitle: "Academic & Professional Roadmap",
      acad1: "Master of Science (M.Sc.) in Clinical Health Psychology (Algeria).",
      acad2: "Advanced hands-on clinical residency across public university hospitals and oncology treatment centers.",
      acad3: "Author of clinical studies investigating the relationship between psychosocial distress and physical/mental wellness parameters.",
      contactTitle: "Direct Professional Contact Portal",
      contactDesc: "Send academic inquiries, collaboration proposals, or clinical feedback regarding this screening framework directly to the psychologist, or contact him via email at ayoubts0110@gmail.com",
      formName: "Full Name",
      formEmail: "Email Address",
      formType: "Inquiry Type",
      typeConsult: "Clinical Consultation / Guidance Request",
      typeInquiry: "Academic / Research Inquiry",
      typeFeedback: "App Technical Feedback or Suggestion",
      formMsg: "Your Clinical / Academic Message",
      formSubmit: "Send Message to Psychologist",
      successMsg: "Your message has been sent successfully! Psychologist Boutaous Ayoub will review your inquiry and reply soon.",
      historyTitle: "Your Sent Messages (Saved Locally)",
      noHistory: "You have not sent any clinical messages yet.",
      disclaimer: "Important Disclaimer: This application serves educational and academic purposes. It does not replace direct face-to-face consultation with a licensed clinical psychologist or psychiatric professional.",
      uploadPhoto: "Upload Profile Photo",
      changePhoto: "Change Photo",
      removePhoto: "Remove Photo",
      uploadPrompt: "Click to upload your photo",
      verifyTitle: "Developer Identity Verification",
      verifyDesc: "Editing or deleting the profile photo of Specialist Boutaous Ayoub is protected by a passkey to prevent unauthorized modifications by other users.",
      passkeyPlaceholder: "Enter developer passcode...",
      verifyBtn: "Verify Identity",
      cancelBtn: "Cancel",
      developerVerified: "Identity verified successfully as developer!",
      hintText: "Note for developer: Please enter your passcode (e.g., ayoub0110)",
    }
  };

  const t = translations[lang];

  return (
    <div className="space-y-6" id="about-developer-page">
      {/* Profile Cover Card with White BG, Blue details and Dark Text */}
      <div className="bg-white text-zinc-950 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden border-2 border-blue-100">
        {/* Decorative ambient background blur */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Interactive Profile Photo Container */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <div 
              className="h-28 w-28 md:h-32 md:w-32 rounded-2xl bg-blue-50 border-2 border-blue-200/80 overflow-hidden flex flex-col items-center justify-center shadow-sm relative group"
            >
              {profilePhoto && !photoError ? (
                <img 
                  src={profilePhoto} 
                  alt={t.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <DefaultAvatar />
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              )}
            </div>

            {/* Actions below image */}
            {!isDeveloperVerified ? (
              <button
                onClick={() => setShowVerifyDialog(true)}
                className="text-[10px] text-zinc-500 hover:text-blue-600 font-extrabold flex items-center gap-1 transition-colors cursor-pointer bg-zinc-50 hover:bg-blue-50 border border-zinc-200 hover:border-blue-200 px-2 py-0.5 rounded"
              >
                <Lock className="h-2.5 w-2.5" />
                <span>{isAr ? "تحديث صورتي" : "Update my photo"}</span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <label className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-md border border-blue-200 font-bold cursor-pointer transition-colors flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    <span>{isAr ? "رفع صورة" : "Upload Photo"}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                      disabled={isUploading}
                    />
                  </label>
                  
                  {profilePhoto && !photoError && (
                    <button
                      onClick={handlePhotoDelete}
                      className="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded-md border border-red-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{isAr ? "حذف" : "Delete"}</span>
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setIsDeveloperVerified(false);
                    sessionStorage.removeItem("dsm_is_dev_verified");
                  }}
                  className="text-[9px] text-zinc-400 hover:text-zinc-600 font-semibold underline cursor-pointer"
                >
                  {isAr ? "قفل وضع المطور" : "Lock Developer Mode"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold">
              <Award className="h-3.5 w-3.5 text-blue-500" />
              <span>{t.degree}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black">
              {t.name}
            </h2>
            
            <p className="text-sm text-blue-600 font-extrabold">
              {t.role}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                <span>{t.location}</span>
              </div>
              <div className="hidden md:block text-zinc-300">|</div>
              <a href="mailto:ayoubts0110@gmail.com" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-extrabold transition-colors">
                <Mail className="h-3.5 w-3.5 text-blue-500" />
                <span>ayoubts0110@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Short Bio Block with Black/Dark text */}
        <div className="mt-6 pt-6 border-t border-blue-100 text-xs md:text-sm text-zinc-900 font-medium leading-relaxed max-w-4xl">
          <p>{t.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialties & Academics column */}
        <div className="space-y-6">
          {/* Specialties Card */}
          <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 md:p-6 shadow-sm text-zinc-950">
            <h3 className="text-base font-bold text-blue-600 border-b border-blue-100 pb-3 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-500" />
              <span>{t.specialtiesTitle}</span>
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{t.spec1Title}</h4>
                  <p className="text-[11px] text-zinc-800 mt-1 leading-relaxed">{t.spec1Desc}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{t.spec2Title}</h4>
                  <p className="text-[11px] text-zinc-800 mt-1 leading-relaxed">{t.spec2Desc}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{t.spec3Title}</h4>
                  <p className="text-[11px] text-zinc-800 mt-1 leading-relaxed">{t.spec3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Roadmap Card */}
          <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 md:p-6 shadow-sm text-zinc-950">
            <h3 className="text-base font-bold text-blue-600 border-b border-blue-100 pb-3 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span>{t.academicTitle}</span>
            </h3>

            <ul className="space-y-3">
              {[t.acad1, t.acad2, t.acad3].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs text-zinc-800 font-medium leading-relaxed">
                  <span className="h-5 w-5 rounded bg-blue-50 text-[10px] text-blue-600 font-mono font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Portal column */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 md:p-6 shadow-sm text-zinc-950">
            <h3 className="text-base font-bold text-blue-600 border-b border-blue-100 pb-3 mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <span>{t.contactTitle}</span>
            </h3>
            <p className="text-xs text-zinc-700 mb-5 leading-relaxed">
              {t.contactDesc}
            </p>

            {isSubmitted && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex gap-2.5 items-start">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{t.successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-900">{t.formName}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-2 border-blue-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black font-semibold shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-900">{t.formEmail}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border-2 border-blue-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black font-semibold shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-900">{t.formType}</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-white border-2 border-blue-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black font-semibold shadow-sm"
                >
                  <option value="consultation">{t.typeConsult}</option>
                  <option value="inquiry">{t.typeInquiry}</option>
                  <option value="feedback">{t.typeFeedback}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-900">{t.formMsg}</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border-2 border-blue-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black font-semibold shadow-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/15 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{t.formSubmit}</span>
              </button>
            </form>

            {/* Sent local history */}
            {savedInquiries.length > 0 && (
              <div className="mt-6 pt-5 border-t border-blue-100 space-y-3">
                <h4 className="text-xs font-bold text-black">
                  {t.historyTitle}
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {savedInquiries.map((inq) => (
                    <div key={inq.id} className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-[11px] space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-500">
                        <span className="font-semibold text-blue-600 font-extrabold">{inq.inquiryType === "consultation" ? t.typeConsult : inq.inquiryType === "inquiry" ? t.typeInquiry : t.typeFeedback}</span>
                        <span>{new Date(inq.date).toLocaleDateString(isAr ? "ar-EG" : "en-US")}</span>
                      </div>
                      <p className="text-black font-medium">{inq.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strict clinical warning note in About Developer */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-2xl p-4 flex gap-3 items-start text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
        <p>{t.disclaimer}</p>
      </div>

      {/* Developer Verification Modal */}
      {showVerifyDialog && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Lock className="h-5 w-5" />
              </div>
              <div className="text-right flex-1">
                <h3 className="text-sm font-black text-zinc-950">{t.verifyTitle}</h3>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  {t.verifyDesc}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                placeholder={t.passkeyPlaceholder}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setVerifyError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify();
                }}
                className="w-full bg-white border-2 border-zinc-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black font-semibold shadow-sm text-center"
                autoFocus
              />
              {verifyError && (
                <p className="text-[10px] text-red-600 font-bold mt-1 text-center">
                  {verifyError}
                </p>
              )}
              <p className="text-[9px] text-zinc-400 italic text-center">
                {t.hintText}
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  setShowVerifyDialog(false);
                  setPasskey("");
                  setVerifyError(null);
                }}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors font-bold cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={handleVerify}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{t.verifyBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
