import { safeSetLearningItem } from './storageHealthService';
import { eiken3Words } from '../data/eiken3Words';
import { eiken3ListeningQuestions } from '../data/eiken3Listening';
import { eiken3Readings } from '../data/eiken3Readings';
import { eiken3CoreExamQuestions, eiken3CoreSentences } from '../data/eiken3Curriculum';
import { DailyQuestion, getQuestionById, localDateKey } from './eiken3DailyService';
import { getListeningSectionRanges as getRanges, getListeningSectionTitle } from './eiken3QuestionLoader';

export type PrepQuestion = DailyQuestion & { section: string; passage?: string; evidence?: string };
export type FullMockResult = { id: string; date: string; reading: number; listening: number; readingTotal: 30 | 35; listeningTotal: 30; timeUsed: number; answers?: Record<string,string>; missionId?: string; writingAnswers?: Record<string,string>; courseEligible?: boolean };
export type PastPaperResult = { id: string; date: string; label: string; reading: number; listening: number; note: string; readingTotal?: 30 | 35; missionId?: string };

const FULL_RESULTS_KEY = 'eiken3FullMockResultsV1';
const PAST_RESULTS_KEY = 'eiken3PastPaperResultsV1';
const hash = (value: string) => [...value].reduce((sum, char) => Math.imul(sum, 31) + char.charCodeAt(0) | 0, 0) >>> 0;
const pick = <T,>(items: T[], seed: string, count: number) => items.map((item, index) => ({ item, order: hash(`${seed}-${index}`) })).sort((a, b) => a.order - b.order).slice(0, count).map(({ item }) => item);

export const getListeningSectionRanges = (total = eiken3ListeningQuestions.length) => getRanges(total);
export const listeningSection = (index: number) => getListeningSectionTitle(index, eiken3ListeningQuestions.length);

export const getFullMock = (seed = localDateKey()): PrepQuestion[] => {
  const basics = [
    ...pick(eiken3CoreExamQuestions.filter(item => item.type === '短文空所補充'), `${seed}-short`, 15),
    ...pick(eiken3CoreExamQuestions.filter(item => item.type === '会話文空所補充'), `${seed}-dialogue`, 5),
  ].map((item, index) => ({ ...getQuestionById(`exam-${item.id}`, seed)!, section: index < 15 ? 'リーディング1 語彙・文法' : 'リーディング2 会話文' }));
  const passages = pick(eiken3Readings, `${seed}-reading`, 5).flatMap(reading => reading.questions.map((question, index) => ({
    id: `full-reading-${reading.id}-${index}`, prompt: question.question, detail: reading.title, answer: question.answer,
    choices: pick(question.choices, `${seed}-${reading.id}-${index}`, question.choices.length), explanation: question.explanation,
    kind: '長文', section: 'リーディング3 長文読解', passage: reading.passage, evidence: question.evidence,
  })));
  const selectedListening = getListeningSectionRanges().flatMap((range, section) => pick(eiken3ListeningQuestions.slice(range.from, range.to), `${seed}-listening-${section}`, 10));
  const listening = selectedListening.map(item => {
    const sourceIndex = eiken3ListeningQuestions.findIndex(source => source.id === item.id);
    return { ...getQuestionById(`listening-${item.id}`, seed)!, section: listeningSection(sourceIndex) };
  });
  return [...basics, ...passages, ...listening];
};

const read = <T,>(key: string): T[] => { if (typeof localStorage === 'undefined') return []; try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter(item => item && typeof item === 'object' && typeof item.id === 'string' && typeof item.date === 'string' && Number.isInteger(item.reading) && item.reading >= 0 && item.reading <= (item.readingTotal === 30 ? 30 : 35) && Number.isInteger(item.listening) && item.listening >= 0 && item.listening <= 30) : []; } catch { return []; } };
const save = <T,>(key: string, values: T[]) => safeSetLearningItem(key, JSON.stringify(values));
export const loadFullMockResults = () => read<FullMockResult>(FULL_RESULTS_KEY).map(item => ({ ...item, readingTotal: item.readingTotal === 30 ? 30 as const : 35 as const }));
export const saveFullMockResult = (result: FullMockResult) => save(FULL_RESULTS_KEY, [...loadFullMockResults(), result].slice(-12));
export const loadPastPaperResults = () => read<PastPaperResult>(PAST_RESULTS_KEY);
export const savePastPaperResult = (result: PastPaperResult) => save(PAST_RESULTS_KEY, [...loadPastPaperResults(), result].slice(-20));
export const deletePastPaperResult = (id: string) => save(PAST_RESULTS_KEY, loadPastPaperResults().filter(item => item.id !== id));

export const getLegacyFullMock = (seed = localDateKey()): PrepQuestion[] => {
  const basics = [
    ...pick(eiken3Words, `${seed}-word`, 15).map(word => getQuestionById(`word-${word.id}`, seed)),
    ...pick(eiken3CoreExamQuestions, `${seed}-exam`, 5).map(item => getQuestionById(`exam-${item.id}`, seed)),
    ...pick(eiken3CoreSentences, `${seed}-sentence`, 5).map(item => getQuestionById(`sentence-${item.id}`, seed)),
  ].filter((item): item is DailyQuestion => Boolean(item)).map((item, index) => ({ ...item, section: index < 15 ? 'リーディング1 語彙・文法' : index < 20 ? 'リーディング2 会話文' : 'リーディング3 語句整序' }));
  const passages = pick(eiken3Readings, `${seed}-reading`, 5).flatMap(reading => reading.questions.map((question, index) => ({
    id: `full-reading-${reading.id}-${index}`, prompt: question.question, detail: reading.title, answer: question.answer,
    choices: pick(question.choices, `${seed}-${reading.id}-${index}`, question.choices.length), explanation: question.explanation,
    kind: '長文', section: 'リーディング4 長文読解', passage: reading.passage, evidence: question.evidence,
  })));
  const selectedListening = getListeningSectionRanges().flatMap((range, section) => pick(eiken3ListeningQuestions.slice(range.from, range.to), `${seed}-listening-${section}`, 10));
  const listening = selectedListening.map(item => {
    const sourceIndex = eiken3ListeningQuestions.findIndex(source => source.id === item.id);
    return { ...getQuestionById(`listening-${item.id}`, seed)!, section: listeningSection(sourceIndex) };
  });
  return [...basics, ...passages, ...listening];
};
