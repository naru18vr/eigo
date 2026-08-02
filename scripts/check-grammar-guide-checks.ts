import { EIKEN4_GRAMMAR_GUIDE_CHECKS, getGrammarGuideCheckQuestions } from '../data/eiken4GrammarGuideData';
import { EIKEN4_GRAMMAR_VIDEOS } from '../data/eiken4GrammarVideos';

const errors: string[] = [];
const videosById = new Map(EIKEN4_GRAMMAR_VIDEOS.map(video => [video.id, video]));

const expectedTopics: Record<string, number> = {
  future: 8,
  conjunction: 8,
  infinitive: 8,
  modal: 8,
  comparison: 10,
};

if (EIKEN4_GRAMMAR_GUIDE_CHECKS.length < 60) {
  errors.push(`文法ガイド確認問題が少なすぎる: ${EIKEN4_GRAMMAR_GUIDE_CHECKS.length}`);
}

if (new Set(EIKEN4_GRAMMAR_GUIDE_CHECKS.map(question => question.id)).size !== EIKEN4_GRAMMAR_GUIDE_CHECKS.length) {
  errors.push('文法ガイド確認問題のIDが重複している');
}

for (const question of EIKEN4_GRAMMAR_GUIDE_CHECKS) {
  if (!question.prompt || !question.explanation || question.choices.length < 2 || new Set(question.choices).size !== question.choices.length || !question.choices.includes(question.correctAnswer)) {
    errors.push(`確認問題の選択肢または正解が不正: ${question.id}`);
  }
  if (question.videoId && !videosById.has(question.videoId)) {
    errors.push(`確認問題に対応する動画がない: ${question.id} -> ${question.videoId}`);
  }
}

for (const [grammarId, expectedCount] of Object.entries(expectedTopics)) {
  const questions = getGrammarGuideCheckQuestions(grammarId);
  if (questions.length < expectedCount) {
    errors.push(`${grammarId}の確認問題が${expectedCount}問未満: ${questions.length}`);
  }
  if (questions.some((question, index) => question.order !== index + 1)) {
    errors.push(`${grammarId}の確認問題の順番が連続していない`);
  }
  if (questions.some(question => !question.videoId)) {
    errors.push(`${grammarId}の確認問題に対応動画が設定されていない`);
  }
}

const expectedVideoIds: Record<string, string[]> = {
  future: ['future-going-to', 'future-going-to-question-negative', 'future-will', 'future-will-question-negative'],
  conjunction: ['conjunction-that', 'conjunction-if', 'conjunction-when', 'conjunction-because'],
  infinitive: ['infinitive-purpose', 'infinitive-emotion', 'infinitive-adjective', 'infinitive-it-is'],
  modal: ['modal-have-to', 'modal-have-to-question-negative', 'modal-must', 'modal-must-question-negative'],
  comparison: ['comparative-er', 'superlative-est', 'comparison-more-most', 'comparison-irregular', 'comparison-as-as'],
};

for (const [grammarId, videoIds] of Object.entries(expectedVideoIds)) {
  const actualVideoIds = getGrammarGuideCheckQuestions(grammarId).map(question => question.videoId);
  if (videoIds.some(videoId => !actualVideoIds.includes(videoId))) {
    errors.push(`${grammarId}の主要動画すべてに確認問題が対応していない`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`文法ガイド確認問題チェックOK: ${EIKEN4_GRAMMAR_GUIDE_CHECKS.length}問・主要5単元を検査`);
