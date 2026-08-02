import type { Eiken4GrammarCategoryId } from './eiken4GrammarCategories';

/**
 * 英検4級トップで次の動画だけを案内するための軽量な索引です。
 * URL・章情報などの詳細は、動画一覧または文法ガイドを開いたときに読み込みます。
 */
export type Eiken4GrammarVideoSummary = {
  id: string;
  grammarId: string;
  title: string;
  required: true;
};

export const EIKEN4_VIDEO_CATEGORY_ALIASES: Record<string, Eiken4GrammarCategoryId[]> = {
  'sentence-pattern': ['other-eiken4'],
  'question-word-infinitive': ['infinitive'],
  'that-clause': ['conjunction'],
  comparison: ['comparative', 'superlative'],
  conversation: ['modal-verb'],
};

export const EIKEN4_REQUIRED_VIDEO_SUMMARIES: Eiken4GrammarVideoSummary[] = [
  { id: 'future-going-to', grammarId: 'future', title: '未来の予定を表す be going to ～', required: true },
  { id: 'future-going-to-question-negative', grammarId: 'future', title: 'be going to ～ の疑問文・否定文', required: true },
  { id: 'future-will', grammarId: 'future', title: 'will ～ の文', required: true },
  { id: 'future-will-question-negative', grammarId: 'future', title: 'Will you ～? ／ I will not ～. の文', required: true },
  { id: 'conjunction-that', grammarId: 'conjunction', title: 'I think that ～. の文', required: true },
  { id: 'conjunction-if', grammarId: 'conjunction', title: 'if ～ の文', required: true },
  { id: 'conjunction-when', grammarId: 'conjunction', title: 'when ～ の文', required: true },
  { id: 'conjunction-because', grammarId: 'conjunction', title: 'because ～ の文', required: true },
  { id: 'infinitive-purpose', grammarId: 'infinitive', title: 'to + 動詞の原形「～するために」', required: true },
  { id: 'infinitive-emotion', grammarId: 'infinitive', title: 'to + 動詞の原形「～して」', required: true },
  { id: 'infinitive-adjective', grammarId: 'infinitive', title: 'to + 動詞の原形「～するべき、～するための」', required: true },
  { id: 'modal-have-to', grammarId: 'modal-verb', title: 'I have to ～. の文', required: true },
  { id: 'modal-have-to-question-negative', grammarId: 'modal-verb', title: 'I have to ～. の疑問文・否定文', required: true },
  { id: 'modal-must', grammarId: 'modal-verb', title: 'must ～ の文', required: true },
  { id: 'modal-must-question-negative', grammarId: 'modal-verb', title: 'Must I ～? ／ You must not ～. の文', required: true },
  { id: 'gerund-basic', grammarId: 'gerund', title: '「動名詞」とは？', required: true },
  { id: 'comparative-er', grammarId: 'comparative', title: '比較の表現①（-er）', required: true },
  { id: 'superlative-est', grammarId: 'superlative', title: '比較の表現②（-est）', required: true },
  { id: 'comparison-more-most', grammarId: 'comparison', title: '注意すべき比較変化①（more ／ most）', required: true },
  { id: 'comparison-irregular', grammarId: 'comparison', title: '注意すべき比較変化②（不規則変化）', required: true },
  { id: 'comparison-as-as', grammarId: 'comparison', title: '比較の表現③（as ... as ～）', required: true },
  { id: 'conversation-may-i', grammarId: 'conversation', title: 'May I ～？ の文', required: true },
  { id: 'conversation-could-you', grammarId: 'conversation', title: 'Could you ～？ の文', required: true },
];

export const EIKEN4_TOTAL_VIDEO_COUNT = 31;

export const getRequiredGrammarVideoSummaries = (grammarId: string) => EIKEN4_REQUIRED_VIDEO_SUMMARIES
  .filter(video => video.grammarId === grammarId || EIKEN4_VIDEO_CATEGORY_ALIASES[video.grammarId]?.includes(grammarId as Eiken4GrammarCategoryId));
