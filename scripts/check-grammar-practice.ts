import { getAvailableGrammarCategories, getGrammarCategorySentences, getGrammarPracticeQuestions, loadGrammarPracticeStats, recordGrammarPracticeAnswer, saveGrammarPracticeResult } from '../services/eiken4GrammarPracticeService';
import { getGrammarLearningState, markGrammarGuideStarted } from '../services/eiken4GrammarProgressService';
import { recordLearningGrammarGuideCheck } from '../services/eiken4StepLearningService';
import { eiken4CoreSentences } from '../data/eiken4Curriculum';

const errors: string[] = [];

class MemoryStorage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
const categories = getAvailableGrammarCategories();
if (categories.length < 10) errors.push(`文法カテゴリが少なすぎる: ${categories.length}`);
const assigned = categories.flatMap(category => getGrammarCategorySentences(category.id).map(sentence => `${sentence.id}:${category.id}`));
if (new Set(assigned.map(value => value.split(':')[0])).size !== assigned.length) errors.push('同じ問題が複数の文法カテゴリに入っている');
const assignedIds = new Set(assigned.map(value => value.split(':')[0]));
const unassigned = eiken4CoreSentences.filter(sentence => !assignedIds.has(sentence.id));
if (unassigned.length) errors.push(`文法カテゴリが未設定の問題がある: ${unassigned.map(sentence => `${sentence.id}(${sentence.grammarTag})`).join('、')}`);
if (eiken4CoreSentences.some(sentence => !sentence.grammarCategory)) errors.push('文法問題データにカテゴリIDがない');
for (const category of categories) {
  const sentences = getGrammarCategorySentences(category.id);
  const questions = getGrammarPracticeQuestions(category.id, 'test-attempt');
  if (!sentences.length) errors.push(`表示カテゴリに問題がない: ${category.id}`);
  if (!questions.length || questions.length > 10) errors.push(`出題数が不正: ${category.id}`);
  if (new Set(questions.map(question => question.id)).size !== questions.length) errors.push(`練習内で問題が重複: ${category.id}`);
  if (questions.some(question => !sentences.some(sentence => `sentence-${sentence.id}` === question.id))) errors.push(`別カテゴリの問題が混入: ${category.id}`);
  if (questions.some(question => question.grammarCategory !== category.id)) errors.push(`問題データのカテゴリIDが不正: ${category.id}`);
}

const target = categories.find(category => category.id === 'past-tense');
if (!target) errors.push('過去形カテゴリがない');
else {
  if (getGrammarLearningState(target.id).status !== 'not-started') errors.push('初回の文法を「まだ」にできない');
  markGrammarGuideStarted(target.id);
  const afterOpen = getGrammarLearningState(target.id);
  if (!afterOpen.guideStarted || afterOpen.guideCompleted || afterOpen.status !== 'not-started') errors.push('解説を開いただけで完了扱いになる');
  recordLearningGrammarGuideCheck(target.id);
  const afterGuide = getGrammarLearningState(target.id);
  if (!afterGuide.guideCompleted || afterGuide.status !== 'in-progress') errors.push('解説確認後を「がんばり中」にできない');
  const questions = getGrammarPracticeQuestions(target.id, 'history-test');
  const answers = questions.map((question, index) => ({ id: question.id, correct: index !== 0 }));
  recordGrammarPracticeAnswer(questions[0].id, false);
  saveGrammarPracticeResult(target.id, questions.map(question => question.id), answers);
  const stats = loadGrammarPracticeStats()[target.id];
  if (!stats || stats.attempts !== 1 || stats.total !== questions.length || stats.correct !== questions.length - 1) errors.push('文法別の学習履歴を保存できない');
  if (getGrammarLearningState(target.id).status !== 'review-needed') errors.push('直近の誤答を「もう一度やろう」にできない');
  if (!(localStorage.getItem('eiken4ReviewScheduleV1') || '').includes(questions[0].id)) errors.push('文法別の誤答が既存復習へ追加されない');
}

const shortTarget = categories.find(category => category.id === 'general-verb');
if (shortTarget) {
  const questions = getGrammarPracticeQuestions(shortTarget.id, 'short-test', 3);
  saveGrammarPracticeResult(shortTarget.id, questions.map(question => question.id), questions.map(question => ({ id: question.id, correct: true })));
  if (getGrammarLearningState(shortTarget.id).status === 'completed') errors.push('3問正解だけで「できた！」になる');
}

const completedTarget = categories.find(category => category.id === 'modal-verb');
if (completedTarget) {
  const questions = getGrammarPracticeQuestions(completedTarget.id, 'completed-test');
  saveGrammarPracticeResult(completedTarget.id, questions.map(question => question.id), questions.map((question, index) => ({ id: question.id, correct: index < Math.ceil(questions.length * .8) })));
  const state = getGrammarLearningState(completedTarget.id);
  if (state.attemptedCount < 5 || state.accuracy < 80 || state.status !== 'completed') errors.push('5問以上・正答率80％以上を「できた！」にできない');
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`文法別練習チェックOK: ${categories.length}カテゴリ・${assigned.length}問`);
