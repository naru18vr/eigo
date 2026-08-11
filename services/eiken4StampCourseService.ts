import { EIKEN4_STAMP_MISSIONS, type Eiken4CourseDuration } from '../data/eiken4StampCourse';
import { safeSetLearningItem } from './storageHealthService';

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
