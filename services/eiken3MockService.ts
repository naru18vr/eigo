import { safeSetLearningItem } from './storageHealthService';
import { eiken3Words } from '../data/eiken3Words';
import { eiken3ListeningQuestions } from '../data/eiken3Listening';
import { eiken3Readings } from '../data/eiken3Readings';
import { DailyQuestion, getQuestionById } from './eiken3DailyService';
import { recordEiken3Activity } from './eiken3ProgressService';
import { eiken3CoreExamQuestions, eiken3CoreSentences } from '../data/eiken3Curriculum';

const RESULT_KEY = 'eiken3WeeklyMockResultV1';
const HISTORY_KEY = 'eiken3MockHistoryV1';
const ATTEMPT_KEY = 'eiken3MockAttemptV1';

export type MockQuestion = DailyQuestion & { section: string; passage?: string; translation?: string; evidence?: string };
export type MockResult = { week: string; score: number; total: number; answers: Record<string, string>; completedAt: string; timeUsed: number; missionId?: string; courseEligible?: boolean };
export type MockAttempt = { week: string; index: number; remaining: number; answers: Record<string, string>; plays: Record<string, number>; missionId?: string };

export const weekKey = () => {
  const date = new Date();
  const first = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil((((date.getTime() - first.getTime()) / 86400000) + first.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
};

const hash = (value: string) => {
  let result = 0;
  for (const character of value) result = Math.imul(31, result) + character.charCodeAt(0) | 0;
  return result >>> 0;
};
const pick = <T,>(items: T[], seed: string, count: number) => items.map((item, i) => ({ item, n: hash(`${seed}-${i}`) })).sort((a, b) => a.n - b.n).slice(0, count).map(x => x.item);

export const getWeeklyMock = (seed = weekKey()): MockQuestion[] => {
  const week = seed;
  const ids = [
    ...pick(eiken3Words, `${week}-w`, 5).map(x => `word-${x.id}`),
    ...pick(eiken3CoreSentences, `${week}-s`, 2).map(x => `sentence-${x.id}`),
    ...pick(eiken3ListeningQuestions, `${week}-l`, 2).map(x => `listening-${x.id}`),
  ];
  const basics = ids.map(id => getQuestionById(id, week)).filter((x): x is DailyQuestion => Boolean(x)).map(question => ({ ...question, section: question.kind }));
  const examQuestions: MockQuestion[] = pick(eiken3CoreExamQuestions, `${week}-exam`, 4).map(item => ({ id:`exam-${item.id}`,prompt:item.prompt,detail:item.type,answer:item.answer,choices:pick(item.choices,`${week}-${item.id}`,item.choices.length),explanation:item.explanation,kind:item.type,section:item.type }));
  const reading = pick(eiken3Readings, `${week}-r`, 1)[0];
  const readingQuestions: MockQuestion[] = reading.questions.map((question, index) => ({
    id: `mock-${reading.id}-${index}`,
    prompt: question.question,
    detail: reading.title,
    answer: question.answer,
    choices: pick(question.choices, `${week}-${reading.id}-${index}`, question.choices.length),
    explanation: question.explanation,
    kind: '長文', section: '長文', passage: reading.passage, translation: reading.translation, evidence: question.evidence,
  }));
  return [...basics, ...examQuestions, ...readingQuestions];
};

export const loadMockResult = (): MockResult | null => {
  if (typeof localStorage === 'undefined') return null;
  try { const item = JSON.parse(localStorage.getItem(RESULT_KEY) || 'null'); return item && typeof item.completedAt === 'string' && Number.isFinite(item.score) && Number.isFinite(item.total) && item.total > 0 ? item : null; } catch { return null; }
};
export const loadMockHistory = (): MockResult[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const history: MockResult[] = Array.isArray(raw) ? raw.filter(item => item && typeof item.completedAt === 'string' && Number.isFinite(item.score) && Number.isFinite(item.total) && item.total > 0) : [];
    const source = history.length ? history : (loadMockResult() ? [loadMockResult()!] : []);
    const unique = source.filter((result, index, items) =>
      items.findIndex(item => item.completedAt === result.completedAt) === index
    );
    if (unique.length !== history.length && history.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(unique));
    }
    return unique;
  } catch { return []; }
};
export const saveMockResult = (result: MockResult) => {
  if (typeof localStorage !== 'undefined') {
    const history = loadMockHistory();
    if (!history.some(item => item.completedAt === result.completedAt)) history.push(result);
    if (!safeSetLearningItem(RESULT_KEY, JSON.stringify(result))) return false;
    if (!safeSetLearningItem(HISTORY_KEY, JSON.stringify(history.slice(-20)))) return false;
    localStorage.removeItem(ATTEMPT_KEY);
  }
  recordEiken3Activity('mock');
  return true;
};
export const loadMockAttempt = (missionId?: string): MockAttempt | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const attempt = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || 'null') as MockAttempt | null;
    return attempt?.week === weekKey() && attempt.missionId === missionId && Number.isInteger(attempt.index) && attempt.index >= 0 && attempt.index < 15 && Number.isFinite(attempt.remaining) && attempt.remaining >= 0 && attempt.remaining <= 600 && attempt.answers && typeof attempt.answers === 'object' && !Array.isArray(attempt.answers) ? attempt : null;
  } catch { return null; }
};
export const saveMockAttempt = (attempt: MockAttempt) => { if (typeof localStorage !== 'undefined') localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt)); };
export const clearMockAttempt = () => { if (typeof localStorage !== 'undefined') localStorage.removeItem(ATTEMPT_KEY); };
