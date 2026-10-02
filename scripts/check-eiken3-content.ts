import { readFileSync } from 'node:fs';
import { eiken3CoreExamQuestions, eiken3CoreSentences } from '../data/eiken3Curriculum';
import { EIKEN3_GRAMMAR_CATEGORIES } from '../data/eiken3GrammarCategories';
import { EIKEN3_GRAMMAR_GUIDE_CHECKS } from '../data/eiken3GrammarGuideData';
import { eiken3ListeningQuestions } from '../data/eiken3Listening';
import { eiken3Readings } from '../data/eiken3Readings';
import { eiken3SpeakingCards } from '../data/eiken3Speaking';
import { EIKEN3_COURSE_DURATIONS, EIKEN3_STAMP_MISSIONS, buildEiken3CourseDays, getEiken3CourseMinuteRange } from '../data/eiken3StampCourse';
import { eiken3Words } from '../data/eiken3Words';
import { eiken3WritingTasks } from '../data/eiken3Writing';

const errors: string[] = [];
const questionIds = new Map<string, string>();

const addId = (id: string, source: string) => {
  const previous = questionIds.get(id);
  if (previous) errors.push(`問題ID重複: ${id} (${previous} / ${source})`);
  questionIds.set(id, source);
};

const checkChoices = (id: string, choices: string[], answer: string, source: string) => {
  if (choices.length < 3) errors.push(`${source} ${id}: 選択肢が3つ未満`);
  if (new Set(choices).size !== choices.length) errors.push(`${source} ${id}: 選択肢が重複`);
  if (!choices.includes(answer)) errors.push(`${source} ${id}: 正解が選択肢にない`);
  if (choices.some(choice => !choice.trim())) errors.push(`${source} ${id}: 空の選択肢がある`);
};

for (const question of eiken3CoreSentences) {
  addId(question.id, '文法');
  if (!question.japaneseQuestion.trim() || !question.explanation.trim()) errors.push(`文法 ${question.id}: 問題文または解説が空`);
  if (!question.words.length || !['.', '?', '!'].includes(question.words.at(-1) || '')) errors.push(`文法 ${question.id}: 文末記号がない`);
}

for (const question of eiken3CoreExamQuestions) {
  addId(question.id, '本番形式');
  if (!question.prompt.trim() || !question.explanation.trim()) errors.push(`本番形式 ${question.id}: 問題文または解説が空`);
  checkChoices(question.id, question.choices, question.answer, '本番形式');
}

for (const question of eiken3ListeningQuestions) {
  addId(question.id, 'リスニング');
  if (!question.audioText.trim() || !question.transcript.trim() || !question.question.trim() || !question.explanation.trim()) errors.push(`リスニング ${question.id}: 必須項目が空`);
  checkChoices(question.id, question.choices, question.answer, 'リスニング');
}

for (const reading of eiken3Readings) {
  addId(reading.id, '長文');
  if (!reading.title.trim() || !reading.passage.trim() || reading.questions.length < 2) errors.push(`長文 ${reading.id}: 本文または設問が不足`);
  reading.questions.forEach((question, index) => {
    const id = `${reading.id}-${index + 1}`;
    if (!question.question.trim() || !question.evidence.trim() || !question.explanation.trim()) errors.push(`長文 ${id}: 必須項目が空`);
    checkChoices(id, question.choices, question.answer, '長文');
  });
}

for (const question of EIKEN3_GRAMMAR_GUIDE_CHECKS) {
  addId(question.id, '文法ガイド確認');
  if (!question.prompt.trim() || !question.explanation.trim()) errors.push(`文法ガイド ${question.id}: 問題文または解説が空`);
  checkChoices(question.id, question.choices, question.correctAnswer, '文法ガイド');
}

const categoryCounts = Object.fromEntries(EIKEN3_GRAMMAR_CATEGORIES.map(category => [category.id, 0]));
for (const question of eiken3CoreSentences) {
  if (!question.grammarCategory || !(question.grammarCategory in categoryCounts)) errors.push(`文法 ${question.id}: 未知のカテゴリ`);
  else categoryCounts[question.grammarCategory] += 1;
}
for (const category of EIKEN3_GRAMMAR_CATEGORIES) {
  if (categoryCounts[category.id] < 4) errors.push(`文法カテゴリ ${category.id}: ${categoryCounts[category.id]}問（4問必要）`);
}
for (const categoryId of ['present-perfect', 'passive', 'relative-clause', 'indirect-question'] as const) {
  if (categoryCounts[categoryId] < 4) errors.push(`英検3級の主要文法 ${categoryId}: ${categoryCounts[categoryId]}問`);
}

const grammarForms = new Set(eiken3CoreSentences.map(question => question.questionType).filter(Boolean));
if (grammarForms.size < 5) errors.push(`文法の出題形式が少なすぎる: ${grammarForms.size}種類`);
if (eiken3CoreSentences.length < 180) errors.push(`英検3級文法が少なすぎる: ${eiken3CoreSentences.length}問`);
if (eiken3CoreExamQuestions.length < 120) errors.push(`本番形式が少なすぎる: ${eiken3CoreExamQuestions.length}問`);
if (eiken3ListeningQuestions.length < 70) errors.push(`リスニングが少なすぎる: ${eiken3ListeningQuestions.length}問`);
if (eiken3Readings.length < 36) errors.push(`長文トピックが少なすぎる: ${eiken3Readings.length}題`);
if (eiken3Readings.reduce((total, reading) => total + reading.questions.length, 0) < 72) errors.push('長文設問が72問未満');
if (eiken3Words.length < 330) errors.push(`英検3級単語が少なすぎる: ${eiken3Words.length}語`);

const wordKeys = eiken3Words.map(word => word.word.trim().toLowerCase());
if (new Set(wordKeys).size !== wordKeys.length) errors.push('英検3級単語: 見出し語重複');
if (eiken3Words.some(word => !word.word.trim() || !word.meaning.trim() || !word.example.trim())) errors.push('英検3級単語: 必須項目不足');

if (eiken3WritingTasks.length < 4) errors.push(`英作文課題が少なすぎる: ${eiken3WritingTasks.length}題`);
for (const task of eiken3WritingTasks) {
  if (!task.prompt.trim() || !task.japanesePrompt.trim() || !task.modelAnswer.trim() || task.checklist.length < 2) errors.push(`英作文 ${task.id}: 必須項目不足`);
}
if (eiken3SpeakingCards.length < 5) errors.push(`面接カードが少なすぎる: ${eiken3SpeakingCards.length}題`);
for (const card of eiken3SpeakingCards) {
  if (!card.passage.trim() || !card.question.trim() || !card.modelAnswer.trim() || !card.tip.trim()) errors.push(`面接 ${card.id}: 必須項目不足`);
}

if (EIKEN3_COURSE_DURATIONS.map(item => item.days).join(',') !== '7,14,21') errors.push('1・2・3週間コースが必要です');
if (EIKEN3_STAMP_MISSIONS.length !== 27) errors.push(`スタンプは27個必要です: ${EIKEN3_STAMP_MISSIONS.length}`);
if (new Set(EIKEN3_STAMP_MISSIONS.map(item => item.id)).size !== EIKEN3_STAMP_MISSIONS.length) errors.push('ミッションIDが重複しています');
if (EIKEN3_STAMP_MISSIONS.filter(item => item.path === '/eiken3/full-mock').length !== 3) errors.push('フル模試は3回必要です');
if (EIKEN3_STAMP_MISSIONS.filter(item => item.path === '/eiken3/past-papers').length !== 3) errors.push('公式過去問は3回必要です');
if (EIKEN3_STAMP_MISSIONS.some(item => !item.path.startsWith('/eiken3/'))) errors.push('英検3級以外のスタンプ導線があります');
for (const duration of [7, 14, 21] as const) {
  const days = buildEiken3CourseDays(duration);
  const flattened = days.flat();
  if (days.length !== duration) errors.push(`${duration}日コースになっていません`);
  if (flattened.length !== 27 || new Set(flattened.map(item => item.id)).size !== 27) errors.push(`${duration}日コースでミッションが欠けています`);
  if (days.some(day => day.length === 0)) errors.push(`${duration}日コースに空の日があります`);
  const range = getEiken3CourseMinuteRange(duration);
  if (range.total !== 950) errors.push(`${duration}日コースの合計時間が一致しません: ${range.total}`);
}

const writingSource = readFileSync('pages/Eiken3WritingPage.tsx', 'utf8');
const speakingSource = readFileSync('pages/Eiken3SpeakingPage.tsx', 'utf8');
const writingServiceSource = readFileSync('services/eiken3WritingService.ts', 'utf8');
const speakingServiceSource = readFileSync('services/eiken3SpeakingService.ts', 'utf8');
const resultSource = readFileSync('pages/Eiken3ResultPage.tsx', 'utf8');
const worksheetServiceSource = readFileSync('services/eiken3WorksheetService.ts', 'utf8');
if (!writingSource.includes('completeWritingTask') || !writingServiceSource.includes('eiken3WritingProgressV1')) errors.push('英作文の保存キーが画面に接続されていません');
if (!speakingSource.includes('completeSpeakingCard') || !speakingServiceSource.includes('eiken3SpeakingProgressV1')) errors.push('面接の保存キーが画面に接続されていません');
if (!resultSource.includes('loadEiken3Grade1Review') || resultSource.includes("services/grade1ReviewService")) errors.push('英検3級の結果画面が中1復習の3級専用保存を使っていません');
if (!worksheetServiceSource.includes('getEiken3Grade1DailySelection') || !worksheetServiceSource.includes('getEiken3Grade1ItemsBySelection') || worksheetServiceSource.includes("from './grade1ReviewService'")) errors.push('英検3級の類題プリントが中1復習の3級専用選定を使っていません');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`英検3級教材検査OK: 文法${eiken3CoreSentences.length}・本番${eiken3CoreExamQuestions.length}・ガイド${EIKEN3_GRAMMAR_GUIDE_CHECKS.length}・リスニング${eiken3ListeningQuestions.length}・長文${eiken3Readings.length}題/${eiken3Readings.reduce((total, reading) => total + reading.questions.length, 0)}問・単語${eiken3Words.length}・英作文${eiken3WritingTasks.length}・面接${eiken3SpeakingCards.length}・スタンプ27`);
