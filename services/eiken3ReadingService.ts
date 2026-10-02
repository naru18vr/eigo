import { eiken3Readings } from '../data/eiken3Readings';
import { localDateKey } from './eiken3DailyService';
import { recordEiken3Activity } from './eiken3ProgressService';
import { classifyReadingSkill, topReadingSkill } from './eiken3ReadingSkillService';
import { safeSetLearningItem } from './storageHealthService';

const KEY = 'eiken3DailyReadingV1';
const HISTORY_KEY = 'eiken3ReadingCoverageV1';
const WEAK_KEY = 'eiken3ReadingWeakV1';
export type ReadingProgress = { date: string; readingId: string; answers: string[]; completedAt?: string; missionId?: string };

const missionKey = (missionId?: string) => missionId === 'reading-1' || missionId === 'reading-2' ? `${KEY}-${missionId}` : KEY;
const readStrings = (key: string): string[] => {
  if (typeof localStorage === 'undefined') return [];
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter(item => typeof item === 'string') : []; } catch { return []; }
};
export const getTodayReading = (missionId?: string) => {
  if (typeof localStorage !== 'undefined') {
    try {
      const current = JSON.parse(localStorage.getItem(missionKey(missionId)) || 'null') as ReadingProgress | null;
      const savedReading = current?.date === localDateKey() ? eiken3Readings.find(reading => reading.id === current.readingId) : undefined;
      if (savedReading) return savedReading;
    } catch { /* choose from coverage */ }
  }
  if (missionId === 'reading-1' || missionId === 'reading-2') return eiken3Readings[missionId === 'reading-1' ? 0 : 1];
  const history = readStrings(HISTORY_KEY);
  const counts = history.reduce((result, id) => { result[id] = (result[id] || 0) + 1; return result; }, {} as Record<string, number>);
  let weak: Record<string, number> = {};
  if (typeof localStorage !== 'undefined') try { const value = JSON.parse(localStorage.getItem(WEAK_KEY) || '{}'); weak = value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { /* repair below */ }
  const targetSkill=topReadingSkill();
  return eiken3Readings.map((reading, index) => ({ reading, index, count: counts[reading.id] || 0, weak: weak[reading.id] || 0, skill:targetSkill&&reading.questions.some(q=>classifyReadingSkill(q.question)===targetSkill)?3:0 })).sort((a, b) => b.skill-a.skill||b.weak - a.weak || a.count - b.count || a.index - b.index)[0].reading;
};

export const recordReadingAnswer = (readingId: string, correct: boolean) => {
  if (typeof localStorage === 'undefined') return;
  let weak: Record<string, number> = {};
  try { const value = JSON.parse(localStorage.getItem(WEAK_KEY) || '{}'); weak = value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { /* start fresh */ }
  weak[readingId] = correct ? Math.max(0, (weak[readingId] || 0) - 1) : Math.min(9, (weak[readingId] || 0) + 2);
  localStorage.setItem(WEAK_KEY, JSON.stringify(weak));
};

export const loadReadingProgress = (missionId?: string): ReadingProgress => {
  const reading = getTodayReading(missionId);
  if (typeof localStorage === 'undefined') return { date: localDateKey(), readingId: reading.id, answers: [], ...(missionId ? { missionId } : {}) };
  try {
    const saved = JSON.parse(localStorage.getItem(missionKey(missionId)) || 'null') as ReadingProgress | null;
    if (saved?.date === localDateKey() && saved.readingId === reading.id && Array.isArray(saved.answers) && saved.answers.every(answer => typeof answer === 'string')) return saved;
  } catch { /* start fresh */ }
  return { date: localDateKey(), readingId: reading.id, answers: [], ...(missionId ? { missionId } : {}) };
};

export const saveReadingProgress = (progress: ReadingProgress) => {
  if (typeof localStorage !== 'undefined') safeSetLearningItem(missionKey(progress.missionId), JSON.stringify(progress));
  if (progress.completedAt) {
    recordEiken3Activity('reading', progress.date);
    if (typeof localStorage !== 'undefined') {
      let history: string[] = [];
      let markers: string[] = [];
      history = readStrings(HISTORY_KEY);
      const marker = `${progress.date}:${progress.readingId}${progress.missionId ? `:mission=${progress.missionId}` : ''}`;
      markers = readStrings(`${HISTORY_KEY}-markers`);
      if (!markers.includes(marker)) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([...history, progress.readingId].slice(-180)));
        localStorage.setItem(`${HISTORY_KEY}-markers`, JSON.stringify([...markers, marker].slice(-180)));
      }
    }
  }
};

export const resetTodayReadingProgress = (missionId?: string) => {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(missionKey(missionId));
};
