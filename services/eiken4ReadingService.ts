import { eiken4Readings } from '../data/eiken4Readings';
import { localDateKey } from './eiken4DailyService';
import { recordEiken4Activity } from './eiken4ProgressService';
import { classifyReadingSkill, topReadingSkill } from './eiken4ReadingSkillService';
import { safeSetLearningItem } from './storageHealthService';

const KEY = 'eiken4DailyReadingV1';
const HISTORY_KEY = 'eiken4ReadingCoverageV1';
const WEAK_KEY = 'eiken4ReadingWeakV1';
export type ReadingProgress = { date: string; readingId: string; answers: string[]; completedAt?: string };

export const getTodayReading = () => {
  if (typeof localStorage !== 'undefined') {
    try {
      const current = JSON.parse(localStorage.getItem(KEY) || 'null') as ReadingProgress | null;
      const savedReading = current?.date === localDateKey() ? eiken4Readings.find(reading => reading.id === current.readingId) : undefined;
      if (savedReading) return savedReading;
    } catch { /* choose from coverage */ }
  }
  let history: string[] = [];
  if (typeof localStorage !== 'undefined') try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { /* start fresh */ }
  const counts = history.reduce((result, id) => { result[id] = (result[id] || 0) + 1; return result; }, {} as Record<string, number>);
  let weak: Record<string, number> = {};
  if (typeof localStorage !== 'undefined') try { weak = JSON.parse(localStorage.getItem(WEAK_KEY) || '{}'); } catch { /* repair below */ }
  const targetSkill=topReadingSkill();
  return eiken4Readings.map((reading, index) => ({ reading, index, count: counts[reading.id] || 0, weak: weak[reading.id] || 0, skill:targetSkill&&reading.questions.some(q=>classifyReadingSkill(q.question)===targetSkill)?3:0 })).sort((a, b) => b.skill-a.skill||b.weak - a.weak || a.count - b.count || a.index - b.index)[0].reading;
};

export const recordReadingAnswer = (readingId: string, correct: boolean) => {
  if (typeof localStorage === 'undefined') return;
  let weak: Record<string, number> = {};
  try { weak = JSON.parse(localStorage.getItem(WEAK_KEY) || '{}'); } catch { /* start fresh */ }
  weak[readingId] = correct ? Math.max(0, (weak[readingId] || 0) - 1) : Math.min(9, (weak[readingId] || 0) + 2);
  localStorage.setItem(WEAK_KEY, JSON.stringify(weak));
};

export const loadReadingProgress = (): ReadingProgress => {
  const reading = getTodayReading();
  if (typeof localStorage === 'undefined') return { date: localDateKey(), readingId: reading.id, answers: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as ReadingProgress | null;
    if (saved?.date === localDateKey() && saved.readingId === reading.id) return saved;
  } catch { /* start fresh */ }
  return { date: localDateKey(), readingId: reading.id, answers: [] };
};

export const saveReadingProgress = (progress: ReadingProgress) => {
  if (typeof localStorage !== 'undefined') safeSetLearningItem(KEY, JSON.stringify(progress));
  if (progress.completedAt) {
    recordEiken4Activity('reading', progress.date);
    if (typeof localStorage !== 'undefined') {
      let history: string[] = [];
      let markers: string[] = [];
      try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { /* repair invalid saved data */ }
      const marker = `${progress.date}:${progress.readingId}`;
      try { markers = JSON.parse(localStorage.getItem(`${HISTORY_KEY}-markers`) || '[]'); } catch { /* repair invalid saved data */ }
      if (!markers.includes(marker)) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([...history, progress.readingId].slice(-180)));
        localStorage.setItem(`${HISTORY_KEY}-markers`, JSON.stringify([...markers, marker].slice(-180)));
      }
    }
  }
};

export const resetTodayReadingProgress = () => {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY);
};
