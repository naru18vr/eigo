import { getExamDate, daysUntilExam } from '../services/eiken3ProgressService';
import { getTodayReading, loadReadingProgress, saveReadingProgress } from '../services/eiken3ReadingService';
import assert from 'node:assert/strict';
import { getFullMock, getLegacyFullMock, loadFullMockResults, loadPastPaperResults } from '../services/eiken3ExamPrepService';
import { getFullMock as getFullMock4 } from '../services/eiken4ExamPrepService';
import { syncEiken3StampCourseFromLearning, loadEiken3StampCourse, selectEiken3StampCourse } from '../services/eiken3StampCourseService';
import { syncEiken4StampCourseFromLearning } from '../services/eiken4StampCourseService';
import { saveFullMockAttempt, loadFullMockAttempt } from '../services/eiken3FullMockAttemptService';
import { loadWritingProgress } from '../services/eiken3WritingService';
import { eiken3WritingTasks } from '../data/eiken3Writing';

const memory = new Map<string,string>();
Object.defineProperty(globalThis, 'localStorage', { value: {
  get length() { return memory.size; }, getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => memory.set(key,value), removeItem: (key: string) => memory.delete(key),
  key: (index: number) => [...memory.keys()][index] ?? null,
}, configurable: true });
for (const seed of ['full-mock','full-mock-2','full-mock-3']) {
  const questions = getFullMock(seed);
  assert.equal(questions.length, 60);
  assert.equal(new Set(questions.map(q=>q.id)).size,60);
  assert.equal(questions.filter(q=>q.section === 'リーディング1 語彙・文法').length,15);
  assert.equal(questions.filter(q=>q.section === 'リーディング2 会話文').length,5);
  assert.equal(questions.filter(q=>q.passage).length,10);
  assert.equal(questions.filter(q=>q.audioText).length,30);
  assert(questions.every(q=>q.choices.includes(q.answer)));
}
assert.equal(getLegacyFullMock('2026-08-15').length,65);
for (const getter of [getFullMock,getFullMock4]) {
  const a = getter('full-mock').map(q=>q.id).sort();
  const b = getter('full-mock-2').map(q=>q.id).sort();
  assert.notDeepEqual(a,b,'Repeated mocks must vary actual questions, not just their order');
}
for (const grade of [3,4]) {
  const sync = grade === 3 ? syncEiken3StampCourseFromLearning : syncEiken4StampCourseFromLearning;
  for (const [key,id] of [['FullMockResultsV1','full-mock-2'],['MockHistoryV1','mini-mock-2'],['PastPaperResultsV1','past-paper-3']]) {
    memory.clear();
    memory.set(`eiken${grade}${key}`,JSON.stringify([{id:'2026-08-15T00:00:00Z', completedAt:'2026-08-15T00:00:00Z', missionId:id}]));
    assert.deepEqual(sync().completedMissionIds,[id], 'Out of order completion must not complete mission 1 too');
    assert.deepEqual(sync().completedMissionIds,[id], 'Repeated sync must be idempotent');
  }
}
memory.clear();
memory.set('eiken3FullMockResultsV1',JSON.stringify([{id:'1',missionId:'full-mock-2',courseEligible:false}]));
assert.deepEqual(syncEiken3StampCourseFromLearning().completedMissionIds,[]);
selectEiken3StampCourse(7,'2026-08-20');
memory.set('eiken3FullMockResultsV1',JSON.stringify([{id:'1'}]));
assert(syncEiken3StampCourseFromLearning().completedMissionIds.includes('full-mock'));
selectEiken3StampCourse(21,'2026-08-21');
assert(loadEiken3StampCourse().completedMissionIds.includes('full-mock'));
for (const corrupt of ['null','{}','"oops"','[null,3]','{broken']) {
  memory.set('eiken3FullMockResultsV1',corrupt); memory.set('eiken3PastPaperResultsV1',corrupt);
  assert.deepEqual(loadFullMockResults(),[]); assert.deepEqual(loadPastPaperResults(),[]);
}
memory.set('eiken3WritingProgressV1',JSON.stringify({drafts:{'email-01':8,'email-02':'hello',unknown:'bad'},completedTaskIds:['email-01']}));
assert.deepEqual(loadWritingProgress().drafts,{'email-02':'hello'});
saveFullMockAttempt({index:29,remaining:0,stage:'writing',answers:{},plays:{},formatVersion:2,seed:'pinned',writingAnswers:{'email-01':'test'},missionId:'full-mock-2'});
assert.equal(loadFullMockAttempt('full-mock-2')?.seed,'pinned');
assert.equal(loadFullMockAttempt('full-mock-2')?.remaining,0);
assert.equal(loadFullMockAttempt('full-mock'),null);
memory.set('eiken3FullMockAttemptV1',JSON.stringify({index:999,stage:'reading',remaining:20,answers:{}}));
assert.equal(loadFullMockAttempt(),null);
for (const task of eiken3WritingTasks) {
  const words = task.modelAnswer.split(/\s+/).length;
  assert(words >= (task.kind === 'email' ? 15 : 25) && words <= (task.kind === 'email' ? 25 : 35),`${task.id}: model answer word range`);
}
memory.clear();
assert.notEqual(getTodayReading('reading-1').id, getTodayReading('reading-2').id);
const second = loadReadingProgress('reading-2');
saveReadingProgress({ ...second, answers: ['a','b'], completedAt: new Date().toISOString() });
assert.deepEqual(syncEiken3StampCourseFromLearning().completedMissionIds,['reading-2']);
assert.equal(loadReadingProgress('reading-1').answers.length,0);
assert.equal(loadReadingProgress('reading-2').answers.length,2);
for (const invalid of ['null','{}','123','"bad"']) {
  memory.set('eiken3ReadingCoverageV1',invalid); memory.set('eiken3ReadingWeakV1',invalid);
  assert(getTodayReading().id);
}
memory.clear();
memory.set('eiken3WeeklyMockResultV1',JSON.stringify({completedAt:'2026-08-01T00:00:00Z'}));
assert(syncEiken3StampCourseFromLearning().completedMissionIds.includes('mini-mock'));
memory.clear();
assert.equal(getExamDate(),'');
assert.equal(daysUntilExam(''),Infinity);
console.log('レビュー回帰検査OK: 3級形式・旧形式再開・模試問題差分・逆順スタンプ・期間変更・壊れた保存・英作文語数');
