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

// Tagged attempts complete their own mission. Only untagged legacy results fill other slots.
const completedFromResults = (ids: string[], key: string, currentIds: string[]) => {
  if (typeof localStorage === 'undefined') return [];
  try {
    let value = JSON.parse(localStorage.getItem(key) || '[]');
    if (key === 'eiken4MockHistoryV1' && Array.isArray(value) && !value.length) {
      const previous = JSON.parse(localStorage.getItem('eiken4WeeklyMockResultV1') || 'null');
      if (previous && typeof previous.completedAt === 'string') value = [previous];
    }
    if (!Array.isArray(value)) return [];
    const results = value.filter(item => item && item.courseEligible !== false && typeof item === 'object' && (typeof item.id === 'string' || typeof item.completedAt === 'string'));
    const tagged = results.map(item => item.missionId).filter(id => ids.includes(id));
    const occupied = new Set([...currentIds, ...tagged]);
    const legacy = results.filter(item => !item.missionId).length;
    const alreadyCovered = ids.filter(id => currentIds.includes(id) && !tagged.includes(id)).length;
    return [...tagged, ...ids.filter(id => !occupied.has(id)).slice(0, Math.max(0, legacy - alreadyCovered))];
  } catch { return []; }
};
const completedReadings = (currentIds: string[]) => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const markers = JSON.parse(localStorage.getItem('eiken4ReadingCoverageV1-markers') || '[]');
    if (!Array.isArray(markers)) return [];
    const ids = ['reading-1', 'reading-2'];
    const valid = markers.filter(marker => typeof marker === 'string');
    const tagged = ids.filter(id => valid.some(marker => marker.endsWith(`:mission=${id}`)));
    const occupied = new Set([...currentIds, ...tagged]);
    const legacy = valid.filter(marker => !marker.includes(':mission=')).length;
    const covered = ids.filter(id => currentIds.includes(id) && !tagged.includes(id)).length;
    return [...tagged, ...ids.filter(id => !occupied.has(id)).slice(0, Math.max(0, legacy - covered))];
  } catch { return []; }
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
    ...completedReadings(current.completedMissionIds),
    ...completedFromResults(['mini-mock', 'mini-mock-2'], 'eiken4MockHistoryV1', current.completedMissionIds),
    ...completedFromResults(['full-mock', 'full-mock-2', 'full-mock-3'], 'eiken4FullMockResultsV1', current.completedMissionIds),
    ...completedFromResults(['past-paper', 'past-paper-2', 'past-paper-3'], 'eiken4PastPaperResultsV1', current.completedMissionIds),
  ];
  const completedMissionIds = Array.from(new Set([...current.completedMissionIds, ...derived])).filter(id => validMissionIds.has(id));
  if (completedMissionIds.length !== current.completedMissionIds.length) save({ ...current, completedMissionIds });
  return { ...current, completedMissionIds };
};
