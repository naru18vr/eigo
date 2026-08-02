import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { EIKEN4_GRAMMAR_CATEGORIES } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_GUIDE_CHECKS } from '../data/eiken4GrammarGuideData';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4Readings } from '../data/eiken4Readings';
import { eiken4Words } from '../data/eiken4Words';

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

for (const question of eiken4CoreSentences) {
  addId(question.id, '文法');
  if (!question.japaneseQuestion.trim() || !question.explanation.trim()) errors.push(`文法 ${question.id}: 問題文または解説が空`);
  if (!question.words.length || !['.', '?', '!'].includes(question.words.at(-1) || '')) errors.push(`文法 ${question.id}: 文末記号がない`);
}

for (const question of eiken4CoreExamQuestions) {
  addId(question.id, '本番形式');
  if (!question.prompt.trim() || !question.explanation.trim()) errors.push(`本番形式 ${question.id}: 問題文または解説が空`);
  checkChoices(question.id, question.choices, question.answer, '本番形式');
}

for (const question of eiken4ListeningQuestions) {
  addId(question.id, 'リスニング');
  if (!question.audioText.trim() || !question.transcript.trim() || !question.question.trim() || !question.explanation.trim()) errors.push(`リスニング ${question.id}: 必須項目が空`);
  checkChoices(question.id, question.choices, question.answer, 'リスニング');
}

for (const reading of eiken4Readings) {
  addId(reading.id, '長文');
  if (!reading.title.trim() || !reading.passage.trim() || reading.questions.length < 2) errors.push(`長文 ${reading.id}: 本文または設問が不足`);
  reading.questions.forEach((question, index) => {
    const id = `${reading.id}-${index + 1}`;
    if (!question.question.trim() || !question.evidence.trim() || !question.explanation.trim()) errors.push(`長文 ${id}: 必須項目が空`);
    checkChoices(id, question.choices, question.answer, '長文');
  });
}

for (const question of EIKEN4_GRAMMAR_GUIDE_CHECKS) {
  addId(question.id, '文法ガイド確認');
  if (!question.prompt.trim() || !question.explanation.trim()) errors.push(`文法ガイド ${question.id}: 問題文または解説が空`);
  checkChoices(question.id, question.choices, question.correctAnswer, '文法ガイド');
}

const categoryCounts = Object.fromEntries(EIKEN4_GRAMMAR_CATEGORIES.map(category => [category.id, 0]));
for (const question of eiken4CoreSentences) {
  if (!question.grammarCategory || !(question.grammarCategory in categoryCounts)) errors.push(`文法 ${question.id}: 未知のカテゴリ`);
  else categoryCounts[question.grammarCategory] += 1;
}
for (const category of EIKEN4_GRAMMAR_CATEGORIES) {
  if (categoryCounts[category.id] < 10) errors.push(`文法カテゴリ ${category.id}: ${categoryCounts[category.id]}問（10問必要）`);
}

const grammarForms = new Set(eiken4CoreSentences.map(question => question.questionType).filter(Boolean));
if (grammarForms.size < 5) errors.push(`文法の出題形式が少なすぎる: ${grammarForms.size}種類`);
if (eiken4CoreExamQuestions.length < 100) errors.push(`本番形式が少なすぎる: ${eiken4CoreExamQuestions.length}問`);
if (eiken4ListeningQuestions.length < 60) errors.push(`リスニングが少なすぎる: ${eiken4ListeningQuestions.length}問`);
if (eiken4Readings.length < 30) errors.push(`長文トピックが少なすぎる: ${eiken4Readings.length}題`);
if (eiken4Readings.reduce((total, reading) => total + reading.questions.length, 0) < 60) errors.push('長文設問が60問未満');
if (eiken4Words.length < 300) errors.push(`英検4級単語が少なすぎる: ${eiken4Words.length}語`);

const wordKeys = eiken4Words.map(word => word.word.trim().toLowerCase());
if (new Set(wordKeys).size !== wordKeys.length) errors.push('英検4級単語: 見出し語重複');
if (eiken4Words.some(word => !word.word.trim() || !word.meaning.trim() || !word.example.trim())) errors.push('英検4級単語: 必須項目不足');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`英検4級教材検査OK: 文法${eiken4CoreSentences.length}・本番${eiken4CoreExamQuestions.length}・ガイド${EIKEN4_GRAMMAR_GUIDE_CHECKS.length}・リスニング${eiken4ListeningQuestions.length}・長文${eiken4Readings.length}題/${eiken4Readings.reduce((total, reading) => total + reading.questions.length, 0)}問・単語${eiken4Words.length}`);
