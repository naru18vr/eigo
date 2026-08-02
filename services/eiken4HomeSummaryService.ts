import type { Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_SENTENCE_IDS } from '../data/eiken4GrammarQuestionIndex';
import { EIKEN4_REVIEW_SCHEDULE_KEY } from '../data/eiken4LearningKeys';
import { getStudiedGrammarIds } from './eiken4StepLearningService';

type ReviewSummary = { dueDate?: string };

const localDateKey = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const loadReviewSummary = (): ReviewSummary[] => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const value = JSON.parse(localStorage.getItem(EIKEN4_REVIEW_SCHEDULE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

/** トップ画面用。問題本文・単語一覧・動画詳細を読み込まずに復習の有無だけを判定します。 */
export const getLightweightDailyLearningReadiness = () => {
  const studiedGrammarIds = new Set<Eiken4GrammarCategoryId>(getStudiedGrammarIds());
  const grammarQuestionCount = Array.from(studiedGrammarIds).reduce(
    (total, grammarId) => total + (EIKEN4_GRAMMAR_SENTENCE_IDS[grammarId]?.length || 0),
    0,
  );
  const dueReviewCount = loadReviewSummary().filter(record => Boolean(record.dueDate && record.dueDate <= localDateKey())).length;
  return { studiedGrammarCount: studiedGrammarIds.size, grammarQuestionCount, dueReviewCount, canStart: grammarQuestionCount + dueReviewCount > 0 };
};

export const getLightweightDueReviewCount = () => getLightweightDailyLearningReadiness().dueReviewCount;
