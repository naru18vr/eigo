export type Eiken4ExamQuestion = {
  id: string;
  type: '短文空所補充' | '会話文空所補充' | '語句整序';
  prompt: string;
  translation?: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export const eiken4ExamQuestions: Eiken4ExamQuestion[] = [
  { id:'x001', type:'短文空所補充', prompt:'My sister ( ___ ) dinner for us yesterday.', translation:'姉は昨日、私たちに夕食を作りました。', choices:['cooks','cooked','cooking','cook'], answer:'cooked', explanation:'yesterdayがあるので過去形cookedを使います。' },
  { id:'x002', type:'短文空所補充', prompt:'There ( ___ ) two cats under the table.', translation:'テーブルの下に猫が2匹います。', choices:['is','are','am','be'], answer:'are', explanation:'主語がtwo catsと複数なのでareです。' },
  { id:'x003', type:'短文空所補充', prompt:'I want ( ___ ) a doctor in the future.', translation:'私は将来、医者になりたいです。', choices:['be','to be','being','was'], answer:'to be', explanation:'want to＋動詞の原形で「～したい」です。' },
  { id:'x004', type:'短文空所補充', prompt:'This bag is ( ___ ) than that one.', translation:'このかばんはあのかばんより軽いです。', choices:['light','lighter','lightest','the light'], answer:'lighter', explanation:'thanの前では比較級lighterを使います。' },
  { id:'x005', type:'短文空所補充', prompt:'We have lived here ( ___ ) three years.', translation:'私たちはここに3年間住んでいます。', choices:['at','for','since','from'], answer:'for', explanation:'期間を表すthree yearsの前ではforを使います。' },
  { id:'x006', type:'短文空所補充', prompt:'Please turn ( ___ ) the TV. I want to watch the news.', translation:'テレビをつけてください。ニュースを見たいです。', choices:['on','off','up','down'], answer:'on', explanation:'turn onは「電源をつける」です。' },
  { id:'x007', type:'短文空所補充', prompt:'Ken is good ( ___ ) playing the guitar.', translation:'ケンはギターを弾くのが得意です。', choices:['at','in','on','for'], answer:'at', explanation:'be good atで「～が得意」です。' },
  { id:'x008', type:'短文空所補充', prompt:'You ( ___ ) run in the library.', translation:'図書館で走ってはいけません。', choices:['must','must not','have to','can'], answer:'must not', explanation:'must notは強い禁止を表します。' },
  { id:'x009', type:'短文空所補充', prompt:'When I called Emi, she ( ___ ) her homework.', translation:'私がエミに電話したとき、彼女は宿題をしていました。', choices:['does','did','was doing','is doing'], answer:'was doing', explanation:'過去のある時点で進行中なので過去進行形です。' },
  { id:'x010', type:'短文空所補充', prompt:'This picture was painted ( ___ ) my grandfather.', translation:'この絵は祖父によって描かれました。', choices:['by','of','to','with'], answer:'by', explanation:'受け身で行為者を表すときはbyを使います。' },
  { id:'x011', type:'短文空所補充', prompt:'Have you ( ___ ) been to Okinawa?', translation:'今までに沖縄へ行ったことがありますか。', choices:['ever','never','yet','ago'], answer:'ever', explanation:'経験を尋ねる現在完了の疑問文ではeverを使います。' },
  { id:'x012', type:'短文空所補充', prompt:'I was tired, ( ___ ) I went to bed early.', translation:'疲れていたので、早く寝ました。', choices:['so','but','or','if'], answer:'so', explanation:'原因と結果を結ぶsoが適切です。' },
  { id:'x013', type:'短文空所補充', prompt:'How ( ___ ) milk do you need?', translation:'牛乳はどのくらい必要ですか。', choices:['many','much','long','often'], answer:'much', explanation:'数えられない名詞milkにはHow muchを使います。' },
  { id:'x014', type:'短文空所補充', prompt:'The girl ( ___ ) is singing is my cousin.', translation:'歌っている女の子は私のいとこです。', choices:['who','which','where','when'], answer:'who', explanation:'人を説明する主格の関係代名詞whoです。' },
  { id:'x015', type:'短文空所補充', prompt:'If it is sunny tomorrow, we ( ___ ) hiking.', translation:'明日晴れたら、ハイキングへ行きます。', choices:['go','went','will go','going'], answer:'will go', explanation:'未来の条件では、主節にwill＋動詞の原形を使えます。' },
  { id:'x016', type:'会話文空所補充', prompt:'A: How was your weekend?\nB: ( ___ ) I went camping with my family.', choices:['It was great.','See you later.','You are welcome.','That is too bad.'], answer:'It was great.', explanation:'週末の感想を答えてから、したことを説明しています。' },
  { id:'x017', type:'会話文空所補充', prompt:'A: May I use your computer?\nB: ( ___ ) I am not using it now.', choices:['Sure.','Never mind.','I hope not.','No, I did not.'], answer:'Sure.', explanation:'許可を求められ、今は使っていないのでSure.が自然です。' },
  { id:'x018', type:'会話文空所補充', prompt:'A: What is the matter?\nB: ( ___ )', choices:['I have a stomachache.','I like apples.','It is on the desk.','I am thirteen.'], answer:'I have a stomachache.', explanation:'What is the matter?は体調や問題を尋ねる表現です。' },
  { id:'x019', type:'会話文空所補充', prompt:'A: Would you like some more cake?\nB: ( ___ ) I am full.', choices:['No, thank you.','Yes, I do.','Here you are.','Of course I can.'], answer:'No, thank you.', explanation:'I am full.と続くため、丁寧に断る表現が適切です。' },
  { id:'x020', type:'会話文空所補充', prompt:'A: Excuse me. Where is the post office?\nB: ( ___ )', choices:['It is next to the bank.','I went there yesterday.','It opens at nine.','I need a stamp.'], answer:'It is next to the bank.', explanation:'Whereへの答えとして場所を説明します。' },
  { id:'x021', type:'会話文空所補充', prompt:'A: I passed the English test.\nB: ( ___ )', choices:['Congratulations!','Be careful.','That is all right.','Do not worry.'], answer:'Congratulations!', explanation:'合格した相手にはCongratulations!と祝います。' },
  { id:'x022', type:'会話文空所補充', prompt:'A: Shall we play tennis after school?\nB: ( ___ ) I have to see the dentist.', choices:['I am sorry, but I cannot.','That sounds fun.','Yes, let us.','No problem.'], answer:'I am sorry, but I cannot.', explanation:'歯医者へ行く必要があるため、誘いを断ります。' },
  { id:'x023', type:'会話文空所補充', prompt:'A: How long does it take to the station?\nB: ( ___ )', choices:['About ten minutes.','Twice a week.','At seven o’clock.','For two years.'], answer:'About ten minutes.', explanation:'How long does it take?には所要時間を答えます。' },
  { id:'x024', type:'会話文空所補充', prompt:'A: Thank you for helping me.\nB: ( ___ )', choices:['You are welcome.','I am sorry.','Excuse me.','That is too bad.'], answer:'You are welcome.', explanation:'お礼への返答はYou are welcome.です。' },
  { id:'x025', type:'語句整序', prompt:'「私は放課後に何をすべきか分かりません。」正しい英文は？', choices:["I don't know what to do after school.","I don't what know to do after school.","What I don't know do after school.","I know don't what after school to do."], answer:"I don't know what to do after school.", explanation:'疑問詞＋to＋動詞の原形でwhat to doとなります。' },
  { id:'x026', type:'語句整序', prompt:'「私に駅への行き方を教えてください。」正しい英文は？', choices:['Please tell me how to get to the station.','Please how tell me to get the station.','Tell please to me how get the station.','How to the station please tell get me.'], answer:'Please tell me how to get to the station.', explanation:'tell＋人＋how to～の語順です。' },
  { id:'x027', type:'語句整序', prompt:'「この本はあの本ほど難しくありません。」正しい英文は？', choices:['This book is not as difficult as that one.','This book not is difficult as as that one.','This is book as not difficult that one.','Not as this book is that one difficult.'], answer:'This book is not as difficult as that one.', explanation:'not as＋形容詞＋asで「～ほど…ではない」です。' },
  { id:'x028', type:'語句整序', prompt:'「父は私に部屋を掃除するように言いました。」正しい英文は？', choices:['My father told me to clean my room.','My father told to clean me my room.','My father me told clean to my room.','To clean my father told my room me.'], answer:'My father told me to clean my room.', explanation:'tell＋人＋to＋動詞の原形の語順です。' },
  { id:'x029', type:'語句整序', prompt:'「窓のそばで本を読んでいる少年は私の弟です。」正しい英文は？', choices:['The boy reading a book by the window is my brother.','The boy is reading by the window a book my brother.','Reading the boy a book is my brother by the window.','The window by a book reading boy my brother is.'], answer:'The boy reading a book by the window is my brother.', explanation:'reading以下がThe boyを後ろから説明します。' },
  { id:'x030', type:'語句整序', prompt:'「あなたは何回京都を訪れたことがありますか。」正しい英文は？', choices:['How many times have you visited Kyoto?','How times many you have visited Kyoto?','How have you many times Kyoto visited?','Many times how visited have Kyoto you?'], answer:'How many times have you visited Kyoto?', explanation:'How many times＋現在完了の疑問文の語順です。' },
];
