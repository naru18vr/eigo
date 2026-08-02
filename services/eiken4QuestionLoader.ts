/** 大きな教材配列を利用ページでだけ読み込むためのローダー。 */
export const loadGrammarPracticeService = () => import('./eiken4GrammarPracticeService');
export const loadExamService = () => import('./eiken4ExamService');
export const loadListeningQuestions = () => import('../data/eiken4Listening');
export const loadReadingService = () => import('./eiken4ReadingService');

export const getListeningSectionRanges = (total: number) => {
  const size = Math.ceil(total / 3);
  return [
    { title: '第1部 会話の応答', from: 0, to: Math.min(size, total) },
    { title: '第2部 会話の内容', from: Math.min(size, total), to: Math.min(size * 2, total) },
    { title: '第3部 説明文の内容', from: Math.min(size * 2, total), to: total },
  ];
};

export const getListeningSectionTitle = (index: number, total: number) => {
  const ranges = getListeningSectionRanges(total);
  return ranges.find(range => index >= range.from && index < range.to)?.title || ranges.at(-1)?.title || '第3部 説明文の内容';
};
