import { eiken3CoreSentences } from './eiken3Curriculum';
import type { Eiken3GrammarCategoryId } from './eiken3GrammarCategories';

/** 文法カテゴリと問題本文がずれないよう、教材から軽量なID索引を作る。 */
export const EIKEN3_GRAMMAR_SENTENCE_IDS: Partial<Record<Eiken3GrammarCategoryId, string[]>> = Object.fromEntries(
  [...new Set(eiken3CoreSentences.map(sentence => sentence.grammarCategory).filter(Boolean))].map(categoryId => [
    categoryId,
    eiken3CoreSentences.filter(sentence => sentence.grammarCategory === categoryId).map(sentence => sentence.id),
  ]),
) as Partial<Record<Eiken3GrammarCategoryId, string[]>>;
