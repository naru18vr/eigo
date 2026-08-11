import { readFileSync } from 'node:fs';
import { buildEiken4CourseDays, EIKEN4_COURSE_DURATIONS, EIKEN4_STAMP_MISSIONS, getEiken4CourseMinuteRange } from '../data/eiken4StampCourse';
import { completeEiken4MissionForPath, loadEiken4StampCourse, selectEiken4StampCourse, setEiken4MissionCompleted } from '../services/eiken4StampCourseService';

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
assert(EIKEN4_COURSE_DURATIONS.map(item => item.days).join(',') === '7,14,21', '1・2・3週間コースが必要です');
assert(EIKEN4_STAMP_MISSIONS.length === 27, `スタンプは27個必要です: ${EIKEN4_STAMP_MISSIONS.length}`);
assert(new Set(EIKEN4_STAMP_MISSIONS.map(item => item.id)).size === 27, 'ミッションIDが重複しています');
assert(EIKEN4_STAMP_MISSIONS.filter(item => item.path === '/eiken4/full-mock').length === 3, 'フル模試は3回必要です');
assert(EIKEN4_STAMP_MISSIONS.filter(item => item.path === '/eiken4/past-papers').length === 3, '公式過去問は3回必要です');
for (const duration of [7, 14, 21] as const) {
  const days = buildEiken4CourseDays(duration);
  const flattened = days.flat();
  assert(days.length === duration, `${duration}日分になっていません`);
  assert(flattened.length === 27, `${duration}日コースでミッションが欠けています`);
  assert(new Set(flattened.map(item => item.id)).size === 27, `${duration}日コースで重複があります`);
  assert(days.every(day => day.length > 0), `${duration}日コースに空の日があります`);
  const range = getEiken4CourseMinuteRange(duration);
  assert(range.total === 800, `${duration}日コースの合計時間が一致しません`);
  assert(range.min === Math.min(...days.map(day => day.reduce((sum, mission) => sum + mission.estimatedMinutes, 0))), `${duration}日コースの最短時間が不正です`);
  assert(range.max === Math.max(...days.map(day => day.reduce((sum, mission) => sum + mission.estimatedMinutes, 0))), `${duration}日コースの最長時間が不正です`);
}

const memory = new Map<string, string>();
(globalThis as typeof globalThis & { localStorage: Storage }).localStorage = {
  get length() { return memory.size; }, clear: () => memory.clear(), getItem: key => memory.get(key) ?? null,
  key: index => Array.from(memory.keys())[index] ?? null, removeItem: key => { memory.delete(key); }, setItem: (key, value) => { memory.set(key, value); },
};
selectEiken4StampCourse(7, '2026-08-20');
setEiken4MissionCompleted('step-1', true);
selectEiken4StampCourse(14, '2026-08-21');
const switched = loadEiken4StampCourse();
assert(switched.duration === 14 && switched.startDate === '2026-08-21', '期間・開始日の変更を保存できません');
assert(switched.completedMissionIds.includes('step-1'), '期間変更で既存スタンプが消えました');
setEiken4MissionCompleted('unknown', true);
assert(!loadEiken4StampCourse().completedMissionIds.includes('unknown'), '不正なミッションIDを保存しています');
assert(!completeEiken4MissionForPath('step-2', '/eiken4/full-mock'), '別画面のミッションを誤って完了できます');
assert(completeEiken4MissionForPath('full-mock', '/eiken4/full-mock'), '正しい画面の完了を保存できません');

const pageSource = readFileSync('pages/Eiken4StampCoursePage.tsx', 'utf8');
assert(!pageSource.includes('スタンプを押す'), '未完了でも押せる手動スタンプが残っています');
assert(pageSource.includes('完了で自動スタンプ'), '自動スタンプの案内がありません');
console.log('英検4級スタンプラリー検査: 期間変更互換・27ミッション・自動スタンプ・模試/過去問3回');
