import type { Eiken4GrammarCategoryId } from './eiken4GrammarCategories';

/**
 * 文法別の復習判定に必要なIDだけを持つ軽量な索引です。
 * 問題本文は文法練習・復習ページを開いたときに読み込みます。
 */
export const EIKEN4_GRAMMAR_SENTENCE_IDS: Partial<Record<Eiken4GrammarCategoryId, string[]>> = {
  'general-verb': ['e4s001', 'e4s018', 'e4s023'],
  'past-tense': ['e4s002', 'e4s003', 'e4s011', 'e4s012', 'e4s031', 'e4s032'],
  'present-progressive': ['e4s013', 'e4s033'],
  'past-progressive': ['e4s014', 'e4s034'],
  future: ['e4s015', 'e4s016', 'e4s035', 'e4s036', 'e4s046'],
  'modal-verb': ['e4s004', 'e4s007', 'e4s017', 'e4s037', 'e4s038', 'e4s039', 'e4s040'],
  'question-words': ['e4s024', 'e4s025', 'e4s026', 'e4s053'],
  imperative: ['e4s021', 'e4s048'],
  'there-is-are': ['e4s010', 'e4s029', 'e4s052'],
  infinitive: ['e4s019', 'e4s041', 'e4s047'],
  gerund: ['e4s005', 'e4s006', 'e4s020', 'e4s042', 'e4s043'],
  comparative: ['e4s008', 'e4s027', 'e4s049', 'e4s051'],
  superlative: ['e4s009', 'e4s028', 'e4s050'],
  conjunction: ['e4s030', 'e4s058', 'e4s059'],
  'other-eiken4': ['e4s022', 'e4s044', 'e4s045'],
};
