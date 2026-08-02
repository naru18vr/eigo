import type { Eiken4GrammarCategoryId } from './eiken4GrammarCategories';

/**
 * 文法別の復習判定に必要なIDだけを持つ軽量な索引です。
 * 問題本文は文法練習・復習ページを開いたときに読み込みます。
 */
export const EIKEN4_GRAMMAR_SENTENCE_IDS: Partial<Record<Eiken4GrammarCategoryId, string[]>> = {
  'general-verb': ['e4s001', 'e4s018', 'e4s023', 'e4add-gv-01', 'e4add-gv-02', 'e4add-gv-03', 'e4add-gv-04', 'e4add-gv-05', 'e4add-gv-06', 'e4add-gv-07'],
  'past-tense': ['e4s002', 'e4s003', 'e4s011', 'e4s012', 'e4s031', 'e4s032', 'e4add-past-01', 'e4add-past-02', 'e4add-past-03', 'e4add-past-04'],
  'present-progressive': ['e4s013', 'e4s033', 'e4add-pres-01', 'e4add-pres-02', 'e4add-pres-03', 'e4add-pres-04', 'e4add-pres-05', 'e4add-pres-06', 'e4add-pres-07', 'e4add-pres-08'],
  'past-progressive': ['e4s014', 'e4s034', 'e4add-pastprog-01', 'e4add-pastprog-02', 'e4add-pastprog-03', 'e4add-pastprog-04', 'e4add-pastprog-05', 'e4add-pastprog-06', 'e4add-pastprog-07', 'e4add-pastprog-08'],
  future: ['e4s015', 'e4s016', 'e4s035', 'e4s036', 'e4s046', 'e4add-future-01', 'e4add-future-02', 'e4add-future-03', 'e4add-future-04', 'e4add-future-05'],
  'modal-verb': ['e4s004', 'e4s007', 'e4s017', 'e4s037', 'e4s038', 'e4s039', 'e4s040', 'e4add-modal-01', 'e4add-modal-02', 'e4add-modal-03'],
  'question-words': ['e4s024', 'e4s025', 'e4s026', 'e4s053', 'e4add-q-01', 'e4add-q-02', 'e4add-q-03', 'e4add-q-04', 'e4add-q-05', 'e4add-q-06'],
  imperative: ['e4s021', 'e4s048', 'e4add-imp-01', 'e4add-imp-02', 'e4add-imp-03', 'e4add-imp-04', 'e4add-imp-05', 'e4add-imp-06', 'e4add-imp-07', 'e4add-imp-08'],
  'there-is-are': ['e4s010', 'e4s029', 'e4s052', 'e4add-there-01', 'e4add-there-02', 'e4add-there-03', 'e4add-there-04', 'e4add-there-05', 'e4add-there-06', 'e4add-there-07'],
  infinitive: ['e4s019', 'e4s041', 'e4s047', 'e4add-inf-01', 'e4add-inf-02', 'e4add-inf-03', 'e4add-inf-04', 'e4add-inf-05', 'e4add-inf-06', 'e4add-inf-07'],
  gerund: ['e4s005', 'e4s006', 'e4s020', 'e4s042', 'e4s043', 'e4add-gerund-01', 'e4add-gerund-02', 'e4add-gerund-03', 'e4add-gerund-04', 'e4add-gerund-05'],
  comparative: ['e4s008', 'e4s027', 'e4s049', 'e4s051', 'e4add-comp-01', 'e4add-comp-02', 'e4add-comp-03', 'e4add-comp-04', 'e4add-comp-05', 'e4add-comp-06'],
  superlative: ['e4s009', 'e4s028', 'e4s050', 'e4add-super-01', 'e4add-super-02', 'e4add-super-03', 'e4add-super-04', 'e4add-super-05', 'e4add-super-06', 'e4add-super-07'],
  conjunction: ['e4s030', 'e4s058', 'e4s059', 'e4add-conj-01', 'e4add-conj-02', 'e4add-conj-03', 'e4add-conj-04', 'e4add-conj-05', 'e4add-conj-06', 'e4add-conj-07'],
  'other-eiken4': ['e4s022', 'e4s044', 'e4s045', 'e4add-other-01', 'e4add-other-02', 'e4add-other-03', 'e4add-other-04', 'e4add-other-05', 'e4add-other-06', 'e4add-other-07'],
};
