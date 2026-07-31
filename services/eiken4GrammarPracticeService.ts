import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import type { Sentence } from '../types';
import { getQuestionById, localDateKey, recordReviewAnswer, type DailyAnswer, type DailyQuestion } from './eiken4DailyService';
import { safeSetLearningItem } from './storageHealthService';

export type GrammarCategoryId =
  | 'general-verb' | 'past-tense' | 'present-progressive' | 'past-progressive'
  | 'future' | 'modal-verb' | 'question-words' | 'imperative' | 'there-is-are'
  | 'infinitive' | 'gerund' | 'comparative' | 'superlative' | 'conjunction' | 'other-eiken4';

export type GrammarCategory = {
  id: GrammarCategoryId;
  title: string;
  description: string;
  guideTopic?: string;
  matches: (sentence: Sentence) => boolean;
};

const tag = (sentence: Sentence) => sentence.grammarTag;
const words = (sentence: Sentence) => sentence.words.join(' ');

export const grammarCategories: GrammarCategory[] = [
  { id: 'general-verb', title: '一般動詞・基本表現', description: '「する・行く」など、動きを表す文', matches: sentence => /^(get up|want＋名詞|道案内)$/.test(tag(sentence)) },
  { id: 'past-tense', title: '過去形', description: '昨日したことを表す文', guideTopic: 'past', matches: sentence => /^(過去形|過去形の疑問文|過去形の否定文|不規則動詞)$/.test(tag(sentence)) },
  { id: 'present-progressive', title: '現在進行形', description: '今していることを表す文', matches: sentence => tag(sentence) === '現在進行形' },
  { id: 'past-progressive', title: '過去進行形', description: 'そのときしていたことを表す文', guideTopic: 'past', matches: sentence => tag(sentence) === '過去進行形' },
  { id: 'future', title: '未来を表す表現', description: 'これからすることを表す文', guideTopic: 'future', matches: sentence => /^(be going to|未来 will|Will you \.\.\.\?)$/.test(tag(sentence)) },
  { id: 'modal-verb', title: '助動詞', description: 'できる・すべき・してはいけないを表す文', guideTopic: 'modal', matches: sentence => /^(Can I \.\.\.\?|May I \.\.\.\?|must not|should|have to)$/.test(tag(sentence)) },
  { id: 'question-words', title: '疑問詞', description: '何・どこ・どのくらいをたずねる文', matches: sentence => /^(How often \.\.\.\?|How long \.\.\.\?|How many \.\.\.\?|疑問詞 What)$/.test(tag(sentence)) },
  { id: 'imperative', title: '命令文・誘いかけ', description: '〜してください・〜しましょうの文', matches: sentence => /^Let's \.\.\.$/.test(tag(sentence)) || /^(Please|Let's)/.test(words(sentence)) },
  { id: 'there-is-are', title: 'There is / There are', description: '〜があります・いますを表す文', guideTopic: 'there', matches: sentence => /^There (is|are)/.test(tag(sentence)) },
  { id: 'infinitive', title: 'to不定詞', description: '〜すること・〜するためにを表す文', guideTopic: 'infinitive', matches: sentence => /^(want to|目的の不定詞|Would you like to \.\.\.\?)$/.test(tag(sentence)) },
  { id: 'gerund', title: '動名詞', description: '〜することを表す動詞ingの文', guideTopic: 'gerund', matches: sentence => /^動名詞/.test(tag(sentence)) },
  { id: 'comparative', title: '比較級', description: '2つのものを比べる文', guideTopic: 'comparison', matches: sentence => /^(比較級|as \.\.\. as)$/.test(tag(sentence)) },
  { id: 'superlative', title: '最上級', description: '3つ以上の中で一番を表す文', guideTopic: 'comparison', matches: sentence => tag(sentence) === '最上級' },
  { id: 'conjunction', title: '接続詞', description: '文と文をつなぐ表現', guideTopic: 'conjunction', matches: sentence => /^(because|接続詞 if|接続詞 when)$/.test(tag(sentence)) },
  { id: 'other-eiken4', title: 'その他の英検4級文法', description: '人にものを渡す・見せるなどの表現', guideTopic: 'give', matches: sentence => /^(show|give|make|teach)＋人＋物$/.test(tag(sentence)) },
];

export type GrammarPracticeStats = { attempts: number; correct: number; total: number; lastAnsweredAt?: string; lastWrongAt?: string };
export type GrammarPracticeHistory = { id: string; categoryId: GrammarCategoryId; questionIds: string[]; answers: DailyAnswer[]; completedAt: string };

const STATS_KEY = 'eiken4GrammarPracticeStatsV1';
const HISTORY_KEY = 'eiken4GrammarPracticeHistoryV1';

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

export const getGrammarCategory = (categoryId: string | null | undefined) => grammarCategories.find(category => category.id === categoryId);

export const getGrammarCategorySentences = (categoryId: GrammarCategoryId) => {
  const category = getGrammarCategory(categoryId);
  return category ? eiken4CoreSentences.filter(sentence => grammarCategories.find(item => item.matches(sentence))?.id === category.id) : [];
};

export const getAvailableGrammarCategories = () => grammarCategories.filter(category => getGrammarCategorySentences(category.id).length > 0);

export const getGrammarPracticeQuestions = (categoryId: GrammarCategoryId, attemptId: string, count = 10): DailyQuestion[] =>
  shuffled(getGrammarCategorySentences(categoryId), `${localDateKey()}-${categoryId}-${attemptId}`)
    .slice(0, count)
    .map(sentence => getQuestionById(`sentence-${sentence.id}`, localDateKey()))
    .filter((question): question is DailyQuestion => Boolean(question));

export const loadGrammarPracticeStats = (): Record<string, GrammarPracticeStats> => {
  const stats = read<Record<string, GrammarPracticeStats>>(STATS_KEY, {});
  return Object.fromEntries(Object.entries(stats).filter(([, value]) => value && Number.isFinite(value.attempts) && Number.isFinite(value.correct) && Number.isFinite(value.total)));
};

export const getGrammarLearningState = (stats: GrammarPracticeStats | undefined) => {
  if (!stats?.total) return '未学習';
  if (stats.lastWrongAt && (!stats.lastAnsweredAt || stats.lastWrongAt === stats.lastAnsweredAt)) return '復習しよう';
  return stats.correct / stats.total >= .8 ? 'できた' : '練習中';
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

export const recordGrammarPracticeAnswer = (id: string, correct: boolean) => recordReviewAnswer(id, correct, false);
