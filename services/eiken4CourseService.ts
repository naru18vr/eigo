import { loadGrade1Review } from './grade1ReviewService';
import { loadDailyProgress, localDateKey } from './eiken4DailyService';
import { loadReadingProgress } from './eiken4ReadingService';
import { isWordQuizDoneToday } from './eiken4WordMasteryService';

const WORKSHEET_DONE_KEY = 'eiken4WorksheetDoneV1';

export const isWorksheetDoneToday = () => typeof localStorage !== 'undefined' && localStorage.getItem(WORKSHEET_DONE_KEY) === localDateKey();
export const recordWorksheetDone = () => { if (typeof localStorage !== 'undefined') localStorage.setItem(WORKSHEET_DONE_KEY, localDateKey()); };
export const resetTodayWorksheetDone = () => { if (typeof localStorage !== 'undefined') localStorage.removeItem(WORKSHEET_DONE_KEY); };

export const getTodayCourseSteps = () => [
  { title: '中1のおさらい', path: '/eiken4/grade1-review', done: Boolean(loadGrade1Review().completedAt) },
  { title: '今日の15分', path: '/eiken4/daily', done: Boolean(loadDailyProgress().completedAt) },
  { title: 'ミニ長文', path: '/eiken4/reading', done: Boolean(loadReadingProgress().completedAt) },
  { title: '英単語＋確認テスト', path: '/eiken4/words', done: isWordQuizDoneToday() },
  { title: '紙の類似プリント', path: '/eiken4/daily', done: isWorksheetDoneToday() },
];

export const getNextTodayCourseStep = () => getTodayCourseSteps().find(step => !step.done) || { title: '今日の結果', path: '/eiken4/result', done: true };
