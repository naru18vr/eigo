import { EIKEN4_STAMP_MISSIONS, type Eiken4CourseDuration } from '../data/eiken4StampCourse';
import { safeSetLearningItem } from './storageHealthService';
import { eiken4LearningSteps, getLearningStepState } from './eiken4StepLearningService';

export const EIKEN4_STAMP_COURSE_KEY = 'eiken4StampCourseV1';

export type Eiken4StampCourseProgress = {
  version: 1;
  duration?: Eiken4CourseDuration;
  startDate?: string;
  completedMissionIds: string[];
  updatedAt?: string;
};

const emptyProgress = (): Eiken4StampCourseProgress => ({ version: 1, completedMissionIds: [] });
const validMissionIds = new Set(EIKEN4_STAMP_MISSIONS.map(mission => mission.id));

export const loadEiken4StampCourse = (): Eiken4StampCourseProgress => {
  if (typeof localStorage === 'undefined') return emptyProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_STAMP_COURSE_KEY) || 'null') as Partial<Eiken4StampCourseProgress> | null;
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

const save = (progress: Eiken4StampCourseProgress) => {
  safeSetLearningItem(EIKEN4_STAMP_COURSE_KEY, JSON.stringify({ ...progress, version: 1, updatedAt: new Date().toISOString() }));
};

export const selectEiken4StampCourse = (duration: Eiken4CourseDuration, startDate: string) => {
  const current = loadEiken4StampCourse();
  save({ ...current, duration, startDate });
};

export const setEiken4StampCourseStartDate = (startDate: string) => {
  const current = loadEiken4StampCourse();
  save({ ...current, startDate });
};

export const setEiken4MissionCompleted = (missionId: string, completed: boolean) => {
  if (!validMissionIds.has(missionId)) return;
  const current = loadEiken4StampCourse();
  const ids = new Set(current.completedMissionIds);
  if (completed) ids.add(missionId); else ids.delete(missionId);
  save({ ...current, completedMissionIds: Array.from(ids) });
};

export const completeEiken4MissionForPath = (missionId: string | null, expectedPath: string) => {
  if (!missionId || EIKEN4_STAMP_MISSIONS.find(mission => mission.id === missionId)?.path !== expectedPath) return false;
  setEiken4MissionCompleted(missionId, true);
  return true;
};

const completedByCount = (ids: string[], count: number) => ids.slice(0, Math.max(0, count));
const savedArrayLength = (key: string) => {
  if (typeof localStorage === 'undefined') return 0;
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.length : 0; } catch { return 0; }
};
const savedMockCount = () => {
  const historyCount = savedArrayLength('eiken4MockHistoryV1');
  if (historyCount || typeof localStorage === 'undefined') return historyCount;
  try { return localStorage.getItem('eiken4WeeklyMockResultV1') ? 1 : 0; } catch { return 0; }
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
export const syncEiken4StampCourseFromLearning = () => {
  const current = loadEiken4StampCourse();
  const derived = [
    ...eiken4LearningSteps.filter(step => getLearningStepState(step) === 'できた！').map(step => step.id),
    ...(hasSavedValue('eiken4WordCardsDailyV1') ? ['word-cards'] : []),
    ...(hasSavedValue('eiken4WordQuizDailyV1') ? ['word-quiz'] : []),
    ...(savedObjectHasCompletedAt('eiken4MixedReviewV1') ? ['mixed-review'] : []),
    ...(savedObjectHasCompletedAt('eiken4DailyProgressV4') ? ['daily-review'] : []),
    ...(savedObjectHasCompletedAt('eiken4ExamPracticeV1') ? ['exam-practice'] : []),
    ...completedByCount(['reading-1', 'reading-2'], savedArrayLength('eiken4ReadingCoverageV1-markers')),
    ...completedByCount(['mini-mock', 'mini-mock-2'], savedMockCount()),
    ...completedByCount(['full-mock', 'full-mock-2', 'full-mock-3'], savedArrayLength('eiken4FullMockResultsV1')),
    ...completedByCount(['past-paper', 'past-paper-2', 'past-paper-3'], savedArrayLength('eiken4PastPaperResultsV1')),
  ];
  const completedMissionIds = Array.from(new Set([...current.completedMissionIds, ...derived])).filter(id => validMissionIds.has(id));
  if (completedMissionIds.length !== current.completedMissionIds.length) save({ ...current, completedMissionIds });
  return { ...current, completedMissionIds };
};
