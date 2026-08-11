import { buildEiken4CourseDays, EIKEN4_COURSE_DURATIONS, EIKEN4_STAMP_MISSIONS } from '../data/eiken4StampCourse';

const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
assert(EIKEN4_COURSE_DURATIONS.map(item => item.days).join(',') === '7,14,21', '1・2・3週間コースが必要です');
assert(EIKEN4_STAMP_MISSIONS.length === 21, `スタンプは21個必要です: ${EIKEN4_STAMP_MISSIONS.length}`);
assert(new Set(EIKEN4_STAMP_MISSIONS.map(item => item.id)).size === 21, 'ミッションIDが重複しています');
for (const duration of [7, 14, 21] as const) {
  const days = buildEiken4CourseDays(duration);
  const flattened = days.flat();
  assert(days.length === duration, `${duration}日分になっていません`);
  assert(flattened.length === 21, `${duration}日コースでミッションが欠けています`);
  assert(new Set(flattened.map(item => item.id)).size === 21, `${duration}日コースで重複があります`);
  assert(days.every(day => day.length > 0), `${duration}日コースに空の日があります`);
}
console.log('英検4級スタンプラリー検査: 1・2・3週間、21ミッション、重複なし');
