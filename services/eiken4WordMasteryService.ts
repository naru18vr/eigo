const KEY = 'eiken4WordMasteryV1';
const IMPORT_KEY = 'eiken4WordMasteryImportedDaysV1';
import type { DailyProgress } from './eiken4DailyService';
export type WordMastery = { correct: number; wrong: number; streak: number; lastSeen: string };
export type WordMasteryMap = Record<string, WordMastery>;
export const loadWordMastery = (): WordMasteryMap => { if (typeof localStorage === 'undefined') return {}; try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
export const recordWordMastery = (rawId: string, correct: boolean) => { if (typeof localStorage === 'undefined') return; const id = rawId.replace(/^word-/, ''); const map = loadWordMastery(); const current = map[id] || { correct: 0, wrong: 0, streak: 0, lastSeen: '' }; map[id] = { correct: current.correct + (correct ? 1 : 0), wrong: current.wrong + (correct ? 0 : 1), streak: correct ? current.streak + 1 : 0, lastSeen: new Date().toISOString() }; localStorage.setItem(KEY, JSON.stringify(map)); };
export const masteryLevel = (mastery?: WordMastery) => !mastery ? 'new' : mastery.streak >= 2 ? 'mastered' : 'learning';
export const importDailyWordAnswers = (progress: DailyProgress) => {
  if (typeof localStorage === 'undefined') return;
  const imported = JSON.parse(localStorage.getItem(IMPORT_KEY) || '[]') as string[];
  if (imported.includes(progress.date)) return;
  progress.answers.filter(answer => answer.id.startsWith('word-')).forEach(answer => recordWordMastery(answer.id, answer.correct));
  localStorage.setItem(IMPORT_KEY, JSON.stringify([...imported, progress.date].slice(-60)));
};
