import { eiken3CoreSentences } from '../data/eiken3Curriculum';
import { EIKEN3_GRAMMAR_CATEGORIES, getEiken3GrammarCategory, getEiken3GrammarCategoryForGuideTopic, getEiken3GrammarCategoriesForGuideTopic, type Eiken3GrammarCategory, type Eiken3GrammarCategoryId } from '../data/eiken3GrammarCategories';
import { EIKEN3_GRAMMAR_PRACTICE_HISTORY_KEY, EIKEN3_GRAMMAR_PRACTICE_STATS_KEY } from '../data/eiken3LearningKeys';
import { getQuestionById, localDateKey, recordReviewAnswer, type DailyAnswer, type DailyQuestion } from './eiken3DailyService';
import { getRecentQuestionIds } from './eiken3QuestionSessionService';
import { safeSetLearningItem } from './storageHealthService';

export type GrammarCategoryId = Eiken3GrammarCategoryId;
export type GrammarCategory = Eiken3GrammarCategory;
export type GrammarPracticeQuestion = DailyQuestion & { grammarCategory: GrammarCategoryId };
export const grammarCategories = EIKEN3_GRAMMAR_CATEGORIES;
export { getEiken3GrammarCategoryForGuideTopic, getEiken3GrammarCategoriesForGuideTopic };

export type GrammarPracticeStats = { attempts: number; correct: number; total: number; lastAnsweredAt?: string; lastWrongAt?: string };
export type GrammarPracticeHistory = { id: string; categoryId: GrammarCategoryId; questionIds: string[]; answers: DailyAnswer[]; completedAt: string };

const STATS_KEY = EIKEN3_GRAMMAR_PRACTICE_STATS_KEY;
const HISTORY_KEY = EIKEN3_GRAMMAR_PRACTICE_HISTORY_KEY;

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

export const getGrammarCategory = getEiken3GrammarCategory;

export const getGrammarCategorySentences = (categoryId: GrammarCategoryId) => {
  const category = getGrammarCategory(categoryId);
  return category ? eiken3CoreSentences.filter(sentence => sentence.grammarCategory === category.id) : [];
};

export const getAvailableGrammarCategories = () => grammarCategories.filter(category => getGrammarCategorySentences(category.id).length > 0);

export const getGrammarPracticeQuestions = (categoryId: GrammarCategoryId, attemptId: string, count = 10): GrammarPracticeQuestion[] => {
  const shuffledSentences = shuffled(getGrammarCategorySentences(categoryId), `${localDateKey()}-${categoryId}-${attemptId}`);
  const recent = new Set(getRecentQuestionIds().map(id => id.replace(/^sentence-/, '')));
  const freshSentences = shuffledSentences.filter(sentence => !recent.has(sentence.id));
  const source = freshSentences.length >= Math.min(count, shuffledSentences.length) ? freshSentences : shuffledSentences;
  return source
    .slice(0, count)
    .map(sentence => {
      const question = getQuestionById(`sentence-${sentence.id}`, localDateKey());
      return question ? { ...question, grammarCategory: categoryId } : undefined;
    })
    .filter((question): question is GrammarPracticeQuestion => Boolean(question));
};

export const loadGrammarPracticeStats = (): Record<string, GrammarPracticeStats> => {
  const stats = read<Record<string, GrammarPracticeStats>>(STATS_KEY, {});
  return Object.fromEntries(Object.entries(stats).filter(([, value]) => value && Number.isFinite(value.attempts) && Number.isFinite(value.correct) && Number.isFinite(value.total)));
};

export const saveGrammarPracticeResult = (categoryId: GrammarCategoryId, questionIds: string[], answers: DailyAnswer[]) => {
  if (!questionIds.length || answers.length !== questionIds.length) return;
  const completedAt = new Date().toISOString();
  const stats = loadGrammarPracticeStats();
  const previous = stats[categoryId] || { attempts: 0, correct: 0, total: 0 };
  const correct = answers.filter(answer => answer.correct).length;
  const updated: GrammarPracticeStats = {
    attempts: previous.attempts + 1,
    correct: previous.correct + correct,
    total: previous.total + answers.length,
    lastAnsweredAt: completedAt,
  };
  if (answers.some(answer => !answer.correct)) updated.lastWrongAt = completedAt;
  stats[categoryId] = updated;
  const history = read<GrammarPracticeHistory[]>(HISTORY_KEY, []);
  const item: GrammarPracticeHistory = { id: `grammar-${categoryId}-${completedAt}`, categoryId, questionIds, answers, completedAt };
  safeSetLearningItem(STATS_KEY, JSON.stringify(stats));
  safeSetLearningItem(HISTORY_KEY, JSON.stringify([...history, item].slice(-120)));
};

// 文法別練習での誤答も、既存のおまかせ復習の予定に登録する。
export const recordGrammarPracticeAnswer = (id: string, correct: boolean) => recordReviewAnswer(id, correct, false);
