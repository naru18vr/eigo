export const listeningCauseOptions = [
  '単語を知らなかった',
  '音がつながって聞こえた',
  '疑問詞を聞き逃した',
  '選択肢を読むのが遅かった',
] as const;
export type ListeningCause = typeof listeningCauseOptions[number];
const KEY = 'eiken4ListeningCausesV1';
export type ListeningCauseRecord = { questionId: string; cause: ListeningCause; date: string };

export const loadListeningCauses = (): ListeningCauseRecord[] => {
  if (typeof localStorage === 'undefined') return [];
  try { const value = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value : []; } catch { return []; }
};
export const recordListeningCause = (questionId: string, cause: ListeningCause) => {
  if (typeof localStorage === 'undefined') return;
  const records = [...loadListeningCauses(), { questionId, cause, date: new Date().toISOString() }].slice(-120);
  localStorage.setItem(KEY, JSON.stringify(records));
};
export const getTopListeningCause = () => {
  const counts = loadListeningCauses().reduce((result, item) => ({ ...result, [item.cause]: (result[item.cause] || 0) + 1 }), {} as Record<string, number>);
  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0]?.[0] || '';
};
