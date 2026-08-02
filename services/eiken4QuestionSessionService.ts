const RECENT_QUESTION_KEY = 'eiken4RecentQuestionIdsV1';

export const getRecentQuestionIds = (): string[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_QUESTION_KEY) || '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
};

/** 直近の練習セッションを覚え、問題数に余裕があるとき同じ問題を避ける。 */
export const rememberQuestionSession = (ids: string[]) => {
  if (typeof localStorage === 'undefined' || !ids.length) return;
  const previous = getRecentQuestionIds();
  localStorage.setItem(RECENT_QUESTION_KEY, JSON.stringify(Array.from(new Set([...previous, ...ids])).slice(-120)));
};
