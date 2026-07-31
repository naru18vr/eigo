import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import { EIKEN4_GRAMMAR_CATEGORIES, type Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_PRACTICE_HISTORY_KEY, EIKEN4_GRAMMAR_PRACTICE_STATS_KEY, EIKEN4_REVIEW_SCHEDULE_KEY, EIKEN4_STEP_LEARNING_KEY } from '../data/eiken4LearningKeys';

export type GrammarLearningStatus = 'not-started' | 'in-progress' | 'completed' | 'review-needed';
export type GrammarLearningState = {
  grammarId: Eiken4GrammarCategoryId;
  guideViewed: boolean;
  practiced: boolean;
  attemptedCount: number;
  correctCount: number;
  accuracy: number;
  lastStudiedAt?: string;
  reviewDue: boolean;
  status: GrammarLearningStatus;
};

type Stats = { correct?: number; total?: number; lastAnsweredAt?: string };
type History = { categoryId?: string; answers?: { correct?: boolean }[]; completedAt?: string };
type Review = { id?: string; dueDate?: string };
type StepData = { guideViewedGrammarIds?: string[] };

const read = <T,>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
};

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const getGrammarLearningState = (grammarId: Eiken4GrammarCategoryId): GrammarLearningState => {
  const valid = EIKEN4_GRAMMAR_CATEGORIES.some(category => category.id === grammarId);
  const stats = read<Record<string, Stats>>(EIKEN4_GRAMMAR_PRACTICE_STATS_KEY, {})[grammarId] || {};
  const history = read<History[]>(EIKEN4_GRAMMAR_PRACTICE_HISTORY_KEY, []).filter(item => item?.categoryId === grammarId);
  const latest = history.at(-1);
  const attemptedCount = Number.isFinite(stats.total) ? Math.max(0, stats.total || 0) : 0;
  const correctCount = Number.isFinite(stats.correct) ? Math.min(attemptedCount, Math.max(0, stats.correct || 0)) : 0;
  const accuracy = attemptedCount ? Math.round(correctCount / attemptedCount * 100) : 0;
  const stepData = read<StepData>(EIKEN4_STEP_LEARNING_KEY, {});
  // 旧データは、練習履歴があれば解説も確認済みと安全に推定する。
  const guideViewed = Boolean(stepData.guideViewedGrammarIds?.includes(grammarId) || attemptedCount > 0);
  const sentenceIds = new Set(eiken4CoreSentences.filter(sentence => sentence.grammarCategory === grammarId).map(sentence => `sentence-${sentence.id}`));
  const reviewDue = read<Review[]>(EIKEN4_REVIEW_SCHEDULE_KEY, []).some(item => Boolean(item?.id && sentenceIds.has(item.id) && item.dueDate && item.dueDate <= today()));
  const latestAnswers = Array.isArray(latest?.answers) ? latest.answers : [];
  const latestAccuracy = latestAnswers.length ? latestAnswers.filter(answer => answer?.correct).length / latestAnswers.length * 100 : undefined;
  let status: GrammarLearningStatus = 'in-progress';
  if (!valid || (!guideViewed && attemptedCount === 0)) status = 'not-started';
  else if (reviewDue || (latestAccuracy !== undefined && latestAccuracy < 80)) status = 'review-needed';
  else if (attemptedCount >= 5 && accuracy >= 80) status = 'completed';
  return { grammarId, guideViewed, practiced: attemptedCount > 0, attemptedCount, correctCount, accuracy, lastStudiedAt: stats.lastAnsweredAt || latest?.completedAt, reviewDue, status };
};
