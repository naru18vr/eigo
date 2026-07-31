import { getAvailableGrammarCategories, getGrammarCategorySentences, getGrammarLearningState, getGrammarPracticeQuestions, loadGrammarPracticeStats, recordGrammarPracticeAnswer, saveGrammarPracticeResult } from '../services/eiken4GrammarPracticeService';
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
  const questions = getGrammarPracticeQuestions(target.id, 'history-test');
  const answers = questions.map((question, index) => ({ id: question.id, correct: index !== 0 }));
  recordGrammarPracticeAnswer(questions[0].id, false);
  saveGrammarPracticeResult(target.id, questions.map(question => question.id), answers);
  const stats = loadGrammarPracticeStats()[target.id];
  if (!stats || stats.attempts !== 1 || stats.total !== questions.length || stats.correct !== questions.length - 1) errors.push('文法別の学習履歴を保存できない');
  if (getGrammarLearningState(stats) !== '復習しよう') errors.push('直近の誤答を復習状態にできない');
  if (!(localStorage.getItem('eiken4ReviewScheduleV1') || '').includes(questions[0].id)) errors.push('文法別の誤答が既存復習へ追加されない');
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`文法別練習チェックOK: ${categories.length}カテゴリ・${assigned.length}問`);
