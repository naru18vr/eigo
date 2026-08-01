import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import { EIKEN4_GRAMMAR_CATEGORIES, type Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_GUIDE_PROGRESS_KEY, EIKEN4_GRAMMAR_PRACTICE_HISTORY_KEY, EIKEN4_GRAMMAR_PRACTICE_STATS_KEY, EIKEN4_REVIEW_SCHEDULE_KEY, EIKEN4_STEP_LEARNING_KEY } from '../data/eiken4LearningKeys';
import { safeSetLearningItem } from './storageHealthService';

export type GrammarLearningStatus = 'not-started' | 'in-progress' | 'completed' | 'review-needed';
export type GrammarLearningState = {
  grammarId: Eiken4GrammarCategoryId;
  guideStarted: boolean;
  guideCompleted: boolean;
  /** 旧画面との互換名。guideCompletedと同じ値。 */
  guideViewed: boolean;
  practiced: boolean;
  attemptedCount: number;
  correctCount: number;
  accuracy: number;
  incorrectQuestionIds: string[];
  lastStudiedAt?: string;
  nextReviewAt?: string;
  reviewDue: boolean;
  status: GrammarLearningStatus;
};

type Stats = { correct?: number; total?: number; lastAnsweredAt?: string };
type History = { categoryId?: string; questionIds?: string[]; answers?: { id?: string; correct?: boolean }[]; completedAt?: string };
type Review = { id?: string; dueDate?: string; step?: number; resolved?: boolean };
type StepData = { guideViewedGrammarIds?: string[] };
export type GrammarGuideProgress = { grammarId: Eiken4GrammarCategoryId; started: boolean; completed: boolean; startedAt?: string; completedAt?: string };

const read = <T,>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
};

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const loadGuideProgress = () => read<Record<string, GrammarGuideProgress>>(EIKEN4_GRAMMAR_GUIDE_PROGRESS_KEY, {});

export const markGrammarGuideStarted = (grammarId: Eiken4GrammarCategoryId) => {
  const progress = loadGuideProgress();
  const previous = progress[grammarId];
  if (previous?.started) return;
  progress[grammarId] = { grammarId, started: true, completed: Boolean(previous?.completed), startedAt: new Date().toISOString(), completedAt: previous?.completedAt };
  safeSetLearningItem(EIKEN4_GRAMMAR_GUIDE_PROGRESS_KEY, JSON.stringify(progress));
};

export const markGrammarGuideCompleted = (grammarId: Eiken4GrammarCategoryId) => {
  const progress = loadGuideProgress();
  const previous = progress[grammarId]; const timestamp = new Date().toISOString();
  progress[grammarId] = { grammarId, started: true, completed: true, startedAt: previous?.startedAt || timestamp, completedAt: previous?.completedAt || timestamp };
  safeSetLearningItem(EIKEN4_GRAMMAR_GUIDE_PROGRESS_KEY, JSON.stringify(progress));
};

export const getGrammarStatusLabel = (status: GrammarLearningStatus) => ({
  'not-started': 'まだ', 'in-progress': 'がんばり中', completed: 'できた！', 'review-needed': 'もう一度やろう',
} as const)[status];

export const migrateGrammarStatus = (value: unknown): GrammarLearningStatus => {
  if (value === '未学習' || value === 'まだ' || value === 'not-started') return 'not-started';
  if (value === '練習中' || value === 'がんばり中' || value === 'in-progress') return 'in-progress';
  if (value === '完了' || value === 'できた！' || value === 'completed') return 'completed';
  if (value === '復習しよう' || value === 'もう一度やろう' || value === 'review-needed') return 'review-needed';
  return 'not-started';
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
  const savedGuide = loadGuideProgress()[grammarId];
  const legacyCompleted = Boolean(stepData.guideViewedGrammarIds?.includes(grammarId) || attemptedCount > 0);
  const guideStarted = Boolean(savedGuide?.started || legacyCompleted);
  const guideCompleted = Boolean(savedGuide?.completed || legacyCompleted);
  const sentenceIds = new Set(eiken4CoreSentences.filter(sentence => sentence.grammarCategory === grammarId).map(sentence => `sentence-${sentence.id}`));
  const grammarReviews = read<Review[]>(EIKEN4_REVIEW_SCHEDULE_KEY, []).filter(item => Boolean(item?.id && sentenceIds.has(item.id)));
  const reviewDue = grammarReviews.some(item => Boolean(item.dueDate && item.dueDate <= today()));
  const nextReviewAt = grammarReviews.map(item => item.dueDate).filter((date): date is string => Boolean(date)).sort()[0];
  const latestAnswers = Array.isArray(latest?.answers) ? latest.answers : [];
  const incorrectQuestionIds = Array.from(new Set([
    ...latestAnswers.map((answer, index) => !answer?.correct ? answer.id || latest?.questionIds?.[index] : undefined).filter((id): id is string => Boolean(id)),
    ...grammarReviews.filter(item => item.resolved === false || (item.resolved === undefined && (item.step || 0) === 0)).map(item => item.id).filter((id): id is string => Boolean(id)),
    ...grammarReviews.filter(item => item.dueDate && item.dueDate <= today()).map(item => item.id).filter((id): id is string => Boolean(id)),
  ]));
  const latestAccuracy = latestAnswers.length ? latestAnswers.filter(answer => answer?.correct).length / latestAnswers.length * 100 : undefined;
  let status: GrammarLearningStatus = 'in-progress';
  if (!valid || (!guideCompleted && attemptedCount === 0 && !guideStarted)) status = 'not-started';
  else if (reviewDue || (latestAccuracy !== undefined && latestAccuracy < 80)) status = 'review-needed';
  else if (attemptedCount >= 5 && accuracy >= 80) status = 'completed';
  return { grammarId, guideStarted, guideCompleted, guideViewed: guideCompleted, practiced: attemptedCount > 0, attemptedCount, correctCount, accuracy, incorrectQuestionIds, lastStudiedAt: stats.lastAnsweredAt || latest?.completedAt || savedGuide?.completedAt || savedGuide?.startedAt, nextReviewAt, reviewDue, status };
};
