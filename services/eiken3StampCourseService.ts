import { EIKEN3_STAMP_MISSIONS, type Eiken3CourseDuration } from '../data/eiken3StampCourse';
import { safeSetLearningItem } from './storageHealthService';
import { eiken3LearningSteps, getLearningStepState } from './eiken3StepLearningService';

export const EIKEN3_STAMP_COURSE_KEY = 'eiken3StampCourseV1';

export type Eiken3StampCourseProgress = {
  version: 1;
  duration?: Eiken3CourseDuration;
  startDate?: string;
  completedMissionIds: string[];
  updatedAt?: string;
};

const emptyProgress = (): Eiken3StampCourseProgress => ({ version: 1, completedMissionIds: [] });
const validMissionIds = new Set(EIKEN3_STAMP_MISSIONS.map(mission => mission.id));

export const loadEiken3StampCourse = (): Eiken3StampCourseProgress => {
  if (typeof localStorage === 'undefined') return emptyProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN3_STAMP_COURSE_KEY) || 'null') as Partial<Eiken3StampCourseProgress> | null;
    if (!saved) return emptyProgress();
    const duration = saved.duration === 7 || saved.duration === 14 || saved.duration === 21 ? saved.duration : undefined;
    return {
      version: 1,
      ...(duration ? { duration } : {}),
      ...(typeof saved.startDate === 'string' ? { startDate: saved.startDate } : {}),
      completedMissionIds: Array.isArray(saved.completedMissionIds) ? Array.from(new Set(saved.completedMissionIds.filter(id => validMissionIds.has(id)))) : [],
      ...(typeof saved.updatedAt === 'string' ? { updatedAt: saved.updatedAt } : {}),
    };
  } catch {
    return emptyProgress();
  }
};

const save = (progress: Eiken3StampCourseProgress) => {
  safeSetLearningItem(EIKEN3_STAMP_COURSE_KEY, JSON.stringify({ ...progress, version: 1, updatedAt: new Date().toISOString() }));
};

export const selectEiken3StampCourse = (duration: Eiken3CourseDuration, startDate: string) => {
  const current = loadEiken3StampCourse();
  save({ ...current, duration, startDate });
};

export const setEiken3StampCourseStartDate = (startDate: string) => {
  const current = loadEiken3StampCourse();
  save({ ...current, startDate });
};

export const setEiken3MissionCompleted = (missionId: string, completed: boolean) => {
  if (!validMissionIds.has(missionId)) return;
  const current = loadEiken3StampCourse();
  const ids = new Set(current.completedMissionIds);
  if (completed) ids.add(missionId); else ids.delete(missionId);
  save({ ...current, completedMissionIds: Array.from(ids) });
};

export const completeEiken3MissionForPath = (missionId: string | null, expectedPath: string) => {
  if (!missionId || EIKEN3_STAMP_MISSIONS.find(mission => mission.id === missionId)?.path !== expectedPath) return false;
  setEiken3MissionCompleted(missionId, true);
  return true;
};

const completedByCount = (ids: string[], count: number) => ids.slice(0, Math.max(0, count));
const savedArrayLength = (key: string) => {
  if (typeof localStorage === 'undefined') return 0;
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.length : 0; } catch { return 0; }
};
const savedMockCount = () => {
  const historyCount = savedArrayLength('eiken3MockHistoryV1');
  if (historyCount || typeof localStorage === 'undefined') return historyCount;
  try { return localStorage.getItem('eiken3WeeklyMockResultV1') ? 1 : 0; } catch { return 0; }
};
const savedObjectHasCompletedAt = (key: string) => {
  if (typeof localStorage === 'undefined') return false;
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null') as { completedAt?: unknown } | null;
    return typeof value?.completedAt === 'string';
  } catch { return false; }
};
const hasSavedValue = (key: string) => {
  if (typeof localStorage === 'undefined') return false;
  try { return localStorage.getItem(key) !== null; } catch { return false; }
};

// 既存の学習履歴もスタンプへ取り込み、以前に終えた学習をやり直させない。
export const syncEiken3StampCourseFromLearning = () => {
  const current = loadEiken3StampCourse();
  const derived = [
    ...eiken3LearningSteps.filter(step => getLearningStepState(step) === 'できた！').map(step => step.id),
    ...(hasSavedValue('eiken3WordCardsDailyV1') ? ['word-cards'] : []),
    ...(hasSavedValue('eiken3WordQuizDailyV1') ? ['word-quiz'] : []),
    ...(savedObjectHasCompletedAt('eiken3MixedReviewV1') ? ['mixed-review'] : []),
    ...(savedObjectHasCompletedAt('eiken3DailyProgressV4') ? ['daily-review'] : []),
    ...(savedObjectHasCompletedAt('eiken3ExamPracticeV1') ? ['exam-practice'] : []),
    ...completedByCount(['reading-1', 'reading-2'], savedArrayLength('eiken3ReadingCoverageV1-markers')),
    ...completedByCount(['mini-mock', 'mini-mock-2'], savedMockCount()),
    ...completedByCount(['full-mock', 'full-mock-2', 'full-mock-3'], savedArrayLength('eiken3FullMockResultsV1')),
    ...completedByCount(['past-paper', 'past-paper-2', 'past-paper-3'], savedArrayLength('eiken3PastPaperResultsV1')),
  ];
  const completedMissionIds = Array.from(new Set([...current.completedMissionIds, ...derived])).filter(id => validMissionIds.has(id));
  if (completedMissionIds.length !== current.completedMissionIds.length) save({ ...current, completedMissionIds });
  return { ...current, completedMissionIds };
};
