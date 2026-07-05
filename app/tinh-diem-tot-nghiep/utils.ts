export const GROUP_MAPPING: Record<string, string[]> = {
  A: ["A00", "A01", "A02", "A0T", "A0C", "A09", "A10", "A08", "AH2", "AH3", "AH4"],
  B: ["B00", "B08", "B03", "B01", "B02", "B04", "B0C"],
  C: ["C00", "C01", "C02", "C03", "C04", "C14", "C19", "C20", "C16", "C17", "C05", "C06", "C08"],
  D: ["D01", "D07", "D08", "D09", "D10", "D11", "D14", "D15", "D02", "D03", "D04", "D05", "D06", "DD2", "D66", "D84", "D85", "D87", "D0C", "DK"],
  X_TH: ["X01", "X21", "X25", "X70", "X74", "X02", "X06", "X10", "X26", "X46", "X03", "X07", "X12", "X27", "X28", "TH1", "TH3", "TH5", "TH6"]
};

export const getEnglishEquivalentScore = (
  type: "none" | "ielts" | "toeic",
  scoreStr: string,
  target: "standard" | "neu" | "ftu" | "hust" | "hcmut"
): number => {
  if (type === "none" || !scoreStr) return 0;
  const score = parseFloat(scoreStr);
  if (isNaN(score)) return 0;

  if (target === "neu") {
    if (type === "ielts") {
      if (score >= 7.5) return 10.0;
      if (score >= 7.0) return 9.5;
      if (score >= 6.5) return 9.0;
      if (score >= 6.0) return 8.5;
      if (score >= 5.5) return 8.0;
    } else if (type === "toeic") {
      if (score >= 965) return 10.0;
      if (score >= 945) return 9.5;
      if (score >= 890) return 9.0;
      if (score >= 840) return 8.5;
      if (score >= 785) return 8.0;
    }
  } else if (target === "ftu") {
    if (type === "ielts") {
      if (score >= 8.0) return 10.0;
      if (score >= 7.5) return 9.5;
      if (score >= 7.0) return 9.0;
      if (score >= 6.5) return 8.5;
    }
  } else if (target === "hust") {
    if (type === "ielts") {
      if (score >= 7.0) return 10.0;
      if (score >= 6.5) return 9.5;
      if (score >= 6.0) return 9.0;
      if (score >= 5.5) return 8.5;
      if (score >= 5.0) return 8.0;
    }
  } else if (target === "hcmut") {
    if (type === "ielts") {
      if (score >= 6.0) return 10.0;
      if (score >= 5.5) return 9.0;
      if (score >= 5.0) return 8.0;
      if (score >= 4.5) return 7.0;
    }
  } else {
    if (type === "ielts") {
      if (score >= 6.5) return 10.0;
      if (score >= 6.0) return 9.5;
      if (score >= 5.5) return 9.0;
      if (score >= 5.0) return 8.5;
      if (score >= 4.5) return 8.0;
      if (score >= 4.0) return 7.5;
    } else if (type === "toeic") {
      if (score >= 850) return 10.0;
      if (score >= 750) return 9.5;
      if (score >= 650) return 9.0;
      if (score >= 600) return 8.5;
      if (score >= 550) return 8.0;
      if (score >= 450) return 7.5;
    }
  }
  return 0;
};

export const calculateAllCombinations = (
  scores: Record<string, string>,
  otherLanguageType: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian",
  certType: "none" | "ielts" | "toeic",
  certScore: string,
  conversionTarget: "standard" | "neu" | "ftu" | "hust" | "hcmut",
  areaPriority: "KV3" | "KV2" | "KV2-NT" | "KV1",
  objectPriority: "none" | "UT1" | "UT2"
) => {
  const m = parseFloat(scores.math) || 0;
  const l = parseFloat(scores.literature) || 0;
  const rawEnglish = parseFloat(scores.english) || 0;
  const p = parseFloat(scores.physics) || 0;
  const c = parseFloat(scores.chemistry) || 0;
  const b = parseFloat(scores.biology) || 0;
  const h = parseFloat(scores.history) || 0;
  const g = parseFloat(scores.geography) || 0;
  const gd = parseFloat(scores.gdktpl) || 0;
  const info = parseFloat(scores.informatics) || 0;
  const techInd = parseFloat(scores.techIndustrial) || 0;
  const techAgr = parseFloat(scores.techAgricultural) || 0;

  const otherLang = parseFloat(scores.otherLanguage) || 0;
  const finalKorean = otherLanguageType === "Korean" ? otherLang : 0;
  const finalChinese = otherLanguageType === "Chinese" ? otherLang : 0;
  const finalJapanese = otherLanguageType === "Japanese" ? otherLang : 0;
  const finalFrench = otherLanguageType === "French" ? otherLang : 0;
  const finalGerman = otherLanguageType === "German" ? otherLang : 0;
  const finalRussian = otherLanguageType === "Russian" ? otherLang : 0;

  const equivEnglish = getEnglishEquivalentScore(certType, certScore, conversionTarget);
  const finalEnglish = Math.max(rawEnglish, equivEnglish);

  let areaScore = 0;
  if (areaPriority === "KV1") areaScore = 0.75;
  if (areaPriority === "KV2-NT") areaScore = 0.5;
  if (areaPriority === "KV2") areaScore = 0.25;

  let objectScore = 0;
  if (objectPriority === "UT1") objectScore = 2.0;
  if (objectPriority === "UT2") objectScore = 1.0;

  const basePriority = areaScore + objectScore;

  const calculatePriority = (sumThreeSubjects: number): number => {
    if (sumThreeSubjects < 22.5) return Math.min(basePriority, 3.0);
    const actualPriority = ((30 - sumThreeSubjects) / 7.5) * basePriority;
    return parseFloat(Math.min(actualPriority, 3.0).toFixed(4));
  };

  const hasScores = (...vals: string[]) => vals.every(v => v !== "");

  const results: Record<string, number> = {};

  // Khối A
  if (hasScores(scores.math, scores.physics, scores.chemistry)) results.A00 = m + p + c + calculatePriority(m + p + c);
  if (hasScores(scores.math, scores.physics, scores.english) || (scores.math !== "" && scores.physics !== "" && equivEnglish > 0)) {
    results.A01 = m + p + finalEnglish + calculatePriority(m + p + finalEnglish);
  }
  if (hasScores(scores.math, scores.physics, scores.biology)) results.A02 = m + p + b + calculatePriority(m + p + b);
  if (hasScores(scores.math, scores.physics, scores.informatics)) results.A0T = m + p + info + calculatePriority(m + p + info);
  if (hasScores(scores.math, scores.physics, scores.techIndustrial)) results.A0C = m + p + techInd + calculatePriority(m + p + techInd);
  if (hasScores(scores.math, scores.geography, scores.gdktpl)) results.A09 = m + g + gd + calculatePriority(m + g + gd);
  if (hasScores(scores.math, scores.physics, scores.gdktpl)) results.A10 = m + p + gd + calculatePriority(m + p + gd);
  if (hasScores(scores.math, scores.history, scores.gdktpl)) results.A08 = m + h + gd + calculatePriority(m + h + gd);
  if (hasScores(scores.math, scores.chemistry, scores.otherLanguage) && otherLanguageType === "Korean") results.AH2 = m + c + finalKorean + calculatePriority(m + c + finalKorean);
  if (hasScores(scores.math, scores.physics, scores.otherLanguage) && otherLanguageType === "Korean") results.AH3 = m + p + finalKorean + calculatePriority(m + p + finalKorean);
  if (hasScores(scores.math, scores.biology, scores.otherLanguage) && otherLanguageType === "Korean") results.AH4 = m + b + finalKorean + calculatePriority(m + b + finalKorean);

  // Khối B
  if (hasScores(scores.math, scores.chemistry, scores.biology)) results.B00 = m + c + b + calculatePriority(m + c + b);
  if (hasScores(scores.math, scores.biology, scores.english) || (scores.math !== "" && scores.biology !== "" && equivEnglish > 0)) {
    results.B08 = m + b + finalEnglish + calculatePriority(m + b + finalEnglish);
  }
  if (hasScores(scores.math, scores.biology, scores.literature)) results.B03 = m + b + l + calculatePriority(m + b + l);
  if (hasScores(scores.math, scores.history, scores.biology)) results.B01 = m + h + b + calculatePriority(m + h + b);
  if (hasScores(scores.math, scores.biology, scores.geography)) results.B02 = m + b + g + calculatePriority(m + b + g);
  if (hasScores(scores.math, scores.biology, scores.gdktpl)) results.B04 = m + b + gd + calculatePriority(m + b + gd);
  if (hasScores(scores.math, scores.chemistry, scores.techIndustrial)) results.B0C = m + c + techInd + calculatePriority(m + c + techInd);

  // Khối C
  if (hasScores(scores.literature, scores.history, scores.geography)) results.C00 = l + h + g + calculatePriority(l + h + g);
  if (hasScores(scores.literature, scores.math, scores.physics)) results.C01 = l + m + p + calculatePriority(l + m + p);
  if (hasScores(scores.literature, scores.math, scores.chemistry)) results.C02 = l + m + c + calculatePriority(l + m + c);
  if (hasScores(scores.literature, scores.math, scores.history)) results.C03 = l + m + h + calculatePriority(l + m + h);
  if (hasScores(scores.literature, scores.math, scores.geography)) results.C04 = l + m + g + calculatePriority(l + m + g);
  if (hasScores(scores.literature, scores.math, scores.gdktpl)) results.C14 = l + m + gd + calculatePriority(l + m + gd);
  if (hasScores(scores.literature, scores.history, scores.gdktpl)) results.C19 = l + h + gd + calculatePriority(l + h + gd);
  if (hasScores(scores.literature, scores.geography, scores.gdktpl)) results.C20 = l + g + gd + calculatePriority(l + g + gd);
  if (hasScores(scores.literature, scores.physics, scores.gdktpl)) results.C16 = l + p + gd + calculatePriority(l + p + gd);
  if (hasScores(scores.literature, scores.chemistry, scores.gdktpl)) results.C17 = l + c + gd + calculatePriority(l + c + gd);
  if (hasScores(scores.literature, scores.physics, scores.chemistry)) results.C05 = l + p + c + calculatePriority(l + p + c);
  if (hasScores(scores.literature, scores.physics, scores.biology)) results.C06 = l + p + b + calculatePriority(l + p + b);
  if (hasScores(scores.literature, scores.chemistry, scores.biology)) results.C08 = l + c + b + calculatePriority(l + c + b);

  // Khối D
  const d01Check = hasScores(scores.literature, scores.math, scores.english) || (scores.literature !== "" && scores.math !== "" && equivEnglish > 0);
  if (d01Check) results.D01 = l + m + finalEnglish + calculatePriority(l + m + finalEnglish);
  
  const d07Check = hasScores(scores.math, scores.chemistry, scores.english) || (scores.math !== "" && scores.chemistry !== "" && equivEnglish > 0);
  if (d07Check) results.D07 = m + c + finalEnglish + calculatePriority(m + c + finalEnglish);
  
  const d08Check = hasScores(scores.math, scores.biology, scores.english) || (scores.math !== "" && scores.biology !== "" && equivEnglish > 0);
  if (d08Check) results.D08 = m + b + finalEnglish + calculatePriority(m + b + finalEnglish);
  
  const d09Check = hasScores(scores.math, scores.history, scores.english) || (scores.math !== "" && scores.history !== "" && equivEnglish > 0);
  if (d09Check) results.D09 = m + h + finalEnglish + calculatePriority(m + h + finalEnglish);
  
  const d10Check = hasScores(scores.math, scores.geography, scores.english) || (scores.math !== "" && scores.geography !== "" && equivEnglish > 0);
  if (d10Check) results.D10 = m + g + finalEnglish + calculatePriority(m + g + finalEnglish);
  
  const d11Check = hasScores(scores.literature, scores.physics, scores.english) || (scores.literature !== "" && scores.physics !== "" && equivEnglish > 0);
  if (d11Check) results.D11 = l + p + finalEnglish + calculatePriority(l + p + finalEnglish);
  
  const d14Check = hasScores(scores.literature, scores.history, scores.english) || (scores.literature !== "" && scores.history !== "" && equivEnglish > 0);
  if (d14Check) results.D14 = l + h + finalEnglish + calculatePriority(l + h + finalEnglish);
  
  const d15Check = hasScores(scores.literature, scores.geography, scores.english) || (scores.literature !== "" && scores.geography !== "" && equivEnglish > 0);
  if (d15Check) results.D15 = l + g + finalEnglish + calculatePriority(l + g + finalEnglish);

  if (hasScores(scores.literature, scores.math, scores.otherLanguage) && otherLanguageType === "Russian") results.D02 = l + m + finalRussian + calculatePriority(l + m + finalRussian);
  if (hasScores(scores.literature, scores.math, scores.otherLanguage) && otherLanguageType === "French") results.D03 = l + m + finalFrench + calculatePriority(l + m + finalFrench);
  if (hasScores(scores.literature, scores.math, scores.otherLanguage) && otherLanguageType === "Chinese") results.D04 = l + m + finalChinese + calculatePriority(l + m + finalChinese);
  if (hasScores(scores.literature, scores.math, scores.otherLanguage) && otherLanguageType === "German") results.D05 = l + m + finalGerman + calculatePriority(l + m + finalGerman);
  if (hasScores(scores.literature, scores.math, scores.otherLanguage) && otherLanguageType === "Japanese") results.D06 = l + m + finalJapanese + calculatePriority(l + m + finalJapanese);
  if (hasScores(scores.literature, scores.math, scores.otherLanguage) && otherLanguageType === "Korean") results.DD2 = l + m + finalKorean + calculatePriority(l + m + finalKorean);

  const d66Check = hasScores(scores.literature, scores.gdktpl, scores.english) || (scores.literature !== "" && scores.gdktpl !== "" && equivEnglish > 0);
  if (d66Check) results.D66 = l + gd + finalEnglish + calculatePriority(l + gd + finalEnglish);

  const d84Check = hasScores(scores.math, scores.english, scores.gdktpl) || (scores.math !== "" && scores.gdktpl !== "" && equivEnglish > 0);
  if (d84Check) results.D84 = m + finalEnglish + gd + calculatePriority(m + finalEnglish + gd);

  if (hasScores(scores.math, scores.gdktpl, scores.otherLanguage) && otherLanguageType === "German") results.D85 = m + gd + finalGerman + calculatePriority(m + gd + finalGerman);
  if (hasScores(scores.math, scores.gdktpl, scores.otherLanguage) && otherLanguageType === "French") results.D87 = m + gd + finalFrench + calculatePriority(m + gd + finalFrench);

  const d0cCheck = hasScores(scores.math, scores.english, scores.techAgricultural) || (scores.math !== "" && scores.techAgricultural !== "" && equivEnglish > 0);
  if (d0cCheck) results.D0C = m + finalEnglish + techAgr + calculatePriority(m + finalEnglish + techAgr);
  if (hasScores(scores.math, scores.literature, scores.informatics)) results.DK = m + l + info + calculatePriority(m + l + info);

  // Khối X & TH
  if (hasScores(scores.literature, scores.math, scores.gdktpl)) results.X01 = l + m + gd + calculatePriority(l + m + gd);
  if (hasScores(scores.math, scores.geography, scores.gdktpl)) results.X21 = m + g + gd + calculatePriority(m + g + gd);
  
  const x25Check = hasScores(scores.math, scores.english, scores.gdktpl) || (scores.math !== "" && scores.gdktpl !== "" && equivEnglish > 0);
  if (x25Check) results.X25 = m + finalEnglish + gd + calculatePriority(m + finalEnglish + gd);
  
  if (hasScores(scores.literature, scores.history, scores.gdktpl)) results.X70 = l + h + gd + calculatePriority(l + h + gd);
  if (hasScores(scores.literature, scores.geography, scores.gdktpl)) results.X74 = l + g + gd + calculatePriority(l + g + gd);
  if (hasScores(scores.math, scores.literature, scores.informatics)) results.X02 = m + l + info + calculatePriority(m + l + info);
  if (hasScores(scores.math, scores.physics, scores.informatics)) results.X06 = m + p + info + calculatePriority(m + p + info);
  if (hasScores(scores.math, scores.chemistry, scores.informatics)) results.X10 = m + c + info + calculatePriority(m + c + info);

  const x26Check = hasScores(scores.math, scores.english, scores.informatics) || (scores.math !== "" && scores.informatics !== "" && equivEnglish > 0);
  if (x26Check) results.X26 = m + finalEnglish + info + calculatePriority(m + finalEnglish + info);

  if (hasScores(scores.math, scores.otherLanguage, scores.informatics) && otherLanguageType === "Japanese") results.X46 = m + finalJapanese + info + calculatePriority(m + finalJapanese + info);
  if (hasScores(scores.math, scores.literature, scores.techIndustrial)) results.X03 = m + l + techInd + calculatePriority(m + l + techInd);
  if (hasScores(scores.math, scores.physics, scores.techIndustrial)) results.X07 = m + p + techInd + calculatePriority(m + p + techInd);
  if (hasScores(scores.math, scores.chemistry, scores.techAgricultural)) results.X12 = m + c + techAgr + calculatePriority(m + c + techAgr);

  const x27Check = hasScores(scores.math, scores.english, scores.techIndustrial) || (scores.math !== "" && scores.techIndustrial !== "" && equivEnglish > 0);
  if (x27Check) results.X27 = m + finalEnglish + techInd + calculatePriority(m + finalEnglish + techInd);

  const x28Check = hasScores(scores.math, scores.english, scores.techAgricultural) || (scores.math !== "" && scores.techAgricultural !== "" && equivEnglish > 0);
  if (x28Check) results.X28 = m + finalEnglish + techAgr + calculatePriority(m + finalEnglish + techAgr);

  if (hasScores(scores.math, scores.physics, scores.informatics)) results.TH1 = m + p + info + calculatePriority(m + p + info);
  if (hasScores(scores.math, scores.physics, scores.techIndustrial)) results.TH3 = m + p + techInd + calculatePriority(m + p + techInd);
  if (hasScores(scores.math, scores.chemistry, scores.techIndustrial)) results.TH5 = m + c + techInd + calculatePriority(m + c + techInd);
  if (hasScores(scores.math, scores.literature, scores.informatics)) results.TH6 = m + l + info + calculatePriority(m + l + info);

  const roundedResults: Record<string, number> = {};
  Object.entries(results).forEach(([grp, val]) => {
    roundedResults[grp] = parseFloat(val.toFixed(2));
  });

  let maxGroup = "";
  let maxVal = -1;
  Object.entries(roundedResults).forEach(([grp, val]) => {
    if (val > maxVal) {
      maxVal = val;
      maxGroup = grp;
    }
  });

  return {
    results: roundedResults,
    highestGroup: maxGroup !== "" ? { name: maxGroup, score: maxVal } : null,
    equivEnglish
  };
};

export interface SubjectSemesterScores {
  grade10_hk1: string;
  grade10_hk2: string;
  grade11_hk1: string;
  grade11_hk2: string;
  grade12_hk1: string;
  grade12_hk2: string;
}

export const TRANSCRIPT_SUBJECTS = {
  math: "Toán",
  literature: "Ngữ văn",
  english: "Tiếng Anh",
  physics: "Vật lý",
  chemistry: "Hóa học",
  biology: "Sinh học",
  history: "Lịch sử",
  geography: "Địa lý",
  gdktpl: "GDKTPL",
  informatics: "Tin học",
  techIndustrial: "Công nghệ CN",
  techAgricultural: "Công nghệ NN"
} as const;

export type TranscriptSubjectKey = keyof typeof TRANSCRIPT_SUBJECTS;

export const TRANSCRIPT_SUBJECT_GROUPS: Record<string, TranscriptSubjectKey[]> = {
  A00: ["math", "physics", "chemistry"],
  A01: ["math", "physics", "english"],
  B00: ["math", "chemistry", "biology"],
  C00: ["literature", "history", "geography"],
  D01: ["math", "literature", "english"],
  D07: ["math", "chemistry", "english"],
  D08: ["math", "biology", "english"]
};

export const calculateSubjectAverage = (semesters: SubjectSemesterScores): number => {
  const values = [
    parseFloat(semesters.grade10_hk1),
    parseFloat(semesters.grade10_hk2),
    parseFloat(semesters.grade11_hk1),
    parseFloat(semesters.grade11_hk2),
    parseFloat(semesters.grade12_hk1),
    parseFloat(semesters.grade12_hk2)
  ].filter(v => !isNaN(v));

  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / values.length).toFixed(2));
};

export const calculateTranscriptPriorityScore = (gpaSum: number, basePriority: number): number => {
  if (gpaSum < 22.5) return Math.min(basePriority, 3.0);
  const actualPriority = ((30 - gpaSum) / 7.5) * basePriority;
  return parseFloat(Math.min(actualPriority, 3.0).toFixed(4));
};

export const calculateTranscriptScore = (
  subjectAvgs: Record<TranscriptSubjectKey, number>,
  selectedGroup: string,
  basePriority: number
): { totalScore: number; gpaSum: number; priorityScore: number } => {
  const subjects = TRANSCRIPT_SUBJECT_GROUPS[selectedGroup];
  if (!subjects) return { totalScore: 0, gpaSum: 0, priorityScore: 0 };

  const gpaSum = subjects.reduce((acc, sub) => acc + (subjectAvgs[sub] || 0), 0);
  const priorityScore = calculateTranscriptPriorityScore(gpaSum, basePriority);
  const totalScore = parseFloat((gpaSum + priorityScore).toFixed(4));

  return { totalScore, gpaSum, priorityScore };
};

