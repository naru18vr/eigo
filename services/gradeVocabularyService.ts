export type VocabularyMastery = {
  days: Record<string, boolean>;
  correct: number;
  wrong: number;
  lastSeen: string;
};

export type VocabularyMasteryMap = Record<string, VocabularyMastery>;
export type VocabularyMasteryLevel = 'new' | 'learning' | 'consolidating' | 'mastered';

const storageKey = (grade: number) => `grade${grade}VocabularyMasteryV1`;
const localDay = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const gradeWordId = (grade: number, index: number) => `g${grade}w${String(index + 1).padStart(3, '0')}`;

export const loadGradeVocabularyMastery = (grade: number): VocabularyMasteryMap => {
  if (typeof localStorage === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(storageKey(grade)) || '{}') as VocabularyMasteryMap;
  } catch {
    return {};
  }
};

export const recordGradeVocabularyAttempt = (grade: number, id: string, correct: boolean, day = localDay()) => {
  if (typeof localStorage === 'undefined') return;
  const mastery = loadGradeVocabularyMastery(grade);
  const current = mastery[id] || { days: {}, correct: 0, wrong: 0, lastSeen: '' };
  const previousToday = current.days[day];
  mastery[id] = {
    days: { ...current.days, [day]: previousToday === undefined ? correct : previousToday && correct },
    correct: current.correct + (correct ? 1 : 0),
    wrong: current.wrong + (correct ? 0 : 1),
    lastSeen: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(grade), JSON.stringify(mastery));
};

export const gradeVocabularyMasteryLevel = (mastery?: VocabularyMastery): VocabularyMasteryLevel => {
  if (!mastery) return 'new';
  const days = Object.entries(mastery.days).sort(([left], [right]) => left.localeCompare(right));
  const correctDays = days.filter(([, correct]) => correct).length;
  const latestCorrect = days.at(-1)?.[1] === true;
  if (correctDays >= 4 && latestCorrect) return 'mastered';
  if (correctDays >= 2) return 'consolidating';
  return 'learning';
};
