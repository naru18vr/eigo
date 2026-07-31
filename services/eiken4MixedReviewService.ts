import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import { EIKEN4_MIXED_REVIEW_KEY } from '../data/eiken4LearningKeys';
import { safeSetLearningItem } from './storageHealthService';
import { getStudiedGrammarIds } from './eiken4StepLearningService';
import { localDateKey, type DailyAnswer } from './eiken4DailyService';

export type MixedReviewProgress = {
  date: string;
  questionIds: string[];
  answers: DailyAnswer[];
  completedAt?: string;
};

const hash = (value: string) => {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const buildQuestionIds = (seed: string) => {
  const studied = new Set(getStudiedGrammarIds());
  return eiken4CoreSentences
    .filter(sentence => sentence.grammarCategory && studied.has(sentence.grammarCategory))
    .map((sentence, index) => ({ id: `sentence-${sentence.id}`, order: hash(`${seed}-${sentence.id}-${index}`) }))
    .sort((left, right) => left.order - right.order)
    .slice(0, 10)
    .map(item => item.id);
};

const isValid = (value: unknown): value is MixedReviewProgress => {
  if (!value || typeof value !== 'object') return false;
  const progress = value as Partial<MixedReviewProgress>;
  return typeof progress.date === 'string' && Array.isArray(progress.questionIds) && Array.isArray(progress.answers);
};

export const loadMixedReviewProgress = (): MixedReviewProgress | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_MIXED_REVIEW_KEY) || 'null');
    return isValid(saved) ? saved : null;
  } catch {
    return null;
  }
};

export const startMixedReview = (): MixedReviewProgress => {
  const progress: MixedReviewProgress = {
    date: localDateKey(),
    questionIds: buildQuestionIds(`${Date.now()}-${Math.random()}`),
    answers: [],
  };
  saveMixedReviewProgress(progress);
  return progress;
};

export const saveMixedReviewProgress = (progress: MixedReviewProgress) => {
  safeSetLearningItem(EIKEN4_MIXED_REVIEW_KEY, JSON.stringify(progress));
};
