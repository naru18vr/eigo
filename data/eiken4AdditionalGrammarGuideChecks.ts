import type { GrammarGuideCheckQuestion } from './eiken4GrammarGuideData';

/** 主要単元を1問で終わらせないための追加確認問題。 */
export const EIKEN4_ADDITIONAL_GRAMMAR_GUIDE_CHECKS: GrammarGuideCheckQuestion[] = [
  { id: 'future-guide-05', grammarId: 'future', videoId: 'future-going-to', prompt: '「彼は来週サッカーをする予定です」に合う文は？', choices: ['He is going to play soccer next week.', 'He going to plays soccer next week.', 'He will to play soccer next week.'], correctAnswer: 'He is going to play soccer next week.', explanation: '主語が he なので is going to + 動詞の原形だよ。', order: 5 },
  { id: 'future-guide-06', grammarId: 'future', videoId: 'future-going-to-question-negative', prompt: '「彼女は明日来る予定ではありません」に合う文は？', choices: ["She isn't going to come tomorrow.", "She doesn't going to come tomorrow.", "She isn't go to come tomorrow."], correctAnswer: "She isn't going to come tomorrow.", explanation: 'be going to の否定は be動詞の後ろに not を置くよ。', order: 6 },
  { id: 'future-guide-07', grammarId: 'future', videoId: 'future-will', prompt: 'I (　) call you tonight. に入る語は？', choices: ['will', 'am going', 'will to'], correctAnswer: 'will', explanation: 'will の後ろは call のような動詞の原形だよ。', order: 7 },
  { id: 'future-guide-08', grammarId: 'future', videoId: 'future-will-question-negative', prompt: '「私はその会議に行きません」に合う文は？', choices: ["I will not go to the meeting.", "I will not going to the meeting.", "I don't will go to the meeting."], correctAnswer: "I will not go to the meeting.", explanation: 'will の否定は will not + 動詞の原形だよ。', order: 8 },

  { id: 'conjunction-guide-05', grammarId: 'conjunction', videoId: 'conjunction-that', prompt: 'She knows (　) I like music. に入る語は？', choices: ['that', 'if', 'because'], correctAnswer: 'that', explanation: 'know that ～ で「～だと知っている」という形だよ。', order: 5 },
  { id: 'conjunction-guide-06', grammarId: 'conjunction', videoId: 'conjunction-if', prompt: 'If you are hungry, you (　) eat this sandwich. に入る語は？', choices: ['can', 'did', 'were'], correctAnswer: 'can', explanation: '条件の文でも、できることは can で表せるよ。', order: 6 },
  { id: 'conjunction-guide-07', grammarId: 'conjunction', videoId: 'conjunction-when', prompt: 'I listen to music when I (　) my homework. に入る語は？', choices: ['finish', 'will finish', 'finished'], correctAnswer: 'finish', explanation: '習慣を表す when の中は現在形にするよ。', order: 7 },
  { id: 'conjunction-guide-08', grammarId: 'conjunction', videoId: 'conjunction-because', prompt: 'We stayed inside (　) it was cold. に入る語は？', choices: ['because', 'if', 'when'], correctAnswer: 'because', explanation: '寒かった「ので」という理由なので because だよ。', order: 8 },

  { id: 'infinitive-guide-05', grammarId: 'infinitive', videoId: 'infinitive-purpose', prompt: 'I got up early (　) catch the first train. に入る語は？', choices: ['to', 'for', 'at'], correctAnswer: 'to', explanation: '「～するために」は to + 動詞の原形だよ。', order: 5 },
  { id: 'infinitive-guide-06', grammarId: 'infinitive', videoId: 'infinitive-emotion', prompt: 'She was surprised (　) see the snow. に入る語は？', choices: ['to', 'for', 'on'], correctAnswer: 'to', explanation: '感情の理由を表す surprised to ～ の形だよ。', order: 6 },
  { id: 'infinitive-guide-07', grammarId: 'infinitive', videoId: 'infinitive-adjective', prompt: 'I need a pen (　) write this note. に入る語は？', choices: ['to', 'for', 'with'], correctAnswer: 'to', explanation: 'pen to write で「書くためのペン」だよ。', order: 7 },
  { id: 'infinitive-guide-08', grammarId: 'infinitive', videoId: 'infinitive-it-is', prompt: 'It is useful (　) learn English. に入る語は？', choices: ['to', 'at', 'for'], correctAnswer: 'to', explanation: 'It is + 形容詞 + to ～ の形だよ。', order: 8 },

  { id: 'modal-guide-05', grammarId: 'modal', videoId: 'modal-have-to', prompt: 'My brother (　) get up early tomorrow. に入る語は？', choices: ['has to', 'have to', 'having to'], correctAnswer: 'has to', explanation: '主語が my brother なので has to だよ。', order: 5 },
  { id: 'modal-guide-06', grammarId: 'modal', videoId: 'modal-have-to-question-negative', prompt: 'You (　) bring your own lunch. に入る語は？', choices: ["don't have to", "mustn't to", "doesn't have to"], correctAnswer: "don't have to", explanation: 'You の「～する必要はない」は don’t have to だよ。', order: 6 },
  { id: 'modal-guide-07', grammarId: 'modal', videoId: 'modal-must', prompt: 'We (　) be quiet in the library. に入る語は？', choices: ['must', 'must to', 'are must'], correctAnswer: 'must', explanation: 'must の後ろは be のような動詞の原形だよ。', order: 7 },
  { id: 'modal-guide-08', grammarId: 'modal', videoId: 'modal-must-question-negative', prompt: 'Must I finish this today? ― No, you (　). に入る語は？', choices: ["don't have to", "mustn't", "can't to"], correctAnswer: "don't have to", explanation: 'must の質問に「必要ない」と答えるときは don’t have to だよ。', order: 8 },

  { id: 'comparison-guide-06', grammarId: 'comparison', videoId: 'comparative-er', prompt: 'My bag is (　) than yours. に入る語は？', choices: ['smaller', 'smallest', 'the small'], correctAnswer: 'smaller', explanation: '2つを比べる than の前は比較級 smaller だよ。', order: 6 },
  { id: 'comparison-guide-07', grammarId: 'comparison', videoId: 'superlative-est', prompt: 'This is the (　) river in the country. に入る語は？', choices: ['longest', 'longer', 'long'], correctAnswer: 'longest', explanation: '国の中で一番なので the longest だよ。', order: 7 },
  { id: 'comparison-guide-08', grammarId: 'comparison', videoId: 'comparison-more-most', prompt: 'This exercise is (　) difficult than that one. に入る語は？', choices: ['more', 'most', 'the more'], correctAnswer: 'more', explanation: '長い形容詞の比較級は more + 形容詞だよ。', order: 8 },
  { id: 'comparison-guide-09', grammarId: 'comparison', videoId: 'comparison-irregular', prompt: 'This is (　) song of the three. に入る語は？', choices: ['the best', 'better', 'the good'], correctAnswer: 'the best', explanation: 'good の最上級は best だよ。', order: 9 },
  { id: 'comparison-guide-10', grammarId: 'comparison', videoId: 'comparison-as-as', prompt: 'This desk is as (　) as that one. に入る語は？', choices: ['clean', 'cleaner', 'cleanest'], correctAnswer: 'clean', explanation: 'as ～ as の中は形容詞の原級だよ。', order: 10 },

  { id: 'gerund-guide-02', grammarId: 'gerund', videoId: 'gerund-basic', prompt: 'She finished (　) the letter. に入る語は？', choices: ['writing', 'write', 'to writing'], correctAnswer: 'writing', explanation: 'finish の後ろは動名詞 writing だよ。', order: 2 },
  { id: 'gerund-guide-03', grammarId: 'gerund', videoId: 'gerund-basic', prompt: '(　) English is useful. に入る語は？', choices: ['Learning', 'Learn', 'To learning'], correctAnswer: 'Learning', explanation: '動名詞を文の主語にして「学ぶこと」と言えるよ。', order: 3 },
  { id: 'gerund-guide-04', grammarId: 'gerund', videoId: 'gerund-basic', prompt: 'He practices (　) every day. に入る語は？', choices: ['speaking', 'speak', 'to speaking'], correctAnswer: 'speaking', explanation: 'practice の後ろは動名詞 speaking だよ。', order: 4 },

  { id: 'basic-guide-02', grammarId: 'basic', prompt: '「あなたは毎日英語を勉強しますか」に合う文は？', choices: ['Do you study English every day?', 'Are you study English every day?', 'Does you study English every day?'], correctAnswer: 'Do you study English every day?', explanation: '主語が you の一般動詞疑問文は Do で始めるよ。', order: 2 },
  { id: 'basic-guide-03', grammarId: 'basic', prompt: '「彼女は13歳です」に合う文は？', choices: ['She is thirteen.', 'She are thirteen.', 'She has thirteen.'], correctAnswer: 'She is thirteen.', explanation: '年齢は be動詞 is を使って表すよ。', order: 3 },
  { id: 'basic-guide-04', grammarId: 'basic', prompt: '「窓を開けてもいいですか」に合う文は？', choices: ['Can I open the window?', 'Do I can open the window?', 'Can I opening the window?'], correctAnswer: 'Can I open the window?', explanation: 'Can I + 動詞の原形で許可をたずねるよ。', order: 4 },
  { id: 'basic-guide-05', grammarId: 'basic', prompt: '「これは誰のかばんですか」に合う文は？', choices: ['Whose bag is this?', 'Who bag is this?', 'Whose is bag this?'], correctAnswer: 'Whose bag is this?', explanation: 'Whose + 名詞で「誰の～」を表すよ。', order: 5 },

  { id: 'past-guide-02', grammarId: 'past', prompt: '「私は先週その本を読みました」に合う文は？', choices: ['I read the book last week.', 'I readed the book last week.', 'I am read the book last week.'], correctAnswer: 'I read the book last week.', explanation: 'read はつづりが同じで、過去形では発音が変わる不規則動詞だよ。', order: 2 },
  { id: 'past-guide-03', grammarId: 'past', prompt: '「彼らはそのとき走っていました」に合う文は？', choices: ['They were running then.', 'They was running then.', 'They are running then.'], correctAnswer: 'They were running then.', explanation: '複数の主語には were + 動詞ing を使うよ。', order: 3 },

  { id: 'there-guide-02', grammarId: 'there', prompt: '箱の中にペンが2本あります。に合う文は？', choices: ['There are two pens in the box.', 'There is two pens in the box.', 'It are two pens in the box.'], correctAnswer: 'There are two pens in the box.', explanation: 'two pens は複数なので There are だよ。', order: 2 },
  { id: 'there-guide-03', grammarId: 'there', prompt: '公園の近くに病院はありません。に合う文は？', choices: ['There is no hospital near the park.', 'There are no hospital near the park.', 'There is not hospital near the park.'], correctAnswer: 'There is no hospital near the park.', explanation: '1つの hospital の存在を否定するので There is no だよ。', order: 3 },

  { id: 'give-guide-02', grammarId: 'give', prompt: '「母は私に新しい時計をくれました」に合う文は？', choices: ['My mother gave me a new watch.', 'My mother gave a new watch me.', 'My mother give me a new watch.'], correctAnswer: 'My mother gave me a new watch.', explanation: 'give + 人 + もの の順番にするよ。', order: 2 },
];
