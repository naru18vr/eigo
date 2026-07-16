import { daysUntilExam } from './eiken4ProgressService';

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
