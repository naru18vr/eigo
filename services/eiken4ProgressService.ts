import { safeSetLearningItem } from './storageHealthService';
const ACTIVITY_KEY = 'eiken4ActivityLogV1';
const EXAM_DATE_KEY = 'eiken4ExamDateV1';

export type ActivityKind = 'daily' | 'reading' | 'mock';
export type ActivityLog = Record<string, Partial<Record<ActivityKind, boolean>>>;

export const getLocalDate = (date = new Date()) => {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const loadActivityLog = (): ActivityLog => {
  if (typeof localStorage === 'undefined') return {};
  try { const value = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; }
};

export const recordEiken4Activity = (kind: ActivityKind, date = getLocalDate()) => {
  if (typeof localStorage === 'undefined') return;
  const log = loadActivityLog(); log[date] = { ...log[date], [kind]: true };
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
};

const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime()) && getLocalDate(new Date(`${value}T00:00:00`)) === value;
export const getExamDate = () => {
  if (typeof localStorage === 'undefined') return '';
  try { const value = localStorage.getItem(EXAM_DATE_KEY) || ''; return validDate(value) ? value : ''; } catch { return ''; }
};
export const saveExamDate = (date: string) => { if (!date || validDate(date)) safeSetLearningItem(EXAM_DATE_KEY, date); };
export const daysUntilExam = (date: string) => {
  if (!validDate(date)) return Infinity;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
};

export const lastSevenDays = () => Array.from({ length: 7 }, (_, index) => {
  const date = new Date(); date.setDate(date.getDate() - (6 - index));
  return getLocalDate(date);
});

export const calculateStreak = (log: ActivityLog) => {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const date = new Date(); date.setDate(date.getDate() - i);
    if (log[getLocalDate(date)]?.daily) streak++; else if (i > 0 || log[getLocalDate(date)]) break;
  }
  return streak;
};
