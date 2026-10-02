import type { Sentence } from '../types';
import type { Eiken3ExamQuestion } from './eiken3ExamQuestions';
import type { Eiken3ListeningQuestion } from './eiken3Listening';
import type { Eiken3Reading } from './eiken3Readings';
import type { Eiken3Word } from './eiken3Words';

/**
 * 英検3級で初めてまとまって扱う文法・語彙を、基礎級からの追加教材として管理する。
 * 公式過去問の転載ではなく、学習用に作成したオリジナル問題です。
 */
export const eiken3GradeSpecificSentences: Sentence[] = [
  { id: 'e3-g3-s01', japaneseQuestion: '私はこの本を3回読んだことがあります。', words: ['I', 'have', 'read', 'this', 'book', 'three', 'times', '.'], grammarTag: '現在完了 経験', explanation: '「～したことがある」は have + 過去分詞で表します。', questionType: 'fill-blank' },
  { id: 'e3-g3-s02', japaneseQuestion: '彼女は2年間この学校で勉強しています。', words: ['She', 'has', 'studied', 'at', 'this', 'school', 'for', 'two', 'years', '.'], grammarTag: '現在完了 継続', explanation: 'for + 期間で、過去から今までの継続を表します。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s03', japaneseQuestion: '私はまだ昼食を食べていません。', words: ['I', 'have', 'not', 'eaten', 'lunch', 'yet', '.'], grammarTag: '現在完了 完了', explanation: '現在完了の否定文では、yetを文末に置いて「まだ」を表します。', questionType: 'reorder' },
  { id: 'e3-g3-s04', japaneseQuestion: 'あなたはもう宿題を終えましたか。', words: ['Have', 'you', 'finished', 'your', 'homework', 'yet', '?'], grammarTag: '現在完了 完了', explanation: 'Have + 主語 + 過去分詞で、完了したかをたずねます。', questionType: 'fill-blank' },
  { id: 'e3-g3-s05', japaneseQuestion: '私の兄は先週から病気です。', words: ['My', 'brother', 'has', 'been', 'sick', 'since', 'last', 'week', '.'], grammarTag: '現在完了 継続', explanation: 'since + 始まった時点で、状態の継続を表します。', questionType: 'reorder' },
  { id: 'e3-g3-s06', japaneseQuestion: '彼らはまだ京都へ行ったことがありません。', words: ['They', 'have', 'never', 'been', 'to', 'Kyoto', '.'], grammarTag: '現在完了 経験', explanation: 'have never been to ～で「一度も～へ行ったことがない」です。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s07', japaneseQuestion: '私は鍵をなくしてしまいました。', words: ['I', 'have', 'lost', 'my', 'keys', '.'], grammarTag: '現在完了 完了', explanation: 'have lostは、なくした結果が今も関係する表現です。', questionType: 'fill-blank' },
  { id: 'e3-g3-s08', japaneseQuestion: 'あなたは今までに外国へ行ったことがありますか。', words: ['Have', 'you', 'ever', 'been', 'to', 'a', 'foreign', 'country', '?'], grammarTag: '現在完了 経験', explanation: 'Have you ever ～?で経験をたずねます。', questionType: 'response' },

  { id: 'e3-g3-s09', japaneseQuestion: 'この橋は100年前に建てられました。', words: ['This', 'bridge', 'was', 'built', 'one', 'hundred', 'years', 'ago', '.'], grammarTag: '受け身', explanation: 'was + 過去分詞で、過去にされたことを表します。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s10', japaneseQuestion: '英語は多くの国で話されています。', words: ['English', 'is', 'spoken', 'in', 'many', 'countries', '.'], grammarTag: '受け身', explanation: 'is spokenは「話されている」という受け身です。', questionType: 'reorder' },
  { id: 'e3-g3-s11', japaneseQuestion: 'この写真は父によって撮られました。', words: ['This', 'picture', 'was', 'taken', 'by', 'my', 'father', '.'], grammarTag: '受け身', explanation: '行為者をby + 人で表します。', questionType: 'fill-blank' },
  { id: 'e3-g3-s12', japaneseQuestion: 'この部屋は毎日掃除されます。', words: ['This', 'room', 'is', 'cleaned', 'every', 'day', '.'], grammarTag: '受け身', explanation: '現在の習慣の受け身はis / are + 過去分詞です。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s13', japaneseQuestion: 'この歌は世界中で知られています。', words: ['This', 'song', 'is', 'known', 'around', 'the', 'world', '.'], grammarTag: '受け身', explanation: 'be knownで「知られている」です。', questionType: 'reorder' },
  { id: 'e3-g3-s14', japaneseQuestion: 'そのケーキは妹によって作られました。', words: ['The', 'cake', 'was', 'made', 'by', 'my', 'sister', '.'], grammarTag: '受け身', explanation: 'was madeはmakeの過去分詞を使った受け身です。', questionType: 'fill-blank' },
  { id: 'e3-g3-s15', japaneseQuestion: 'この本は日本語に翻訳されています。', words: ['This', 'book', 'is', 'translated', 'into', 'Japanese', '.'], grammarTag: '受け身', explanation: 'be translated into ～で「～語に翻訳される」です。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s16', japaneseQuestion: 'その窓は昨日割られました。', words: ['The', 'window', 'was', 'broken', 'yesterday', '.'], grammarTag: '受け身', explanation: 'was brokenはbreakの過去分詞brokenを使います。', questionType: 'reorder' },

  { id: 'e3-g3-s17', japaneseQuestion: 'これは私が昨日買ったかばんです。', words: ['This', 'is', 'the', 'bag', 'that', 'I', 'bought', 'yesterday', '.'], grammarTag: '関係代名詞', explanation: 'that以下がthe bagを詳しく説明しています。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s18', japaneseQuestion: '公園で走っている男の子は私の弟です。', words: ['The', 'boy', 'who', 'is', 'running', 'in', 'the', 'park', 'is', 'my', 'brother', '.'], grammarTag: '関係代名詞', explanation: 'who is running以下がthe boyを説明しています。', questionType: 'reorder' },
  { id: 'e3-g3-s19', japaneseQuestion: 'これは私が探していた本です。', words: ['This', 'is', 'the', 'book', 'which', 'I', 'was', 'looking', 'for', '.'], grammarTag: '関係代名詞', explanation: 'which以下が物のthe bookを説明しています。', questionType: 'fill-blank' },
  { id: 'e3-g3-s20', japaneseQuestion: '私を助けてくれた女性は先生です。', words: ['The', 'woman', 'who', 'helped', 'me', 'is', 'a', 'teacher', '.'], grammarTag: '関係代名詞', explanation: 'who helped meが人のthe womanを説明しています。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s21', japaneseQuestion: '私たちが泊まったホテルは海の近くにあります。', words: ['The', 'hotel', 'that', 'we', 'stayed', 'at', 'is', 'near', 'the', 'sea', '.'], grammarTag: '関係代名詞', explanation: 'that we stayed atがthe hotelを説明しています。', questionType: 'reorder' },
  { id: 'e3-g3-s22', japaneseQuestion: '彼がくれた時計はとても大切です。', words: ['The', 'watch', 'that', 'he', 'gave', 'me', 'is', 'very', 'special', '.'], grammarTag: '関係代名詞', explanation: 'that he gave meがthe watchを説明しています。', questionType: 'fill-blank' },
  { id: 'e3-g3-s23', japaneseQuestion: '私は京都に住んでいる友達がいます。', words: ['I', 'have', 'a', 'friend', 'who', 'lives', 'in', 'Kyoto', '.'], grammarTag: '関係代名詞', explanation: 'who lives in Kyotoがa friendを説明しています。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s24', japaneseQuestion: 'これは私たちが使う部屋です。', words: ['This', 'is', 'the', 'room', 'that', 'we', 'use', '.'], grammarTag: '関係代名詞', explanation: 'that we useがthe roomを説明しています。', questionType: 'reorder' },

  { id: 'e3-g3-s25', japaneseQuestion: '私は何をすればよいか分かりません。', words: ['I', 'do', 'not', 'know', 'what', 'to', 'do', '.'], grammarTag: '間接疑問', explanation: '疑問詞 + to + 動詞の原形で「何を～すべきか」です。', questionType: 'fill-blank' },
  { id: 'e3-g3-s26', japaneseQuestion: '彼女は駅への行き方を知っています。', words: ['She', 'knows', 'how', 'to', 'get', 'to', 'the', 'station', '.'], grammarTag: '間接疑問', explanation: 'how to getで「どうやって行くか」を表します。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s27', japaneseQuestion: 'あなたは彼がどこに住んでいるか知っていますか。', words: ['Do', 'you', 'know', 'where', 'he', 'lives', '?'], grammarTag: '間接疑問', explanation: '間接疑問ではwhereの後ろを「主語 + 動詞」の語順にします。', questionType: 'reorder' },
  { id: 'e3-g3-s28', japaneseQuestion: '私は彼女がなぜ怒っているのか分かりません。', words: ['I', 'do', 'not', 'know', 'why', 'she', 'is', 'angry', '.'], grammarTag: '間接疑問', explanation: 'why she is angryのように、疑問詞の後ろは普通の文の語順です。', questionType: 'fill-blank' },
  { id: 'e3-g3-s29', japaneseQuestion: '私は彼が正しいと思います。', words: ['I', 'think', 'that', 'he', 'is', 'right', '.'], grammarTag: '接続詞 that', explanation: 'think that ～で「～と思う」です。', questionType: 'sentence-choice' },
  { id: 'e3-g3-s30', japaneseQuestion: '雨が降っていたけれど、私たちは試合をしました。', words: ['Although', 'it', 'was', 'raining', ',', 'we', 'played', 'the', 'game', '.'], grammarTag: '接続詞 although', explanation: 'Although ～で「～だけれども」という逆接を表します。', questionType: 'reorder' },
];

export const eiken3GradeSpecificExamQuestions: Eiken3ExamQuestion[] = [
  { id: 'x3-001', type: '短文空所補充', prompt: 'I ( ___ ) this movie three times.', translation: '私はこの映画を3回見たことがあります。', choices: ['see', 'saw', 'have seen', 'am seeing'], answer: 'have seen', explanation: 'three timesという経験を現在完了で表します。' },
  { id: 'x3-002', type: '短文空所補充', prompt: 'This picture ( ___ ) by my sister yesterday.', translation: 'この写真は昨日、姉によって撮られました。', choices: ['takes', 'took', 'was taken', 'is taking'], answer: 'was taken', explanation: '「撮られた」という過去の受け身です。' },
  { id: 'x3-003', type: '短文空所補充', prompt: 'The girl ( ___ ) is playing the violin is my cousin.', translation: 'バイオリンを弾いている女の子は私のいとこです。', choices: ['which', 'who', 'where', 'when'], answer: 'who', explanation: '人を説明するのでwhoを使います。' },
  { id: 'x3-004', type: '短文空所補充', prompt: 'Do you know ( ___ ) he lives?', translation: 'あなたは彼がどこに住んでいるか知っていますか。', choices: ['where', 'where does', 'what does', 'which does'], answer: 'where', explanation: '間接疑問ではwhere he livesの語順です。' },
  { id: 'x3-005', type: '短文空所補充', prompt: 'I have lived here ( ___ ) 2022.', translation: '私は2022年からここに住んでいます。', choices: ['for', 'since', 'during', 'from'], answer: 'since', explanation: '2022という始まった時点にはsinceを使います。' },
  { id: 'x3-006', type: '短文空所補充', prompt: 'The room ( ___ ) every morning.', translation: 'その部屋は毎朝掃除されます。', choices: ['cleans', 'is cleaned', 'cleaned', 'is cleaning'], answer: 'is cleaned', explanation: '習慣の受け身はis + 過去分詞です。' },
  { id: 'x3-007', type: '短文空所補充', prompt: 'This is the book ( ___ ) I bought yesterday.', translation: 'これは私が昨日買った本です。', choices: ['who', 'where', 'that', 'when'], answer: 'that', explanation: '物を説明する関係代名詞thatです。' },
  { id: 'x3-008', type: '短文空所補充', prompt: 'I do not know ( ___ ) to use this computer.', translation: '私はこのコンピューターの使い方が分かりません。', choices: ['what', 'how', 'where', 'which'], answer: 'how', explanation: 'how to useで「使い方」を表します。' },
  { id: 'x3-009', type: '会話文空所補充', prompt: 'A: Have you ever been to Canada?\nB: ( ___ ) I visited Toronto last summer.', choices: ['Yes, I have.', 'Yes, I do.', 'No, I was.', 'No, I did.'], answer: 'Yes, I have.', explanation: 'Have you ～?にはYes, I have.で答えます。' },
  { id: 'x3-010', type: '会話文空所補充', prompt: 'A: Do you know where the post office is?\nB: ( ___ )', choices: ['Yes, it is next to the bank.', 'Yes, I went yesterday.', 'No, I am a student.', 'No, it was Monday.'], answer: 'Yes, it is next to the bank.', explanation: '場所をたずねられているので、場所を答えます。' },
  { id: 'x3-011', type: '会話文空所補充', prompt: 'A: Who made this cake?\nB: ( ___ )', choices: ['It was delicious.', 'My grandmother did.', 'At three o’clock.', 'In the kitchen.'], answer: 'My grandmother did.', explanation: 'Whoに対して、作った人を答えます。' },
  { id: 'x3-012', type: '会話文空所補充', prompt: 'A: Why are you carrying an umbrella?\nB: ( ___ )', choices: ['Because it may rain.', 'For two hours.', 'At the station.', 'With my brother.'], answer: 'Because it may rain.', explanation: 'Whyには理由を答えます。' },
  { id: 'x3-013', type: '語句整序', prompt: '「私はこの町に5年間住んでいます。」正しい英文は？', choices: ['I have lived in this town for five years.', 'I lived have in this town for five years.', 'I have in lived this town five years for.', 'For five years I lived have this town in.'], answer: 'I have lived in this town for five years.', explanation: 'have + 過去分詞 + for + 期間の語順です。' },
  { id: 'x3-014', type: '語句整序', prompt: '「この歌は多くの人に知られています。」正しい英文は？', choices: ['This song is known by many people.', 'This song known is many people by.', 'Many people is known this song by.', 'This is song known by people many.'], answer: 'This song is known by many people.', explanation: 'be + 過去分詞 + byの形です。' },
  { id: 'x3-015', type: '語句整序', prompt: '「私は彼女がどこにいるか知りません。」正しい英文は？', choices: ["I do not know where she is.", "I do not where know she is.", "Where she do not know is.", "I know not do where is she."], answer: 'I do not know where she is.', explanation: '間接疑問where she isは普通の文の語順です。' },
  { id: 'x3-016', type: '語句整序', prompt: '「私を助けてくれた少年は親切です。」正しい英文は？', choices: ['The boy who helped me is kind.', 'The boy helped who me is kind.', 'Who helped me the boy is kind.', 'The boy is who helped me kind.'], answer: 'The boy who helped me is kind.', explanation: 'who helped meがThe boyを説明します。' },
  { id: 'x3-017', type: '短文空所補充', prompt: 'She has ( ___ ) finished her homework.', translation: '彼女はもう宿題を終えました。', choices: ['yet', 'already', 'ever', 'ago'], answer: 'already', explanation: '肯定文の「もう」はalreadyです。' },
  { id: 'x3-018', type: '短文空所補充', prompt: 'The computer ( ___ ) in Japan.', translation: 'そのコンピューターは日本で作られました。', choices: ['made', 'was made', 'makes', 'is making'], answer: 'was made', explanation: '過去の受け身なのでwas madeです。' },
  { id: 'x3-019', type: '短文空所補充', prompt: 'I have a friend ( ___ ) lives in Hokkaido.', translation: '私には北海道に住んでいる友達がいます。', choices: ['who', 'where', 'what', 'when'], answer: 'who', explanation: '人を説明する関係代名詞whoです。' },
  { id: 'x3-020', type: '短文空所補充', prompt: 'He told me ( ___ ) to get to the museum.', translation: '彼は博物館への行き方を私に教えてくれました。', choices: ['how', 'what', 'when', 'which'], answer: 'how', explanation: 'how to getで「行き方」を表します。' },
  { id: 'x3-021', type: '会話文空所補充', prompt: 'A: How long have you studied English?\nB: ( ___ )', choices: ['For three years.', 'At three o’clock.', 'Three years ago.', 'Since Monday morning at.'], answer: 'For three years.', explanation: 'How longには期間を答えます。' },
  { id: 'x3-022', type: '会話文空所補充', prompt: 'A: Is this the camera that you bought?\nB: ( ___ )', choices: ['Yes, I bought it last month.', 'Yes, I am buying yesterday.', 'No, I do not camera.', 'No, it buys me.'], answer: 'Yes, I bought it last month.', explanation: '買ったカメラかを確認しているので、購入について答えます。' },
  { id: 'x3-023', type: '語句整序', prompt: '「その店は父によって経営されています。」正しい英文は？', choices: ['The shop is run by my father.', 'The shop run is my father by.', 'My father is run the shop by.', 'By the shop is run my father.'], answer: 'The shop is run by my father.', explanation: 'is run byで「～によって経営されている」です。' },
  { id: 'x3-024', type: '語句整序', prompt: '「何を持っていけばよいか教えてください。」正しい英文は？', choices: ['Please tell me what to bring.', 'Please what tell me to bring.', 'Tell what to me please bring.', 'What bring please tell me to.'], answer: 'Please tell me what to bring.', explanation: 'tell + 人 + 疑問詞 + to + 動詞の形です。' },
];

export const eiken3GradeSpecificListeningQuestions: Eiken3ListeningQuestion[] = [
  { id: 'l3-001', audioText: 'Girl: Have you finished your science project? Boy: Not yet. I will finish it tonight.', transcript: 'Girl: Have you finished your science project?\nBoy: Not yet. I will finish it tonight.', translation: '女の子：理科の課題は終わりましたか。\n男の子：まだです。今夜終えるつもりです。', question: '男の子はいつ課題を終えるつもりですか？', choices: ['今朝', '昼休み', '今夜', '明日'], answer: '今夜', explanation: 'I will finish it tonightを聞き取ります。' },
  { id: 'l3-002', audioText: 'Boy: Who made this beautiful box? Girl: My grandfather made it for me.', transcript: 'Boy: Who made this beautiful box?\nGirl: My grandfather made it for me.', translation: '男の子：このきれいな箱を作ったのは誰ですか。\n女の子：祖父が私のために作りました。', question: '箱を作ったのは誰ですか？', choices: ['父', '祖父', '先生', '女の子'], answer: '祖父', explanation: 'My grandfather made itを確認します。' },
  { id: 'l3-003', audioText: 'Girl: Have you ever seen a whale? Boy: No, but I have seen dolphins many times.', transcript: 'Girl: Have you ever seen a whale?\nBoy: No, but I have seen dolphins many times.', translation: '女の子：クジラを見たことがありますか。\n男の子：いいえ、でもイルカは何度も見たことがあります。', question: '男の子が何度も見たことがあるのは何ですか？', choices: ['クジラ', 'イルカ', '魚', '鳥'], answer: 'イルカ', explanation: 'I have seen dolphins many timesが答えです。' },
  { id: 'l3-004', audioText: 'Boy: Do you know where the new café is? Girl: It is next to the post office.', transcript: 'Boy: Do you know where the new café is?\nGirl: It is next to the post office.', translation: '男の子：新しいカフェがどこにあるか知っていますか。\n女の子：郵便局の隣です。', question: '新しいカフェはどこにありますか？', choices: ['駅の前', '郵便局の隣', '学校の中', '公園の近く'], answer: '郵便局の隣', explanation: 'next to the post officeを聞き取ります。' },
  { id: 'l3-005', audioText: 'Girl: Why is the window broken? Boy: It was broken by a baseball.', transcript: 'Girl: Why is the window broken?\nBoy: It was broken by a baseball.', translation: '女の子：なぜ窓が割れているのですか。\n男の子：野球ボールで割られました。', question: '窓を割ったものは何ですか？', choices: ['石', '野球ボール', '風', '木の枝'], answer: '野球ボール', explanation: 'by a baseballが原因を表しています。' },
  { id: 'l3-006', audioText: 'Boy: Which bag is yours? Girl: The one that is under the chair.', transcript: 'Boy: Which bag is yours?\nGirl: The one that is under the chair.', translation: '男の子：どのかばんがあなたのものですか。\n女の子：いすの下にあるものです。', question: '女の子のかばんはどこにありますか？', choices: ['机の上', 'いすの下', 'ドアの横', 'ロッカーの中'], answer: 'いすの下', explanation: 'under the chairを確認します。' },
  { id: 'l3-007', audioText: 'Girl: How long have you lived in this town? Boy: Since I was five years old.', transcript: 'Girl: How long have you lived in this town?\nBoy: Since I was five years old.', translation: '女の子：この町にどのくらい住んでいますか。\n男の子：5歳のときからです。', question: '男の子はいつからこの町に住んでいますか？', choices: ['3歳から', '5歳から', '10歳から', '去年から'], answer: '5歳から', explanation: 'Since I was five years oldを聞き取ります。' },
  { id: 'l3-008', audioText: 'Boy: What are you going to do after school? Girl: I am going to practice the speech that I will give tomorrow.', transcript: 'Boy: What are you going to do after school?\nGirl: I am going to practice the speech that I will give tomorrow.', translation: '男の子：放課後何をする予定ですか。\n女の子：明日するスピーチの練習をします。', question: '女の子は何を練習しますか？', choices: ['歌', 'ダンス', 'スピーチ', '英作文'], answer: 'スピーチ', explanation: 'practice the speechを聞き取ります。' },
  { id: 'l3-009', audioText: 'Girl: The library is closed today. Boy: Really? I wanted to return the book that I borrowed.', transcript: 'Girl: The library is closed today.\nBoy: Really? I wanted to return the book that I borrowed.', translation: '女の子：図書館は今日閉まっています。\n男の子：本当ですか。借りた本を返したかったです。', question: '男の子は何を返したかったのですか？', choices: ['DVD', 'かばん', '借りた本', '鍵'], answer: '借りた本', explanation: 'the book that I borrowedが答えです。' },
  { id: 'l3-010', audioText: 'Boy: Have you eaten lunch? Girl: Yes. I have already eaten a sandwich.', transcript: 'Boy: Have you eaten lunch?\nGirl: Yes. I have already eaten a sandwich.', translation: '男の子：昼食を食べましたか。\n女の子：はい。もうサンドイッチを食べました。', question: '女の子は何を食べましたか？', choices: ['おにぎり', 'サンドイッチ', 'パスタ', 'りんご'], answer: 'サンドイッチ', explanation: 'eaten a sandwichを聞き取ります。' },
  { id: 'l3-011', audioText: 'Girl: Can I use the computer? Boy: Sorry, it is being used by Mr. Smith.', transcript: 'Girl: Can I use the computer?\nBoy: Sorry, it is being used by Mr. Smith.', translation: '女の子：コンピューターを使ってもいいですか。\n男の子：ごめんなさい、スミス先生に使われています。', question: 'コンピューターを使っているのは誰ですか？', choices: ['女の子', '男の子', 'スミス先生', '校長先生'], answer: 'スミス先生', explanation: 'by Mr. Smithを確認します。' },
  { id: 'l3-012', audioText: 'Boy: Do you know how to get to the museum? Girl: Yes. Go straight and turn right at the second corner.', transcript: 'Boy: Do you know how to get to the museum?\nGirl: Yes. Go straight and turn right at the second corner.', translation: '男の子：博物館への行き方を知っていますか。\n女の子：はい。まっすぐ行き、2つ目の角で右に曲がってください。', question: 'どこで右に曲がりますか？', choices: ['最初の角', '2つ目の角', '駅の前', '学校の角'], answer: '2つ目の角', explanation: 'at the second cornerを聞き取ります。' },
];

export const eiken3GradeSpecificReadings: Eiken3Reading[] = [
  { id: 'r3-001', type: 'メール', title: 'A New Volunteer Day', passage: 'Hi Kenta, Our class will have a volunteer day next Saturday. We will clean a beach near the station. Please bring work gloves and a hat. Lunch will be prepared by the community center. I have never joined this activity before, so I am excited. Can you come with me? Aya', translation: 'ケンタへ。私たちのクラスは次の土曜日にボランティアの日を行います。駅の近くの浜を掃除します。作業用手袋と帽子を持ってきてください。昼食は地域センターが用意します。私はこの活動に参加したことがないので、わくわくしています。一緒に来られますか。アヤより。', questions: [
    { question: '生徒たちはどこを掃除しますか？', choices: ['駅', '浜', '学校', '公園'], answer: '浜', evidence: 'We will clean a beach near the station.', explanation: 'clean a beachが掃除する場所です。' },
    { question: '昼食は誰によって用意されますか？', choices: ['先生', 'アヤ', '地域センター', 'ケンタ'], answer: '地域センター', evidence: 'Lunch will be prepared by the community center.', explanation: 'by the community centerが用意する人・組織です。' },
  ] },
  { id: 'r3-002', type: '説明文', title: 'How Bees Help Flowers', passage: 'Bees visit flowers to collect nectar. When a bee moves to another flower, pollen is carried on its body. The pollen helps the flower make seeds. Many fruits and vegetables are produced because bees visit plants. People should protect bees by planting flowers and avoiding harmful chemicals.', translation: 'ミツバチは蜜を集めるために花を訪れます。ミツバチが別の花へ移ると、花粉が体に運ばれます。その花粉は花が種を作るのを助けます。ミツバチが植物を訪れるので、多くの果物や野菜が作られます。人々は花を植えたり、害のある薬品を避けたりしてミツバチを守るべきです。', questions: [
    { question: '花粉はどのように別の花へ運ばれますか？', choices: ['風で飛ぶ', 'ミツバチの体について運ばれる', '人が運ぶ', '雨で流れる'], answer: 'ミツバチの体について運ばれる', evidence: 'pollen is carried on its body', explanation: 'itsはbeeを指しています。' },
    { question: '人々はミツバチを守るために何をすべきですか？', choices: ['花を植える', '花を全部摘む', '薬品を増やす', '巣を動かす'], answer: '花を植える', evidence: 'by planting flowers', explanation: 'by planting flowersが方法の一つです。' },
  ] },
  { id: 'r3-003', type: '案内', title: 'Community Music Hall', passage: 'The community music hall will be closed on May 3 and 4 for repairs. The piano room will be open again on May 5, but the recording room will stay closed until May 10. Members who have booked the recording room will receive an email. Please do not enter rooms marked “Closed.”', translation: '地域音楽ホールは修理のため5月3日と4日は閉まります。ピアノ室は5月5日に再び開きますが、録音室は5月10日まで閉まったままです。録音室を予約した会員にはメールが届きます。「Closed」と書かれた部屋には入らないでください。', questions: [
    { question: 'ピアノ室はいつ再び開きますか？', choices: ['5月3日', '5月4日', '5月5日', '5月10日'], answer: '5月5日', evidence: 'The piano room will be open again on May 5.', explanation: 'open again on May 5を確認します。' },
    { question: '誰にメールが届きますか？', choices: ['全員', '録音室を予約した会員', 'ピアノ室を使う人', '修理の人'], answer: '録音室を予約した会員', evidence: 'Members who have booked the recording room will receive an email.', explanation: 'who have booked以下がmembersを説明します。' },
  ] },
  { id: 'r3-004', type: '日記', title: 'A Helpful Neighbor', passage: 'Last month, our family moved to a new apartment. At first, I did not know anyone. One rainy morning, I forgot my umbrella. A neighbor who lives on the same floor lent me one. We talked on the way to the station, and I learned that she works at a library. Since then, we have greeted each other every morning.', translation: '先月、私たち家族は新しいアパートへ引っ越しました。最初、私は誰も知りませんでした。ある雨の朝、傘を忘れました。同じ階に住む近所の人が傘を貸してくれました。駅までの道で話し、彼女が図書館で働いていると知りました。それ以来、私たちは毎朝お互いにあいさつをしています。', questions: [
    { question: '近所の人は何を貸しましたか？', choices: ['本', '自転車', '傘', 'かばん'], answer: '傘', evidence: 'lent me one', explanation: 'oneは前のumbrellaを指します。' },
    { question: '筆者たちはその後、何をしていますか？', choices: ['毎朝あいさつしている', '毎週図書館へ行く', '一緒に引っ越す', '毎晩駅で話す'], answer: '毎朝あいさつしている', evidence: 'we have greeted each other every morning', explanation: '現在完了で、それ以来続く習慣を表しています。' },
  ] },
  { id: 'r3-005', type: 'メール', title: 'The Science Museum Visit', passage: 'Dear Students, The science museum visit will be held on June 18. The bus will leave school at 8:20, so please arrive by 8:00. You may bring a camera, but flash photography is not allowed. The museum guide will show us an exhibit that was made by local students. We will return to school at 3:40. Mr. Lee', translation: '生徒のみなさんへ。科学博物館への訪問は6月18日に行われます。バスは8時20分に学校を出るので、8時までに来てください。カメラを持ってきてもよいですが、フラッシュ撮影は禁止です。博物館のガイドが、地元の生徒によって作られた展示を見せてくれます。学校には3時40分に戻ります。リー先生より。', questions: [
    { question: '生徒は何時までに来なければなりませんか？', choices: ['7時40分', '8時', '8時20分', '3時40分'], answer: '8時', evidence: 'please arrive by 8:00', explanation: 'by 8:00は8時までにという意味です。' },
    { question: '展示は誰によって作られましたか？', choices: ['博物館のガイド', '先生', '地元の生徒', 'バスの運転手'], answer: '地元の生徒', evidence: 'was made by local students', explanation: 'by local studentsが作った人を表します。' },
  ] },
  { id: 'r3-006', type: '説明文', title: 'Learning from Mistakes', passage: 'When people learn a new skill, they often make mistakes. A mistake shows what needs more practice. For example, a student who forgets an English word can write it in a notebook and use it in a new sentence. It is important not to give up. People who continue practicing usually become more confident.', translation: '人が新しい技能を学ぶとき、よく間違いをします。間違いは何をもっと練習する必要があるかを示します。例えば、英単語を忘れた生徒は、それをノートに書き、新しい文で使うことができます。あきらめないことが大切です。練習を続ける人は、たいてい自信がつきます。', questions: [
    { question: '間違いは何を示しますか？', choices: ['何を買うか', '何をもっと練習するか', '誰に会うか', 'いつ休むか'], answer: '何をもっと練習するか', evidence: 'A mistake shows what needs more practice.', explanation: 'what needs more practiceが答えです。' },
    { question: '間違えた単語をどうするとよいですか？', choices: ['消す', 'ノートに書いて新しい文で使う', '友達に隠す', 'すぐに忘れる'], answer: 'ノートに書いて新しい文で使う', evidence: 'write it in a notebook and use it in a new sentence', explanation: '具体例の行動を確認します。' },
  ] },
];

export const eiken3GradeSpecificWords: Eiken3Word[] = [
  { id: 'g3w001', word: 'experience', meaning: '経験', example: 'It was a good experience.', category: '名詞', priority: 'A' },
  { id: 'g3w002', word: 'opportunity', meaning: '機会', example: 'This is a good opportunity to learn.', category: '名詞', priority: 'A' },
  { id: 'g3w003', word: 'reason', meaning: '理由', example: 'Tell me one reason.', category: '名詞', priority: 'A' },
  { id: 'g3w004', word: 'technology', meaning: '技術', example: 'Technology can help people.', category: '名詞', priority: 'A' },
  { id: 'g3w005', word: 'yet', meaning: 'まだ、もう', example: 'Have you finished it yet?', category: '副詞', priority: 'A' },
  { id: 'g3w006', word: 'since', meaning: '～以来、～から', example: 'I have lived here since 2022.', category: '接続詞・前置詞', priority: 'A' },
  { id: 'g3w007', word: 'ever', meaning: '今までに', example: 'Have you ever seen a whale?', category: '副詞', priority: 'A' },
  { id: 'g3w008', word: 'recycle', meaning: '再利用する', example: 'We recycle paper at school.', category: '動詞', priority: 'A' },
  { id: 'g3w009', word: 'develop', meaning: '発達させる、開発する', example: 'Reading can develop your ideas.', category: '動詞', priority: 'A' },
  { id: 'g3w010', word: 'provide', meaning: '提供する', example: 'The school provides lunch.', category: '動詞', priority: 'B' },
  { id: 'g3w011', word: 'notice', meaning: '気づく、案内', example: 'Did you notice the sign?', category: '動詞・名詞', priority: 'B' },
  { id: 'g3w012', word: 'speak', meaning: '話す', example: 'Many people speak English.', category: '動詞', priority: 'A' },
  { id: 'g3w013', word: 'spoken', meaning: '話された', example: 'English is spoken here.', category: '過去分詞', priority: 'A' },
  { id: 'g3w014', word: 'known', meaning: '知られた', example: 'The town is known for its flowers.', category: '過去分詞', priority: 'A' },
  { id: 'g3w015', word: 'translate', meaning: '翻訳する', example: 'Please translate this sentence.', category: '動詞', priority: 'A' },
  { id: 'g3w016', word: 'around', meaning: '～の周りに、世界中で', example: 'People around the world use it.', category: '前置詞・副詞', priority: 'B' },
  { id: 'g3w017', word: 'relative', meaning: '親せき、関係のある', example: 'I visited my relatives.', category: '名詞・形容詞', priority: 'B' },
  { id: 'g3w018', word: 'whose', meaning: '誰の', example: 'Do you know whose bag this is?', category: '疑問詞', priority: 'B' },
  { id: 'g3w019', word: 'where', meaning: '～する場所、どこに', example: 'This is the room where we study.', category: '関係副詞・疑問詞', priority: 'A' },
  { id: 'g3w020', word: 'although', meaning: '～だけれども', example: 'Although it was raining, we played.', category: '接続詞', priority: 'B' },
  { id: 'g3w021', word: 'mistake', meaning: '間違い', example: 'A mistake can help you learn.', category: '名詞', priority: 'A' },
  { id: 'g3w022', word: 'skill', meaning: '技能、スキル', example: 'Reading is an important skill.', category: '名詞', priority: 'A' },
  { id: 'g3w023', word: 'confident', meaning: '自信のある', example: 'I feel more confident now.', category: '形容詞', priority: 'B' },
  { id: 'g3w024', word: 'training', meaning: '訓練、練習', example: 'The team has training today.', category: '名詞', priority: 'A' },
  { id: 'g3w025', word: 'society', meaning: '社会', example: 'We want to help society.', category: '名詞', priority: 'A' },
  { id: 'g3w026', word: 'pollen', meaning: '花粉', example: 'Bees carry pollen to flowers.', category: '名詞', priority: 'B' },
  { id: 'g3w027', word: 'nectar', meaning: '花の蜜', example: 'Bees collect nectar.', category: '名詞', priority: 'C' },
  { id: 'g3w028', word: 'community', meaning: '地域、共同体', example: 'The community center is nearby.', category: '名詞', priority: 'A' },
  { id: 'g3w029', word: 'activity', meaning: '活動', example: 'This activity is good for everyone.', category: '名詞', priority: 'A' },
  { id: 'g3w030', word: 'prepare', meaning: '準備する', example: 'Lunch was prepared by the center.', category: '動詞', priority: 'A' },
  { id: 'g3w031', word: 'repair', meaning: '修理する、修理', example: 'The hall is closed for repairs.', category: '動詞・名詞', priority: 'B' },
  { id: 'g3w032', word: 'article', meaning: '記事、冠詞', example: 'I read an article about bees.', category: '名詞', priority: 'A' },
  { id: 'g3w033', word: 'material', meaning: '材料、教材', example: 'The teacher prepared new material.', category: '名詞', priority: 'B' },
  { id: 'g3w034', word: 'service', meaning: 'サービス、奉仕', example: 'The library offers a useful service.', category: '名詞', priority: 'A' },
  { id: 'g3w035', word: 'exhibit', meaning: '展示、展示品', example: 'The museum has a new exhibit.', category: '名詞', priority: 'B' },
  { id: 'g3w036', word: 'success', meaning: '成功', example: 'Practice is important for success.', category: '名詞', priority: 'A' },
];
