export type Language = "ar" | "en";

export interface ScreeningQuestion {
  id: string;
  textEn: string;
  textAr: string;
  options: {
    value: number;
    textEn: string;
    textAr: string;
  }[];
}

export interface ScreeningTest {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  dsmCode: string;
  dsmCriteriaEn: string;
  dsmCriteriaAr: string;
  questions: ScreeningQuestion[];
  // Mapping score range to educational severity feedback
  interpretScore: (score: number, answers: Record<string, number>) => {
    categoryEn: string;
    categoryAr: string;
    feedbackEn: string;
    feedbackAr: string;
  };
}

export interface DiagnosticCategory {
  id: string;
  titleEn: string;
  titleAr: string;
  code: string;
  subcategories: {
    nameEn: string;
    nameAr: string;
    code: string;
    criteriaEn: string[];
    criteriaAr: string[];
    differentialEn: string[];
    differentialAr: string[];
    icdCriteriaEn?: string[];
    icdCriteriaAr?: string[];
    icdCode?: string;
  }[];
}

export interface SavedResult {
  id: string;
  testId: string;
  testTitleEn: string;
  testTitleAr: string;
  date: string;
  score: number;
  categoryEn: string;
  categoryAr: string;
  answers: Record<string, number>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DailyMoodLog {
  id: string;
  date: string;
  mood: number; // 1-5
  anxiety: number; // 1-5
  sleep: number; // 1-5 (hours or quality)
  notes: string;
}
