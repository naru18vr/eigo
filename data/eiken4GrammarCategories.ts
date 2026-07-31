import type { Sentence } from '../types';

export type Eiken4GrammarCategoryId =
  | 'general-verb' | 'past-tense' | 'present-progressive' | 'past-progressive'
  | 'future' | 'modal-verb' | 'question-words' | 'imperative' | 'there-is-are'
  | 'infinitive' | 'gerund' | 'comparative' | 'superlative' | 'conjunction' | 'other-eiken4';

export type Eiken4GrammarCategory = {
  id: Eiken4GrammarCategoryId;
  title: string;
  description: string;
  guideTopic?: string;
  matches: (sentence: Sentence) => boolean;
};

const tag = (sentence: Sentence) => sentence.grammarTag;
const words = (sentence: Sentence) => sentence.words.join(' ');

// 画面表示・問題データ・学習履歴で共通利用する、表記ゆれのないカテゴリ定義。
export const EIKEN4_GRAMMAR_CATEGORIES: Eiken4GrammarCategory[] = [
  { id: 'general-verb', title: '一般動詞', description: '「する・行く」など、動きを表す文', guideTopic: 'basic', matches: sentence => /^(get up|want＋名詞|道案内)$/.test(tag(sentence)) },
  { id: 'past-tense', title: '過去形', description: '昨日したことを表す文', guideTopic: 'past', matches: sentence => /^(過去形|過去形の疑問文|過去形の否定文|不規則動詞)$/.test(tag(sentence)) },
  { id: 'present-progressive', title: '現在進行形', description: '今していることを表す文', guideTopic: 'present-progressive', matches: sentence => tag(sentence) === '現在進行形' },
  { id: 'past-progressive', title: '過去進行形', description: 'そのときしていたことを表す文', guideTopic: 'past', matches: sentence => tag(sentence) === '過去進行形' },
  { id: 'future', title: '未来を表す表現', description: 'これからすることを表す文', guideTopic: 'future', matches: sentence => /^(be going to|未来 will|Will you \.\.\.\?)$/.test(tag(sentence)) },
  { id: 'modal-verb', title: '助動詞', description: 'できる・すべき・してはいけないを表す文', guideTopic: 'modal', matches: sentence => /^(Can I \.\.\.\?|May I \.\.\.\?|must not|should|have to)$/.test(tag(sentence)) },
  { id: 'question-words', title: '疑問詞', description: '何・どこ・どのくらいをたずねる文', guideTopic: 'basic', matches: sentence => /^(How often \.\.\.\?|How long \.\.\.\?|How many \.\.\.\?|疑問詞 What)$/.test(tag(sentence)) },
  { id: 'imperative', title: '命令文', description: '〜してください・〜しましょうの文', guideTopic: 'basic', matches: sentence => /^Let's \.\.$/.test(tag(sentence)) || /^(Please|Let's)/.test(words(sentence)) },
  { id: 'there-is-are', title: 'There is / There are', description: '〜があります・いますを表す文', guideTopic: 'there', matches: sentence => /^There (is|are)/.test(tag(sentence)) },
  { id: 'infinitive', title: 'to不定詞', description: '〜すること・〜するためにを表す文', guideTopic: 'infinitive', matches: sentence => /^(want to|目的の不定詞|Would you like to \.\.\.\?)$/.test(tag(sentence)) },
  { id: 'gerund', title: '動名詞', description: '〜することを表す動詞ingの文', guideTopic: 'gerund', matches: sentence => /^動名詞/.test(tag(sentence)) },
  { id: 'comparative', title: '比較級', description: '2つのものを比べる文', guideTopic: 'comparison', matches: sentence => /^(比較級|as \.\.\. as)$/.test(tag(sentence)) },
  { id: 'superlative', title: '最上級', description: '3つ以上の中で一番を表す文', guideTopic: 'comparison', matches: sentence => tag(sentence) === '最上級' },
  { id: 'conjunction', title: '接続詞', description: '文と文をつなぐ表現', guideTopic: 'conjunction', matches: sentence => /^(because|接続詞 if|接続詞 when)$/.test(tag(sentence)) },
  { id: 'other-eiken4', title: 'その他の英検4級文法', description: '人にものを渡す・見せるなどの表現', guideTopic: 'give', matches: sentence => /^(show|give|make|teach)＋人＋物$/.test(tag(sentence)) },
];

export const getEiken4GrammarCategory = (categoryId: string | null | undefined) =>
  EIKEN4_GRAMMAR_CATEGORIES.find(category => category.id === categoryId);

export const getEiken4GrammarCategoryId = (sentence: Sentence): Eiken4GrammarCategoryId | undefined =>
  EIKEN4_GRAMMAR_CATEGORIES.find(category => category.matches(sentence))?.id;

export const getEiken4GrammarCategoryForGuideTopic = (guideTopic: string) =>
  EIKEN4_GRAMMAR_CATEGORIES.find(category => category.guideTopic === guideTopic);

export const getEiken4GrammarCategoriesForGuideTopic = (guideTopic: string) =>
  EIKEN4_GRAMMAR_CATEGORIES.filter(category => category.guideTopic === guideTopic);
