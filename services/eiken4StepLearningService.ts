import { EIKEN4_GRAMMAR_CATEGORIES, type Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_PRACTICE_STATS_KEY, EIKEN4_STEP_LEARNING_KEY } from '../data/eiken4LearningKeys';
import { safeSetLearningItem } from './storageHealthService';

export type LearningStepId = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'step-6' | 'step-7';
export type LearningStepState = 'まだ' | 'がんばり中' | 'できた！' | 'もう一度やろう' | '順番にやろう';

type MiniCheck = { question: string; choices: string[]; answer: string; explanation: string };
export type LearningStep = {
  id: LearningStepId;
  title: string;
  summary: string;
  topics: string;
  grammarIds: Eiken4GrammarCategoryId[];
  lesson: { title: string; message: string; shape: string; example: { en: string; ja: string }; check: MiniCheck };
  final?: boolean;
};

export const eiken4LearningSteps: LearningStep[] = [
  {
    id: 'step-1', title: '基本の文を覚えよう', summary: '英語の文のいちばん大事な形を知ろう。', topics: 'be動詞・一般動詞・たずねる文', grammarIds: ['general-verb', 'question-words', 'imperative'],
    lesson: { title: '「だれが・どうする」を見つけよう', message: 'am / is / are は「〜です」。play や go は「する・行く」。英語は、まずだれのことかを言ってから動きを言うよ。', shape: 'I am happy. / I play tennis.', example: { en: 'I play tennis after school.', ja: '私は放課後にテニスをします。' }, check: { question: '「私は毎日英語を勉強します」に合う文は？', choices: ['I study English every day.', 'I studying English every day.', 'I studied English every day.'], answer: 'I study English every day.', explanation: '毎日のことは study のように動詞をそのまま使うよ。' } },
  },
  {
    id: 'step-2', title: '今していることを言おう', summary: '今している途中のことを言えるようにしよう。', topics: '現在進行形・現在形との違い', grammarIds: ['present-progressive'],
    lesson: { title: '今している途中は「be動詞 + ing」', message: '今している途中なら、am / is / are の後に動詞の ing形を置くよ。毎日のことを言う現在形とは、少し形がちがうよ。', shape: 'I am reading.', example: { en: 'She is reading a book now.', ja: '彼女は今、本を読んでいます。' }, check: { question: '「私は今、勉強しています」に合う文は？', choices: ['I study now.', 'I am studying now.', 'I studied now.'], answer: 'I am studying now.', explanation: '今している途中なので am + studying を使うよ。' } },
  },
  {
    id: 'step-3', title: '過去のことを言おう', summary: '昨日したことや、そのときしていたことを言えるようにしよう。', topics: '過去形・不規則動詞・過去進行形', grammarIds: ['past-tense', 'past-progressive'],
    lesson: { title: '「昨日」のしるしを見よう', message: 'yesterday があれば、動詞を過去の形にすることが多いよ。そのときしている途中なら was / were + ing を使うよ。', shape: 'I played yesterday. / I was reading.', example: { en: 'I watched TV yesterday.', ja: '私は昨日テレビを見ました。' }, check: { question: 'yesterday がある文は、どれ？', choices: ['I play tennis yesterday.', 'I played tennis yesterday.', 'I am play tennis yesterday.'], answer: 'I played tennis yesterday.', explanation: 'yesterday があるので played のように過去の形にするよ。' } },
  },
  {
    id: 'step-4', title: 'これからのことを言おう', summary: '予定や、できること・してはいけないことを言おう。', topics: '未来の表現・can・must・have to', grammarIds: ['future', 'modal-verb'],
    lesson: { title: 'will や can の後は動詞のもとの形', message: 'will は「〜するでしょう」、can は「〜できる」。この言葉の後は、動詞をそのまま置くよ。', shape: 'I will help. / I can swim.', example: { en: 'I can swim very well.', ja: '私はとても上手に泳げます。' }, check: { question: '「私は明日手伝います」に合う文は？', choices: ['I will help tomorrow.', 'I will helps tomorrow.', 'I helping tomorrow.'], answer: 'I will help tomorrow.', explanation: 'will の後は help のように動詞のもとの形だよ。' } },
  },
  {
    id: 'step-5', title: '文をくわしくしよう', summary: '「〜すること」や理由を足して、文を広げよう。', topics: 'to不定詞・動名詞・接続詞・There is', grammarIds: ['infinitive', 'gerund', 'conjunction', 'there-is-are', 'other-eiken4'],
    lesson: { title: '文と文をつないでみよう', message: 'to + 動詞で「〜すること・ために」。because で「なぜなら」。短い文をつなぐと、伝えられることが増えるよ。', shape: 'I want to play. / I stayed home because it rained.', example: { en: 'I want to visit Kyoto.', ja: '私は京都を訪れたいです。' }, check: { question: 'want の後に続くのはどれ？', choices: ['to play', 'playing to', 'played'], answer: 'to play', explanation: 'want to + 動詞で「〜したい」だよ。' } },
  },
  {
    id: 'step-6', title: 'くらべて言おう', summary: '2つをくらべたり、一番を言ったりしよう。', topics: '比較級・最上級', grammarIds: ['comparative', 'superlative'],
    lesson: { title: '2つなら「より〜」、たくさんなら「一番」', message: '2つをくらべるときは taller than。3つ以上で一番なら the tallest の形を使うよ。', shape: 'A is taller than B. / A is the tallest.', example: { en: 'Tom is taller than Ken.', ja: 'トムはケンより背が高いです。' }, check: { question: '「日本で一番高い山」に合う形は？', choices: ['the highest mountain', 'higher mountain', 'high mountain'], answer: 'the highest mountain', explanation: 'たくさんの中で一番なので the highest を使うよ。' } },
  },
  {
    id: 'step-7', title: '本番に近い問題をやってみよう', summary: '覚えたことを使って、単語・会話・読む・聞く問題に挑戦しよう。', topics: '単語・会話・読む・聞く・本番形式', grammarIds: [], final: true,
    lesson: { title: '答えを急がず、問題のしるしを見よう', message: '文法、単語、会話、読む問題、聞く問題を少しずつ使うよ。分からないときは、前のステップに戻って大丈夫。', shape: '読んで → 考えて → 答える', example: { en: 'Take your time and try.', ja: 'あわてずに、やってみよう。' }, check: { question: '分からない問題が出たら、どうする？', choices: ['前の説明を見直す', 'すぐにあきらめる', '答えだけ覚える'], answer: '前の説明を見直す', explanation: '分からないときは、説明に戻ると次は分かりやすくなるよ。' } },
  },
];

type StepRecord = {
  startedAt?: string;
  lastStudiedAt?: string;
  checkAnsweredAt?: string;
  completedAt?: string;
  attemptedGrammarIds: Eiken4GrammarCategoryId[];
  masteredGrammarIds: Eiken4GrammarCategoryId[];
  lastWrongGrammarIds: Eiken4GrammarCategoryId[];
};
export type LearningNextActivity = { type: 'grammar-guide' | 'grammar-practice'; categoryId: Eiken4GrammarCategoryId };
type StepLearningData = { version: 1 | 2; steps: Partial<Record<LearningStepId, StepRecord>>; allowedStepIds: LearningStepId[]; nextActivity?: LearningNextActivity };

const now = () => new Date().toISOString();
const emptyRecord = (): StepRecord => ({ attemptedGrammarIds: [], masteredGrammarIds: [], lastWrongGrammarIds: [] });
const unique = <T,>(items: T[]) => Array.from(new Set(items));
const isNextActivity = (value: unknown): value is LearningNextActivity => Boolean(value && typeof value === 'object' && ((value as LearningNextActivity).type === 'grammar-guide' || (value as LearningNextActivity).type === 'grammar-practice') && EIKEN4_GRAMMAR_CATEGORIES.some(category => category.id === (value as LearningNextActivity).categoryId));

const readData = (): StepLearningData => {
  if (typeof localStorage === 'undefined') return { version: 2, steps: {}, allowedStepIds: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_STEP_LEARNING_KEY) || '{}') as Partial<StepLearningData>;
    return { version: saved.version === 2 ? 2 : 1, steps: saved.steps || {}, allowedStepIds: Array.isArray(saved.allowedStepIds) ? saved.allowedStepIds : [], ...(isNextActivity(saved.nextActivity) ? { nextActivity: saved.nextActivity } : {}) };
  } catch { return { version: 2, steps: {}, allowedStepIds: [] }; }
};

const saveData = (data: StepLearningData) => {
  // 旧6ステップ版の最後の総合練習は、新しい7ステップ版でも完了として引き継ぐ。
  if (data.version === 1 && data.steps['step-6']?.completedAt && !data.steps['step-7']) {
    const legacy = data.steps['step-6']!;
    data.steps['step-7'] = { ...emptyRecord(), startedAt: legacy.startedAt, lastStudiedAt: legacy.lastStudiedAt, completedAt: legacy.completedAt };
  }
  data.version = 2;
  safeSetLearningItem(EIKEN4_STEP_LEARNING_KEY, JSON.stringify(data));
};

const legacyGrammarIds = () => {
  if (typeof localStorage === 'undefined') return { attempted: [] as Eiken4GrammarCategoryId[], mastered: [] as Eiken4GrammarCategoryId[] };
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN4_GRAMMAR_PRACTICE_STATS_KEY) || '{}') as Record<string, { total?: number; correct?: number }>;
    const attempted = EIKEN4_GRAMMAR_CATEGORIES.filter(category => (saved[category.id]?.total || 0) > 0).map(category => category.id);
    const mastered = attempted.filter(id => {
      const stat = saved[id];
      return stat && (stat.correct || 0) / (stat.total || 1) >= 0.8;
    });
    return { attempted, mastered };
  } catch { return { attempted: [] as Eiken4GrammarCategoryId[], mastered: [] as Eiken4GrammarCategoryId[] }; }
};

const recordFor = (data: StepLearningData, stepId: LearningStepId) => data.steps[stepId] || emptyRecord();

const allAttempted = (data: StepLearningData) => unique([...Object.values(data.steps).flatMap(record => record?.attemptedGrammarIds || []), ...legacyGrammarIds().attempted]);
const allMastered = (data: StepLearningData) => unique([...Object.values(data.steps).flatMap(record => record?.masteredGrammarIds || []), ...legacyGrammarIds().mastered]);

export const getStepForGrammarCategory = (categoryId: Eiken4GrammarCategoryId) =>
  eiken4LearningSteps.find(step => step.grammarIds.includes(categoryId));

export const getLearningStep = (stepId: string | undefined) => eiken4LearningSteps.find(step => step.id === stepId);
export const getStudiedGrammarIds = () => allAttempted(readData());
export const getNextLearningActivity = (data = readData()) => data.nextActivity;

export const getLearningStepState = (step: LearningStep, data = readData()): LearningStepState => {
  const index = eiken4LearningSteps.findIndex(item => item.id === step.id);
  const previous = index > 0 ? eiken4LearningSteps[index - 1] : undefined;
  const previousDone = !previous || getLearningStepState(previous, data) === 'できた！';
  const unlocked = previousDone || data.allowedStepIds.includes(step.id);
  if (!unlocked) return '順番にやろう';
  const record = recordFor(data, step.id);
  const legacyFinalComplete = data.version === 1 && step.id === 'step-7' && Boolean(data.steps['step-6']?.completedAt);
  if (step.final) return record.completedAt || legacyFinalComplete ? 'できた！' : record.startedAt ? 'がんばり中' : 'まだ';
  const attempted = allAttempted(data);
  const mastered = allMastered(data);
  const masteredAll = step.grammarIds.every(id => mastered.includes(id));
  if (masteredAll) return 'できた！';
  if (record.lastWrongGrammarIds.length) return 'もう一度やろう';
  if (step.grammarIds.some(id => attempted.includes(id)) || record.startedAt) return 'がんばり中';
  return 'まだ';
};

export const getLearningStepProgress = (step: LearningStep, data = readData()) => {
  const mastered = allMastered(data);
  const legacyFinalComplete = data.version === 1 && step.id === 'step-7' && Boolean(data.steps['step-6']?.completedAt);
  return { done: step.final ? Number(Boolean(recordFor(data, step.id).completedAt) || legacyFinalComplete) : step.grammarIds.filter(id => mastered.includes(id)).length, total: step.final ? 1 : step.grammarIds.length };
};

export const getNextLearningStep = (data = readData()) =>
  eiken4LearningSteps.find(step => getLearningStepState(step, data) !== 'できた！' && getLearningStepState(step, data) !== '順番にやろう');

export const markLearningStepOpened = (stepId: LearningStepId) => {
  const data = readData(); const record = recordFor(data, stepId); const timestamp = now();
  data.steps[stepId] = { ...record, startedAt: record.startedAt || timestamp, lastStudiedAt: timestamp };
  saveData(data);
};

export const recordLearningStepCheck = (stepId: LearningStepId) => {
  const data = readData(); const record = recordFor(data, stepId); const timestamp = now();
  data.steps[stepId] = { ...record, startedAt: record.startedAt || timestamp, lastStudiedAt: timestamp, checkAnsweredAt: timestamp };
  saveData(data);
};

export const allowLearningStepStart = (stepId: LearningStepId) => {
  const data = readData();
  data.allowedStepIds = unique([...data.allowedStepIds, stepId]);
  saveData(data);
};

export const recordLearningGrammarPractice = (categoryId: Eiken4GrammarCategoryId, correct: number, total: number) => {
  const step = getStepForGrammarCategory(categoryId);
  if (!step) return;
  const data = readData(); const record = recordFor(data, step.id); const timestamp = now();
  const passed = total > 0 && correct / total >= 0.8;
  data.steps[step.id] = {
    ...record,
    startedAt: record.startedAt || timestamp,
    lastStudiedAt: timestamp,
    attemptedGrammarIds: unique([...record.attemptedGrammarIds, categoryId]),
    masteredGrammarIds: passed ? unique([...record.masteredGrammarIds, categoryId]) : record.masteredGrammarIds.filter(id => id !== categoryId),
    lastWrongGrammarIds: passed ? record.lastWrongGrammarIds.filter(id => id !== categoryId) : unique([...record.lastWrongGrammarIds, categoryId]),
  };
  const updated = data.steps[step.id]!;
  if (step.grammarIds.every(id => updated.masteredGrammarIds.includes(id))) updated.completedAt = timestamp;
  else delete updated.completedAt;
  const nextCategory = step.grammarIds.find(id => !allMastered(data).includes(id));
  data.nextActivity = nextCategory ? { type: 'grammar-guide', categoryId: nextCategory } : undefined;
  saveData(data);
};

// 文法ガイドの確認問題に答えた内容も、学習済みとして保存する。
export const recordLearningGrammarGuideCheck = (categoryId: Eiken4GrammarCategoryId) => {
  const step = getStepForGrammarCategory(categoryId);
  if (!step) return;
  const data = readData(); const record = recordFor(data, step.id); const timestamp = now();
  data.steps[step.id] = {
    ...record,
    startedAt: record.startedAt || timestamp,
    lastStudiedAt: timestamp,
    checkAnsweredAt: timestamp,
    attemptedGrammarIds: unique([...record.attemptedGrammarIds, categoryId]),
  };
  data.nextActivity = { type: 'grammar-practice', categoryId };
  saveData(data);
};

export const completeLearningStep = (stepId: LearningStepId) => {
  const data = readData(); const record = recordFor(data, stepId); const timestamp = now();
  data.steps[stepId] = { ...record, startedAt: record.startedAt || timestamp, lastStudiedAt: timestamp, completedAt: timestamp };
  saveData(data);
};

export const getStepGrammarCategories = (step: LearningStep) => step.grammarIds
  .map(id => EIKEN4_GRAMMAR_CATEGORIES.find(category => category.id === id))
  .filter((category): category is (typeof EIKEN4_GRAMMAR_CATEGORIES)[number] => Boolean(category));
