export type Eiken4CourseDuration = 7 | 14 | 21;

export type Eiken4StampMission = {
  id: string;
  title: string;
  description: string;
  path: string;
  estimatedMinutes: number;
  icon: string;
};

export const EIKEN4_COURSE_DURATIONS = [
  { days: 7 as const, label: '1週間コース', pace: '1日3〜5こ', minutes: '約90〜140分/日', description: '模試と過去問まで短期集中で進める', recommended: false },
  { days: 14 as const, label: '2週間コース', pace: '1日1〜3こ', minutes: '約45〜75分/日', description: '本番演習を多めに、バランスよく進める', recommended: true },
  { days: 21 as const, label: '3週間コース', pace: '1日1〜2こ', minutes: '約25〜65分/日', description: '復習をはさみながら本番演習を重ねる', recommended: false },
] as const;

// 期間を変えてもスタンプが消えないよう、ミッションIDと順番は固定する。
export const EIKEN4_STAMP_MISSIONS: Eiken4StampMission[] = [
  { id: 'step-1', title: '基本の文', description: '一般動詞・疑問詞・命令文', path: '/eiken4/learning-step/step-1', estimatedMinutes: 25, icon: '📖' },
  { id: 'step-2', title: '今していること', description: '現在進行形', path: '/eiken4/learning-step/step-2', estimatedMinutes: 20, icon: '📖' },
  { id: 'step-3', title: '過去のこと', description: '過去形・過去進行形', path: '/eiken4/learning-step/step-3', estimatedMinutes: 30, icon: '📖' },
  { id: 'step-4', title: '未来・助動詞', description: 'will・be going to・must', path: '/eiken4/learning-step/step-4', estimatedMinutes: 30, icon: '📖' },
  { id: 'mini-mock', title: '10分ミニ模試①', description: '前半の力を本番形式で確認', path: '/eiken4/mock', estimatedMinutes: 10, icon: '🏁' },
  { id: 'step-5', title: '文をくわしくする', description: '不定詞・動名詞・接続詞', path: '/eiken4/learning-step/step-5', estimatedMinutes: 35, icon: '📖' },
  { id: 'step-6', title: 'くらべる文', description: '比較級・最上級', path: '/eiken4/learning-step/step-6', estimatedMinutes: 25, icon: '📖' },
  { id: 'step-7', title: '文法の仕上げ', description: '段階別学習のまとめ', path: '/eiken4/learning-step/step-7', estimatedMinutes: 20, icon: '📖' },
  { id: 'exam-practice', title: '本番形式10問①', description: '文法と会話を本番形式で確認', path: '/eiken4/exam-practice', estimatedMinutes: 15, icon: '✏️' },
  { id: 'word-cards', title: '単語カード', description: '英検4級の重要単語を覚える', path: '/eiken4/words', estimatedMinutes: 15, icon: '🔤' },
  { id: 'word-quiz', title: '単語テスト', description: '覚えた単語を確認する', path: '/eiken4/words/quiz', estimatedMinutes: 15, icon: '🔤' },
  { id: 'word-challenge', title: '単語5方向テスト', description: '音・意味・スペルをまとめて確認', path: '/eiken4/word-challenge', estimatedMinutes: 20, icon: '🔤' },
  { id: 'full-mock', title: 'フル模試①', description: '最初の本番通し練習', path: '/eiken4/full-mock', estimatedMinutes: 65, icon: '🏁' },
  { id: 'mixed-review', title: '文法まとめ問題', description: '習った文法だけをまぜて練習', path: '/eiken4/mixed-review', estimatedMinutes: 15, icon: '🔀' },
  { id: 'daily-review', title: '間違いの復習', description: '忘れかけた問題をやり直す', path: '/eiken4/daily', estimatedMinutes: 15, icon: '↻' },
  { id: 'past-paper', title: '公式過去問①', description: '公式問題の結果を記録して確認', path: '/eiken4/past-papers', estimatedMinutes: 65, icon: '🎓' },
  { id: 'reading-1', title: 'ミニ長文①', description: '短い英文を読んで答える', path: '/eiken4/reading', estimatedMinutes: 15, icon: '📚' },
  { id: 'reading-2', title: 'ミニ長文②', description: '根拠を見つけて答える', path: '/eiken4/reading', estimatedMinutes: 15, icon: '📚' },
  { id: 'listening', title: 'リスニング', description: '本番と同じ3部構成を練習', path: '/eiken4/listening-practice', estimatedMinutes: 25, icon: '🎧' },
  { id: 'listening-focus', title: '聞き取りの弱点直し', description: '苦手な聞き方を集中練習', path: '/eiken4/listening-focus', estimatedMinutes: 20, icon: '🎧' },
  { id: 'mini-mock-2', title: '10分ミニ模試②', description: '読む・聞く問題も含めて確認', path: '/eiken4/mock', estimatedMinutes: 10, icon: '🏁' },
  { id: 'exam-practice-2', title: '本番形式10問②', description: '時間を意識してもう一度力試し', path: '/eiken4/exam-practice', estimatedMinutes: 15, icon: '✏️' },
  { id: 'full-mock-2', title: 'フル模試②', description: '1回目の間違いを直して再挑戦', path: '/eiken4/full-mock', estimatedMinutes: 65, icon: '🏁' },
  { id: 'past-paper-2', title: '公式過去問②', description: '別の回の公式問題に挑戦', path: '/eiken4/past-papers', estimatedMinutes: 65, icon: '🎓' },
  { id: 'weakness', title: '間違い直し', description: '苦手な問題をもう一度', path: '/eiken4/weakness', estimatedMinutes: 20, icon: '💪' },
  { id: 'full-mock-3', title: 'フル模試③', description: '本番前の最終リハーサル', path: '/eiken4/full-mock', estimatedMinutes: 65, icon: '🏁' },
  { id: 'past-paper-3', title: '公式過去問③', description: '最後に合格圏を確認', path: '/eiken4/past-papers', estimatedMinutes: 65, icon: '🎓' },
];

export const buildEiken4CourseDays = (duration: Eiken4CourseDuration) => {
  const result: Eiken4StampMission[][] = [];
  let missionIndex = 0;
  let remainingMinutes = EIKEN4_STAMP_MISSIONS.reduce((sum, mission) => sum + mission.estimatedMinutes, 0);
  for (let dayIndex = 0; dayIndex < duration; dayIndex += 1) {
    const remainingDays = duration - dayIndex;
    const targetMinutes = remainingMinutes / remainingDays;
    const day: Eiken4StampMission[] = [];
    let dayMinutes = 0;
    while (missionIndex < EIKEN4_STAMP_MISSIONS.length) {
      const missionsAfter = EIKEN4_STAMP_MISSIONS.length - (missionIndex + 1);
      if (day.length > 0 && missionsAfter < remainingDays - 1) break;
      const next = EIKEN4_STAMP_MISSIONS[missionIndex];
      if (day.length > 0 && Math.abs(targetMinutes - dayMinutes) <= Math.abs(targetMinutes - (dayMinutes + next.estimatedMinutes))) break;
      day.push(next);
      dayMinutes += next.estimatedMinutes;
      missionIndex += 1;
    }
    // 必ず1日1ミッション以上にし、後ろの日の分も残す。
    if (day.length === 0 && missionIndex < EIKEN4_STAMP_MISSIONS.length) {
      const next = EIKEN4_STAMP_MISSIONS[missionIndex++];
      day.push(next);
      dayMinutes += next.estimatedMinutes;
    }
    result.push(day);
    remainingMinutes -= dayMinutes;
  }
  return result;
};
