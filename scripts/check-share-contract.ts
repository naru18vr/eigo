import { createParentDailyReport } from '../services/eiken4ReportService';
import { createSevenDayStudyPlan } from '../services/eiken4StudyPlanService';

const errors: string[] = [];
const plan = createSevenDayStudyPlan('2026-09-25', 'https://naru18vr.github.io/eigo/', new Date(2026, 6, 20, 12));
if (plan.schema !== 'eigo-study-plan' || plan.version !== 1) errors.push('学習計画の形式が不正');
if (plan.tasks.length !== 35) errors.push(`7日分のタスク数が不正: ${plan.tasks.length}`);
if (new Set(plan.tasks.map(task => task.id)).size !== plan.tasks.length) errors.push('学習計画のIDが重複');
if (plan.tasks.some(task => !/^eigo-\d{4}-\d{2}-\d{2}-/.test(task.id))) errors.push('安定したタスクIDではない');
if (plan.tasks.some(task => task.launchUrl.includes('/eigo//#'))) errors.push('起動URLに不要なスラッシュがある');
if (plan.tasks.some(task => task.estimatedMinutes < 1 || task.estimatedMinutes > 60)) errors.push('予定時間が範囲外');
const totals = plan.tasks.reduce((result, task) => ({ ...result, [task.date]: (result[task.date] || 0) + task.estimatedMinutes }), {} as Record<string, number>);
if (Object.entries(totals).some(([, minutes]) => minutes > plan.learner.dailyLimitMinutes)) errors.push('1日の学習時間上限を超過');

const report = createParentDailyReport({
  daily: { date:'2026-07-20', questionIds:['a','b'], answers:[{id:'a',correct:true},{id:'b',correct:false}], retryIds:[], retryAnswers:[], completedAt:'done' },
  reading: { date:'2026-07-20', readingId:'r', answers:['A'], completedAt:'done' },
  grade1: { date:'2026-07-20', answers:Array(10).fill(true), completedAt:'done' },
  readingTotal: 1, readingCorrect: 1, completedSteps: 4, weaknessNames:['文法'], transferCode:'1234', transferLink:'https://example.test/#/transfer?data=secret',
});
['【今日の英検4級】','2026/07/20','4/5ステップ','1/2問','文法','1234','公開場所には貼らない'].forEach(text => {
  if (!report.includes(text)) errors.push(`日報に必要な項目がない: ${text}`);
});

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`共有データチェックOK: 7日分${plan.tasks.length}タスク・保護者日報`);
