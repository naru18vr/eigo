import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import { EIKEN4_GRAMMAR_CATEGORIES, getEiken4GrammarCategory, getEiken4GrammarCategoryForGuideTopic, getEiken4GrammarCategoriesForGuideTopic, type Eiken4GrammarCategory, type Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_PRACTICE_HISTORY_KEY, EIKEN4_GRAMMAR_PRACTICE_STATS_KEY } from '../data/eiken4LearningKeys';
import { getQuestionById, localDateKey, recordReviewAnswer, type DailyAnswer, type DailyQuestion } from './eiken4DailyService';
import { safeSetLearningItem } from './storageHealthService';

export type GrammarCategoryId = Eiken4GrammarCategoryId;
export type GrammarCategory = Eiken4GrammarCategory;
export type GrammarPracticeQuestion = DailyQuestion & { grammarCategory: GrammarCategoryId };
export const grammarCategories = EIKEN4_GRAMMAR_CATEGORIES;
export { getEiken4GrammarCategoryForGuideTopic, getEiken4GrammarCategoriesForGuideTopic };

export type GrammarPracticeStats = { attempts: number; correct: number; total: number; lastAnsweredAt?: string; lastWrongAt?: string };
export type GrammarPracticeHistory = { id: string; categoryId: GrammarCategoryId; questionIds: string[]; answers: DailyAnswer[]; completedAt: string };

const STATS_KEY = EIKEN4_GRAMMAR_PRACTICE_STATS_KEY;
const HISTORY_KEY = EIKEN4_GRAMMAR_PRACTICE_HISTORY_KEY;

const hash = (value: string) => {
  let result = 2166136261;
  for (const character of value) { result ^= character.charCodeAt(0); result = Math.imul(result, 16777619); }
  return result >>> 0;
};

const shuffled = <T,>(items: T[], seed: string) => items
  .map((item, index) => ({ item, order: hash(`${seed}-${index}`) }))
  .sort((left, right) => left.order - right.order)
  .map(({ item }) => item);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof localStorage === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key) || '') as T; } catch { return fallback; }
};

export const getGrammarCategory = getEiken4GrammarCategory;

export const getGrammarCategorySentences = (categoryId: GrammarCategoryId) => {
  const category = getGrammarCategory(categoryId);
  return category ? eiken4CoreSentences.filter(sentence => sentence.grammarCategory === category.id) : [];
};

export const getAvailableGrammarCategories = () => grammarCategories.filter(category => getGrammarCategorySentences(category.id).length > 0);

export const getGrammarPracticeQuestions = (categoryId: GrammarCategoryId, attemptId: string, count = 10): GrammarPracticeQuestion[] =>
  shuffled(getGrammarCategorySentences(categoryId), `${localDateKey()}-${categoryId}-${attemptId}`)
    .slice(0, count)
    .map(sentence => {
      const question = getQuestionById(`sentence-${sentence.id}`, localDateKey());
      return question ? { ...question, grammarCategory: categoryId } : undefined;
    })
    .filter((question): question is GrammarPracticeQuestion => Boolean(question));

export const loadGrammarPracticeStats = (): Record<string, GrammarPracticeStats> => {
  const stats = read<Record<string, GrammarPracticeStats>>(STATS_KEY, {});
  return Object.fromEntries(Object.entries(stats).filter(([, value]) => value && Number.isFinite(value.attempts) && Number.isFinite(value.correct) && Number.isFinite(value.total)));
};

export const getGrammarLearningState = (stats: GrammarPracticeStats | undefined) => {
  if (!stats?.total) return 'まだ';
  if (stats.lastWrongAt && (!stats.lastAnsweredAt || stats.lastWrongAt === stats.lastAnsweredAt)) return '復習しよう';
  return stats.correct / stats.total >= .8 ? 'できた！' : 'がんばり中';
};

export const saveGrammarPracticeResult = (categoryId: GrammarCategoryId, questionIds: string[], answers: DailyAnswer[]) => {
  if (!questionIds.length || answers.length !== questionIds.length) return;
  const completedAt = new Date().toISOString();
  const stats = loadGrammarPracticeStats();
  const previous = stats[categoryId] || { attempts: 0, correct: 0, total: 0 };
  const correct = answers.filter(answer => answer.correct).length;
  stats[categoryId] = {
    attempts: previous.attempts + 1,
    correct: previous.correct + correct,
    total: previous.total + answers.length,
    lastAnsweredAt: completedAt,
    ...(answers.some(answer => !answer.correct) ? { lastWrongAt: completedAt } : {}),
  };
  const history = read<GrammarPracticeHistory[]>(HISTORY_KEY, []);
  const item: GrammarPracticeHistory = { id: `grammar-${categoryId}-${completedAt}`, categoryId, questionIds, answers, completedAt };
  safeSetLearningItem(STATS_KEY, JSON.stringify(stats));
  safeSetLearningItem(HISTORY_KEY, JSON.stringify([...history, item].slice(-120)));
};

// 文法別練習での誤答も、既存のおまかせ復習の予定に登録する。
export const recordGrammarPracticeAnswer = (id: string, correct: boolean) => recordReviewAnswer(id, correct, false);
