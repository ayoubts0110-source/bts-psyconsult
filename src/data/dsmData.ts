import { ScreeningTest, DiagnosticCategory } from "../types";

// Standard frequency options for PHQ-9 and GAD-7
const frequencyOptions = [
  { value: 0, textEn: "Not at all", textAr: "لا يوجد على الإطلاق" },
  { value: 1, textEn: "Several days", textAr: "عدة أيام" },
  { value: 2, textEn: "More than half the days", textAr: "أكثر من نصف الأيام" },
  { value: 3, textEn: "Nearly every day", textAr: "كل يوم تقريباً" }
];

export const DSM_ASSESSMENTS: ScreeningTest[] = [
  {
    id: "mdd",
    titleEn: "Major Depressive Disorder (MDD) Screener",
    titleAr: "مقياس اضطراب الاكتئاب الجسيم (MDD)",
    subtitleEn: "PHQ-9 Aligned Assessment",
    subtitleAr: "تقييم متوافق مع معايير PHQ-9",
    descriptionEn: "A 9-question tool designed to monitor severity of depression based on the diagnostic criteria of DSM-5. Requires symptoms to be present for at least 2 weeks.",
    descriptionAr: "أداة مكونة من 9 أسئلة مصممة لتقييم ومراقبة شدة أعراض الاكتئاب بناءً على المعايير التشخيصية للدليل التشخيصي والإحصائي الخامس (DSM-5). تتطلب وجود الأعراض لمدة أسبوعين على الأقل.",
    dsmCode: "DSM-5 Code: 296.xx (ICD-10: F32.x / F33.x)",
    dsmCriteriaEn: "DSM-5 Criterion A: Five (or more) of the 9 symptoms have been present during the same 2-week period and represent a change from previous functioning; at least one of the symptoms is either (1) depressed mood or (2) loss of interest or pleasure.",
    dsmCriteriaAr: "معيار DSM-5 (أ): وجود خمسة (أو أكثر) من الأعراض التسعة خلال نفس الفترة التي تبلغ أسبوعين، وتمثل تغييراً عن الأداء السابق؛ ويجب أن يكون أحد هذه الأعراض على الأقل هو (1) المزاج المكتئب أو (2) فقدان الاهتمام أو المتعة.",
    questions: [
      {
        id: "mdd_1",
        textEn: "Little interest or pleasure in doing things",
        textAr: "قلة الاهتمام أو المتعة في القيام بالأشياء",
        options: frequencyOptions
      },
      {
        id: "mdd_2",
        textEn: "Feeling down, depressed, or hopeless",
        textAr: "الشعور بالضيق، أو الاكتئاب، أو اليأس",
        options: frequencyOptions
      },
      {
        id: "mdd_3",
        textEn: "Trouble falling or staying asleep, or sleeping too much",
        textAr: "صعوبة في النوم أو الاستمرار فيه، أو النوم الزائد عن الحد",
        options: frequencyOptions
      },
      {
        id: "mdd_4",
        textEn: "Feeling tired or having little energy",
        textAr: "الشعور بالتعب أو قلة الطاقة والنشاط",
        options: frequencyOptions
      },
      {
        id: "mdd_5",
        textEn: "Poor appetite or overeating",
        textAr: "ضعف الشهية أو الإفراط في تناول الطعام",
        options: frequencyOptions
      },
      {
        id: "mdd_6",
        textEn: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
        textAr: "الشعور بالرضا السيئ عن نفسك - أو أنك فاشل أو خيبت أمل نفسك أو عائلتك",
        options: frequencyOptions
      },
      {
        id: "mdd_7",
        textEn: "Trouble concentrating on things, such as reading the newspaper or watching television",
        textAr: "صعوبة في التركيز على الأشياء، مثل القراءة أو مشاهدة التلفاز",
        options: frequencyOptions
      },
      {
        id: "mdd_8",
        textEn: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
        textAr: "الحركة أو التحدث ببطء شديد لدرجة أن الآخرين قد يلاحظون ذلك؟ أو العكس - التململ والاضطراب الشديدان لدرجة الحركة أكثر من المعتاد",
        options: frequencyOptions
      },
      {
        id: "mdd_9",
        textEn: "Thoughts that you would be better off dead or of hurting yourself in some way",
        textAr: "أفكار بأن الموت أفضل لك أو بإيذاء نفسك بأي شكل من الأشكال",
        options: frequencyOptions
      }
    ],
    interpretScore: (score, answers) => {
      // Analyze DSM-5 Criterion A: Need at least 5 symptoms with value >= 2 (Several days or more)
      // and at least one of them must be question 1 or 2 with score >= 2
      let symptomCount = 0;
      let hasCoreSymptom = false;

      // Question 1 corresponds to index 0, question 2 to index 1
      const q1 = answers["mdd_1"] || 0;
      const q2 = answers["mdd_2"] || 0;
      if (q1 >= 2 || q2 >= 2) {
        hasCoreSymptom = true;
      }

      Object.entries(answers).forEach(([key, val]) => {
        if (key.startsWith("mdd_") && val >= 2) {
          symptomCount++;
        }
      });

      // Special case: suicide ideation (Q9) scored positive if >= 1
      const q9 = answers["mdd_9"] || 0;
      if (q9 >= 1 && answers["mdd_9"] !== undefined) {
        // counted in symptom count already if >= 2, but let's count it if >= 1 for clinical safety alert
      }

      const meetsDsmAThreshold = symptomCount >= 5 && hasCoreSymptom;

      if (score >= 20) {
        return {
          categoryEn: "Severe Depression",
          categoryAr: "اكتئاب جسيم (شديد)",
          feedbackEn: `Your score is ${score}/27, indicating severe depressive symptoms.${meetsDsmAThreshold ? " Symptom profile meets the threshold for DSM-5 Depressive Episode Criteria A (at least 5 symptoms including depressed mood or anhedonia)." : ""} Please consult a psychiatrist or clinical psychologist immediately.`,
          feedbackAr: `مجموع درجاتك هو ${score}/27، مما يشير إلى أعراض اكتئاب شديدة.${meetsDsmAThreshold ? " يتوافق نمط الأعراض مع المعيار التشخيصي (أ) لاضطراب الاكتئاب الجسيم (5 أعراض أو أكثر تشمل المزاج المكتئب أو فقدان المتعة)." : ""} يرجى استشارة طبيب نفسي أو أخصائي نفسي عيادي على الفور.`
        };
      } else if (score >= 15) {
        return {
          categoryEn: "Moderately Severe Depression",
          categoryAr: "اكتئاب متوسط الشدة",
          feedbackEn: `Your score is ${score}/27, indicating moderately severe depressive symptoms.${meetsDsmAThreshold ? " Symptom profile meets the threshold for DSM-5 Depressive Episode Criteria A." : ""} Consultation with a mental health professional is highly recommended.`,
          feedbackAr: `مجموع درجاتك هو ${score}/27، مما يشير إلى أعراض اكتئاب متوسطة الشدة.${meetsDsmAThreshold ? " يتوافق نمط الأعراض مع المعيار التشخيصي (أ) لاضطراب الاكتئاب الجسيم." : ""} ينصح بشدة بالتشاور مع أخصائي صحة نفسية.`
        };
      } else if (score >= 10) {
        return {
          categoryEn: "Moderate Depression",
          categoryAr: "اكتئاب متوسط",
          feedbackEn: `Your score is ${score}/27, indicating moderate depressive symptoms.${meetsDsmAThreshold ? " Note: Although moderate, your symptoms meet the symptomatic threshold for a DSM-5 depressive episode." : ""} It is recommended to speak to a therapist or counselor for a clinical review.`,
          feedbackAr: `مجموع درجاتك هو ${score}/27، مما يشير إلى أعراض اكتئاب متوسطة.${meetsDsmAThreshold ? " تنبيه: على الرغم من كونه متوسطاً، إلا أن نمط الأعراض يتوافق مع الحد الأدنى للمعيار التشخيصي لـ DSM-5." : ""} يوصى بالتحدث إلى معالج أو مستشار نفسي لمراجعة حالتك.`
        };
      } else if (score >= 5) {
        return {
          categoryEn: "Mild Depression",
          categoryAr: "اكتئاب خفيف",
          feedbackEn: `Your score is ${score}/27, indicating mild depressive symptoms. Often managed with self-care, lifestyle adjustments, and active monitoring. If symptoms persist for more than 2 weeks and cause distress, consider professional counseling.`,
          feedbackAr: `مجموع درجاتك هو ${score}/27، مما يشير إلى أعراض اكتئاب خفيفة. غالباً ما يتم إدارتها بالرعاية الذاتية، وتعديلات نمط الحياة، والمراقبة النشطة. إذا استمرت الأعراض وأثرت على أدائك، يفضل التحدث مع مستشار.`
        };
      } else {
        return {
          categoryEn: "Minimal / No Depression",
          categoryAr: "أعراض اكتئاب بسيطة أو غير موجودة",
          feedbackEn: `Your score is ${score}/27, showing minimal depressive symptoms. This is within the typical sub-clinical range. Continue monitoring your mental wellbeing.`,
          feedbackAr: `مجموع درجاتك هو ${score}/27، مما يشير إلى الحد الأدنى من أعراض الاكتئاب. هذا في النطاق الطبيعي غير السريري.`
        };
      }
    }
  },
  {
    id: "gad",
    titleEn: "Generalized Anxiety Disorder (GAD) Screener",
    titleAr: "مقياس اضطراب القلق المعمم (GAD)",
    subtitleEn: "GAD-7 Aligned Assessment",
    subtitleAr: "تقييم متوافق مع معايير GAD-7",
    descriptionEn: "A 7-question tool focusing on DSM-5 clinical criteria for Generalized Anxiety, measuring worry, control difficulty, and somatic tension over the last 2 weeks.",
    descriptionAr: "أداة مكونة من 7 أسئلة تركز على المعايير السريرية لـ DSM-5 لاضطراب القلق العام، وتقيس درجات القلق، وصعوبة التحكم فيه، والتوتر الجسدي خلال الأسبوعين الماضيين.",
    dsmCode: "DSM-5 Code: 300.02 (ICD-10: F41.1)",
    dsmCriteriaEn: "DSM-5 Criteria: Excessive anxiety and worry (apprehensive expectation), occurring more days than not for at least 6 months, about a number of events or activities. The individual finds it difficult to control the worry.",
    dsmCriteriaAr: "معايير DSM-5: القلق والتوتر المفرطان (التوقع المتوجس)، ويحدثان في معظم الأيام لمدة 6 أشهر على الأقل، بشأن عدد من الأحداث أو الأنشطة. يجد الفرد صعوبة في السيطرة على هذا القلق.",
    questions: [
      {
        id: "gad_1",
        textEn: "Feeling nervous, anxious or on edge",
        textAr: "الشعور بالعصبية أو القلق أو التوتر الشديد",
        options: frequencyOptions
      },
      {
        id: "gad_2",
        textEn: "Not being able to stop or control worrying",
        textAr: "عدم القدرة على إيقاف القلق أو السيطرة عليه",
        options: frequencyOptions
      },
      {
        id: "gad_3",
        textEn: "Worrying too much about different things",
        textAr: "القلق المفرط بشأن أشياء مختلفة ومتنوعة",
        options: frequencyOptions
      },
      {
        id: "gad_4",
        textEn: "Trouble relaxing",
        textAr: "صعوبة في الاسترخاء والراحة",
        options: frequencyOptions
      },
      {
        id: "gad_5",
        textEn: "Being so restless that it is hard to sit still",
        textAr: "الشعور بالتململ الشديد لدرجة يصعب معها الجلوس ساكناً",
        options: frequencyOptions
      },
      {
        id: "gad_6",
        textEn: "Becoming easily annoyed or irritable",
        textAr: "سرعة الانفعال والغضب أو الشعور بالضيق بسهولة",
        options: frequencyOptions
      },
      {
        id: "gad_7",
        textEn: "Feeling afraid as if something awful might happen",
        textAr: "الشعور بالخوف وكأن شيئاً فظيعاً قد يحدث",
        options: frequencyOptions
      }
    ],
    interpretScore: (score) => {
      if (score >= 15) {
        return {
          categoryEn: "Severe Anxiety",
          categoryAr: "قلق حاد (شديد)",
          feedbackEn: `Your score is ${score}/21, suggesting severe generalized anxiety symptoms. In line with DSM-5 criteria, you should consult a licensed clinical psychologist or psychiatrist for an comprehensive diagnostic assessment and treatment options.`,
          feedbackAr: `مجموع درجاتك هو ${score}/21، مما يشير إلى أعراض قلق معمم شديدة. تماشياً مع معايير DSM-5، يجب عليك استشارة أخصائي نفسي عيادي أو طبيب نفسي مرخص للتقييم والتشخيص الدقيق.`
        };
      } else if (score >= 10) {
        return {
          categoryEn: "Moderate Anxiety",
          categoryAr: "قلق متوسط",
          feedbackEn: `Your score is ${score}/21, suggesting moderate general anxiety. This is a common threshold for clinical concern in GAD. Consider booking a consultation with a therapist or counselor to learn coping strategies.`,
          feedbackAr: `مجموع درجاتك هو ${score}/21، مما يشير إلى أعراض قلق متوسطة. هذه عتبة سريرية تستحق الاهتمام. يفضل مراجعة معالج نفسي لمعرفة تقنيات إدارة القلق والتعامل معه.`
        };
      } else if (score >= 5) {
        return {
          categoryEn: "Mild Anxiety",
          categoryAr: "قلق خفيف",
          feedbackEn: `Your score is ${score}/21, indicating mild anxiety symptoms. Often responsive to mindfulness, stress management training, and counseling. Monitor if this interferes with your social or occupational life.`,
          feedbackAr: `مجموع درجاتك هو ${score}/21، مما يشير إلى أعراض قلق خفيفة. غالباً ما تستجيب للرعاية الذاتية واليقظة الذهنية وإدارة الضغوط. راقب ما إذا كان هذا يؤثر على حياتك اليومية.`
        };
      } else {
        return {
          categoryEn: "Minimal / No Anxiety",
          categoryAr: "قلق بسيط أو غير موجود",
          feedbackEn: `Your score is ${score}/21, showing minimal generalized anxiety symptoms. This is in the healthy/typical range.`,
          feedbackAr: `مجموع درجاتك هو ${score}/21، مما يدل على قلق بسيط أو غائب. هذا في النطاق الطبيعي والصحي.`
        };
      }
    }
  },
  {
    id: "adhd",
    titleEn: "Adult ADHD Screening",
    titleAr: "مقياس اضطراب فرط الحركة وتشتت الانتباه للبالغين",
    subtitleEn: "ASRS v1.1 Aligned",
    subtitleAr: "متوافق مع مقياس ASRS للبالغين",
    descriptionEn: "A 6-question clinical screening tool mapped to DSM-5 criteria for adult attention deficit hyperactivity disorder (ADHD), evaluating core inattentive and hyperactive symptoms.",
    descriptionAr: "أداة فحص سريرية من 6 أسئلة مطابقة لمعايير DSM-5 لاضطراب نقص الانتباه وفرط الحركة لدى البالغين (ADHD)، وتقيم الأعراض الرئيسية لتشتت الانتباه وفرط النشاط.",
    dsmCode: "DSM-5 Code: 314.xx (ICD-10: F90.x)",
    dsmCriteriaEn: "DSM-5 Criteria for Adult ADHD: A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning, requiring at least 5 symptoms in either domain, with several symptoms present prior to age 12, in 2 or more settings.",
    dsmCriteriaAr: "معايير DSM-5 لـ ADHD البالغين: نمط مستمر من ضعف الانتباه و/أو فرط الحركة والاندفاعية الذي يتعارض مع الأداء، ويتطلب 5 أعراض على الأقل في أي من المجالين، مع وجود عدة أعراض قبل سن 12 عاماً، وفي بيئتين أو أكثر.",
    questions: [
      {
        id: "adhd_1",
        textEn: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
        textAr: "كم مرة تجد صعوبة في إنهاء التفاصيل النهائية لمشروع ما، بمجرد الانتهاء من الأجزاء الصعبة منه؟",
        options: [
          { value: 0, textEn: "Never", textAr: "أبداً" },
          { value: 1, textEn: "Rarely", textAr: "نادراً" },
          { value: 2, textEn: "Sometimes", textAr: "أحياناً" },
          { value: 3, textEn: "Often", textAr: "غالباً" },
          { value: 4, textEn: "Very Often", textAr: "غالباً جداً" }
        ]
      },
      {
        id: "adhd_2",
        textEn: "How often do you have difficulty getting things in order when you have to perform a task that requires organization?",
        textAr: "كم مرة تواجه صعوبة في ترتيب وتنظيم الأمور عندما يتعين عليك أداء مهمة تتطلب تنظيماً؟",
        options: [
          { value: 0, textEn: "Never", textAr: "أبداً" },
          { value: 1, textEn: "Rarely", textAr: "نادراً" },
          { value: 2, textEn: "Sometimes", textAr: "أحياناً" },
          { value: 3, textEn: "Often", textAr: "غالباً" },
          { value: 4, textEn: "Very Often", textAr: "غالباً جداً" }
        ]
      },
      {
        id: "adhd_3",
        textEn: "How often do you have problems remembering appointments or obligations?",
        textAr: "كم مرة تواجه مشاكل في تذكر المواعيد أو الالتزامات؟",
        options: [
          { value: 0, textEn: "Never", textAr: "أبداً" },
          { value: 1, textEn: "Rarely", textAr: "نادراً" },
          { value: 2, textEn: "Sometimes", textAr: "أحياناً" },
          { value: 3, textEn: "Often", textAr: "غالباً" },
          { value: 4, textEn: "Very Often", textAr: "غالباً جداً" }
        ]
      },
      {
        id: "adhd_4",
        textEn: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
        textAr: "عندما يكون لديك مهمة تتطلب الكثير من التفكير والجهد الذهني، كم مرة تتجنب البدء فيها أو تؤجله؟",
        options: [
          { value: 0, textEn: "Never", textAr: "أبداً" },
          { value: 1, textEn: "Rarely", textAr: "نادراً" },
          { value: 2, textEn: "Sometimes", textAr: "أحياناً" },
          { value: 3, textEn: "Often", textAr: "غالباً" },
          { value: 4, textEn: "Very Often", textAr: "غالباً جداً" }
        ]
      },
      {
        id: "adhd_5",
        textEn: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
        textAr: "كم مرة تفرك أو تحرك يديك أو قدميك بتململ عندما يتعين عليك الجلوس لفترة طويلة؟",
        options: [
          { value: 0, textEn: "Never", textAr: "أبداً" },
          { value: 1, textEn: "Rarely", textAr: "نادراً" },
          { value: 2, textEn: "Sometimes", textAr: "أحياناً" },
          { value: 3, textEn: "Often", textAr: "غالباً" },
          { value: 4, textEn: "Very Often", textAr: "غالباً جداً" }
        ]
      },
      {
        id: "adhd_6",
        textEn: "How often do you feel overly active and compelled to do things, as if you were driven by a motor?",
        textAr: "كم مرة تشعر بنشاط مفرط وتجد نفسك مجبراً على القيام بأشياء، وكأن هناك محركاً يدفعك؟",
        options: [
          { value: 0, textEn: "Never", textAr: "أبداً" },
          { value: 1, textEn: "Rarely", textAr: "نادراً" },
          { value: 2, textEn: "Sometimes", textAr: "أحياناً" },
          { value: 3, textEn: "Often", textAr: "غالباً" },
          { value: 4, textEn: "Very Often", textAr: "غالباً جداً" }
        ]
      }
    ],
    interpretScore: (score, answers) => {
      // ASRS scoring rules: count highly symptomatic responses (shaded boxes)
      // For Q1, Q2, Q3: symptomatic if score >= 2 (Sometimes, Often, Very Often)
      // For Q4, Q5, Q6: symptomatic if score >= 3 (Often, Very Often)
      let positiveSymptomCount = 0;

      const q1 = answers["adhd_1"] || 0;
      const q2 = answers["adhd_2"] || 0;
      const q3 = answers["adhd_3"] || 0;
      const q4 = answers["adhd_4"] || 0;
      const q5 = answers["adhd_5"] || 0;
      const q6 = answers["adhd_6"] || 0;

      if (q1 >= 2) positiveSymptomCount++;
      if (q2 >= 2) positiveSymptomCount++;
      if (q3 >= 2) positiveSymptomCount++;
      if (q4 >= 3) positiveSymptomCount++;
      if (q5 >= 3) positiveSymptomCount++;
      if (q6 >= 3) positiveSymptomCount++;

      const isConsistentWithAdhd = positiveSymptomCount >= 4;

      if (isConsistentWithAdhd) {
        return {
          categoryEn: "Consistent with ADHD Profile",
          categoryAr: "متوافق مع مؤشرات تشتت الانتباه وفرط الحركة",
          feedbackEn: `Your screening shows positive scores on ${positiveSymptomCount} out of 6 key diagnostic indicators. This is highly consistent with an ADHD symptom profile in adults. We recommend a full clinical interview with an ADHD specialist or neuropsychologist for diagnostic confirmation.`,
          feedbackAr: `يظهر الفحص درجات إيجابية في ${positiveSymptomCount} من أصل 6 مؤشرات تشخيصية رئيسية. يتوافق هذا بشكل كبير مع نمط أعراض ADHD للبالغين. ننصح بحجز موعد مع أخصائي نفسي عيادي أو طبيب نفسي متخصص للتقييم المتكامل.`
        };
      } else {
        return {
          categoryEn: "Unlikely ADHD Profile",
          categoryAr: "غير متوافق مع مؤشرات ADHD",
          feedbackEn: `Your screening shows positive scores on only ${positiveSymptomCount} out of 6 key indicators. This suggests an ADHD profile is less likely, though other factors (such as stress, burnout, or anxiety) might be affecting your current focus levels.`,
          feedbackAr: `يظهر الفحص درجات إيجابية في ${positiveSymptomCount} فقط من أصل 6 مؤشرات. هذا يشير إلى أن وجود نمط ADHD أقل احتمالاً، على الرغم من أن عوامل أخرى (مثل التوتر، أو الاحتراق الوظيفي، أو القلق) قد تؤثر على مستويات تركيزك الحالية.`
        };
      }
    }
  },
  {
    id: "insomnia",
    titleEn: "DSM-5 Insomnia Severity Screener",
    titleAr: "مقياس شدة الأرق السريري (DSM-5)",
    subtitleEn: "Insomnia Disorder screening",
    subtitleAr: "فحص اضطراب الأرق واليقظة",
    descriptionEn: "Evaluates difficulty initiating or maintaining sleep, sleep quality satisfaction, daytime fatigue, frequency, and distress over the past 3 months according to DSM-5 criteria.",
    descriptionAr: "يقيم صعوبة البدء في النوم أو الاستمرار فيه، ومدى الرضا عن جودة النوم، والتعب نهاراً، والتكرار، والضيق النفسي طوال الأشهر الثلاثة الماضية تماشياً مع معايير الأرق.",
    dsmCode: "DSM-5 Code: 307.42 (ICD-10: G47.00)",
    dsmCriteriaEn: "DSM-5 Criteria: Complaint of sleep quantity or quality with >=1 symptom (difficulty initiating, maintaining, or waking early), causing clinically significant distress or impairment. Occurs >= 3 nights per week for >= 3 months.",
    dsmCriteriaAr: "معايير DSM-5: الشكوى من كمية النوم أو جودته مع وجود عرض واحد على الأقل (صعوبة البدء، أو الاستمرار، أو الاستيقاظ المبكر)، مسبباً ضيقاً أو خللاً وظيفياً كبيراً. ويحدث بمعدل 3 ليالٍ على الأقل أسبوعياً لمدة 3 أشهر على الأقل.",
    questions: [
      {
        id: "ins_1",
        textEn: "Difficulty falling asleep (onset time > 30 minutes)?",
        textAr: "صعوبة في الخلود إلى النوم (تأخر النوم لأكثر من 30 دقيقة)؟",
        options: [
          { value: 0, textEn: "None", textAr: "لا توجد" },
          { value: 1, textEn: "Mild", textAr: "خفيفة" },
          { value: 2, textEn: "Moderate", textAr: "متوسطة" },
          { value: 3, textEn: "Severe", textAr: "شديدة" },
          { value: 4, textEn: "Very Severe", textAr: "شديدة جداً" }
        ]
      },
      {
        id: "ins_2",
        textEn: "Difficulty staying asleep (waking up during the night and having trouble going back to sleep)?",
        textAr: "صعوبة الاستمرار في النوم (الاستيقاظ ليلاً وصعوبة العودة للنوم مجدداً)؟",
        options: [
          { value: 0, textEn: "None", textAr: "لا توجد" },
          { value: 1, textEn: "Mild", textAr: "خفيفة" },
          { value: 2, textEn: "Moderate", textAr: "متوسطة" },
          { value: 3, textEn: "Severe", textAr: "شديدة" },
          { value: 4, textEn: "Very Severe", textAr: "شديدة جداً" }
        ]
      },
      {
        id: "ins_3",
        textEn: "Waking up too early in the morning and unable to get back to sleep?",
        textAr: "الاستيقاظ مبكراً جداً في الصباح دون القدرة على النوم مجدداً؟",
        options: [
          { value: 0, textEn: "None", textAr: "لا توجد" },
          { value: 1, textEn: "Mild", textAr: "خفيفة" },
          { value: 2, textEn: "Moderate", textAr: "متوسطة" },
          { value: 3, textEn: "Severe", textAr: "شديدة" },
          { value: 4, textEn: "Very Severe", textAr: "شديدة جداً" }
        ]
      },
      {
        id: "ins_4",
        textEn: "How satisfied/dissatisfied are you with your current sleep pattern?",
        textAr: "ما مدى رضاك / عدم رضاك عن نمط نومك الحالي؟",
        options: [
          { value: 0, textEn: "Very Satisfied", textAr: "راضٍ جداً" },
          { value: 1, textEn: "Satisfied", textAr: "راضٍ" },
          { value: 2, textEn: "Neutral", textAr: "محايد" },
          { value: 3, textEn: "Dissatisfied", textAr: "غير راضٍ" },
          { value: 4, textEn: "Very Dissatisfied", textAr: "غير راضٍ تماماً" }
        ]
      },
      {
        id: "ins_5",
        textEn: "Does your sleep problem interfere with your daily functioning (daytime fatigue, focus, work, social)?",
        textAr: "هل تؤثر مشاكل النوم على أدائك اليومي (الخمول، التركيز، العمل، الحياة الاجتماعية)؟",
        options: [
          { value: 0, textEn: "Not at all", textAr: "لا تؤثر على الإطلاق" },
          { value: 1, textEn: "A little", textAr: "قليلاً" },
          { value: 2, textEn: "Somewhat", textAr: "إلى حد ما" },
          { value: 3, textEn: "Much", textAr: "بدرجة كبيرة" },
          { value: 4, textEn: "Very Much", textAr: "بدرجة كبيرة جداً" }
        ]
      },
      {
        id: "ins_6",
        textEn: "How noticeable to others do you think your sleep problem is in terms of impairing your quality of life?",
        textAr: "إلى أي مدى تعتقد أن مشكلة نومك ملحوظة للآخرين من حيث الإضرار بجودة حياتك؟",
        options: [
          { value: 0, textEn: "Not noticeable", textAr: "غير ملحوظة" },
          { value: 1, textEn: "Barely", textAr: "بالكاد ملحوظة" },
          { value: 2, textEn: "Somewhat", textAr: "ملحوظة نوعاً ما" },
          { value: 3, textEn: "Much", textAr: "ملحوظة جداً" },
          { value: 4, textEn: "Very Much", textAr: "ملحوظة للغاية" }
        ]
      }
    ],
    interpretScore: (score) => {
      if (score >= 18) {
        return {
          categoryEn: "Severe Clinical Insomnia",
          categoryAr: "أرق سريري حاد (شديد جداً)",
          feedbackEn: `Your score is ${score}/24, reflecting severe clinical insomnia. Mapped to DSM-5 criteria, severe insomnia requires clinical intervention. It is highly recommended to seek consultation from a sleep specialist or psychologist specializing in CBT-I (Cognitive Behavioral Therapy for Insomnia).`,
          feedbackAr: `مجموع درجاتك هو ${score}/24، مما يعكس أرقاً سريرياً شديداً. وفقاً لمعايير DSM-5، يتطلب الأرق الشديد تدخلاً طبياً. ينصح بشدة بمراجعة أخصائي نوم أو معالج سلوكي متخصص في علاج الأرق السلوكي المعرفي (CBT-I).`
        };
      } else if (score >= 12) {
        return {
          categoryEn: "Moderate Clinical Insomnia",
          categoryAr: "أرق سريري متوسط",
          feedbackEn: `Your score is ${score}/24, suggesting moderate clinical insomnia. Your symptoms likely affect daytime functioning. Consider sleep hygiene improvements or speaking with a professional about targeted solutions.`,
          feedbackAr: `مجموع درجاتك هو ${score}/24، مما يشير إلى أرق سريري متوسط. قد تؤثر أعراضك بشكل مباشر على تركيزك ونشاطك نهاراً. ينصح بتحسين عادات النوم السليمة واستشارة مختص.`
        };
      } else if (score >= 6) {
        return {
          categoryEn: "Sub-threshold Insomnia",
          categoryAr: "أرق خفيف (تحت العتبة السريرية)",
          feedbackEn: `Your score is ${score}/24, indicating sub-threshold insomnia. You experience sleep disruption, but it may not fully meet clinical criteria for Insomnia Disorder yet. Reviewing sleep habits (reducing evening screen time, stable wake-up schedule) is beneficial.`,
          feedbackAr: `مجموع درجاتك هو ${score}/24، مما يشير إلى أرق خفيف تحت العتبة السريرية. تعاني من بعض الاضطرابات ولكنها قد لا ترقى لتشخيص اضطراب الأرق الكامل. تحسين روتين النوم قد يساعدك بشكل كبير.`
        };
      } else {
        return {
          categoryEn: "No Clinical Insomnia",
          categoryAr: "لا يوجد أرق سريري",
          feedbackEn: `Your score is ${score}/24, showing no clinically significant sleep problems. This is an optimal healthy sleep indicator.`,
          feedbackAr: `مجموع درجاتك هو ${score}/24، مما يعني عدم وجود مشاكل نوم ذات أهمية سريرية. واصل الحفاظ على نمط نومك الصحي.`
        };
      }
    }
  },
  {
    id: "iq",
    titleEn: "Wechsler-Aligned Intelligence & Cognitive Screening",
    titleAr: "اختبار الذكاء والقدرات الإدراكية (Wechsler)",
    subtitleEn: "Cognitive Domains Assessment",
    subtitleAr: "تقييم متوافق مع قياس الذكاء والوظائف الإدراكية",
    descriptionEn: "A 10-question logical, quantitative, memory and spatial-cognitive screen aligned with Wechsler intelligence domains to assess fluid intelligence and conceptual categorization.",
    descriptionAr: "أداة فحص إدراكية مكونة من 10 أسئلة تقيس الاستدلال المنطقي والكمي والذاكرة العاملة والقدرات الفراغية، متوافقة مع مجالات الذكاء لمقياس وكسلر لتقييم الذكاء السائل والتصنيف المفاهيمي.",
    dsmCode: "DSM-5: Neurocognitive Domain Screen",
    dsmCriteriaEn: "DSM-5 Assessment for intellectual and cognitive domains focusing on conceptual, social, and practical reasoning abilities, which are central to evaluating global neurocognitive performance.",
    dsmCriteriaAr: "تقييم DSM-5 للمجالات الفكرية والإدراكية مع التركيز على قدرات الاستدلال المفاهيمي والاجتماعي والعملي، والتي تعد أساسية لتقييم الأداء العصبي المعرفي العام.",
    questions: [
      {
        id: "iq_1",
        textEn: "Find the missing number in the logical sequence: 2, 6, 12, 20, 30, ?",
        textAr: "أوجد العدد الناقص في المتسلسلة المنطقية التالية: 2، 6، 12، 20، 30، ؟",
        options: [
          { value: 10, textEn: "42", textAr: "42" },
          { value: 0, textEn: "36", textAr: "36" },
          { value: 0, textEn: "40", textAr: "40" },
          { value: 0, textEn: "45", textAr: "45" }
        ]
      },
      {
        id: "iq_2",
        textEn: "Light is to Darkness as Knowledge is to:",
        textAr: "النور بالنسبة للظلام كالمعرفة بالنسبة لـ:",
        options: [
          { value: 10, textEn: "Ignorance", textAr: "الجهل" },
          { value: 0, textEn: "Reading", textAr: "القراءة" },
          { value: 0, textEn: "Science", textAr: "العلم" },
          { value: 0, textEn: "Mind", textAr: "العقل" }
        ]
      },
      {
        id: "iq_3",
        textEn: "If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
        textAr: "إذا كانت 5 آلات تستغرق 5 دقائق لصناعة 5 قطع، فكم من الوقت تستغرق 100 آلة لصناعة 100 قطعة؟",
        options: [
          { value: 10, textEn: "5 minutes", textAr: "5 دقائق" },
          { value: 0, textEn: "100 minutes", textAr: "100 دقيقة" },
          { value: 0, textEn: "20 minutes", textAr: "20 دقيقة" },
          { value: 0, textEn: "1 minute", textAr: "دقيقة واحدة" }
        ]
      },
      {
        id: "iq_4",
        textEn: "If you reverse the numbers in the sequence '7-3-9-1-5' and subtract 2 from the middle number, what is the resulting sequence?",
        textAr: "إذا قمت بعكس ترتيب الأرقام في المتسلسلة '7-3-9-1-5' وطرحت 2 من الرقم الموجود في المنتصف، فما هي المتسلسلة الناتجة؟",
        options: [
          { value: 10, textEn: "5-1-7-3-7", textAr: "5-1-7-3-7" },
          { value: 0, textEn: "5-1-9-3-7", textAr: "5-1-9-3-7" },
          { value: 0, textEn: "7-3-7-1-5", textAr: "7-3-7-1-5" },
          { value: 0, textEn: "5-2-7-3-7", textAr: "5-2-7-3-7" }
        ]
      },
      {
        id: "iq_5",
        textEn: "A cube has 6 faces. If you paint all faces of a large 3x3x3 cube green, and then slice it into 27 small 1x1x1 cubes, how many small cubes will have exactly 3 green faces?",
        textAr: "مكعب له 6 أوجه. إذا قمت بطلاء جميع أوجه مكعب كبير مقاس 3x3x3 باللون الأخضر، ثم قطعته إلى 27 مكعباً صغيراً مقاس 1x1x1، فكم مكعباً صغيراً سيكون له 3 أوجه خضراء بالضبط؟",
        options: [
          { value: 10, textEn: "8 cubes (corners)", textAr: "8 مكعبات (الزوايا)" },
          { value: 0, textEn: "12 cubes", textAr: "12 مكعباً" },
          { value: 0, textEn: "6 cubes", textAr: "6 مكعبات" },
          { value: 0, textEn: "1 cube", textAr: "مكعب واحد" }
        ]
      },
      {
        id: "iq_6",
        textEn: "Which of the following does not belong with the others in terms of chemical categorization?",
        textAr: "أي من العناصر التالية لا ينتمي إلى بقية المجموعة من حيث التصنيف المفاهيمي؟",
        options: [
          { value: 10, textEn: "Brass (alloy)", textAr: "النحاس الأصفر (سبيكة)" },
          { value: 0, textEn: "Gold (element)", textAr: "الذهب (عنصر نقّي)" },
          { value: 0, textEn: "Silver (element)", textAr: "الفضة (عنصر نقّي)" },
          { value: 0, textEn: "Copper (element)", textAr: "النحاس الأحمر (عنصر نقّي)" }
        ]
      },
      {
        id: "iq_7",
        textEn: "All Glims are Snarks. Some Snarks are bright. Therefore, are some Glims definitely bright?",
        textAr: "كل 'الجليمز' هم 'سناركس'. بعض 'السناركس' مضيئون. بناءً عليه، هل بعض 'الجليمز' بالتأكيد مضيئون؟",
        options: [
          { value: 10, textEn: "Not necessarily true", textAr: "ليس بالضرورة صحيحاً" },
          { value: 0, textEn: "Yes, definitely", textAr: "نعم، بالتأكيد" },
          { value: 0, textEn: "No, impossible", textAr: "لا، هذا مستحيل" },
          { value: 0, textEn: "None of the above", textAr: "لا شيء مما سبق" }
        ]
      },
      {
        id: "iq_8",
        textEn: "If 3 men can dig 3 holes in 3 days, how many holes can 6 men dig in 6 days?",
        textAr: "إذا كان بإمكان 3 رجال حفر 3 حفر في 3 أيام، فكم حفرة يمكن لـ 6 رجال حفرها في 6 أيام؟",
        options: [
          { value: 10, textEn: "12 holes", textAr: "12 حفرة" },
          { value: 0, textEn: "6 holes", textAr: "6 حفر" },
          { value: 0, textEn: "18 holes", textAr: "18 حفرة" },
          { value: 0, textEn: "9 holes", textAr: "9 حفر" }
        ]
      },
      {
        id: "iq_9",
        textEn: "You walk 10 meters North, then 10 meters East, then 10 meters South, then 10 meters West. How far are you from your starting point?",
        textAr: "مشيت 10 أمتار شمالاً، ثم 10 أمتار شرقاً، ثم 10 أمتار جنوباً، ثم 10 أمتار غرباً. كم تبعد الآن عن نقطة انطلاقك؟",
        options: [
          { value: 10, textEn: "0 meters (back at start)", textAr: "0 متر (عدت تماماً لنقطة البداية)" },
          { value: 0, textEn: "10 meters", textAr: "10 أمتار" },
          { value: 0, textEn: "20 meters", textAr: "20 متراً" },
          { value: 0, textEn: "40 meters", textAr: "40 متراً" }
        ]
      },
      {
        id: "iq_10",
        textEn: "Water is to Ice as Gas is to:",
        textAr: "الماء بالنسبة للثلج كالغاز بالنسبة لـ:",
        options: [
          { value: 10, textEn: "Liquid", textAr: "السائل" },
          { value: 0, textEn: "Air", textAr: "الهواء" },
          { value: 0, textEn: "Solid", textAr: "الصلب" },
          { value: 0, textEn: "Steam", textAr: "البخار" }
        ]
      }
    ],
    interpretScore: (score) => {
      if (score >= 90) {
        return {
          categoryEn: "Very Superior (Estimated IQ: 130+)",
          categoryAr: "ذكاء عبقري / مرتفع جداً (معدل ذكاء تقديري: +130)",
          feedbackEn: `Your score is ${score}/100, showing outstanding logical, mathematical, and spatial comprehension skills. This corresponds to the top 2% of the general population in fluid intelligence, reflecting excellent working memory capacity and strong pattern induction capabilities.`,
          feedbackAr: `مجموع درجاتك هو ${score}/100، مما يظهر مهارات استثنائية في الفهم المنطقي والرياضي والفراغي. يتطابق هذا مع أعلى 2٪ من أفراد المجتمع في مستويات الذكاء السائل، مما يعكس سعة ذاكرة عاملة ممتازة وقدرات استدلال متطورة للغاية.`
        };
      } else if (score >= 70) {
        return {
          categoryEn: "Superior (Estimated IQ: 115-129)",
          categoryAr: "ذكاء مرتفع / متفوق (معدل ذكاء تقديري: 115-129)",
          feedbackEn: `Your score is ${score}/100, indicating high cognitive capacity and superior problem-solving efficiency. You easily identify relationships between abstract concepts and display rapid analytical thinking.`,
          feedbackAr: `مجموع درجاتك هو ${score}/100، مما يشير إلى سعة إدراكية عالية وكفاءة متفوقة في حل المشكلات والمسائل الرياضية. يمكنك بسهولة كشف العلاقات بين المفاهيم المجردة وتحليلها بسرعة ودقة.`
        };
      } else if (score >= 50) {
        return {
          categoryEn: "High Average (Estimated IQ: 100-114)",
          categoryAr: "فوق المتوسط طبيعي (معدل ذكاء تقديري: 100-114)",
          feedbackEn: `Your score is ${score}/100, indicating above-average cognitive and deductive reasoning skills. This reflects typical healthy neural processing speed, solid logical structures, and standard spatial rotation abilities.`,
          feedbackAr: `مجموع درجاتك هو ${score}/100، مما يشير إلى مهارات إدراكية واستدلالية فوق المعدل الطبيعي بقليل. يعكس هذا سرعة معالجة ذهنية صحية، وبنية منطقية صلبة، وقدرات ممتازة على التفكير المتسلسل والتحليلي.`
        };
      } else if (score >= 30) {
        return {
          categoryEn: "Average / Typical (Estimated IQ: 85-99)",
          categoryAr: "متوسط طبيعي / معتدل (معدل ذكاء تقديري: 85-99)",
          feedbackEn: `Your score is ${score}/100, representing standard cognitive functioning within the typical population average. You have robust general logic skills that help resolve daily practical and social problems effectively.`,
          feedbackAr: `مجموع درجاتك هو ${score}/100، مما يمثل مستوى طبيعي معتدل في الوظائف الإدراكية وهو النطاق الأكثر شيوعاً بين الأفراد. تمتلك مهارات منطقية عامة متوازنة تساعدك على حل المشكلات الحياتية اليومية بفعالية.`
        };
      } else {
        return {
          categoryEn: "Below Average (Estimated IQ: <85)",
          categoryAr: "أقل من المتوسط الطبيعي (معدل ذكاء تقديري: <85)",
          feedbackEn: `Your score is ${score}/100, suggesting below-average logical induction speed on this screen. This could be due to stress, rushing, or fatigue. A comprehensive neuropsychological review with Wechsler clinical scales is recommended for accurate diagnostic profiling.`,
          feedbackAr: `مجموع درجاتك هو ${score}/100، مما يشير إلى أداء أقل من المتوسط في هذا الفحص الإدراكي المبدئي. قد يتأثر ذلك بالتوتر، أو التسرع، أو الإرهاق. يوصى بمراجعة شاملة للوظائف الذهنية مع معالج نفسي عيادي لتقييم أدق.`
        };
      }
    }
  },
  {
    id: "rorschach",
    titleEn: "Rorschach Projective Inkblot Screening",
    titleAr: "مقياس الروشاخ الإسقاطي لبقع الحبر",
    subtitleEn: "Perceptual Personality Projection",
    subtitleAr: "تحليل الشخصية الإسقاطي وأنماط الإدراك للأعماق",
    descriptionEn: "A 5-card projective screening evaluating perceptual organization, emotional coping styles, and subconscious associations based on interpretations of stylized symmetrical inkblots.",
    descriptionAr: "أداة فحص إسقاطية مكونة من 5 بطاقات تقيم الهيكل التنظيمي للإدراك، وأساليب التعامل العاطفي، والترابطات اللاشعورية بناءً على تفسير بقع الحبر المتناظرة المصممة بدقة.",
    dsmCode: "Projective: Perceptual-Cognitive Style",
    dsmCriteriaEn: "Projective assessments analyze dynamic aspects of personality, unconscious mechanisms, perceptual projection, and self-organization rather than categorical diagnostics.",
    dsmCriteriaAr: "تحلل التقييمات الإسقاطية الجوانب الحركية للشخصية، والآليات اللاشعورية، والإسقاط الإدراكي، والتنظيم الذاتي بدلاً من تقديم تشخيص فئوي جاف.",
    questions: [
      {
        id: "rorschach_1",
        textEn: "Card I (Symmetrical Dark Grey Inkblot): What does this inkblot look like to you?",
        textAr: "البطاقة الأولى (بقعة حبر رمادية غامقة متناظرة): ماذا تبدو لك هذه البقعة؟",
        options: [
          { value: 0, textEn: "A bat, butterfly, or flying creature with wings", textAr: "خفاش، أو فراشة، أو كائن مجنح يطير بسلاسة" },
          { value: 1, textEn: "Two hands reaching out or figures dancing in motion", textAr: "يدان ممدودتان أو شخصيات ترقص وتتحرك بديناميكية" },
          { value: 2, textEn: "A pelvic bone, chest cavity, or medical skeletal scan", textAr: "عظم الحوض، أو التجويف الصدري، أو صورة أشعة طبية" },
          { value: 3, textEn: "A menacing mask, dark storm clouds, or a strange monster", textAr: "قناع يبعث على التهديد، أو غيوم عاصفة داكنة، أو وحش غريب" }
        ]
      },
      {
        id: "rorschach_2",
        textEn: "Card II (Symmetrical Black and Vibrant Red Inkblot): What does this inkblot look like to you?",
        textAr: "البطاقة الثانية (بقعة حبر باللون الأسود والأحمر الزاهي): ماذا تبدو لك هذه البقعة؟",
        options: [
          { value: 0, textEn: "Two dogs, bears, or animals touching paws", textAr: "كلبان، أو دبان، أو حيوانات تتلامس بقوائمها" },
          { value: 1, textEn: "Two people spinning around in a ritualistic dance with flames", textAr: "شخصان يدوران حول بعضهما في رقصة طقوسية مع النيران" },
          { value: 2, textEn: "Blood splatters, a heart chamber, or anatomical inner organs", textAr: "بقع دماء، أو حجرة قلب، أو أعضاء تشريحية داخلية" },
          { value: 3, textEn: "An explosive volcanic eruption or entrance to a dark cave", textAr: "ثوران بركاني متفجر أو مدخل إلى كهف مظلم وغامض" }
        ]
      },
      {
        id: "rorschach_3",
        textEn: "Card III (Two Stylized Symmetrical Figures with Red Bow): What does this inkblot look like to you?",
        textAr: "البطاقة الثالثة (شخصيتان متناظرتان مع لمسة حمراء في الوسط): ماذا تبدو لك هذه البقعة؟",
        options: [
          { value: 0, textEn: "Two elegant human figures, waiters, or dancers bowing", textAr: "شخصان أنيقان، أو نادلان، أو راقصان ينحنيان لبعضهما" },
          { value: 1, textEn: "Red butterflies, spinning tops, or dynamic festive ribbons", textAr: "فراشات حمراء، أو بلابل تدور، أو أشرطة احتفالية" },
          { value: 2, textEn: "Spinal column, kidneys, or medical diagnostic scans", textAr: "العمود الفقري، أو الكلى، أو صور الأشعة التشخيصية" },
          { value: 3, textEn: "Two monkeys pulling apart a bone, or creatures from another world", textAr: "قردان يتنازعان على عظم، أو كائنات غريبة من عالم آخر" }
        ]
      },
      {
        id: "rorschach_4",
        textEn: "Card IV (Large Dark, Shadowed Overbearing Inkblot): What does this inkblot look like to you?",
        textAr: "البطاقة الرابعة (بقعة داكنة ضخمة ومهيبة ذات ظلال متداخلة): ماذا تبدو لك هذه البقعة؟",
        options: [
          { value: 0, textEn: "A large rugged boots, fur pelt, or heavy winter coat", textAr: "حذاء جلدي كبير، أو فرو دافئ، أو معطف شتوي ثقيل" },
          { value: 1, textEn: "A giant walking forward, looking up from a low perspective", textAr: "عملاق يمشي للأمام، يُنظر إليه من منظور سفلي منخفض" },
          { value: 2, textEn: "An exposed backbone, deep muscular fibers, or physical injury", textAr: "عمود فقري مكشوف، أو ألياف عضلية عميقة، أو إصابة جسدية" },
          { value: 3, textEn: "An oppressive monster, a looming shadow of authority, or a dark castle", textAr: "وحش جائر، أو ظل يلوح في الأفق للسلطة والرقابة، أو قلعة مظلمة" }
        ]
      },
      {
        id: "rorschach_5",
        textEn: "Card V (Symmetrical Bat-like Outline): What does this inkblot look like to you?",
        textAr: "البطاقة الخامسة (شكل متناظر يشبه الخفاش أو الفراشة): ماذا تبدو لك هذه البقعة؟",
        options: [
          { value: 0, textEn: "A bat, butterfly, or moth gliding smoothly", textAr: "خفاش، أو فراشة، أو عثة تطير بسلاسة في الهواء" },
          { value: 1, textEn: "A person with outstretched arms running or stretching", textAr: "شخص ممدود الذراعين يجري بنشاط أو يتمدد" },
          { value: 2, textEn: "A skeletal frame, head of a stag with horns, or narrow joints", textAr: "هيكل عظمي، أو رأس وعل بقرون، أو مفاصل ضيقة وحساسة" },
          { value: 3, textEn: "Two profile faces arguing, or scissors cutting through cloth", textAr: "وجهان جانبيان في حالة نزاع، أو مقص يقطع قطعة قماش" }
        ]
      }
    ],
    interpretScore: (score, answers) => {
      // Calculate frequencies of 0, 1, 2, 3 response styles
      const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
      let totalAnswers = 0;
      Object.entries(answers).forEach(([key, val]) => {
        if (key.startsWith("rorschach_")) {
          counts[val] = (counts[val] || 0) + 1;
          totalAnswers++;
        }
      });

      // Find dominant response style
      let dominantStyle = 0;
      let maxCount = -1;
      for (let i = 0; i <= 3; i++) {
        if ((counts[i] || 0) > maxCount) {
          maxCount = counts[i];
          dominantStyle = i;
        }
      }

      // If tie, can use custom checks
      if (dominantStyle === 0) {
        return {
          categoryEn: "Synthesized Perceptual Style (Holistic Logic)",
          categoryAr: "النمط الإدراكي التركيبي (المنطق الكلي المتزن)",
          feedbackEn: `Your projective responses emphasize whole-shape configurations (bats, butterflies, animals). This suggests a strong cognitive drive for structure, balanced logical integration, and a focus on practical, standard, and cohesive realities over emotional fragmentation.`,
          feedbackAr: `تركز استجاباتك الإسقاطية على دمج الأشكال كبنية كاملة متناسقة (خفافيش، فراشات، حيوانات). يشير هذا إلى وجود دافع معرفي قوي للتنظيم والترتيب والمنطق المتوازن، والاهتمام بالواقعية والاتساق في الحياة اليومية.`
        };
      } else if (dominantStyle === 1) {
        return {
          categoryEn: "Affective-Kinesthetic Style (Creative & Empathic)",
          categoryAr: "النمط الحركي الوجداني (الإبداعي والتعاطفي)",
          feedbackEn: `Your responses highlight motion, human interaction, and aesthetic details. This style represents deep emotional sensitivity, creative imagination, high empathy, and active inner life. You easily process social-emotional nuances.`,
          feedbackAr: `تظهر استجاباتك ميلاً واضحاً للحركة والتفاعل البشري والتفاصيل الجمالية الزاهية. يمثل هذا الأسلوب حساسية عاطفية عميقة، وخيالاً إبداعياً غنياً، وتعاطفاً مرتفعاً، مع حياة داخلية نشطة وتفاعل ممتاز مع الآخرين.`
        };
      } else if (dominantStyle === 2) {
        return {
          categoryEn: "Somatic-Vigilant Style (Internalized Awareness)",
          categoryAr: "النمط الجسدي الحذر (الوعي الداخلي المكثف)",
          feedbackEn: `Your responses contain anatomical, structural, or visceral elements (skeletons, organs, scan imagery). This profile often corresponds to heightened body focus, high self-awareness, intellectualization as a defense mechanism, or subtle stress manifested physically.`,
          feedbackAr: `تحتوي استجاباتك على عناصر تشريحية وهيكلية وأحشاء داخلية (هياكل عظمية، أعضاء، صور أشعة). يرتبط هذا النمط غالباً بتركيز مرتفع على الجسد، ووعي ذاتي مكثف، أو استخدام العقلنة كآلية دفاعية، أو ضغوط نفسية تنعكس جسدياً.`
        };
      } else {
        return {
          categoryEn: "Imaginative-Complex Style (Subconscious Conflict Projection)",
          categoryAr: "النمط الإسقاطي الخيالي (الإسقاط اللاواعي الرمزي)",
          feedbackEn: `Your responses tend toward complex, dramatic, or shadowed perceptions (monsters, authority figures, caves, conflicts). This reflects rich metaphorical fantasy, high openness to subconscious experiences, and potential active psychodynamic conflicts or fears of authority being actively processed.`,
          feedbackAr: `تميل استجاباتك لتفسيرات مركبة أو درامية أو غامضة (وحوش، ظلال سلطوية، كهوف، صراعات). يعكس هذا خيالاً رمزياً غنياً، وانفتاحاً على التجارب العميقة اللاشعورية، مع وجود صراعات نفسية ديناميكية أو قلق يتم معالجته داخلياً.`
        };
      }
    }
  },
  {
    id: "blackfoot",
    titleEn: "Black Foot (Patte Noire) Projective Screening",
    titleAr: "اختبار القدم السوداء الإسقاطي للأعماق",
    subtitleEn: "Psychoanalytic Sibling & Authority Dynamics",
    subtitleAr: "التحليل النفسي الإسقاطي للعلاقات الأسرية والأنا",
    descriptionEn: "Louis Corman's diagnostic tool evaluating sibling rivalry, paternal authority, maternal attachment, and psychodynamic defense mechanisms through stories of the piglet 'Patte Noire'.",
    descriptionAr: "أداة تشخيص إسقاطية شهيرة للمطور لويس كورمان تقيم الغيرة بين الإخوة، السلطة الأبوية، التعلق بالأم، وآليات الدفاع النفسي واللاشعور عبر مغامرات الخنزير الصغير 'القدم السوداء'.",
    dsmCode: "Psychoanalytic: Ego Defense & Complexes",
    dsmCriteriaEn: "Evaluates child and adult psychoanalytic dynamics, unconscious impulses, fraternal positions, parental imagos, and ego defense structures.",
    dsmCriteriaAr: "يقيم الديناميكيات النفسية للأعماق والتحليل النفسي، النبضات اللاشعورية، الغيرة وصراعات الترتيب العائلي، علاقات الأبوين، وبنية الدفاع النفسي للأنا.",
    questions: [
      {
        id: "blackfoot_1",
        textEn: "Card 1: Fraternal Rivalry (The Feed) - The mother pig feeds other piglets while Patte Noire looks on alone. What does Patte Noire feel or wish to do?",
        textAr: "البطاقة الأولى: الغيرة الأخوية (الرضاعة) - الأم ترضع الخنازير الصغيرة بينما ينظر 'القدم السوداء' منفرداً من بعيد. بماذا يشعر أو يتمنى أن يفعل؟",
        options: [
          { value: 0, textEn: "Patte Noire decides to explore the farm autonomously to find their own food, growing independent.", textAr: "يقرر 'القدم السوداء' استكشاف المزرعة بمفرده بحثاً عن طعامه الخاص، ليصبح أكثر استقلالية وقوة." },
          { value: 1, textEn: "Patte Noire feels angry, wishing they could push the others away and have all the mother's attention.", textAr: "يشعر 'القدم السوداء' بالغضب والغيرة، متمنياً دفع الآخرين بعيداً لكي يحظى بحنان الأم وحده." },
          { value: 2, textEn: "Patte Noire wishes they were smaller so they could be cradled and fed like an infant again.", textAr: "يتمنى 'القدم السوداء' لو كان أصغر حجماً حتى يُحتضن ويُطعم كطفل رضيع مدلل مرة أخرى." },
          { value: 3, textEn: "Patte Noire hides away, feeling sad and guilty, believing they don't deserve the mother's warmth.", textAr: "يختبئ بعيداً وهو يشعر بالحزن والذنب، معتقداً في قرارة نفسه أنه لا يستحق حنان أمه واهتمامها." }
        ]
      },
      {
        id: "blackfoot_2",
        textEn: "Card 2: Father Imago (The Authority) - A large, strong father pig standing in front of Patte Noire. What is Patte Noire's response to this figure?",
        textAr: "البطاقة الثانية: صورة الأب (السلطة والحدود) - خنزير أب كبير وقوي يقف أمام 'القدم السوداء'. كيف يستجيب 'القدم السوداء' لهذه الشخصية؟",
        options: [
          { value: 0, textEn: "Patte Noire listens to the father's guidance, learning boundaries while maintaining self-confidence.", textAr: "يستمع 'القدم السوداء' لتوجيهات والده، ويتعلم الحدود الصحية والسلوك القويم مع الحفاظ على ثقته بنفسه." },
          { value: 1, textEn: "Patte Noire feels the father is unfair and controlling, projecting their anger onto other piglets.", textAr: "يشعر أن والده جائر ومسيطر للغاية، ويسقط غضبه وصراعه الداخلي على بقية إخوته والمحيطين به." },
          { value: 2, textEn: "Patte Noire wishes the father would protect them from all hardships and make all decisions.", textAr: "يتمنى لو يقوم والده بحمايته من كل صعاب الحياة واتخاذ كافة القرارات المصيرية نيابة عنه بشكل مطلق." },
          { value: 3, textEn: "Patte Noire feels extremely anxious and small under the father's gaze, hiding their true thoughts.", textAr: "يشعر بقلق شديد وصغر حجمه تحت نظرات والده المهيبة، ويكبت مشاعره الحقيقية خوفاً من العقاب." }
        ]
      },
      {
        id: "blackfoot_3",
        textEn: "Card 3: Guilt & Superego (The Shadow) - A large, mysterious shadow cast over a piglet's tail. What is Patte Noire's interpretation of this event?",
        textAr: "البطاقة الثالثة: ذنب الأنا الأعلى والذعر (الظل) - ظل أسود غامض وكبير يلقي بثقله فوق ذيل الخنزير الصغير. كيف يفسر 'القدم السوداء' هذا المشهد؟",
        options: [
          { value: 0, textEn: "Patte Noire understands rules exist for safety, facing mistakes courageously without excessive self-blame.", textAr: "يفهم أن القواعد والتحذيرات وضعت لسلامته، ويواجه أخطاءه وسلوكه بشجاعة دون جلد مفرط للذات." },
          { value: 1, textEn: "Patte Noire blames the scary shadow on a bad monster, refusing to take responsibility for any mischief.", textAr: "يلقي باللوم في وجود هذا الظل المخيف على وحش خارجي سيء، رافضاً تماماً تحمل أي مسؤولية عن أخطائه." },
          { value: 2, textEn: "Patte Noire runs back to cry in mother's arms, hoping she will soothe away all fear and guilt.", textAr: "يركض باكياً إلى حضن أمه الدافئ، آملاً أن تمحو عنه كل مخاوفه وتغفر له تقصيره وتجعله يشعر بالأمان." },
          { value: 3, textEn: "Patte Noire fears immediate severe punishment, feeling deep internal shame and expecting the worst.", textAr: "يخشى عقاباً شديداً وقاسياً فورياً، ويشعر بخزي داخلي عميق وتأنيب ضمير حاد متوقعاً الأسوأ." }
        ]
      },
      {
        id: "blackfoot_4",
        textEn: "Card 4: Regression & Oral Attachment (The Nest) - Patte Noire snuggles warm and close to the sleeping mother pig. What is their subconscious desire here?",
        textAr: "البطاقة الرابعة: النكوص والتعلق الفمي (الحضن والأمان) - 'القدم السوداء' يحتضن أمه النائمة بحنان ودفء. ما هي الرغبة اللاشعورية لديه هنا؟",
        options: [
          { value: 0, textEn: "Patte Noire feels secure and loved, resting to gain energy for tomorrow's active exploration.", textAr: "يشعر بالأمان التام والقبول الدافئ، ليرتاح ويستعيد طاقته الكافية للاستكشاف والتعلم غداً." },
          { value: 1, textEn: "Patte Noire wishes they could keep mother entirely to themselves, fearing she loves the others more.", textAr: "يتمنى لو يستأثر بأمه بالكامل لنفسه فقط، ويخشى باستمرار من أنها قد تحب بقية إخوته أكثر منه." },
          { value: 2, textEn: "Patte Noire wants to merge completely with mother, staying a helpless baby forever to avoid growing up.", textAr: "يريد الاندماج والذوبان التام في حنان أمه، والبقاء طفلاً صغيراً للأبد هرباً من تحديات ومسؤوليات الكبر." },
          { value: 3, textEn: "Patte Noire feels they are bothering mother by being close, keeping their distance and suppressing their need for affection.", textAr: "يشعر بالحرج وأنه يزعج والدته باقترابه، فيبتعد ويكبت رغبته الفطرية في طلب الحب والدفء." }
        ]
      },
      {
        id: "blackfoot_5",
        textEn: "Card 5: Social Dynamics & Play (The Mud) - Patte Noire playing and sharing games with peer piglets in the mud. How do they navigate this social setting?",
        textAr: "البطاقة الخامسة: الديناميات الاجتماعية واللعب (الوحل والمرح) - 'القدم السوداء' يلعب ويمرح مع أقرانه في الطين والوحل. كيف يدير هذا المشهد الاجتماعي؟",
        options: [
          { value: 0, textEn: "Patte Noire cooperates happily with peers, sharing toys and playing fair while asserting their personality.", textAr: "يتعاون بسعادة مع أقرانه، ويشاركهم اللعب بعدالة مع التعبير عن شخصيته المستقلة والمحبوبة." },
          { value: 1, textEn: "Patte Noire wants to dominate the games, feeling jealous if another piglet is chosen as leader.", textAr: "يريد فرض سيطرته وقيادته للألعاب، ويشعر بالغيرة المفرطة والضيق إذا تم اختيار خنزير آخر كقائد للعب." },
          { value: 2, textEn: "Patte Noire prefers to watch from the sidelines, waiting for someone to drag them into the game and take care of them.", textAr: "يفضل البقاء مراقباً من بعيد، منتظراً بشغف أن يأتي أحد ليسحبه للمجموعة ويهتم به ويرعاه طوال الوقت." },
          { value: 3, textEn: "Patte Noire stands apart, fearing they will be rejected or bullied, hiding their desire to make friends.", textAr: "يقف وحيداً ومنعزلاً، خشية أن يتم رفضه أو مضايقته، ويكبت رغبته الكبيرة في الاندماج وبناء الصداقات." }
        ]
      }
    ],
    interpretScore: (score, answers) => {
      const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
      let totalAnswers = 0;
      Object.entries(answers).forEach(([key, val]) => {
        if (key.startsWith("blackfoot_")) {
          counts[val] = (counts[val] || 0) + 1;
          totalAnswers++;
        }
      });

      let dominantStyle = 0;
      let maxCount = -1;
      for (let i = 0; i <= 3; i++) {
        if ((counts[i] || 0) > maxCount) {
          maxCount = counts[i];
          dominantStyle = i;
        }
      }

      if (dominantStyle === 0) {
        return {
          categoryEn: "Constructive Ego Integration & Autonomy",
          categoryAr: "تكامل الأنا البناء والاستقلالية النفسية",
          feedbackEn: `Your projective selections demonstrate adaptive coping mechanisms (sublimation, humor, stable self-concept). You resolve interpersonal and parental conflicts with mature autonomy, indicating balanced emotional intelligence, healthy boundaries, and a solid developmental profile.`,
          feedbackAr: `تظهر خياراتك الإسقاطية استخداماً ممتازاً لآليات الدفاع النفسي الناضجة (كالتسامي، والاستقلالية، وتقدير الذات الإيجابي). يمكنك حل الصراعات البين-شخصية والأسرية بوعي واستقلالية، مما يعكس نضجاً عاطفياً سليماً.`
        };
      } else if (dominantStyle === 1) {
        return {
          categoryEn: "Active Fraternal Rivalry & Projection Trends",
          categoryAr: "الغيرة الأخوية النشطة والنزعات الإسقاطية",
          feedbackEn: `Your responses highlight sibling rivalry, jealousy, or power struggles regarding parental attention. You may occasionally project internal frustrations onto your peer group or feel highly sensitive to issues of fairness, recognition, and competitive positioning.`,
          feedbackAr: `تسلط ردودك الضوء على صراعات الغيرة والتنافس الأخوي أو التنازع على نيل الاهتمام والمكانة داخل الأسرة. قد تسقط أحياناً بعض إحباطاتك على أقرانك أو تشعر بحساسية مفرطة تجاه قضايا العدالة والتقدير والتميز.`
        };
      } else if (dominantStyle === 2) {
        return {
          categoryEn: "Oral-Regressive Dependency Profile",
          categoryAr: "النمط النكوصي الفمي (الاعتمادية والاحتياج للحنان)",
          feedbackEn: `Your responses reflect subconscious regressive wishes (desires to return to infant safety, complete protection, or merging with maternal comfort). This suggests an active need for external validation, high reassurance, and underlying anxiety about autonomy or abandonment.`,
          feedbackAr: `تعكس خياراتك رغبات لاشعورية نكوصية (التوق للعودة لأمان الطفولة المبكرة، والاحتواء المطلق والاندماج في حنان الأم). يشير هذا إلى احتياج نفسي للدعم الخارجي المستمر، والتحقق، وقلق خفي من الاستقلالية أو الهجر.`
        };
      } else {
        return {
          categoryEn: "Superego Guilt & Conflict Repression Profile",
          categoryAr: "قلق الأنا الأعلى وكبت الصراعات الداخلية",
          feedbackEn: `Your responses reflect a highly vigilant Superego characterized by severe self-criticism, fear of authority/punishment, and repression of natural impulses. You may over-internalize guilt, expect strict evaluations, and find it hard to express anger or self-assertion directly.`,
          feedbackAr: `تشير خياراتك إلى وجود 'أنا أعلى' صارم للغاية يتميز بجلد الذات، والقلق من السلطة أو العقاب، وكبت النبضات الطبيعية. قد تبالغ في تذويت الشعور بالتقصير وتجد صعوبة في التعبير عن غضبك أو تأكيد ذاتك بوضوح.`
        };
      }
    }
  }
];

export const DSM_REFERENCE_LIBRARY: DiagnosticCategory[] = [
  {
    id: "depressive",
    titleEn: "Depressive Disorders",
    titleAr: "اضطرابات الاكتئاب",
    code: "DSM-5 Section II",
    subcategories: [
      {
        nameEn: "Major Depressive Disorder (MDD)",
        nameAr: "اضطراب الاكتئاب الجسيم",
        code: "296.xx (F32.x / F33.x)",
        criteriaEn: [
          "Depressed mood most of the day, nearly every day.",
          "Markedly diminished interest or pleasure in all, or almost all, activities.",
          "Significant weight loss or gain, or decrease/increase in appetite.",
          "Insomnia or hypersomnia nearly every day.",
          "Psychomotor agitation or retardation nearly every day.",
          "Fatigue or loss of energy nearly every day.",
          "Feelings of worthlessness or excessive/inappropriate guilt.",
          "Diminished ability to think or concentrate, or indecisiveness.",
          "Recurrent thoughts of death, suicidal ideation, or suicide attempt."
        ],
        criteriaAr: [
          "المزاج المكتئب معظم اليوم، في كل يوم تقريباً.",
          "تناقص ملحوظ في الاهتمام أو المتعة في جميع الأنشطة أو معظمها.",
          "فقدان أو زيادة كبيرة في الوزن، أو نقص/زيادة في الشهية.",
          "الأرق أو النوم الزائد يومياً تقريباً.",
          "الهاج والاضطراب النفسي الحركي أو الخمول يومياً تقريباً.",
          "التعب أو فقدان الطاقة يومياً تقريباً.",
          "الشعور بتفاهة الذات أو الذنب المفرط/غير الملائم.",
          "ضعف القدرة على التفكير أو التركيز، أو التردد الشديد.",
          "أفكار متكررة عن الموت، أو التفكير في الانتحار، أو محاولة الانتحار."
        ],
        differentialEn: [
          "Bipolar Disorders (require mania/hypomania history)",
          "Schizoaffective Disorder",
          "Hypothyroidism or other medical conditions",
          "Substance-Induced Depressive Disorder",
          "Normal Grief / Bereavement"
        ],
        differentialAr: [
          "الاضطرابات ثنائية القطب (تتطلب تاريخاً من الهوس/الهوس الخفيف)",
          "الاضطراب الفصامي العاطفي",
          "قصور الغدة الدرقية أو الحالات الطبية الأخرى",
          "اضطراب الاكتئاب الناجم عن المواد/الأدوية",
          "الحزن الطبيعي / الفقد"
        ],
        icdCode: "F32 / F33",
        icdCriteriaEn: [
          "Depressed mood, loss of interest/enjoyment, and increased fatigability/reduced activity (at least 2 are required as core symptoms).",
          "Reduced concentration and attention; reduced self-esteem and confidence; ideas of guilt and unworthiness.",
          "Bleak and pessimistic views of the future; ideas or acts of self-harm or suicide; disturbed sleep; diminished appetite.",
          "Minimal duration of the entire episode is about 2 weeks."
        ],
        icdCriteriaAr: [
          "المزاج المكتئب، فقدان الاهتمام والمتعة، وزيادة قابلية التعب وقلة النشاط والتعب الجسدي الملحوظ (يُشترط عرضين على الأقل كأعراض رئيسية).",
          "نقص التركيز والانتباه؛ تدني تقدير الذات والثقة بالنفس؛ أفكار الشعور بالذنب ونقص القيمة.",
          "نظرة سوداوية متشائمة للمستقبل؛ أفكار أو أفعال إيذاء الذات أو الانتحار؛ اضطراب النوم؛ وضعف الشهية.",
          "الحد الأدنى لمدة النوبة بالكامل هو حوالي أسبوعين."
        ]
      },
      {
        nameEn: "Persistent Depressive Disorder (Dysthymia)",
        nameAr: "اضطراب الاكتئاب المستمر (الديستيميا)",
        code: "300.4 (F34.1)",
        criteriaEn: [
          "Depressed mood for most of the day, for more days than not, for at least 2 years (1 year for children/adolescents).",
          "Presence, while depressed, of two (or more) of: Poor appetite/overeating, insomnia/hypersomnia, low energy/fatigue, low self-esteem, poor concentration/difficulty making decisions, feelings of hopelessness.",
          "During the 2-year period, the individual has never been without symptoms for more than 2 months at a time."
        ],
        criteriaAr: [
          "مزاج مكتئب معظم اليوم، في معظم الأيام، لمدة سنتين على الأقل (سنة للأطفال والمراهقين).",
          "وجود اثنين (أو أكثر) مما يلي أثناء الاكتئاب: ضعف الشهية/الإفراط في الطعام، الأرق/النوم الزائد، انخفاض الطاقة، تدني تقدير الذات، ضعف التركيز، الشعور باليأس.",
          "لم يخلُ الفرد من الأعراض لأكثر من شهرين متتاليين خلال فترة السنتين."
        ],
        differentialEn: [
          "Major Depressive Disorder",
          "Chronic Medical Illnesses",
          "Personality Disorders"
        ],
        differentialAr: [
          "اضطراب الاكتئاب الجسيم",
          "الأمراض الطبية المزمنة",
          "اضطرابات الشخصية"
        ]
      }
    ]
  },
  {
    id: "anxiety",
    titleEn: "Anxiety Disorders",
    titleAr: "اضطرابات القلق",
    code: "DSM-5 Section II",
    subcategories: [
      {
        nameEn: "Generalized Anxiety Disorder (GAD)",
        nameAr: "اضطراب القلق المعمم",
        code: "300.02 (F41.1)",
        criteriaEn: [
          "Excessive anxiety and worry occurring more days than not for at least 6 months, about a number of events or activities.",
          "The individual finds it difficult to control the worry.",
          "The anxiety and worry are associated with 3 or more of the following 6 symptoms (with at least some symptoms present for more days than not for the past 6 months): Restlessness/feeling keyed up, being easily fatigued, difficulty concentrating/mind going blank, irritability, muscle tension, sleep disturbance."
        ],
        criteriaAr: [
          "قلق وتوتر مفرطان في معظم الأيام لمدة 6 أشهر على الأقل بشأن أحداث أو أنشطة متعددة.",
          "يجد الفرد صعوبة كبيرة في التحكم بالسيطرة على هذا القلق.",
          "يرتبط القلق بـ 3 أعراض أو أكثر من الأعراض الستة التالية: التململ/الشعور بالتوتر العصبي، سرعة التعب، صعوبة التركيز/فراغ الذهن، سرعة الانفعال، التوتر العضلي، اضطراب النوم."
        ],
        differentialEn: [
          "Social Anxiety Disorder",
          "Obsessive-Compulsive Disorder (OCD)",
          "Panic Disorder",
          "Hyperthyroidism / Caffeine Intoxication"
        ],
        differentialAr: [
          "اضطراب القلق الاجتماعي (الرهاب الاجتماعي)",
          "الاضطراب الوسواسي القهري (OCD)",
          "اضطراب الهلع",
          "فرط نشاط الغدة الدرقية / التسمم بالكافيين"
        ],
        icdCode: "F41.1",
        icdCriteriaEn: [
          "Generalized and persistent anxiety which is 'free-floating' (not restricted to specific circumstances).",
          "Duration of at least 6 months with prominent tension, worry, and feelings of apprehension.",
          "Presence of autonomic overactivity symptoms (sweating, tachycardia, tachypnea, dizziness, dry mouth).",
          "Motor tension (restlessness, tension headaches, inability to relax)."
        ],
        icdCriteriaAr: [
          "قلق معمم ومستمر يوصف بأنه 'طليق الحرية' (لا يقتصر على ظروف بيئية محددة).",
          "المدة لا تقل عن 6 أشهر مع توتر بارز، قلق مستمر، ومشاعر توجس.",
          "وجود أعراض فرط النشاط الذاتي (التعرق، تسارع ضربات القلب، سرعة التنفس، الدوخة، جفاف الفم).",
          "التوتر الحركي (التململ البدني، صداع التوتر، عدم القدرة على الاسترخاء)."
        ]
      },
      {
        nameEn: "Panic Disorder",
        nameAr: "اضطراب الهلع",
        code: "300.01 (F41.0)",
        criteriaEn: [
          "Recurrent unexpected panic attacks. A panic attack is an abrupt surge of intense fear or discomfort that reaches a peak within minutes.",
          "At least one of the attacks has been followed by 1 month (or more) of one or both of: (a) Persistent concern about additional attacks or their consequences, (b) A significant maladaptive change in behavior related to the attacks."
        ],
        criteriaAr: [
          "نوبات هلع غير متوقعة ومتكررة. نوبة الهلع هي طوفان مفاجئ من الخوف الشديد أو عدم الارتياح يبلغ ذروته في غضون دقائق.",
          "تُتبع نوبة واحدة على الأقل بشهر أو أكثر من: (أ) القلق المستمر من حدوث نوبات أخرى أو عواقبها، (ب) تغيير سلوكي غير متكيف وهام يتعلق بالنوبات."
        ],
        differentialEn: [
          "Specific Phobias",
          "Cardiopulmonary medical disorders (e.g. Arrhythmia, Asthma)",
          "Substance use (stimulants)"
        ],
        differentialAr: [
          "أنواع الرهاب المحددة",
          "أمراض القلب والرئة الطبية (مثل عدم انتظام ضربات القلب، الربو)",
          "تعاطي المؤثرات العقلية (المنشطات)"
        ],
        icdCode: "F41.0",
        icdCriteriaEn: [
          "Recurrent attacks of severe anxiety (panic) which are not restricted to any particular situation or set of circumstances (unpredictable).",
          "Sudden onset of severe physical and cognitive symptoms (palpitations, chest pain, choking sensations, dizziness, feelings of unreality/depersonalization, fear of dying or losing control).",
          "Exclusion of phobic disorders as the primary cause of the panic."
        ],
        icdCriteriaAr: [
          "نوبات متكررة من القلق الشديد (الهلع) لا تقتصر على أي موقف معين أو مجموعة من الظروف (غير متوقعة).",
          "بدء مفاجئ لأعراض جسدية ومعرفية شديدة (خفقان، ألم الصدر، غصة الحلق، الدوار، تبدد الشخصية، الخوف من الموت أو فقدان السيطرة).",
          "استبعاد الاضطرابات الرهابية كسبب رئيسي للهجوم الهلعي."
        ]
      }
    ]
  },
  {
    id: "neurodevelopmental",
    titleEn: "Neurodevelopmental Disorders",
    titleAr: "الاضطرابات النمائية العصبية",
    code: "DSM-5 Section II",
    subcategories: [
      {
        nameEn: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        nameAr: "اضطراب نقص الانتباه وفرط الحركة",
        code: "314.xx (F90.x)",
        criteriaEn: [
          "A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning or development.",
          "Inattention: 6 or more symptoms for children, at least 5 for older adolescents and adults (aged 17+), persisting for >= 6 months (e.g., fails to give close attention, difficulty sustaining attention, does not seem to listen, fails to finish tasks, difficulty organizing, avoids sustained mental effort, loses things, easily distracted, forgetful).",
          "Hyperactivity/Impulsivity: 6 or more symptoms for children, at least 5 for adults, persisting for >= 6 months (e.g., fidgets, leaves seat, runs/climbs inappropriately, unable to play quietly, on the go/driven by a motor, talks excessively, blurts out answers, difficulty waiting turn, interrupts/intrudes).",
          "Several inattentive or hyperactive-impulsive symptoms were present prior to age 12 years.",
          "Symptoms are present in two or more settings (e.g., at home, school, or work; with friends or relatives; in other activities)."
        ],
        criteriaAr: [
          "نمط مستمر من تشتت الانتباه و/أو فرط النشاط-الاندفاعية الذي يتعارض مع الأداء أو التطور النمائي.",
          "نقص الانتباه: 6 أعراض أو أكثر للأطفال، و5 أعراض على الأقل للمراهقين والبالغين (17 سنة فأكثر)، مستمرة لمدة 6 أشهر على الأقل (مثل: عدم الانتباه للتفاصيل، صعوبة الحفاظ على التركيز، عدم الإنصات، صعوبة تنظيم المهام، تجنب الجهد الذهني، إضاعة الأدوات، سهولة التشتت، كثرة النسيان).",
          "فرط النشاط والاندفاعية: 6 أعراض أو أكثر للأطفال، و5 أعراض على الأقل للبالغين، مستمرة لمدة 6 أشهر على الأقل (مثل: التململ والتحرك، ترك المقعد، الركض/التسلق، عدم القدرة على اللعب بهدوء، كثرة الكلام، الاندفاع بالإجابة، صعوبة انتظار الدور، التطفل).",
          "ظهرت العديد من الأعراض قبل سن الـ 12 عاماً.",
          "تظهر الأعراض في بيئتين أو أكثر (مثل المنزل، المدرسة، العمل، أو مع الأصدقاء)."
        ],
        differentialEn: [
          "Oppositional Defiant Disorder (ODD)",
          "Specific Learning Disorders",
          "Autism Spectrum Disorder (ASD)",
          "Anxiety / Depressive Disorders (can cause concentration problems)"
        ],
        differentialAr: [
          "اضطراب التحدي المعارض (ODD)",
          "صعوبات التعلم المحددة",
          "اضطراب طيف التوحد (ASD)",
          "اضطرابات القلق والاكتئاب (قد تسبب مشاكل التركيز)"
        ],
        icdCode: "F90",
        icdCriteriaEn: [
          "Impairment of attention: early termination of tasks and leaving activities unfinished; frequent shifts from one activity to another.",
          "Overactivity: excessive restlessness, especially in situations requiring relative calm (such as school or structured tasks).",
          "Impulsivity: substantial difficulty waiting turns, frequent interruptions/intrusions on others, blurting out answers before questions are completed.",
          "Onset of symptoms before age 6, persisting across multiple settings."
        ],
        icdCriteriaAr: [
          "قصور الانتباه: الإنهاء المبكر للمهام وترك الأنشطة دون إتمام؛ وكثرة التحول والتبديل بين الأنشطة المختلفة.",
          "فرط النشاط: التململ البدني المفرط، لا سيما في المواقف والبيئات التي تتطلب الهدوء والسكينة النسبية (مثل مقاعد الدراسة أو المهام المنظمة).",
          "الاندفاعية: صعوبة بالغة في انتظار الدور، مقاطعة الآخرين والتطفل عليهم بشكل متكرر، وإطلاق الإجابات بتسرع قبل اكتمال طرح الأسئلة.",
          "ظهور الأعراض والسمات السلوكية قبل سن السادسة، مع استمرارها عبر بيئات ومواقف متعددة."
        ]
      }
    ]
  },
  {
    id: "obsessive",
    titleEn: "Obsessive-Compulsive & Related",
    titleAr: "الوسواس القهري والاضطرابات ذات الصلة",
    code: "DSM-5 Section II",
    subcategories: [
      {
        nameEn: "Obsessive-Compulsive Disorder (OCD)",
        nameAr: "الاضطراب الوسواسي القهري",
        code: "300.3 (F42)",
        criteriaEn: [
          "Presence of obsessions, compulsions, or both.",
          "Obsessions: Recurrent/persistent thoughts, urges, or images experienced as intrusive/unwanted, causing marked anxiety; the individual attempts to ignore, suppress, or neutralize them with some other thought or action.",
          "Compulsions: Repetitive behaviors (e.g. hand washing, ordering, checking) or mental acts (e.g. praying, counting) the individual feels driven to perform in response to an obsession or according to rigid rules.",
          "The obsessions or compulsions are time-consuming (take more than 1 hour per day) or cause clinically significant distress or impairment."
        ],
        criteriaAr: [
          "وجود وساوس أو أفعال قهرية أو كلاهما.",
          "الوساوس: أفكار أو نزوات أو صور متكررة ومستمرة يُنظر إليها على أنها مقتحمة وغير مرغوب فيها، وتسبب قلقاً بالغاً؛ ويحاول الفرد تجاهلها أو قمعها أو إبطال مفعولها بفكرة أو فعل آخر.",
          "الأفعال القهرية: سلوكيات متكررة (مثل غسل اليدين، الترتيب، التدقيق) أو أعمال ذهنية (مثل الصلاة صامتاً، العد) يشعر الفرد بدافع قوي للقيام بها كاستجابة للوسواس.",
          "تستهلك الوساوس أو الأفعال القهرية وقتاً كبيراً (أكثر من ساعة يومياً) أو تسبب ضيقاً كبيراً أو خللاً في الأداء اليومي."
        ],
        differentialEn: [
          "Anxiety Disorders (excessive real-life worries)",
          "Major Depressive Disorder (ruminations)",
          "Eating Disorders (food-related rituals)",
          "Tic Disorders"
        ],
        differentialAr: [
          "اضطرابات القلق (مخاوف الحياة الحقيقية المفرطة)",
          "اضطراب الاكتئاب الجسيم (الاجترار الفكري)",
          "اضطرابات الأكل (طقوس تتعلق بالطعام)",
          "اضطرابات اللزّمات الحركية (Tic Disorders)"
        ],
        icdCode: "F42",
        icdCriteriaEn: [
          "Obsessional symptoms or compulsive acts (or both) must be present on most days for at least 2 successive weeks.",
          "They must be recognized by the individual as their own thoughts or impulses (not imposed by outside persons/influences).",
          "There must be at least one thought or act that is still resisted unsuccessfully, even if others are no longer resisted.",
          "Carrying out the obsessive thought or compulsive act must not be in itself pleasurable (simple relief of tension is not experienced as pleasure)."
        ],
        icdCriteriaAr: [
          "يجب أن تتواجد أعراض وسواسية أو أفعال قهرية (أو كلاهما) في معظم الأيام لمدة أسبوعين متتاليين على الأقل.",
          "يجب أن يعترف الفرد بأنها نابعة من أفكاره ودوافعه الخاصة (وليست مفروضة عليه من قبل أشخاص أو قوى خارجية).",
          "يجب أن يكون هناك فكرة أو فعل واحد على الأقل يبدي الفرد تجاهه مقاومة فاشلة، حتى لو كان لا يقاوم الأفكار الأخرى.",
          "لا يجب أن يكون تنفيذ الفكرة الوسواسية أو الفعل القهري ممتعاً في حد ذاته (التخفيف البسيط للتوتر لا يعتبر متعة)."
        ]
      }
    ]
  },
  {
    id: "trauma",
    titleEn: "Trauma & Stressor-Related",
    titleAr: "الاضطرابات المرتبطة بالصدمات والضغوط",
    code: "DSM-5 Section II",
    subcategories: [
      {
        nameEn: "Post-Traumatic Stress Disorder (PTSD)",
        nameAr: "اضطراب ما بعد الصدمة",
        code: "309.81 (F43.10)",
        criteriaEn: [
          "Exposure to actual or threatened death, serious injury, or sexual violence (direct, witnessed, learning of it, or repeated extreme exposure).",
          "Presence of intrusion symptoms (distressing memories, dreams, flashbacks, physiological reactions to cues).",
          "Persistent avoidance of stimuli associated with the traumatic event.",
          "Negative alterations in cognitions and mood associated with the event (inability to remember details, persistent negative beliefs, distorted self-blame, negative emotional state, detachment).",
          "Marked alterations in arousal and reactivity (irritable behavior, hypervigilance, exaggerated startle response, concentration problems, sleep disturbance).",
          "Duration of disturbance is more than 1 month."
        ],
        criteriaAr: [
          "التعرض للموت الفعلي أو التهديد به، أو الإصابة الخطيرة، أو العنف الجنسي (بشكل مباشر، أو شهود عيان، أو معرفة حدوثه لقريب، أو التعرض المتكرر).",
          "وجود أعراض اقتحامية (ذكريات مؤلمة متكررة، أحلام مزعجة، استرجاع الأحداث/Flashbacks، تفاعلات جسدية حادة عند تذكر الحدث).",
          "التجنب المستمر للمثيرات المرتبطة بالحدث الصادم.",
          "تغيرات سلبية في الأفكار والمزاج مرتبطة بالحدث (عدم تذكر التفاصيل، معتقدات سلبية مستمرة عن العالم، لوم النفس، حالة انفعالية سلبية، الانفصال عن الآخرين).",
          "تغيرات ملحوظة في الاستثارة والوجل واليقظة المفرطة (سلوك غاضب، تيقظ مفرط، ردود فعل فزع مبالغ فيها، مشاكل التركيز، اضطراب النوم).",
          "مدة الاضطراب تزيد عن شهر واحد."
        ],
        differentialEn: [
          "Adjustment Disorders",
          "Acute Stress Disorder (duration < 1 month)",
          "Major Depressive Disorder",
          "Generalized Anxiety Disorder"
        ],
        differentialAr: [
          "اضطرابات التكيف",
          "اضطراب الضغط العصبي الحاد (المدة أقل من شهر)",
          "اضطراب الاكتئاب الجسيم",
          "اضطراب القلق المعمم"
        ],
        icdCode: "F43.1",
        icdCriteriaEn: [
          "The patient must have been exposed to a stressful event or situation (either short- or long-lasting) of an exceptionally threatening or catastrophic nature.",
          "There must be persistent remembering or 'reliving' of the stressor in intrusive flashbacks, vivid memories, or recurring dreams.",
          "The patient must show actual or preferred avoidance of circumstances resembling or associated with the stressor.",
          "Either of the following must be present: (1) Inability to recall some important aspects of the period of exposure, or (2) Persistent symptoms of increased psychological sensitivity and arousal (insomnia, irritability, hypervigilance, exaggerated startle, concentration issues)."
        ],
        icdCriteriaAr: [
          "يجب أن يكون المريض قد تعرض لحدث أو موقف عصيب صادم (سواء كان قصير أو طويل الأجل) ذو طبيعة مهددة بشكل استثنائي أو كارثي مروع.",
          "يجب أن يكون هناك تذكر مستمر أو 'إعادة معايشة' للعامل الضاغط في شكل نوبات استرجاع مقتحمة (Flashbacks) أو ذكريات حية أو أحلام متكررة.",
          "يجب أن يظهر المريض تجنباً فعلياً للظروف والمواقف التي تشبه أو ترتبط بالعامل الضاغط الصادم.",
          "يجب أن يتوفر أي مما يلي: (1) عدم القدرة على تذكر بعض الجوانب الهامة من فترة التعرض للصدمة، أو (2) أعراض مستمرة لزيادة الحساسية واليقظة النفسية والفسيولوجية (أرق، سرعة انفعال، تيقظ مفرط، فزع مبالغ فيه، تشتت)."
        ]
      }
    ]
  },
  {
    id: "cim10",
    titleEn: "CIM-10 Mental & Behavioral Disorders (WHO)",
    titleAr: "تصنيف CIM-10 للاضطرابات النفسية والسلوكية (منظمة الصحة العالمية)",
    code: "WHO ICD-10 / CIM-10",
    subcategories: [
      {
        nameEn: "F32 Depressive Episode (CIM-10 Clinical Criteria)",
        nameAr: "F32 نوبة الاكتئاب (معايير التصنيف الدولي العاشر CIM-10)",
        code: "CIM-10 Code: F32",
        criteriaEn: [
          "Key symptoms: Depressed mood, loss of interest/enjoyment, and increased fatigability/reduced activity.",
          "Other common symptoms: Reduced concentration and attention; reduced self-esteem and confidence; ideas of guilt and unworthiness; bleak and pessimistic views of the future; ideas or acts of self-harm or suicide; disturbed sleep; diminished appetite.",
          "Mild Depressive Episode: At least 2 key symptoms + at least 2 other common symptoms (duration of at least 2 weeks).",
          "Moderate Depressive Episode: At least 2 key symptoms + at least 3 (preferably 4) other common symptoms (duration of at least 2 weeks).",
          "Severe Depressive Episode: All 3 key symptoms + at least 4 other common symptoms, with severe distress and typically somatic symptoms."
        ],
        criteriaAr: [
          "الأعراض الرئيسية: المزاج المكتئب، فقدان الاهتمام والمتعة، وزيادة قابلية التعب وقلة النشاط والتعب الجسدي الملحوظ.",
          "أعراض شائعة أخرى: نقص التركيز والانتباه؛ تدني تقدير الذات والثقة بالنفس؛ أفكار الشعور بالذنب ونقص القيمة؛ نظرة سوداوية متشائمة للمستقبل؛ أفكار أو أفعال إيذاء الذات أو الانتحار؛ اضطراب النوم؛ وضعف الشهية.",
          "النوبة الاكتئابية الخفيفة: وجود عرضين رئيسيين على الأقل + عرضين شائعين آخرين على الأقل (بشرط استمرار الأعراض لمدة أسبوعين أو أكثر).",
          "النوبة الاكتئابية المتوسطة: وجود عرضين رئيسيين على الأقل + 3 أو 4 أعراض شائعة أخرى على الأقل (بشرط استمرار الأعراض لمدة أسبوعين أو أكثر).",
          "النوبة الاكتئابية الشديدة: وجود جميع الأعراض الرئيسية الثلاثة + 4 أعراض شائعة أخرى على الأقل، مسبباً ضيقاً نفسياً شديداً ومصحوباً بأعراض جسدية عادة."
        ],
        differentialEn: [
          "F31 Bipolar Affective Disorder",
          "F43.2 Adjustment Disorders (with depressive or anxious-depressive reaction)",
          "F06.3 Organic Mood Disorders (due to underlying physical illness or cerebral lesion)"
        ],
        differentialAr: [
          "F31 الاضطراب الوجداني ثنائي القطب",
          "F43.2 اضطرابات التكيف (مع تفاعل اكتئابي أو قلقي اكتئابي مختلط)",
          "F06.3 اضطرابات المزاج العضوية (الناجمة عن اعتلالات جسدية أو آفات دماغية)"
        ]
      },
      {
        nameEn: "F41.1 Generalized Anxiety Disorder (CIM-10 Clinical Criteria)",
        nameAr: "F41.1 اضطراب القلق المعمم (معايير التصنيف الدولي العاشر CIM-10)",
        code: "CIM-10 Code: F41.1",
        criteriaEn: [
          "Generalized and persistent anxiety which is not restricted to, or even strongly predominating in, any particular environmental circumstances (i.e. 'free-floating' anxiety).",
          "Duration: Must have been present for at least 6 months.",
          "Apprehension symptoms: Excessive worry about future misfortunes, feeling 'on edge', concentration difficulties.",
          "Motor tension symptoms: Physical restlessness, tension headaches, trembling, inability to relax.",
          "Autonomic overactivity symptoms: Lightheadedness, sweating, tachycardia or palpitations, tachypnea, epigastric discomfort, dry mouth."
        ],
        criteriaAr: [
          "قلق معمم ومستمر لا يقتصر على ظروف بيئية محددة ولا يتركز فيها (ويُعرف طبياً بالقلق 'طليق الحرية').",
          "المدة التشخيصية: يجب أن تستمر هذه الأعراض لمدة 6 أشهر على الأقل.",
          "أعراض التوجس: الق القلق المفرط بشأن مصائب المستقبل، والشعور الدائم بالتوتر والوقوف على الحافة، وصعوبات بالغة في التركيز.",
          "أعراض التوتر الحركي: التململ البدني، صداع التوتر العضلي، الارتعاش أو الرعشة، وعدم القدرة على تحقيق الاسترخاء والهدوء الجسدي.",
          "أعراض فرط النشاط الذاتي (الباراسمبثاوي والسمبثاوي): الدوار والدوخة، فرط التعرق، تسارع ضربات القلب أو خفقانها، سرعة التنفس، عدم ارتياح المعدة، وجفاف الفم الشديد."
        ],
        differentialEn: [
          "F40 Phobic Anxiety Disorders (agoraphobia, social phobias)",
          "F41.0 Panic Disorder (anxiety is episodic and paroxysmal)",
          "F45 Somatoform Disorders (anxiety focused heavily on physical symptoms)"
        ],
        differentialAr: [
          "F40 اضطرابات القلق الرهابي (مثل رهاب الميادين، الرهاب الاجتماعي)",
          "F41.0 اضطراب الهلع (حيث القلق نوبي ومفاجئ وليس مستمراً)",
          "F45 الاضطرابات جسدية الشكل (حيث ينصب القلق بشكل أساسي على الشكاوى والأعراض الجسدية)"
        ]
      }
    ]
  },
  {
    id: "neuropsychology",
    titleEn: "Neuropsychology & Cognitive Domains",
    titleAr: "علم النفس العصبي والمجالات المعرفية (التقييم العصبي النفسي)",
    code: "Neuropsychological Reference",
    subcategories: [
      {
        nameEn: "Core Cognitive Domains & Neuropsychological Functions",
        nameAr: "المجالات المعرفية الرئيسية والوظائف العصبية النفسية",
        code: "Neuropsychological Battery Guidelines",
        criteriaEn: [
          "Complex Attention: Sustained attention, divided attention, selective attention, and information processing speed.",
          "Executive Function: Planning, decision making, working memory, responding to feedback/error correction, cognitive flexibility, and habit overriding.",
          "Learning and Memory: Immediate recall, recent memory (including free recall, cued recall, and recognition memory), and long-term semantic/procedural memory.",
          "Language: Expressive language (naming, word finding, syntactic fluency) and receptive language (comprehension and execution of complex instructions).",
          "Perceptual-Motor Functions: Visuoconstructional skills, visual perception, and motor coordination (praxis).",
          "Social Cognition: Recognition of emotions, empathy, and theory of mind (ability to understand another person's mental state)."
        ],
        criteriaAr: [
          "الانتباه المعقد: القدرة على الانتباه المستمر لفترات طويلة، الانتباه المنقسم (أداء مهام متعددة)، الانتباه الانتقائي، وسرعة معالجة المعلومات الذهنية.",
          "الوظائف التنفيذية العليا: التخطيط المستقبلي، اتخاذ القرارات، الذاكرة العاملة (Working Memory)، التعلم من التغذية الراجعة وتصحيح الأخطاء، المرونة المعرفية، وكبح السلوكيات الاندفاعية.",
          "التعلم والذاكرة: الاستدعاء الفوري للمعلومات، الذاكرة الحديثة (الاستدعاء الحر، الاستدعاء الموجه بالقرائن، وذاكرة التعرف)، والذاكرة طويلة المدى (الدلالية والإجرائية).",
          "اللغة والتواصل: اللغة التعبيرية (تسمية الأشياء، إيجاد الكلمات المناسبة، الطلاقة النحوية واللفظية) واللغة الاستقبالية (فهم ومعالجة الكلام والتعليمات المعقدة).",
          "الإدراك الحركي البصري: مهارات البناء البصري (رسم الأشكال ثلاثية الأبعاد)، الإدراك البصري المكانية، والتنسيق والتحكم الحركي (البركسيا / Praxis).",
          "المعرفة الاجتماعية والوجدانية: التعرف على انفعالات وتعابير وجوه الآخرين، التعاطف، ونظرية العقل (Theory of Mind - فهم وتوقع أفكار ومشاعر ونوايا الآخرين)."
        ],
        differentialEn: [
          "Delirium: Marked by an acute, fluctuating disturbance in attention and awareness (not a stable neurocognitive decline).",
          "Major Depressive Disorder (Pseudo-dementia): Cognitive complaints are often prominent but improve significantly with mood treatment; performance on standardized memory tests lacks the structural consolidation deficits seen in dementia.",
          "Normal Cognitive Aging: Gradual, mild changes (like slower processing) that do NOT interfere with functional independence or daily living skills."
        ],
        differentialAr: [
          "الهذيان (Delirium): يتميز بااضطراب حاد ومتقلب في الانتباه والوعي والتركيز (وليس تدهوراً معرفياً عصبياً مستقراً ومزمناً).",
          "اضطراب الاكتئاب الجسيم (العته الكاذب - Pseudodementia): تكون الشكاوى المعرفية ونقص التركيز بارزة للغاية وتتداخل مع الخرف، ولكنها تتحسن بشكل كبير مع علاج الاكتئاب والمزاج.",
          "الشيخوخة المعرفية الطبيعية: تغيرات تدريجية خفيفة للغاية (مثل بطء طفيف في المعالجة) لا تؤثر على الاستقلالية الوظيفية أو مهارات الحياة اليومية المستقلة."
        ]
      },
      {
        nameEn: "Major Neurocognitive Disorder (Dementia Core Criteria)",
        nameAr: "الاضطراب المعرفي العصبي الكبير (معايير تشخيص الخرف عصبياً)",
        code: "DSM-5: 294.xx / ICD-10: F01-F03",
        criteriaEn: [
          "Evidence of significant cognitive decline from a previous level of performance in one or more cognitive domains (Attention, Executive function, Learning/Memory, Language, Perceptual-motor, Social cognition).",
          "The decline is based on: (1) Concerns of the individual, a knowledgeable informant, or the clinician AND (2) A substantial impairment in cognitive performance, preferably documented by standardized neuropsychological testing or quantified clinical assessment.",
          "The cognitive deficits interfere with independence in everyday activities (e.g., requiring assistance with complex instrumental activities of daily living such as managing medications or finances).",
          "The cognitive deficits do not occur exclusively in the context of delirium.",
          "The cognitive deficits are not better explained by another mental disorder (e.g., Major Depressive Disorder, Schizophrenia)."
        ],
        criteriaAr: [
          "دليل على تدهور معرفي كبير وواضح عن المستوى السابق للأداء في مجال معرفي واحد أو أكثر (الانتباه المعقد، الوظائف التنفيذية، التعلم والذاكرة، اللغة، الإدراك الحركي البصري، أو المعرفة الاجتماعية).",
          "يستند هذا التدهور إلى: (1) مخاوف الفرد، أو مخاوف مخبر مطلع، أو الطبيب المعالج، بالاقتران مع (2) تراجع جوهري في الأداء المعرفي يتم توثيقه عبر اختبارات عصبية نفسية مقننة ومعيارية (Neuropsychological Testing) أو تقييمات سريرية كمية.",
          "تتعارض العيوب المعرفية بشكل مباشر مع استقلالية الفرد في الأنشطة اليومية المعتادة (أي تتطلب تقديم المساعدة في الأنشطة اليومية المعقدة مثل إدارة الشؤون المالية أو استخدام الأدوية).",
          "لا تحدث هذه العيوب والاضطرابات المعرفية حصرياً في سياق نوبة الهذيان المؤقتة (Delirium).",
          "لا يمكن تفسير هذه العيوب المعرفية بشكل أفضل بواسطة اضطراب نفسي أو عقلي آخر (مثل اضطراب الاكتئاب الجسيم، أو فصام الشخصية)."
        ],
        differentialEn: [
          "Mild Neurocognitive Disorder: Cognitive decline is present but does NOT interfere with capacity for independence in everyday activities.",
          "Amnestic Disorders: Characterized by profound memory impairment in isolation, without the widespread multi-domain decline typical of major neurocognitive disorders.",
          "Major Depressive Disorder (Depressive Cognitive Impairment)"
        ],
        differentialAr: [
          "الاضطراب المعرفي العصبي الخفيف (Mild Neurocognitive Disorder): يوجد تراجع معرفي واضح ولكن لا يؤثر على استقلالية الفرد في أنشطته اليومية وحياته المعتادة.",
          "اضطرابات فقدان الذاكرة (Amnestic Disorders): تتميز بوجود عجز عميق ومنعزل في الذاكرة والتعلم فقط، دون تراجع شامل في المجالات المعرفية المتعددة الأخرى.",
          "اضطراب الاكتئاب الجسيم (التراجع المعرفي الاكتئابي المصاحب)"
        ]
      }
    ]
  }
];
