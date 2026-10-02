import { safeSetLearningItem } from './storageHealthService';
const KEY = 'eiken3FullMockAttemptV1';
export type FullMockAttempt = { savedAt: string; index: number; answers: Record<string,string>; remaining: number; stage: 'reading'|'writing'|'listening'; plays: Record<string,number>; missionId?: string; seed?: string; formatVersion?: 2; writingAnswers?: Record<string,string>; elapsedSeconds?: number };
const stringMap = (value: unknown): value is Record<string,string> => Boolean(value) && typeof value === 'object' && !Array.isArray(value) && Object.values(value).every(item => typeof item === 'string');
export const loadFullMockAttempt = (missionId?: string): FullMockAttempt | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!value || value.missionId !== missionId || !Number.isInteger(value.index) || !stringMap(value.answers) || !['reading','writing','listening'].includes(value.stage) || !Number.isFinite(value.remaining) || value.remaining < 0 || value.remaining > 65 * 60) return null;
    const readingCount = value.formatVersion === 2 ? 30 : 35;
    if (value.index < 0 || value.index >= readingCount + 30 || (value.stage === 'reading' && value.index >= readingCount) || (value.stage === 'listening' && value.index < readingCount) || (value.stage === 'writing' && value.formatVersion !== 2)) return null;
    return { ...value, plays: value.plays && typeof value.plays === 'object' && !Array.isArray(value.plays) ? value.plays : {}, writingAnswers: stringMap(value.writingAnswers) ? value.writingAnswers : {}, ...(typeof value.seed === 'string' ? { seed: value.seed } : { seed: missionId }) };
  } catch { return null; }
};
export const saveFullMockAttempt = (attempt: Omit<FullMockAttempt,'savedAt'>) => safeSetLearningItem(KEY, JSON.stringify({ ...attempt, savedAt: new Date().toISOString() }));
export const clearFullMockAttempt = () => { if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY); };
