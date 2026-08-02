import { EIKEN4_GRAMMAR_CATEGORIES, type Eiken4GrammarCategoryId } from './eiken4GrammarCategories';
import { EIKEN4_VIDEO_CATEGORY_ALIASES } from './eiken4GrammarVideoSummary';

export interface Eiken4GrammarVideo {
  id: string;
  grammarId: string;
  chapter: number;
  chapterTitle: string;
  title: string;
  url: string;
  order: number;
  required: boolean;
  provider: 'try-it';
  loginRequired: boolean;
}

// トライイット側の単元名と、アプリ内の問題カテゴリが異なる補助単元を対応づける。
// 動画一覧から既存の文法ガイドへ移動するときだけ使う対応表です。
// 動画側にしかない単元も、学習を止めずに利用できるガイドへ案内します。
const VIDEO_GUIDE_CATEGORY_ALIASES: Record<string, Eiken4GrammarCategoryId[]> = {
  ...EIKEN4_VIDEO_CATEGORY_ALIASES,
  passive: ['other-eiken4'],
};

export const EIKEN4_GRAMMAR_VIDEOS: Eiken4GrammarVideo[] = [
  { id: 'future-going-to', grammarId: 'future', chapter: 1, chapterTitle: '未来を表す文', title: '未来の予定を表す be going to ～', url: 'https://student.try-it.jp/videos/8345/39419', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'future-going-to-question-negative', grammarId: 'future', chapter: 1, chapterTitle: '未来を表す文', title: 'be going to ～ の疑問文・否定文', url: 'https://student.try-it.jp/videos/8346/39420', order: 2, required: true, provider: 'try-it', loginRequired: true },
  { id: 'future-will', grammarId: 'future', chapter: 1, chapterTitle: '未来を表す文', title: 'will ～ の文', url: 'https://student.try-it.jp/videos/8347/39421', order: 3, required: true, provider: 'try-it', loginRequired: true },
  { id: 'future-will-question-negative', grammarId: 'future', chapter: 1, chapterTitle: '未来を表す文', title: 'Will you ～? ／ I will not ～. の文', url: 'https://student.try-it.jp/videos/8348/39422', order: 4, required: true, provider: 'try-it', loginRequired: true },

  { id: 'sentence-show-a-b', grammarId: 'sentence-pattern', chapter: 2, chapterTitle: 'give・callの文', title: 'show A B の文', url: 'https://student.try-it.jp/videos/8349/39423', order: 1, required: false, provider: 'try-it', loginRequired: true },
  { id: 'sentence-call-a-b', grammarId: 'sentence-pattern', chapter: 2, chapterTitle: 'give・callの文', title: 'call A B の文', url: 'https://student.try-it.jp/videos/8350/39424', order: 2, required: false, provider: 'try-it', loginRequired: true },

  { id: 'conjunction-that', grammarId: 'conjunction', chapter: 3, chapterTitle: '接続詞', title: 'I think that ～. の文', url: 'https://student.try-it.jp/videos/8351/39425', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'conjunction-if', grammarId: 'conjunction', chapter: 3, chapterTitle: '接続詞', title: 'if ～ の文', url: 'https://student.try-it.jp/videos/8352/39426', order: 2, required: true, provider: 'try-it', loginRequired: true },
  { id: 'conjunction-when', grammarId: 'conjunction', chapter: 3, chapterTitle: '接続詞', title: 'when ～ の文', url: 'https://student.try-it.jp/videos/8353/39427', order: 3, required: true, provider: 'try-it', loginRequired: true },
  { id: 'conjunction-because', grammarId: 'conjunction', chapter: 3, chapterTitle: '接続詞', title: 'because ～ の文', url: 'https://student.try-it.jp/videos/8354/39428', order: 4, required: true, provider: 'try-it', loginRequired: true },

  { id: 'infinitive-purpose', grammarId: 'infinitive', chapter: 4, chapterTitle: '不定詞', title: 'to + 動詞の原形「～するために」', url: 'https://student.try-it.jp/videos/8355/39429', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'infinitive-emotion', grammarId: 'infinitive', chapter: 4, chapterTitle: '不定詞', title: 'to + 動詞の原形「～して」', url: 'https://student.try-it.jp/videos/8356/39430', order: 2, required: true, provider: 'try-it', loginRequired: true },
  { id: 'infinitive-adjective', grammarId: 'infinitive', chapter: 4, chapterTitle: '不定詞', title: 'to + 動詞の原形「～するべき、～するための」', url: 'https://student.try-it.jp/videos/8357/39431', order: 3, required: true, provider: 'try-it', loginRequired: true },
  { id: 'infinitive-it-is', grammarId: 'infinitive', chapter: 4, chapterTitle: '不定詞', title: "It's important to ～. の文", url: 'https://student.try-it.jp/videos/8358/39432', order: 4, required: false, provider: 'try-it', loginRequired: true },

  { id: 'modal-have-to', grammarId: 'modal-verb', chapter: 5, chapterTitle: '助動詞', title: 'I have to ～. の文', url: 'https://student.try-it.jp/videos/8359/39433', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'modal-have-to-question-negative', grammarId: 'modal-verb', chapter: 5, chapterTitle: '助動詞', title: 'I have to ～. の疑問文・否定文', url: 'https://student.try-it.jp/videos/8360/39434', order: 2, required: true, provider: 'try-it', loginRequired: true },
  { id: 'modal-must', grammarId: 'modal-verb', chapter: 5, chapterTitle: '助動詞', title: 'must ～ の文', url: 'https://student.try-it.jp/videos/8361/39435', order: 3, required: true, provider: 'try-it', loginRequired: true },
  { id: 'modal-must-question-negative', grammarId: 'modal-verb', chapter: 5, chapterTitle: '助動詞', title: 'Must I ～? ／ You must not ～. の文', url: 'https://student.try-it.jp/videos/8362/39436', order: 4, required: true, provider: 'try-it', loginRequired: true },

  { id: 'gerund-basic', grammarId: 'gerund', chapter: 6, chapterTitle: '動名詞ほか', title: '「動名詞」とは？', url: 'https://student.try-it.jp/videos/8363/39437', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'question-word-infinitive', grammarId: 'question-word-infinitive', chapter: 6, chapterTitle: '動名詞ほか', title: 'how to ～ ／ what to ～ などの文', url: 'https://student.try-it.jp/videos/8364/39438', order: 2, required: false, provider: 'try-it', loginRequired: true },
  { id: 'that-clause-sure', grammarId: 'that-clause', chapter: 6, chapterTitle: '動名詞ほか', title: "I'm sure that ～. などの文", url: 'https://student.try-it.jp/videos/8365/39439', order: 3, required: false, provider: 'try-it', loginRequired: true },

  { id: 'comparative-er', grammarId: 'comparative', chapter: 7, chapterTitle: '比較表現', title: '比較の表現①（-er）', url: 'https://student.try-it.jp/videos/8366/39440', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'superlative-est', grammarId: 'superlative', chapter: 7, chapterTitle: '比較表現', title: '比較の表現②（-est）', url: 'https://student.try-it.jp/videos/8367/39441', order: 2, required: true, provider: 'try-it', loginRequired: true },
  { id: 'comparison-more-most', grammarId: 'comparison', chapter: 7, chapterTitle: '比較表現', title: '注意すべき比較変化①（more ／ most）', url: 'https://student.try-it.jp/videos/8368/39442', order: 3, required: true, provider: 'try-it', loginRequired: true },
  { id: 'comparison-irregular', grammarId: 'comparison', chapter: 7, chapterTitle: '比較表現', title: '注意すべき比較変化②（不規則変化）', url: 'https://student.try-it.jp/videos/8369/39443', order: 4, required: true, provider: 'try-it', loginRequired: true },
  { id: 'comparison-as-as', grammarId: 'comparison', chapter: 7, chapterTitle: '比較表現', title: '比較の表現③（as ... as ～）', url: 'https://student.try-it.jp/videos/8370/39444', order: 5, required: true, provider: 'try-it', loginRequired: true },

  { id: 'passive-basic', grammarId: 'passive', chapter: 8, chapterTitle: '受身表現', title: '「受け身」とは？', url: 'https://student.try-it.jp/videos/8371/39445', order: 1, required: false, provider: 'try-it', loginRequired: true },
  { id: 'passive-past-participle', grammarId: 'passive', chapter: 8, chapterTitle: '受身表現', title: '注意すべき過去分詞', url: 'https://student.try-it.jp/videos/8372/39446', order: 2, required: false, provider: 'try-it', loginRequired: true },
  { id: 'passive-question-negative', grammarId: 'passive', chapter: 8, chapterTitle: '受身表現', title: '受け身の疑問文・否定文', url: 'https://student.try-it.jp/videos/8373/39447', order: 3, required: false, provider: 'try-it', loginRequired: true },

  { id: 'conversation-may-i', grammarId: 'conversation', chapter: 9, chapterTitle: '会話表現', title: 'May I ～？ の文', url: 'https://student.try-it.jp/videos/8374/39448', order: 1, required: true, provider: 'try-it', loginRequired: true },
  { id: 'conversation-could-you', grammarId: 'conversation', chapter: 9, chapterTitle: '会話表現', title: 'Could you ～？ の文', url: 'https://student.try-it.jp/videos/8375/39449', order: 2, required: true, provider: 'try-it', loginRequired: true },
];

export const getEiken4GrammarVideos = (grammarId: string) => EIKEN4_GRAMMAR_VIDEOS
  .filter(video => video.grammarId === grammarId || EIKEN4_VIDEO_CATEGORY_ALIASES[video.grammarId]?.includes(grammarId as Eiken4GrammarCategoryId))
  .sort((left, right) => left.chapter - right.chapter || left.order - right.order);

export const getEiken4VideoCategoryAliases = (grammarId: string) => EIKEN4_VIDEO_CATEGORY_ALIASES[grammarId] || [];

export const getEiken4GrammarGuideCategoryId = (grammarId: string): Eiken4GrammarCategoryId | undefined => {
  const direct = EIKEN4_GRAMMAR_CATEGORIES.find(category => category.id === grammarId);
  if (direct) return direct.id;
  return VIDEO_GUIDE_CATEGORY_ALIASES[grammarId]?.[0];
};
