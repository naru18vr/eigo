export interface GrammarGuideCheckQuestion {
  id: string;
  grammarId: string;
  videoId?: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  order: number;
}

import { EIKEN4_ADDITIONAL_GRAMMAR_GUIDE_CHECKS } from './eiken4AdditionalGrammarGuideChecks';

// 文法ガイドの確認問題は、画面ではなくここで単元・動画ごとに管理する。
export const EIKEN4_GRAMMAR_GUIDE_CHECKS: GrammarGuideCheckQuestion[] = [
  { id: 'basic-01', grammarId: 'basic', prompt: '「私は毎日テニスをします」に合う文は？', choices: ['I play tennis every day.', 'I playing tennis every day.', 'I played tennis every day.'], correctAnswer: 'I play tennis every day.', explanation: '毎日のことは play のように動詞をそのまま使うよ。', order: 1 },
  { id: 'present-progressive-01', grammarId: 'present-progressive', prompt: '「彼は今本を読んでいます」に合う文は？', choices: ['He reads a book now.', 'He is reading a book now.', 'He read a book now.'], correctAnswer: 'He is reading a book now.', explanation: '今している途中なので is reading を使うよ。', order: 1 },
  { id: 'past-01', grammarId: 'past', prompt: '「私はそのとき夕食を作っていました」に合う文は？', choices: ['I cooked dinner then.', 'I was cooking dinner then.', 'I am cooking dinner then.'], correctAnswer: 'I was cooking dinner then.', explanation: '「している途中だった」なので was + cooking。', order: 1 },

  // 第1章 未来を表す文
  { id: 'future-going-to-affirmative-01', grammarId: 'future', videoId: 'future-going-to', prompt: '「私は明日勉強する予定です」に合う文は？', choices: ['I am going to study tomorrow.', 'I going to study tomorrow.', 'I will to study tomorrow.'], correctAnswer: 'I am going to study tomorrow.', explanation: 'be going to の前には am / is / are を使うよ。', order: 1 },
  { id: 'future-going-to-question-negative-01', grammarId: 'future', videoId: 'future-going-to-question-negative', prompt: '「あなたは今夜勉強する予定ですか」に合う文は？', choices: ['Are you going to study tonight?', 'Do you going to study tonight?', 'Are you go to study tonight?'], correctAnswer: 'Are you going to study tonight?', explanation: 'be going to の疑問文は be動詞を文の先頭に置くよ。', order: 2 },
  { id: 'future-will-affirmative-01', grammarId: 'future', videoId: 'future-will', prompt: 'I (　) help you tomorrow. に入る語は？', choices: ['will', 'am', 'will to'], correctAnswer: 'will', explanation: 'will の後ろは動詞の原形なので will help になるよ。', order: 3 },
  { id: 'future-will-question-negative-01', grammarId: 'future', videoId: 'future-will-question-negative', prompt: '「あなたは明日来ますか」に合う文は？', choices: ['Will you come tomorrow?', 'Do you will come tomorrow?', 'Will you to come tomorrow?'], correctAnswer: 'Will you come tomorrow?', explanation: 'will の疑問文は Will + 主語 + 動詞の原形？だよ。', order: 4 },

  // 第3章 接続詞
  { id: 'conjunction-that-01', grammarId: 'conjunction', videoId: 'conjunction-that', prompt: 'I think (　) she is kind. に入る語は？', choices: ['that', 'if', 'because'], correctAnswer: 'that', explanation: 'I think that ～. は「私は～と思う」という形だよ。', order: 1 },
  { id: 'conjunction-if-01', grammarId: 'conjunction', videoId: 'conjunction-if', prompt: 'If it rains, I (　) stay home. に入る語は？', choices: ['will', 'am', 'did'], correctAnswer: 'will', explanation: '「もし雨なら、家にいるでしょう」なので will を使うよ。', order: 2 },
  { id: 'conjunction-when-01', grammarId: 'conjunction', videoId: 'conjunction-when', prompt: 'Call me when you (　) home. に入る語は？', choices: ['get', 'will get', 'got'], correctAnswer: 'get', explanation: '未来のことでも when の中は現在形にするよ。', order: 3 },
  { id: 'conjunction-because-01', grammarId: 'conjunction', videoId: 'conjunction-because', prompt: 'I stayed home (　) it was raining. に入る語は？', choices: ['because', 'if', 'when'], correctAnswer: 'because', explanation: '理由を表す「～なので」は because だよ。', order: 4 },

  // 第4章 不定詞
  { id: 'infinitive-purpose-01', grammarId: 'infinitive', videoId: 'infinitive-purpose', prompt: 'I went to the library (　) study. に入る語は？', choices: ['to', 'for', 'at'], correctAnswer: 'to', explanation: '「～するために」は to + 動詞の原形で表すよ。', order: 1 },
  { id: 'infinitive-emotion-01', grammarId: 'infinitive', videoId: 'infinitive-emotion', prompt: 'I am happy (　) see you. に入る語は？', choices: ['to', 'for', 'at'], correctAnswer: 'to', explanation: '「～してうれしい」は happy to + 動詞の原形だよ。', order: 2 },
  { id: 'infinitive-adjective-01', grammarId: 'infinitive', videoId: 'infinitive-adjective', prompt: 'I have a book (　) read. に入る語は？', choices: ['to', 'for', 'at'], correctAnswer: 'to', explanation: '「読むための本」は a book to read の形だよ。', order: 3 },
  { id: 'infinitive-it-is-01', grammarId: 'infinitive', videoId: 'infinitive-it-is', prompt: 'It is important (　) listen carefully. に入る語は？', choices: ['to', 'for', 'at'], correctAnswer: 'to', explanation: 'It is important to ～. は「～することが大切」という形だよ。', order: 4 },

  { id: 'gerund-01', grammarId: 'gerund', videoId: 'gerund-basic', prompt: 'Ken enjoys (　) soccer. に入る語は？', choices: ['play', 'to playing', 'playing'], correctAnswer: 'playing', explanation: 'enjoy の後は動名詞 playing を使うよ。', order: 1 },

  // 第7章 比較表現
  { id: 'comparison-comparative-01', grammarId: 'comparison', videoId: 'comparative-er', prompt: 'Tom is (　) than Ken. に入る語は？', choices: ['taller', 'tallest', 'more tall'], correctAnswer: 'taller', explanation: '2つを比べる「より高い」は taller than だよ。', order: 1 },
  { id: 'comparison-superlative-01', grammarId: 'comparison', videoId: 'superlative-est', prompt: 'This is (　) lake in Japan. に入る語は？', choices: ['the largest', 'larger', 'largest'], correctAnswer: 'the largest', explanation: '3つ以上の中で一番なので the largest を使うよ。', order: 2 },
  { id: 'comparison-more-most-01', grammarId: 'comparison', videoId: 'comparison-more-most', prompt: 'This is (　) interesting book. に入る語は？', choices: ['the most', 'more', 'the more'], correctAnswer: 'the most', explanation: '長い形容詞の最上級は the most + 形容詞だよ。', order: 3 },
  { id: 'comparison-irregular-01', grammarId: 'comparison', videoId: 'comparison-irregular', prompt: 'This is (　) movie of the three. に入る語は？', choices: ['the best', 'better', 'the better'], correctAnswer: 'the best', explanation: 'good の最上級は best。3つの中で一番なので the best だよ。', order: 4 },
  { id: 'comparison-as-as-01', grammarId: 'comparison', videoId: 'comparison-as-as', prompt: 'Ken is as (　) as Tom. に入る語は？', choices: ['tall', 'taller', 'tallest'], correctAnswer: 'tall', explanation: 'as ～ as の中は形容詞の原級を使うよ。', order: 5 },

  // その他の単元は、まず1問で確認する。
  { id: 'modal-have-to-01', grammarId: 'modal', videoId: 'modal-have-to', prompt: 'I (　) wear a uniform. に入る語は？', choices: ['have to', 'has to', 'having to'], correctAnswer: 'have to', explanation: '主語が I なので have to を使うよ。', order: 1 },
  { id: 'modal-have-to-question-negative-01', grammarId: 'modal', videoId: 'modal-have-to-question-negative', prompt: 'I (　) have to hurry. に入る語は？', choices: ["don't", "doesn't", 'not'], correctAnswer: "don't", explanation: 'I の否定は do not（短縮形 don’t）だよ。', order: 2 },
  { id: 'modal-must-01', grammarId: 'modal', videoId: 'modal-must', prompt: 'You (　) do your homework. に入る語は？', choices: ['must', 'must to', 'are must'], correctAnswer: 'must', explanation: 'must の後ろは動詞の原形だよ。', order: 3 },
  { id: 'modal-must-question-negative-01', grammarId: 'modal', videoId: 'modal-must-question-negative', prompt: 'You (　) not run here. に入る語は？', choices: ['must', "don't must", 'are must'], correctAnswer: 'must', explanation: '「～してはいけない」は must not だよ。', order: 4 },
  { id: 'give-01', grammarId: 'give', prompt: '「彼は私に写真を見せました」に合う文は？', choices: ['He showed me a picture.', 'He showed a picture me.', 'He show me a picture.'], correctAnswer: 'He showed me a picture.', explanation: 'showed + 人(me) + もの(a picture) の順番だよ。', order: 1 },
  { id: 'there-01', grammarId: 'there', prompt: '(　) three students in the room. に入る語は？', choices: ['There is', 'There are', 'It is'], correctAnswer: 'There are', explanation: 'three students は複数なので There are だよ。', order: 1 },
];

EIKEN4_GRAMMAR_GUIDE_CHECKS.push(...EIKEN4_ADDITIONAL_GRAMMAR_GUIDE_CHECKS);

export const getGrammarGuideCheckQuestions = (grammarId: string) => EIKEN4_GRAMMAR_GUIDE_CHECKS
  .filter(question => question.grammarId === grammarId)
  .sort((left, right) => left.order - right.order);
