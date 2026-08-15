import type { DailyProgress } from './eiken3DailyService';
import type { ReadingProgress } from './eiken3ReadingService';
import type { Grade1ReviewProgress } from './grade1ReviewService';
import { EIKEN3_STAMP_MISSIONS } from '../data/eiken3StampCourse';
import { loadEiken3StampCourse } from './eiken3StampCourseService';

type DailyReportInput = {
  daily: DailyProgress;
  reading: ReadingProgress;
  grade1: Grade1ReviewProgress;
  readingTotal: number;
  readingCorrect: number;
  completedSteps: number;
  weaknessNames: string[];
  transferCode: string;
  transferLink: string;
};

export const createParentDailyReport = ({ daily, reading, grade1, readingTotal, readingCorrect, completedSteps, weaknessNames, transferCode, transferLink }: DailyReportInput) => {
  const courseProgress = loadEiken3StampCourse();
  const dailyCorrect = daily.answers.filter(answer => answer.correct).length;
  const grade1Correct = grade1.answers.filter(Boolean).length;
  const strengths = [
    daily.completedAt && dailyCorrect >= Math.ceil(daily.questionIds.length * .8) ? '今日の15分' : '',
    reading.completedAt && reading.answers.length >= readingTotal ? 'ミニ長文' : '',
    grade1.completedAt && grade1Correct >= 8 ? '中1復習' : '',
  ].filter(Boolean);
  return `【今日の英検3級】
日付：${daily.date.replaceAll('-', '/')}
進み具合：${completedSteps}/5ステップ
合格スタンプラリー：${courseProgress.completedMissionIds.length}/${EIKEN3_STAMP_MISSIONS.length}
今日の15分：${daily.answers.length ? `${dailyCorrect}/${daily.questionIds.length}問` : '未実施'}
ミニ長文：${reading.answers.length ? `${readingCorrect}/${readingTotal}問` : '未実施'}
中1復習：${grade1.answers.length ? `${grade1Correct}/10問` : '未実施'}
できたこと：${strengths.length ? strengths.join('・') : '取り組み中'}
次に復習：${weaknessNames.length ? weaknessNames.join('・') : '追加の練習を続ける'}
引き継ぎ番号：${transferCode}
最新の記録引き継ぎリンク
${transferLink}

※このリンクには学習記録が含まれます。公開場所には貼らないでください。`;
};
