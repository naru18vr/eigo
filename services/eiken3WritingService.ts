import { eiken3WritingTasks } from '../data/eiken3Writing';
import { safeSetLearningItem } from './storageHealthService';

export const EIKEN3_WRITING_KEY = 'eiken3WritingProgressV1';
export type Eiken3WritingProgress = { version: 1; completedTaskIds: string[]; drafts: Record<string, string>; updatedAt?: string };

const empty = (): Eiken3WritingProgress => ({ version: 1, completedTaskIds: [], drafts: {} });

export const loadWritingProgress = (): Eiken3WritingProgress => {
  if (typeof localStorage === 'undefined') return empty();
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN3_WRITING_KEY) || 'null') as Partial<Eiken3WritingProgress> | null;
    const validIds = new Set(eiken3WritingTasks.map(task => task.id));
    return {
      version: 1,
      completedTaskIds: Array.from(new Set((saved?.completedTaskIds || []).filter(id => validIds.has(id)))),
      drafts: saved?.drafts && typeof saved.drafts === 'object' ? saved.drafts as Record<string, string> : {},
      ...(saved?.updatedAt ? { updatedAt: saved.updatedAt } : {}),
    };
  } catch {
    return empty();
  }
};

const save = (progress: Eiken3WritingProgress) => safeSetLearningItem(EIKEN3_WRITING_KEY, JSON.stringify({ ...progress, version: 1, updatedAt: new Date().toISOString() }));

export const saveWritingDraft = (taskId: string, draft: string) => {
  const current = loadWritingProgress();
  save({ ...current, drafts: { ...current.drafts, [taskId]: draft } });
};

export const completeWritingTask = (taskId: string) => {
  if (!eiken3WritingTasks.some(task => task.id === taskId)) return;
  const current = loadWritingProgress();
  save({ ...current, completedTaskIds: Array.from(new Set([...current.completedTaskIds, taskId])) });
};
