import { daysUntilExam } from './eiken4ProgressService';
import { localDateKey } from './eiken4DailyService';

export type StudyPhase = { id: 'foundation'|'retention'|'practice'|'final'; title: string; period: string; focus: string; daily: string[] };
export const getStudyPhases = (examDate: string): { current: StudyPhase; phases: StudyPhase[]; remaining: number } => {
  const remaining = daysUntilExam(examDate);
  const phases: StudyPhase[] = [
    { id:'foundation', title:'基礎期間', period:'試験71日以上前', focus:'中1英語と基本単語を穴なくする', daily:['中1おさらい','今日の15分','英単語8語'] },
    { id:'retention', title:'定着期間', period:'試験36〜70日前', focus:'忘れかけた問題を繰り返して定着', daily:['今日の15分','ミニ長文','原因別リスニング'] },
    { id:'practice', title:'実戦期間', period:'試験15〜35日前', focus:'時間を意識して本番形式に慣れる', daily:['今日のコース','10分ミニ模試','週1リスニング特訓'] },
    { id:'final', title:'直前期間', period:'試験14日前から', focus:'新しい範囲を増やさず弱点を仕上げる', daily:['弱点特訓','模試の誤答','フル模試は体調のよい日'] },
  ];
  const current = remaining > 70 ? phases[0] : remaining > 35 ? phases[1] : remaining > 14 ? phases[2] : phases[3];
  return { current, phases, remaining };
};

export type SharedStudyTask = {
  id: string;
  source: 'eiken4-app';
  date: string;
  type: 'grade1_review'|'daily_15min'|'mini_reading'|'vocabulary_quiz'|'worksheet'|'mini_mock';
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: 'required'|'high';
  status: 'pending';
  launchUrl: string;
  tags: string[];
};

export type SharedStudyPlan = {
  schema: 'eigo-study-plan';
  version: 1;
  generatedAt: string;
  exam: { name: '英検4級'; date: string; goal: '合格' };
  learner: { schoolGrade: 8; reviewLevel: '中1英語から復習'; dailyLimitMinutes: 60 };
  tasks: SharedStudyTask[];
};

const addLocalDays = (start: Date, amount: number) => {
  const date = new Date(start);
  date.setDate(date.getDate() + amount);
  return date;
};

export const createSevenDayStudyPlan = (examDate: string, baseUrl: string, start = new Date()): SharedStudyPlan => {
  const cleanBase = baseUrl.split('#')[0].replace(/\/$/, '');
  const definitions = [
    ['grade1_review', '中1英語の復習', '中1の単語5語と文法5問を復習する', 10, '/#/eiken4/grade1-review'],
    ['daily_15min', '今日の15分', '英検4級の単語・文法・リスニングに取り組む', 15, '/#/eiken4/daily'],
    ['mini_reading', 'ミニ長文', '短い英文を読み、根拠を探して答える', 10, '/#/eiken4/reading'],
    ['vocabulary_quiz', '英単語＋確認テスト', '単語カードで確認してから10問テストを行う', 15, '/#/eiken4/words'],
    ['worksheet', '類題プリント', '今日の間違いに近い問題を紙で復習する', 10, '/#/eiken4/daily'],
  ] as const;
  const tasks: SharedStudyTask[] = [];
  for (let offset = 0; offset < 7; offset += 1) {
    const date = addLocalDays(start, offset);
    const day = localDateKey(date);
    definitions.filter(([type]) => date.getDay() !== 6 || type !== 'worksheet').forEach(([type, title, description, estimatedMinutes, path]) => tasks.push({
      id: `eigo-${day}-${type}`,
      source: 'eiken4-app',
      date: day,
      type,
      title,
      description,
      estimatedMinutes,
      priority: 'required',
      status: 'pending',
      launchUrl: `${cleanBase}${path}`,
      tags: ['英語', '英検4級', type === 'grade1_review' ? '中1復習' : '毎日'],
    }));
    if (date.getDay() === 6) tasks.push({
      id: `eigo-${day}-mini_mock`, source: 'eiken4-app', date: day, type: 'mini_mock',
      title: '10分ミニ模試', description: '本番形式で実力を確認し、間違いを次週の復習へ登録する',
      estimatedMinutes: 10, priority: 'high', status: 'pending', launchUrl: `${cleanBase}/#/eiken4/mock`, tags: ['英語', '英検4級', '模試'],
    });
  }
  return {
    schema: 'eigo-study-plan', version: 1, generatedAt: new Date().toISOString(),
    exam: { name: '英検4級', date: examDate, goal: '合格' },
    learner: { schoolGrade: 8, reviewLevel: '中1英語から復習', dailyLimitMinutes: 60 },
    tasks,
  };
};
