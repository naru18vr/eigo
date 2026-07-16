const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const read = <T,>(key: string): T | null => {
  if (typeof localStorage === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(key) || 'null') as T | null; } catch { return null; }
};
const completedToday = (key: string) => {
  const value = read<{ date?: string; completedAt?: string }>(key);
  return value?.date === today() && Boolean(value.completedAt);
};

export const WORKSHEET_DONE_KEY = 'eiken4WorksheetDoneV1';
export const getLightweightTodayCourseSteps = () => [
  { title: '中1のおさらい', path: '/eiken4/grade1-review', done: completedToday('grade1DailyReviewV1') },
  { title: '今日の15分', path: '/eiken4/daily', done: completedToday('eiken4DailyProgressV4') },
  { title: 'ミニ長文', path: '/eiken4/reading', done: completedToday('eiken4DailyReadingV1') },
  { title: '英単語＋確認テスト', path: '/eiken4/words', done: typeof localStorage !== 'undefined' && localStorage.getItem('eiken4WordQuizDailyV1') === today() },
  { title: '紙の類似プリント', path: '/eiken4/daily', done: typeof localStorage !== 'undefined' && localStorage.getItem(WORKSHEET_DONE_KEY) === today() },
];
export const getLightweightNextStep = () => getLightweightTodayCourseSteps().find(step => !step.done) || { title: '今日の結果', path: '/eiken4/result', done: true };
