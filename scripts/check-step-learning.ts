import { eiken4CoreSentences } from '../data/eiken4Curriculum';
import { EIKEN4_GRAMMAR_PRACTICE_STATS_KEY, EIKEN4_STEP_LEARNING_KEY } from '../data/eiken4LearningKeys';
import { getDailyLearningReadiness, loadDailyProgress, resetTodayDailyProgress } from '../services/eiken4DailyService';
import { loadMixedReviewProgress, startMixedReview } from '../services/eiken4MixedReviewService';
import { completeLearningStep, eiken4LearningSteps, getLearningStepState, getNextLearningActivity, getNextLearningStep, getStudiedGrammarIds, recordLearningGrammarGuideCheck, recordLearningGrammarPractice } from '../services/eiken4StepLearningService';

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
const first = eiken4LearningSteps[0];
if (getNextLearningStep()?.id !== first.id) errors.push('初回にステップ1が案内されない');
if (getLearningStepState(eiken4LearningSteps[1]) !== '順番にやろう') errors.push('ステップ2が最初から順番待ちにならない');
if (loadDailyProgress().questionIds.length) errors.push('学習前に今日のおまかせ問題へ未習問題が入る');
recordLearningGrammarGuideCheck('general-verb');
if (getNextLearningActivity()?.type !== 'grammar-practice' || getNextLearningActivity()?.categoryId !== 'general-verb') errors.push('文法ガイド後に同じ文法の練習を案内できない');
recordLearningGrammarPractice('general-verb', 4, 10);
if (getNextLearningActivity()?.type !== 'grammar-guide' || getNextLearningActivity()?.categoryId !== 'general-verb') errors.push('低い正答率の後に説明を見直せない');

for (const step of eiken4LearningSteps.slice(0, 6)) {
  for (const categoryId of step.grammarIds) recordLearningGrammarPractice(categoryId, 8, 10);
  if (getLearningStepState(step) !== 'できた！') errors.push(`${step.id}を完了にできない`);
}
if (getNextLearningStep()?.id !== 'step-7') errors.push('基礎完了後に総合練習が案内されない');
const mixedReview = startMixedReview();
if (!mixedReview.questionIds.length || mixedReview.questionIds.length > 10) errors.push('学習済み内容を混ぜる復習を作れない');
if (!loadMixedReviewProgress()) errors.push('学習済み内容を混ぜる復習を保存できない');
for (const id of mixedReview.questionIds) {
  const sentence = eiken4CoreSentences.find(item => `sentence-${item.id}` === id);
  if (!sentence?.grammarCategory || !getStudiedGrammarIds().includes(sentence.grammarCategory)) errors.push('混ぜる復習に未習文法が混ざる');
}
completeLearningStep('step-7');
if (getLearningStepState(eiken4LearningSteps[6]) !== 'できた！') errors.push('総合練習を完了にできない');

const studied = new Set(getStudiedGrammarIds());
if (!studied.size || !getDailyLearningReadiness().canStart) errors.push('文法練習後に復習問題を始められない');
resetTodayDailyProgress();
const daily = loadDailyProgress();
if (!daily.questionIds.length) errors.push('習った文法の復習問題を作れない');
for (const id of daily.questionIds.filter(id => id.startsWith('sentence-'))) {
  const sentence = eiken4CoreSentences.find(item => `sentence-${item.id}` === id);
  if (!sentence?.grammarCategory || !studied.has(sentence.grammarCategory)) errors.push('今日のおまかせ問題に未習文法が混ざる');
}

const migrationStorage = new MemoryStorage();
const masteredStats = Object.fromEntries(eiken4LearningSteps.slice(0, 6).flatMap(step => step.grammarIds).map(id => [id, { attempts: 1, correct: 10, total: 10 }]));
migrationStorage.setItem(EIKEN4_GRAMMAR_PRACTICE_STATS_KEY, JSON.stringify(masteredStats));
migrationStorage.setItem(EIKEN4_STEP_LEARNING_KEY, JSON.stringify({ steps: { 'step-6': { startedAt: '2026-07-30T00:00:00.000Z', completedAt: '2026-07-30T00:10:00.000Z', attemptedGrammarIds: [], masteredGrammarIds: [], lastWrongGrammarIds: [] } }, allowedStepIds: [] }));
Object.defineProperty(globalThis, 'localStorage', { value: migrationStorage, configurable: true });
if (getLearningStepState(eiken4LearningSteps[6]) !== 'できた！') errors.push('旧6ステップ版の総合練習完了を引き継げない');
completeLearningStep('step-1');
const migrated = JSON.parse(migrationStorage.getItem(EIKEN4_STEP_LEARNING_KEY) || '{}');
if (migrated.version !== 2 || !migrated.steps?.['step-7']?.completedAt) errors.push('旧6ステップ版の保存データを安全に移行できない');

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`段階別学習チェックOK: ${eiken4LearningSteps.length}ステップ・復習${daily.questionIds.length}問`);
