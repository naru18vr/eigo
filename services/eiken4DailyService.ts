import { eiken4Words } from '../data/eiken4Words';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { daysUntilExam, getExamDate, recordEiken4Activity } from './eiken4ProgressService';
import { safeSetLearningItem } from './storageHealthService';
import { getStudiedGrammarIds } from './eiken4StepLearningService';
import { EIKEN4_REVIEW_SCHEDULE_KEY } from '../data/eiken4LearningKeys';
import { getRecentQuestionIds, rememberQuestionSession } from './eiken4QuestionSessionService';
import type { Eiken4QuestionType } from '../types';

export const EIKEN4_DAILY_KEY = 'eiken4DailyProgressV4';
const REVIEW_KEY = EIKEN4_REVIEW_SCHEDULE_KEY;
const COVERAGE_KEY = 'eiken4QuestionCoverageV1';
const REVIEW_INTERVALS = [1, 3, 7, 14];

export type DailyQuestion = {
  id: string;
  prompt: string;
  detail: string;
  answer: string;
  choices: string[];
  explanation?: string;
  kind: string;
  audioText?: string;
  transcript?: string;
  translation?: string;
  questionType?: Eiken4QuestionType;
};

export type DailyAnswer = { id: string; correct: boolean };

export type DailyProgress = {
  date: string;
  questionIds: string[];
  answers: DailyAnswer[];
  retryIds: string[];
  retryAnswers: DailyAnswer[];
  completedAt?: string;
};

type ReviewRecord = { id: string; dueDate: string; step: number; resolved?: boolean; incorrectCount?: number; lastIncorrectAt?: string; resolvedAt?: string };

export const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateKey(date);
};

const hash = (value: string) => {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const seededItems = <T,>(items: T[], seed: string, count: number) =>
  items
    .map((item, index) => ({ item, order: hash(`${seed}-${index}`) }))
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
    .map(({ item }) => item);

const choicesFor = (answer: string, distractors: string[], seed: string) => {
  const uniqueDistractors = Array.from(new Set(distractors)).filter(item => item !== answer);
  return seededItems([answer, ...seededItems(uniqueDistractors, `${seed}-distractors`, 3)], `${seed}-order`, 4);
};

const wordQuestion = (wordId: string, date: string): DailyQuestion | undefined => {
  const word = eiken4Words.find(item => `word-${item.id}` === wordId);
  if (!word) return undefined;
  return {
    id: wordId,
    prompt: word.word,
    detail: word.example,
    answer: word.meaning,
    choices: choicesFor(word.meaning, eiken4Words.filter(item => item.id !== word.id).map(item => item.meaning), `${date}-${word.id}`),
    kind: '単語',
  };
};

const sentenceQuestion = (sentenceId: string, date: string): DailyQuestion | undefined => {
  const sentence = eiken4CoreSentences.find(item => `sentence-${item.id}` === sentenceId);
  if (!sentence) return undefined;
  const answer = sentence.words.join(' ').replace(/ ([.,?!])/g, '$1');
  const questionTypeLabels: Record<Eiken4QuestionType, string> = {
    reorder: '語句を並べ替えよう',
    'fill-blank': '空所に入る形を選ぼう',
    'sentence-choice': '日本語に合う文を選ぼう',
    response: '会話の返事を選ぼう',
    dialogue: '会話の流れを考えよう',
    'error-correction': 'まちがいのない文を選ぼう',
  };
  return {
    id: sentenceId,
    prompt: sentence.japaneseQuestion,
    detail: `${questionTypeLabels[sentence.questionType || 'reorder']}・${sentence.grammarTag}`,
    answer,
    choices: choicesFor(answer, eiken4CoreSentences.filter(item => item.id !== sentence.id).map(item => item.words.join(' ').replace(/ ([.,?!])/g, '$1')), `${date}-${sentence.id}`),
    explanation: sentence.explanation,
    questionType: sentence.questionType || 'reorder',
    kind: '文法・会話',
  };
};

const examQuestion = (examId: string, date: string): DailyQuestion | undefined => {
  const exam = eiken4CoreExamQuestions.find(item => `exam-${item.id}` === examId);
  if (!exam) return undefined;
  return {
    id: examId,
    prompt: exam.prompt,
    detail: exam.translation || exam.type,
    answer: exam.answer,
    choices: seededItems(exam.choices, `${date}-${exam.id}`, exam.choices.length),
    explanation: exam.explanation,
    kind: exam.type,
  };
};

const listeningQuestion = (listeningId: string, date: string): DailyQuestion | undefined => {
  const listening = eiken4ListeningQuestions.find(item => `listening-${item.id}` === listeningId);
  if (!listening) return undefined;
  return {
    id: listeningId,
    prompt: listening.question,
    detail: '音声を2回まで聞いて答えよう',
    answer: listening.answer,
    choices: seededItems(listening.choices, `${date}-${listening.id}`, listening.choices.length),
    explanation: listening.explanation,
    kind: 'リスニング',
    audioText: listening.audioText,
    transcript: listening.transcript,
    translation: listening.translation,
  };
};

export const getQuestionById = (id: string, date = localDateKey()) =>
  id.startsWith('word-') ? wordQuestion(id, date)
    : id.startsWith('listening-') ? listeningQuestion(id, date)
      : id.startsWith('exam-') ? examQuestion(id, date)
        : sentenceQuestion(id, date);

const loadReviews = (): ReviewRecord[] => {
  if (typeof localStorage === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(REVIEW_KEY) || '[]'); } catch { return []; }
};

const saveReviews = (records: ReviewRecord[]) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(REVIEW_KEY, JSON.stringify(records));
};

const loadCoverage = (): Record<string, number> => {
  if (typeof localStorage === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(COVERAGE_KEY) || '{}'); } catch { return {}; }
};

export { getRecentQuestionIds, rememberQuestionSession } from './eiken4QuestionSessionService';

export const recordQuestionCoverage = (id: string) => {
  if (typeof localStorage === 'undefined') return;
  const coverage = loadCoverage(); coverage[id] = (coverage[id] || 0) + 1;
  localStorage.setItem(COVERAGE_KEY, JSON.stringify(coverage));
};

const leastSeen = <T extends { id: string }>(items: T[], prefix: string, seed: string, count: number) => {
  const coverage = loadCoverage();
  const recent = new Set(getRecentQuestionIds());
  const freshItems = items.filter(item => !recent.has(`${prefix}${item.id}`));
  const source = freshItems.length >= count ? freshItems : items;
  return source.map((item, index) => ({ item, seen: coverage[`${prefix}${item.id}`] || 0, order: hash(`${seed}-${index}`) }))
    .sort((a, b) => a.seen - b.seen || a.order - b.order).slice(0, count).map(({ item }) => `${prefix}${item.id}`);
};

export const getDueReviewCount = () => loadReviews().filter(record => record.dueDate <= localDateKey()).length;
export const getReviewCategoryCounts = () => loadReviews().reduce((counts, record) => {
  const category = record.id.startsWith('word-') ? '単語' : record.id.startsWith('listening-') ? 'リスニング' : record.id.startsWith('exam-') ? '本番形式' : '文法・会話';
  counts[category] = (counts[category] || 0) + 1; return counts;
}, {} as Record<string, number>);

export const getWeakQuestions = (category: string, count = 10): DailyQuestion[] => {
  const prefix = category === '単語' ? 'word-' : category === 'リスニング' ? 'listening-' : category === '本番形式' ? 'exam-' : 'sentence-';
  const scheduled = loadReviews().filter(record => record.id.startsWith(prefix)).map(record => record.id);
  const fallback = prefix === 'word-' ? eiken4Words.map(item => `word-${item.id}`)
    : prefix === 'listening-' ? eiken4ListeningQuestions.map(item => `listening-${item.id}`)
      : prefix === 'exam-' ? eiken4CoreExamQuestions.map(item => `exam-${item.id}`)
        : eiken4CoreSentences.map(item => `sentence-${item.id}`);
  return seededItems(Array.from(new Set([...scheduled, ...fallback])), `${localDateKey()}-${category}`, count)
    .map(id => getQuestionById(id)).filter((item): item is DailyQuestion => Boolean(item));
};

export const recordReviewAnswer = (id: string, correct: boolean, isRetry: boolean) => {
  if (!/^(word|listening|exam|sentence)-/.test(id)) return;
  const records = loadReviews();
  const index = records.findIndex(record => record.id === id);
  const current = index >= 0 ? records[index] : undefined;
  if (!correct) {
    const next: ReviewRecord = { id, dueDate: addDays(isRetry ? 1 : 0), step: 0, resolved: false, incorrectCount: (current?.incorrectCount || 0) + 1, lastIncorrectAt: new Date().toISOString() };
    if (index >= 0) records[index] = next; else records.push(next);
  } else if (current) {
    const intervalIndex = Math.min(current.step, REVIEW_INTERVALS.length - 1);
    records[index] = { ...current, dueDate: addDays(REVIEW_INTERVALS[intervalIndex]), step: Math.min(current.step + 1, REVIEW_INTERVALS.length), resolved: true, resolvedAt: new Date().toISOString() };
  }
  saveReviews(records);
};

export const getDailyLearningReadiness = () => {
  const studiedGrammarIds = new Set(getStudiedGrammarIds());
  const grammarQuestionCount = eiken4CoreSentences.filter(sentence => sentence.grammarCategory && studiedGrammarIds.has(sentence.grammarCategory)).length;
  const dueReviewCount = loadReviews().filter(record => record.dueDate <= localDateKey()).length;
  return { studiedGrammarCount: studiedGrammarIds.size, grammarQuestionCount, dueReviewCount, canStart: grammarQuestionCount + dueReviewCount > 0 };
};

const buildDailyQuestionIds = (date: string) => {
  const finalMode = daysUntilExam(getExamDate()) <= 14;
  const dueIds = loadReviews().filter(record => record.dueDate <= date)
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate) || left.step - right.step)
    .slice(0, finalMode ? 14 : 8).map(record => record.id);
  const studiedGrammarIds = new Set(getStudiedGrammarIds());
  const studiedSentences = eiken4CoreSentences.filter(sentence => sentence.grammarCategory && studiedGrammarIds.has(sentence.grammarCategory));
  const sentenceIds = leastSeen(studiedSentences, 'sentence-', `${date}-studied-sentences`, 18);
  // 新しい単語・聞く問題・本番問題で数を埋めず、習った文法と既存の復習だけを出す。
  return Array.from(new Set([...dueIds, ...sentenceIds])).slice(0, 18);
};

const emptyProgress = (): DailyProgress => ({
  date: localDateKey(),
  questionIds: buildDailyQuestionIds(localDateKey()),
  answers: [],
  retryIds: [],
  retryAnswers: [],
});

export const loadDailyProgress = (): DailyProgress => {
  if (typeof localStorage === 'undefined') return emptyProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_DAILY_KEY) || 'null') as DailyProgress | null;
    if (saved?.date === localDateKey()) {
      // この版より前に、まだ1問も答えず保存された当日分だけは、未習範囲を除いた内容に作り直す。
      // 回答済みの途中記録は消さず、そのまま続けられるようにする。
      if (!saved.answers.length && !saved.retryAnswers.length && !saved.completedAt) {
        const refreshed = { ...saved, questionIds: buildDailyQuestionIds(saved.date), retryIds: [] };
        saveDailyProgress(refreshed);
        return refreshed;
      }
      return saved;
    }
    const v3 = JSON.parse(localStorage.getItem('eiken4DailyProgressV3') || 'null') as DailyProgress | null;
    if (v3?.date === localDateKey()) {
      const migrated = v3.answers.length ? v3 : { ...v3, questionIds: buildDailyQuestionIds(v3.date) };
      saveDailyProgress(migrated); return migrated;
    }
    const previous = JSON.parse(localStorage.getItem('eiken4DailyProgressV2') || 'null') as DailyProgress | null;
    if (previous?.date === localDateKey()) {
      const migrated = previous.answers.length ? previous : { ...previous, questionIds: buildDailyQuestionIds(previous.date) };
      saveDailyProgress(migrated);
      return migrated;
    }
    const legacy = JSON.parse(localStorage.getItem('eiken4DailyProgressV1') || 'null') as { date: string; answers: DailyAnswer[]; completedAt?: string } | null;
    if (legacy?.date === localDateKey()) {
      const migrated: DailyProgress = {
        date: legacy.date,
        questionIds: buildDailyQuestionIds(legacy.date),
        answers: legacy.answers,
        retryIds: legacy.answers.filter(answer => !answer.correct).map(answer => answer.id),
        retryAnswers: [],
        completedAt: legacy.answers.every(answer => answer.correct) ? legacy.completedAt : undefined,
      };
      saveDailyProgress(migrated);
      return migrated;
    }
    return emptyProgress();
  } catch { return emptyProgress(); }
};

export const saveDailyProgress = (progress: DailyProgress) => {
  if (typeof localStorage !== 'undefined') safeSetLearningItem(EIKEN4_DAILY_KEY, JSON.stringify(progress));
  if (progress.completedAt) recordEiken4Activity('daily', progress.date);
};

export const resetTodayDailyProgress = () => {
  if (typeof localStorage === 'undefined') return;
  [EIKEN4_DAILY_KEY, 'eiken4DailyProgressV3', 'eiken4DailyProgressV2', 'eiken4DailyProgressV1']
    .forEach(key => localStorage.removeItem(key));
};
