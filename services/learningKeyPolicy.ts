// データ引き継ぎと保存状態確認で共通利用する、軽量なキー判定だけを置きます。
const PREFIXES = [
  'eiken4',
  'grade1',
  'grade2',
  'grade3',
  'setAttemptCount',
  'setStats',
  'sentenceMistakeCount',
];
const EXACT_KEYS = new Set(['dailyLog', 'sentenceLearningProfileV1']);

export const isTransferableLearningKey = (key: string) => EXACT_KEYS.has(key) || PREFIXES.some(prefix => key.startsWith(prefix));
