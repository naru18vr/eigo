import { eiken3ExamQuestions } from './eiken3ExamQuestions';
import { getEiken3GrammarCategoryId } from './eiken3GrammarCategories';
import { eiken3Sentences } from './eiken3Sentences';
export type { Eiken3ExamQuestion } from './eiken3ExamQuestions';

// 3級では中学卒業程度の文法を学ぶため、基礎級で除外していた
// 現在完了・受け身・関係代名詞も学習対象に含める。
export const eiken3CoreSentences = eiken3Sentences.map(sentence => ({
  ...sentence,
  grammarCategory: getEiken3GrammarCategoryId(sentence),
}));

export const eiken3CoreExamQuestions = eiken3ExamQuestions;
