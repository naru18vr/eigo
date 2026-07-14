export type Grade1Word = { word: string; meaning: string; example: string };

export const grade1ReviewWords: Grade1Word[] = [
  ['I','私は','I am a student.'],['you','あなたは','You are my friend.'],['he','彼は','He plays soccer.'],['she','彼女は','She likes music.'],['we','私たちは','We study English.'],['they','彼らは','They are students.'],
  ['this','これは','This is my pen.'],['that','あれは','That is a school.'],['what','何','What is this?'],['who','だれ','Who is that boy?'],['where','どこ','Where is my bag?'],['when','いつ','When do you study?'],
  ['school','学校','I go to school.'],['teacher','先生','She is my teacher.'],['student','生徒','He is a student.'],['friend','友達','Ken is my friend.'],['family','家族','I love my family.'],['mother','母','My mother can cook.'],
  ['father','父','My father is busy.'],['brother','兄・弟','I have a brother.'],['sister','姉・妹','She is my sister.'],['book','本','This is an English book.'],['pen','ペン','I have a pen.'],['notebook','ノート','Open your notebook.'],
  ['desk','机','The book is on the desk.'],['room','部屋','This is my room.'],['house','家','I live in this house.'],['dog','犬','I like dogs.'],['cat','猫','The cat is cute.'],['food','食べ物','I like Japanese food.'],
  ['water','水','I drink water.'],['breakfast','朝食','I eat breakfast at seven.'],['morning','朝','I study in the morning.'],['today','今日','I am busy today.'],['tomorrow','明日','See you tomorrow.'],['every','毎～','I walk every day.'],
  ['go','行く','I go to school.'],['come','来る','Please come here.'],['play','する・遊ぶ','I play tennis.'],['like','好きである','I like English.'],['have','持っている','I have a bike.'],['study','勉強する','We study math.'],
  ['eat','食べる','I eat an apple.'],['drink','飲む','She drinks milk.'],['read','読む','I read a book.'],['write','書く','Write your name.'],['speak','話す','I speak Japanese.'],['watch','見る','We watch TV.'],
  ['listen','聞く','Listen to me.'],['help','手伝う','I help my mother.'],['know','知っている','I know him.'],['want','欲しい','I want a new bag.'],['live','住む','I live in Tokyo.'],['make','作る','We make lunch.'],
  ['good','よい','This book is good.'],['new','新しい','I have a new bike.'],['old','古い・年を取った','This house is old.'],['big','大きい','That is a big dog.'],['small','小さい','I have a small cat.'],['happy','うれしい','I am happy.'],
  ['busy','忙しい','She is busy today.'],['kind','親切な','My teacher is kind.'],['can','～できる','I can swim.'],['not','～でない','I am not tired.'],['in','～の中に','The ball is in the box.'],['on','～の上に','The pen is on the desk.'],
  ['under','～の下に','The cat is under the table.'],['with','～と一緒に','I play with Ken.'],['from','～出身の','I am from Japan.'],['to','～へ','I go to school.'],['and','そして','Ken and Yumi are friends.'],['but','しかし','I like dogs, but I do not like cats.'],
].map(([word, meaning, example]) => ({ word, meaning, example }));

export const grade1GrammarTopics = [
  { title: 'be動詞', question: '私は中学生です。', answer: 'I am a junior high school student.', note: 'I の後は am を使います。' },
  { title: 'be動詞', question: '彼は私の友達です。', answer: 'He is my friend.', note: 'he / she の後は is を使います。' },
  { title: 'be動詞の否定文', question: '私は忙しくありません。', answer: 'I am not busy.', note: 'be動詞の後に not を置きます。' },
  { title: 'be動詞の疑問文', question: 'あなたは学生ですか。', answer: 'Are you a student?', note: 'be動詞を文の先頭へ出します。' },
  { title: '一般動詞', question: '私は毎日英語を勉強します。', answer: 'I study English every day.', note: '習慣は現在形で表します。' },
  { title: '三単現', question: '彼女は音楽が好きです。', answer: 'She likes music.', note: 'he / she の現在形では動詞に s を付けます。' },
  { title: '一般動詞の否定文', question: '私は野球をしません。', answer: 'I do not play baseball.', note: 'do not の後は動詞の原形です。' },
  { title: '一般動詞の疑問文', question: 'あなたは犬が好きですか。', answer: 'Do you like dogs?', note: 'Do を先頭に置きます。' },
  { title: '疑問詞', question: 'あなたはどこに住んでいますか。', answer: 'Where do you live?', note: '疑問詞＋疑問文の語順です。' },
  { title: 'can', question: '私は泳ぐことができます。', answer: 'I can swim.', note: 'can の後は動詞の原形です。' },
  { title: 'canの疑問文', question: 'あなたは英語を話せますか。', answer: 'Can you speak English?', note: 'Can を先頭に置きます。' },
  { title: '命令文', question: 'この本を読んでください。', answer: 'Please read this book.', note: '動詞の原形で始めます。' },
  { title: '現在進行形', question: '彼はいまテニスをしています。', answer: 'He is playing tennis now.', note: 'be動詞＋動詞ing を使います。' },
  { title: '過去形', question: '私は昨日テレビを見ました。', answer: 'I watched TV yesterday.', note: '過去のことは動詞を過去形にします。' },
  { title: '代名詞', question: 'これは彼女のかばんです。', answer: 'This is her bag.', note: '「彼女の」は her です。' },
  { title: '複数形', question: '私は2匹の犬を飼っています。', answer: 'I have two dogs.', note: '2つ以上なら名詞を複数形にします。' },
];
