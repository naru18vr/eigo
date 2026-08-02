import type { Eiken4Reading } from './eiken4Readings';

export const eiken4AdditionalReadings: Eiken4Reading[] = [
  { id: 'r019', type: 'お知らせ', title: 'Science Room Notice', passage: 'The science room is open after school on Tuesdays and Thursdays. Students can use the computers there, but they must ask Mr. Green first. Please leave the room by five thirty. The room is closed during lunch time.', translation: '理科室は火曜日と木曜日の放課後に開いています。生徒はコンピューターを使えますが、先にグリーン先生にたずねなければなりません。5時30分までに部屋を出てください。昼休みは閉まっています。', questions: [
    { question: '理科室が開いている曜日はいつですか？', choices: ['月曜と水曜', '火曜と木曜', '水曜と金曜', '毎日'], answer: '火曜と木曜', evidence: 'on Tuesdays and Thursdays', explanation: '曜日を表す Tuesdays and Thursdays を確認します。' },
    { question: 'コンピューターを使う前に何をしますか？', choices: ['友達を呼ぶ', 'グリーン先生にたずねる', '昼食を食べる', '5時30分まで待つ'], answer: 'グリーン先生にたずねる', evidence: 'they must ask Mr. Green first', explanation: 'must ask ～ first は「先に～にたずねなければならない」です。' },
  ]},
  { id: 'r020', type: '家族', title: 'Sunday at Home', passage: 'On Sunday morning, Dad will make pancakes. Mom is going to clean the kitchen. Yuna will walk the dog at ten. In the afternoon, the family will visit Grandma. They will take a train because her house is far from their home.', translation: '日曜日の朝、父はパンケーキを作ります。母は台所を掃除する予定です。ユナは10時に犬を散歩させます。午後、家族は祖母を訪ねます。祖母の家は遠いので電車に乗ります。', questions: [
    { question: '誰が犬を散歩させますか？', choices: ['父', '母', 'ユナ', '祖母'], answer: 'ユナ', evidence: 'Yuna will walk the dog at ten.', explanation: 'Yuna が犬を散歩させる人です。' },
    { question: '家族はなぜ電車に乗りますか？', choices: ['雨だから', '駅が近いから', '祖母の家が遠いから', '犬が好きだから'], answer: '祖母の家が遠いから', evidence: 'because her house is far from their home', explanation: 'because の後ろが電車に乗る理由です。' },
  ]},
  { id: 'r021', type: '会話', title: 'At the Shoe Shop', passage: 'Clerk: Can I help you? Mai: Yes. I need running shoes for school. Clerk: How about these? Mai: They look nice, but I need a smaller size. Clerk: Here is size 23. Mai: Great. I will take them.', translation: '店員：お手伝いしましょうか。マイ：はい、学校用のランニングシューズが必要です。店員：こちらはどうですか。マイ：すてきですが、もっと小さいサイズが必要です。店員：23サイズです。マイ：いいですね。これにします。', questions: [
    { question: 'マイは何が必要ですか？', choices: ['学校用の靴', '新しいかばん', '赤い帽子', '大きな箱'], answer: '学校用の靴', evidence: 'I need running shoes for school.', explanation: 'running shoes for school が必要なものです。' },
    { question: 'マイが選んだサイズは何ですか？', choices: ['21', '22', '23', '24'], answer: '23', evidence: 'Here is size 23.', explanation: '店員が size 23 と言っています。' },
  ]},
  { id: 'r022', type: '旅行', title: 'A Day in Nara', passage: 'Last Saturday, Leo went to Nara with his class. They saw many deer in the park and visited an old temple. At noon, they ate rice balls under a tree. Leo bought a small deer key ring for his sister. They returned to school at four.', translation: '先週の土曜日、レオはクラスで奈良へ行きました。公園でたくさんの鹿を見て、古い寺を訪ねました。正午、木の下でおにぎりを食べました。妹に小さな鹿のキーホルダーを買いました。4時に学校へ戻りました。', questions: [
    { question: 'レオはどこで鹿を見ましたか？', choices: ['学校', '公園', '寺の中', '駅'], answer: '公園', evidence: 'They saw many deer in the park', explanation: 'in the park が場所を表します。' },
    { question: 'レオは誰にキーホルダーを買いましたか？', choices: ['先生', '友達', '妹', '母'], answer: '妹', evidence: 'for his sister', explanation: 'for his sister なので妹へのプレゼントです。' },
  ]},
  { id: 'r023', type: '日記', title: 'A Snowy Holiday', passage: 'It snowed a lot during my winter holiday. I made a snowman with my brother in the morning. In the afternoon, we stayed inside and played a board game. My mother made hot chocolate for us. I hope it snows again next year.', translation: '冬休みにたくさん雪が降りました。朝、弟と雪だるまを作りました。午後は家の中にいてボードゲームをしました。母が私たちにホットチョコレートを作ってくれました。来年も雪が降るといいです。', questions: [
    { question: '筆者は午前中に何をしましたか？', choices: ['スキーをした', '雪だるまを作った', '本を読んだ', '買い物をした'], answer: '雪だるまを作った', evidence: 'I made a snowman with my brother in the morning.', explanation: 'in the morning の行動を探します。' },
    { question: '母は何を作りましたか？', choices: ['ケーキ', 'スープ', 'ホットチョコレート', 'お茶'], answer: 'ホットチョコレート', evidence: 'My mother made hot chocolate for us.', explanation: 'made hot chocolate が答えです。' },
  ]},
  { id: 'r024', type: '案内', title: 'Basketball Club', passage: 'The basketball club practices in the gym on Monday, Wednesday, and Friday. Practice starts at four and ends at six. New students can watch a practice this week. Please bring indoor shoes if you want to join. The club will play a game next month.', translation: 'バスケットボール部は月・水・金に体育館で練習します。練習は4時に始まり6時に終わります。新入生は今週練習を見学できます。入部したい人は体育館シューズを持ってきてください。来月試合をします。', questions: [
    { question: 'バスケットボール部はどこで練習しますか？', choices: ['校庭', '体育館', '公園', '教室'], answer: '体育館', evidence: 'practices in the gym', explanation: 'in the gym が練習場所です。' },
    { question: '入部したい人は何を持ってきますか？', choices: ['外靴', '体育館シューズ', 'ボール', 'お弁当'], answer: '体育館シューズ', evidence: 'Please bring indoor shoes', explanation: 'indoor shoes は体育館シューズです。' },
  ]},
  { id: 'r025', type: '説明文', title: 'Sea Turtles', passage: 'Sea turtles live in warm oceans. They come to beaches to lay eggs. A mother turtle makes a hole in the sand and lays many eggs there. After about two months, baby turtles come out at night. They move toward the sea when they see the moonlight.', translation: 'ウミガメは暖かい海に住んでいます。卵を産むために浜へ来ます。母ガメは砂に穴を作り、そこへたくさんの卵を産みます。約2か月後、赤ちゃんガメは夜に出てきます。月明かりを見ると海へ向かいます。', questions: [
    { question: 'ウミガメはどこに卵を産みますか？', choices: ['川', '浜の砂', '木の上', '海の底'], answer: '浜の砂', evidence: 'A mother turtle makes a hole in the sand and lays many eggs there.', explanation: 'in the sand と there が場所を示します。' },
    { question: '赤ちゃんガメはいつ出てきますか？', choices: ['朝', '昼', '夜', '正午'], answer: '夜', evidence: 'baby turtles come out at night', explanation: 'at night は「夜に」です。' },
  ]},
  { id: 'r026', type: 'メール', title: 'A Message from Nick', passage: 'Hi Sota, I am in Osaka with my family. We visited the aquarium yesterday and saw penguins. Tomorrow, we are going to visit Osaka Castle. I bought a blue fish towel for you. I will give it to you at school next Monday. Nick', translation: 'ソウタへ。家族と大阪にいます。昨日水族館を訪れ、ペンギンを見ました。明日は大阪城を訪れる予定です。青い魚のタオルをあなたに買いました。来週月曜日に学校で渡します。ニックより。', questions: [
    { question: 'ニックは昨日どこへ行きましたか？', choices: ['大阪城', '水族館', '学校', '公園'], answer: '水族館', evidence: 'We visited the aquarium yesterday', explanation: 'yesterday の行動は aquarium です。' },
    { question: 'ニックはソウタに何を買いましたか？', choices: ['赤い帽子', '青い魚のタオル', 'ペンギンの本', '大阪城の写真'], answer: '青い魚のタオル', evidence: 'a blue fish towel for you', explanation: 'for you のプレゼントを確認します。' },
  ]},
  { id: 'r027', type: '時刻表', title: 'Town Bus Schedule', passage: 'The town bus leaves Central Station at 8:00, 9:30, and 11:00 in the morning. It takes twenty minutes to Green Park. On Saturdays, the bus does not run after six in the evening. A one-way ticket is two hundred yen.', translation: '町のバスは中央駅を午前8時、9時30分、11時に出ます。グリーン公園まで20分かかります。土曜日は午後6時以降バスは走りません。片道切符は200円です。', questions: [
    { question: '午前中に中央駅を出るバスは何時ですか？', choices: ['7時', '8時', '10時', '12時'], answer: '8時', evidence: 'leaves Central Station at 8:00', explanation: '朝の出発時刻の一つは8時です。' },
    { question: '片道切符はいくらですか？', choices: ['100円', '150円', '200円', '300円'], answer: '200円', evidence: 'A one-way ticket is two hundred yen.', explanation: 'two hundred yen は200円です。' },
  ]},
  { id: 'r028', type: 'レシピ', title: 'Fruit Sandwich', passage: 'To make a fruit sandwich, you need bread, cream, and bananas. First, spread cream on two slices of bread. Next, put banana slices on one piece. Put the other piece on top and cut the sandwich in half. Keep it in the refrigerator until you eat it.', translation: 'フルーツサンドを作るには、パン、クリーム、バナナが必要です。まずパン2枚にクリームを塗ります。次に1枚にバナナの輪切りを置きます。もう1枚を上に置き、サンドイッチを半分に切ります。食べるまで冷蔵庫に入れておきます。', questions: [
    { question: 'パンに最初に何を塗りますか？', choices: ['バナナ', 'クリーム', 'ジャム', 'バター'], answer: 'クリーム', evidence: 'First, spread cream on two slices of bread.', explanation: 'First の後の作業を確認します。' },
    { question: '食べるまでどこに置きますか？', choices: ['机の上', '冷蔵庫', 'かばん', 'オーブン'], answer: '冷蔵庫', evidence: 'Keep it in the refrigerator', explanation: 'in the refrigerator が保管場所です。' },
  ]},
  { id: 'r029', type: 'お知らせ', title: 'Art Show', passage: 'Our school art show is in the music room this Friday. It starts at three thirty and ends at five. Students in Class 2-A made paintings of their favorite seasons. Please do not touch the paintings. You can write your comments on the blue cards near the door.', translation: '学校の美術展は今週金曜日に音楽室で開かれます。3時30分に始まり5時に終わります。2年A組の生徒が好きな季節の絵を作りました。絵に触らないでください。ドアの近くの青いカードに感想を書けます。', questions: [
    { question: '美術展はどこで開かれますか？', choices: ['美術室', '音楽室', '図書室', '体育館'], answer: '音楽室', evidence: 'in the music room', explanation: '美術展の場所は音楽室です。' },
    { question: '感想はどこに書きますか？', choices: ['白い紙', '青いカード', '絵の裏', 'ノート'], answer: '青いカード', evidence: 'on the blue cards near the door', explanation: 'blue cards に感想を書きます。' },
  ]},
  { id: 'r030', type: '説明文', title: 'School Lunch Helpers', passage: 'Every day, two students help serve lunch in Class 2-C. They wear white caps and wash their hands first. After lunch, they clean the tables and put the dishes in a box. On Friday, the teacher checks the lunch room with them.', translation: '毎日、2年C組の2人の生徒が給食を配る手伝いをします。白い帽子をかぶり、先に手を洗います。給食後、机をきれいにし、食器を箱に入れます。金曜日には先生が一緒に給食室を確認します。', questions: [
    { question: '給食を配る生徒は何人ですか？', choices: ['1人', '2人', '3人', '4人'], answer: '2人', evidence: 'two students help serve lunch', explanation: 'two students は2人です。' },
    { question: '生徒は最初に何をしますか？', choices: ['机を拭く', '帽子を買う', '手を洗う', '食器を箱に入れる'], answer: '手を洗う', evidence: 'wash their hands first', explanation: 'first の後の行動を確認します。' },
  ]},
];
