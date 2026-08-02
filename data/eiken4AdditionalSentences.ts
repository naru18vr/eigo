import type { Sentence } from '../types';

type Spec = [
  id: string,
  japaneseQuestion: string,
  words: string[],
  grammarTag: string,
  explanation: string,
  questionType?: Sentence['questionType'],
];

const makeSentences = (specs: readonly Spec[]): Sentence[] => specs.map(([id, japaneseQuestion, words, grammarTag, explanation, questionType]) => ({
  id,
  japaneseQuestion,
  words,
  grammarTag,
  explanation,
  ...(questionType ? { questionType } : {}),
}));

/**
 * 英検4級の反復練習用追加問題。
 * 既存の問題を置き換えず、カテゴリごとの練習量と出題形式を補うために分離している。
 */
export const eiken4AdditionalSentences = makeSentences([
  // 一般動詞（既存3問 → 10問）
  ['e4add-gv-01', '私は毎朝朝食を食べます。', ['I', 'eat', 'breakfast', 'every', 'morning', '.'], '一般動詞', '毎日の習慣は一般動詞を使うよ。', 'sentence-choice'],
  ['e4add-gv-02', 'あなたは週末に本を読みますか。', ['Do', 'you', 'read', 'books', 'on', 'weekends', '?'], '一般動詞疑問文', '一般動詞の疑問文は Do を文の先頭に置くよ。', 'fill-blank'],
  ['e4add-gv-03', '私は牛乳を飲みません。', ["I", "don't", 'drink', 'milk', '.'], '一般動詞否定文', "一般動詞の否定文は don't + 動詞の原形だよ。", 'error-correction'],
  ['e4add-gv-04', '彼女はピアノを毎日練習します。', ['She', 'practices', 'the', 'piano', 'every', 'day', '.'], '一般動詞', 'she の後ろでは動詞に s をつけることがあるよ。', 'reorder'],
  ['e4add-gv-05', '私たちは放課後に公園へ行きます。', ['We', 'go', 'to', 'the', 'park', 'after', 'school', '.'], '一般動詞', 'go は「行く」という一般動詞だよ。', 'reorder'],
  ['e4add-gv-06', 'あなたはこの写真を知っていますか。', ['Do', 'you', 'know', 'this', 'picture', '?'], '一般動詞疑問文', 'Do you ～? で一般動詞の質問を作るよ。', 'response'],
  ['e4add-gv-07', 'トムは毎晩宿題をします。', ['Tom', 'does', 'his', 'homework', 'every', 'night', '.'], '一般動詞', '三人称単数では do が does になるよ。', 'fill-blank'],

  // 過去形（既存6問 → 10問）
  ['e4add-past-01', '私は昨日図書館を訪れました。', ['I', 'visited', 'the', 'library', 'yesterday', '.'], '過去形', 'yesterday があるので過去形 visited を使うよ。', 'sentence-choice'],
  ['e4add-past-02', 'あなたは先週その映画を見ましたか。', ['Did', 'you', 'see', 'the', 'movie', 'last', 'week', '?'], '過去形の疑問文', '過去の疑問文は Did + 主語 + 動詞の原形だよ。', 'fill-blank'],
  ['e4add-past-03', '彼は今朝学校へ来ませんでした。', ['He', "didn't", 'come', 'to', 'school', 'this', 'morning', '.'], '過去形の否定文', "過去の否定文は didn't + 動詞の原形だよ。", 'error-correction'],
  ['e4add-past-04', '私たちは日曜日に祖母に会いました。', ['We', 'met', 'our', 'grandmother', 'on', 'Sunday', '.'], '不規則動詞', 'meet の過去形は met という不規則変化だよ。', 'reorder'],

  // 助動詞（既存7問 → 10問）
  ['e4add-modal-01', 'あなたはここで写真を撮ってもいいですか。', ['May', 'I', 'take', 'a', 'picture', 'here', '?'], 'May I ...?', 'May I ～? は丁寧に許可を求める表現だよ。', 'response'],
  ['e4add-modal-02', 'あなたはもっと練習すべきです。', ['You', 'should', 'practice', 'more', '.'], 'should', 'should は「～すべきだ」という助言を表すよ。', 'sentence-choice'],
  ['e4add-modal-03', '私は今日、早く帰らなければなりません。', ['I', 'have', 'to', 'go', 'home', 'early', 'today', '.'], 'have to', 'have to は「～しなければならない」だよ。', 'fill-blank'],

  // 動名詞（既存5問 → 10問）
  ['e4add-gerund-01', '私は英語を話すことを楽しみます。', ['I', 'enjoy', 'speaking', 'English', '.'], '動名詞', 'enjoy の後ろは動名詞 speaking を使うよ。', 'sentence-choice'],
  ['e4add-gerund-02', '彼女は料理をすることが好きです。', ['She', 'likes', 'cooking', '.'], '動名詞', 'like の後ろでは cooking のような動名詞も使えるよ。', 'reorder'],
  ['e4add-gerund-03', '雨の中で走ることは楽しくありません。', ['Running', 'in', 'the', 'rain', 'is', 'not', 'fun', '.'], '動名詞', '文の主語にも動名詞を使えるよ。', 'error-correction'],
  ['e4add-gerund-04', '私は宿題を終えてからテレビを見ました。', ['I', 'watched', 'TV', 'after', 'finishing', 'my', 'homework', '.'], '動名詞', 'after の後ろで「～した後」を表すとき動名詞を使えるよ。', 'fill-blank'],
  ['e4add-gerund-05', '彼は泳ぐことが得意です。', ['He', 'is', 'good', 'at', 'swimming', '.'], '動名詞', '前置詞 at の後ろは swimming のような動名詞だよ。', 'sentence-choice'],

  // 比較級（既存4問 → 10問）
  ['e4add-comp-01', 'この箱はあの箱より重いです。', ['This', 'box', 'is', 'heavier', 'than', 'that', 'one', '.'], '比較級', '2つを比べるときは heavier than を使うよ。', 'sentence-choice'],
  ['e4add-comp-02', '夏は春より暑いです。', ['Summer', 'is', 'hotter', 'than', 'spring', '.'], '比較級', '短い形容詞は -er をつけて比較級にするよ。', 'reorder'],
  ['e4add-comp-03', 'この問題はその問題より簡単です。', ['This', 'question', 'is', 'easier', 'than', 'that', 'one', '.'], '比較級', 'easy は y を i に変えて easier になるよ。', 'fill-blank'],
  ['e4add-comp-04', '私の犬はあなたの犬と同じくらい大きいです。', ['My', 'dog', 'is', 'as', 'big', 'as', 'your', 'dog', '.'], 'as ... as', 'as ～ as は「～と同じくらい…」を表すよ。', 'sentence-choice'],
  ['e4add-comp-05', '自転車は車ほど速くありません。', ['A', 'bike', 'is', 'not', 'as', 'fast', 'as', 'a', 'car', '.'], 'as ... as', 'not as ～ as で「～ほど…ではない」だよ。', 'error-correction'],
  ['e4add-comp-06', 'この川はあの川より長いです。', ['This', 'river', 'is', 'longer', 'than', 'that', 'one', '.'], '比較級', 'long の比較級は longer だよ。', 'reorder'],

  // 最上級（既存3問 → 10問）
  ['e4add-super-01', 'これは町で一番古い建物です。', ['This', 'is', 'the', 'oldest', 'building', 'in', 'the', 'town', '.'], '最上級', '3つ以上の中で一番なので the oldest を使うよ。', 'sentence-choice'],
  ['e4add-super-02', '彼女はクラスで一番速く走ります。', ['She', 'runs', 'the', 'fastest', 'in', 'her', 'class', '.'], '最上級', '副詞 fast の最上級は the fastest だよ。', 'fill-blank'],
  ['e4add-super-03', '富士山は日本で一番高い山です。', ['Mt.', 'Fuji', 'is', 'the', 'highest', 'mountain', 'in', 'Japan', '.'], '最上級', 'in Japan の中で一番なので the highest を使うよ。', 'reorder'],
  ['e4add-super-04', 'この問題は3つの中で一番難しいです。', ['This', 'question', 'is', 'the', 'most', 'difficult', 'of', 'the', 'three', '.'], '最上級', '長い形容詞は the most + 形容詞にするよ。', 'sentence-choice'],
  ['e4add-super-05', '日曜日は私にとって一番良い日です。', ['Sunday', 'is', 'the', 'best', 'day', 'for', 'me', '.'], '最上級', 'good の最上級は best だよ。', 'fill-blank'],
  ['e4add-super-06', 'この公園は市内で一番美しいです。', ['This', 'park', 'is', 'the', 'most', 'beautiful', 'in', 'the', 'city', '.'], '最上級', 'beautiful の最上級は the most beautiful だよ。', 'reorder'],
  ['e4add-super-07', '彼は4人の中で一番若いです。', ['He', 'is', 'the', 'youngest', 'of', 'the', 'four', '.'], '最上級', '4人の中で一番若いので the youngest だよ。', 'error-correction'],

  // There is / There are（既存3問 → 10問）
  ['e4add-there-01', '机の上に本が1冊あります。', ['There', 'is', 'a', 'book', 'on', 'the', 'desk', '.'], 'There is', '1つのものには There is を使うよ。', 'sentence-choice'],
  ['e4add-there-02', '箱の中にりんごが3つあります。', ['There', 'are', 'three', 'apples', 'in', 'the', 'box', '.'], 'There are', '複数のものには There are を使うよ。', 'reorder'],
  ['e4add-there-03', 'この町には大きな公園があります。', ['There', 'is', 'a', 'large', 'park', 'in', 'this', 'town', '.'], 'There is', 'There is ～ in … で「…に～があります」だよ。', 'fill-blank'],
  ['e4add-there-04', '教室には20人の生徒がいます。', ['There', 'are', 'twenty', 'students', 'in', 'the', 'classroom', '.'], 'There are', 'students が複数なので There are だよ。', 'sentence-choice'],
  ['e4add-there-05', '冷蔵庫の中に牛乳はありません。', ['There', 'is', 'no', 'milk', 'in', 'the', 'refrigerator', '.'], 'There is', '数えられない名詞にも There is を使うよ。', 'error-correction'],
  ['e4add-there-06', '駅の近くに2軒の店があります。', ['There', 'are', 'two', 'shops', 'near', 'the', 'station', '.'], 'There are', 'two shops が複数なので There are だよ。', 'reorder'],
  ['e4add-there-07', '壁に写真が1枚あります。', ['There', 'is', 'a', 'picture', 'on', 'the', 'wall', '.'], 'There is', 'a picture は1つなので There is だよ。', 'fill-blank'],

  // 現在進行形（既存2問 → 10問）
  ['e4add-pres-01', '私は今、夕食を作っています。', ['I', 'am', 'cooking', 'dinner', 'now', '.'], '現在進行形', '今していることは am + 動詞ing で表すよ。', 'sentence-choice'],
  ['e4add-pres-02', '彼女は公園で走っています。', ['She', 'is', 'running', 'in', 'the', 'park', '.'], '現在進行形', 'she には is + 動詞ing を使うよ。', 'reorder'],
  ['e4add-pres-03', '彼らは英語を勉強していますか。', ['Are', 'they', 'studying', 'English', '?'], '現在進行形', '疑問文は be動詞を先頭に置くよ。', 'fill-blank'],
  ['e4add-pres-04', 'トムはテレビを見ていません。', ['Tom', 'is', 'not', 'watching', 'TV', '.'], '現在進行形', '否定文は be動詞の後ろに not を置くよ。', 'error-correction'],
  ['e4add-pres-05', 'あなたは何を読んでいますか。', ['What', 'are', 'you', 'reading', '?'], '現在進行形', 'What are you ～ing? で「何をしていますか」と聞くよ。', 'response'],
  ['e4add-pres-06', '犬が庭で寝ています。', ['The', 'dog', 'is', 'sleeping', 'in', 'the', 'yard', '.'], '現在進行形', '犬が今していることを is sleeping で表すよ。', 'sentence-choice'],
  ['e4add-pres-07', '私たちはバスを待っています。', ['We', 'are', 'waiting', 'for', 'the', 'bus', '.'], '現在進行形', 'we には are + 動詞ing を使うよ。', 'reorder'],
  ['e4add-pres-08', '雨が降っていますか。', ['Is', 'it', 'raining', '?'], '現在進行形', 'it の疑問文は Is it ～ing? だよ。', 'fill-blank'],

  // 過去進行形（既存2問 → 10問）
  ['e4add-pastprog-01', '私は8時に宿題をしていました。', ['I', 'was', 'doing', 'my', 'homework', 'at', 'eight', '.'], '過去進行形', '過去のある時点で続いていたことは was + 動詞ing だよ。', 'sentence-choice'],
  ['e4add-pastprog-02', '彼らはそのときサッカーをしていました。', ['They', 'were', 'playing', 'soccer', 'then', '.'], '過去進行形', '複数の主語には were + 動詞ing を使うよ。', 'reorder'],
  ['e4add-pastprog-03', 'あなたは昨夜9時に寝ていましたか。', ['Were', 'you', 'sleeping', 'at', 'nine', 'last', 'night', '?'], '過去進行形', '過去進行形の疑問文は Were + 主語 + 動詞ing だよ。', 'fill-blank'],
  ['e4add-pastprog-04', '彼女は昼に料理をしていませんでした。', ['She', 'was', 'not', 'cooking', 'at', 'noon', '.'], '過去進行形', '否定文は was の後ろに not を置くよ。', 'error-correction'],
  ['e4add-pastprog-05', '私が帰宅したとき、母は本を読んでいました。', ['My', 'mother', 'was', 'reading', 'a', 'book', 'when', 'I', 'came', 'home', '.'], '過去進行形', 'when の中の過去の出来事と、続いていた動作を組み合わせるよ。', 'sentence-choice'],
  ['e4add-pastprog-06', '雨が降っていたので、私たちは家にいました。', ['It', 'was', 'raining', ',', 'so', 'we', 'were', 'at', 'home', '.'], '過去進行形', '過去に降り続いていた雨を was raining で表すよ。', 'reorder'],
  ['e4add-pastprog-07', '彼は駅で誰かを待っていました。', ['He', 'was', 'waiting', 'for', 'someone', 'at', 'the', 'station', '.'], '過去進行形', '過去の途中の動作は was waiting だよ。', 'fill-blank'],
  ['e4add-pastprog-08', '子どもたちは川で泳いでいました。', ['The', 'children', 'were', 'swimming', 'in', 'the', 'river', '.'], '過去進行形', 'children は複数なので were swimming だよ。', 'sentence-choice'],

  // 未来（既存5問 → 10問）
  ['e4add-future-01', '私は来週祖父母を訪ねるつもりです。', ['I', 'am', 'going', 'to', 'visit', 'my', 'grandparents', 'next', 'week', '.'], 'be going to', 'be going to + 動詞の原形で予定を表すよ。', 'sentence-choice'],
  ['e4add-future-02', '彼女は今夜料理をするでしょう。', ['She', 'will', 'cook', 'dinner', 'tonight', '.'], '未来 will', 'will の後ろは動詞の原形だよ。', 'reorder'],
  ['e4add-future-03', 'あなたは明日参加しますか。', ['Will', 'you', 'join', 'us', 'tomorrow', '?'], 'Will you ...?', 'Will you ～? で未来の予定をたずねるよ。', 'response'],
  ['e4add-future-04', '私たちは夏に海へ行く予定です。', ['We', 'are', 'going', 'to', 'go', 'to', 'the', 'sea', 'in', 'summer', '.'], 'be going to', 'are going to go で「行く予定」を表すよ。', 'fill-blank'],
  ['e4add-future-05', '雨が降るでしょう。', ['It', 'will', 'rain', 'tomorrow', '.'], '未来 will', '天気の予想にも will を使えるよ。', 'sentence-choice'],

  // to不定詞（既存3問 → 10問）
  ['e4add-inf-01', '私は新しい自転車を買いたいです。', ['I', 'want', 'to', 'buy', 'a', 'new', 'bike', '.'], 'want to', 'want to + 動詞の原形で「～したい」だよ。', 'sentence-choice'],
  ['e4add-inf-02', '彼は英語を学ぶためにアメリカへ行きました。', ['He', 'went', 'to', 'America', 'to', 'learn', 'English', '.'], '目的の不定詞', '2つ目の to learn は目的「～するために」だよ。', 'reorder'],
  ['e4add-inf-03', '私はあなたに会えてうれしいです。', ['I', 'am', 'happy', 'to', 'see', 'you', '.'], '目的の不定詞', 'happy to ～ で「～してうれしい」だよ。', 'fill-blank'],
  ['e4add-inf-04', '読むべき本があります。', ['I', 'have', 'a', 'book', 'to', 'read', '.'], '目的の不定詞', 'book to read で「読むための本」だよ。', 'sentence-choice'],
  ['e4add-inf-05', 'あなたは水を飲む必要があります。', ['You', 'need', 'to', 'drink', 'water', '.'], 'want to', 'need to + 動詞の原形で「～する必要がある」だよ。', 'error-correction'],
  ['e4add-inf-06', '私たちは一緒に昼食を食べたいですか。', ['Would', 'you', 'like', 'to', 'eat', 'lunch', 'together', '?'], 'Would you like to ...?', 'Would you like to ～? は丁寧な誘いだよ。', 'response'],
  ['e4add-inf-07', '彼女は写真を撮るためにカメラを持っています。', ['She', 'has', 'a', 'camera', 'to', 'take', 'pictures', '.'], '目的の不定詞', '目的を表す to take を使うよ。', 'reorder'],

  // 命令文（既存2問 → 10問）
  ['e4add-imp-01', 'ドアを閉めてください。', ['Please', 'close', 'the', 'door', '.'], '命令文', 'Please + 動詞の原形で丁寧な命令文になるよ。', 'sentence-choice'],
  ['e4add-imp-02', 'ゆっくり話してください。', ['Please', 'speak', 'slowly', '.'], '命令文', 'Please の後ろは動詞の原形だよ。', 'reorder'],
  ['e4add-imp-03', 'ここに座ってください。', ['Please', 'sit', 'here', '.'], '命令文', '相手にお願いするときは Please をつけよう。', 'fill-blank'],
  ['e4add-imp-04', '窓を開けないでください。', ['Please', "don't", 'open', 'the', 'window', '.'], '命令文', "don't + 動詞の原形で「～しないで」だよ。", 'error-correction'],
  ['e4add-imp-05', '一緒に勉強しましょう。', ["Let's", 'study', 'together', '.'], "Let's ...", "Let's + 動詞の原形で「～しましょう」だよ。", 'sentence-choice'],
  ['e4add-imp-06', '公園へ行きましょう。', ["Let's", 'go', 'to', 'the', 'park', '.'], "Let's ...", "Let's go で「行きましょう」だよ。", 'reorder'],
  ['e4add-imp-07', '忘れないでください。', ['Please', "don't", 'forget', '.'], '命令文', "Please don't ～ で丁寧に禁止するよ。", 'fill-blank'],
  ['e4add-imp-08', 'この線に沿って歩いてください。', ['Please', 'walk', 'along', 'this', 'line', '.'], '命令文', 'Please の後ろに動詞の原形を置くよ。', 'sentence-choice'],

  // その他の英検4級文法（既存3問 → 10問）
  ['e4add-other-01', '先生は私に新しい本を見せました。', ['The', 'teacher', 'showed', 'me', 'a', 'new', 'book', '.'], 'show＋人＋物', 'show + 人 + 物で「人に物を見せる」だよ。', 'sentence-choice'],
  ['e4add-other-02', '彼は妹にプレゼントをあげました。', ['He', 'gave', 'his', 'sister', 'a', 'present', '.'], 'give＋人＋物', 'give + 人 + 物で「人に物をあげる」だよ。', 'reorder'],
  ['e4add-other-03', '母は私たちにおいしいケーキを作りました。', ['Mother', 'made', 'us', 'a', 'delicious', 'cake', '.'], 'make＋人＋物', 'make + 人 + 物で「人のために物を作る」だよ。', 'fill-blank'],
  ['e4add-other-04', '彼女は私に英語を教えました。', ['She', 'taught', 'me', 'English', '.'], 'teach＋人＋物', 'teach + 人 + 物で「人に物を教える」だよ。', 'sentence-choice'],
  ['e4add-other-05', '父は私に古い写真を見せました。', ['My', 'father', 'showed', 'me', 'an', 'old', 'photo', '.'], 'show＋人＋物', 'showed は show の過去形だよ。', 'reorder'],
  ['e4add-other-06', '私は友達にお土産をあげました。', ['I', 'gave', 'my', 'friend', 'a', 'souvenir', '.'], 'give＋人＋物', 'gave は give の過去形だよ。', 'fill-blank'],
  ['e4add-other-07', 'コーチは私たちに新しい練習を教えました。', ['The', 'coach', 'taught', 'us', 'a', 'new', 'practice', '.'], 'teach＋人＋物', 'taught は teach の過去形だよ。', 'error-correction'],

  // 疑問詞（既存4問 → 10問）
  ['e4add-q-01', 'あなたはどこに住んでいますか。', ['Where', 'do', 'you', 'live', '?'], '疑問詞 What', 'Where は「どこ」をたずねる疑問詞だよ。', 'response'],
  ['e4add-q-02', 'あなたはどのくらいの頻度で泳ぎますか。', ['How', 'often', 'do', 'you', 'swim', '?'], 'How often ...?', 'How often は回数・頻度をたずねるよ。', 'sentence-choice'],
  ['e4add-q-03', '駅までどのくらい時間がかかりますか。', ['How', 'long', 'does', 'it', 'take', 'to', 'the', 'station', '?'], 'How long ...?', 'How long does it take ～? で時間をたずねるよ。', 'reorder'],
  ['e4add-q-04', 'あなたは何冊本を持っていますか。', ['How', 'many', 'books', 'do', 'you', 'have', '?'], 'How many ...?', '数えられる名詞の数は How many でたずねるよ。', 'fill-blank'],
  ['e4add-q-05', 'あなたの誕生日はいつですか。', ['When', 'is', 'your', 'birthday', '?'], '疑問詞 What', 'When は「いつ」をたずねる疑問詞だよ。', 'response'],
  ['e4add-q-06', 'これは誰のかばんですか。', ['Whose', 'bag', 'is', 'this', '?'], '疑問詞 What', 'Whose は「誰の」をたずねる疑問詞だよ。', 'sentence-choice'],

  // 接続詞（既存3問 → 10問）
  ['e4add-conj-01', '私は疲れていたので早く寝ました。', ['I', 'went', 'to', 'bed', 'early', 'because', 'I', 'was', 'tired', '.'], 'because', 'because は理由「～なので」を表すよ。', 'sentence-choice'],
  ['e4add-conj-02', 'もし明日晴れたら、私たちは公園へ行きます。', ['If', 'it', 'is', 'sunny', 'tomorrow', ',', 'we', 'will', 'go', 'to', 'the', 'park', '.'], '接続詞 if', 'if は「もし～なら」という条件を表すよ。', 'reorder'],
  ['e4add-conj-03', '家に着いたら電話してください。', ['Call', 'me', 'when', 'you', 'get', 'home', '.'], '接続詞 when', 'when は「～するとき」を表すよ。', 'fill-blank'],
  ['e4add-conj-04', '私は彼が親切だと思います。', ['I', 'think', 'that', 'he', 'is', 'kind', '.'], 'because', 'that は think の内容をつなぐよ。', 'sentence-choice'],
  ['e4add-conj-05', '雨が降ったので試合は中止になりました。', ['The', 'game', 'was', 'canceled', 'because', 'it', 'rained', '.'], 'because', 'because の後ろに理由の文を置くよ。', 'error-correction'],
  ['e4add-conj-06', '時間があれば、私を手伝ってください。', ['If', 'you', 'have', 'time', ',', 'please', 'help', 'me', '.'], '接続詞 if', 'If you have time は「時間があれば」だよ。', 'reorder'],
  ['e4add-conj-07', '夕食が終わったとき、宿題をしました。', ['When', 'dinner', 'was', 'over', ',', 'I', 'did', 'my', 'homework', '.'], '接続詞 when', 'when の後ろに起きた時を表す文を置くよ。', 'sentence-choice'],
]);
