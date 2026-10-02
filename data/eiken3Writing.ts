export type Eiken3WritingTask = {
  id: string;
  kind: 'email' | 'opinion';
  title: string;
  prompt: string;
  japanesePrompt: string;
  wordRange: string;
  checklist: string[];
  modelAnswer: string;
  explanation: string;
};

/** 英検3級の形式に合わせたオリジナルのライティング練習。 */
export const eiken3WritingTasks: Eiken3WritingTask[] = [
  {
    id: 'email-01',
    kind: 'email',
    title: 'メールに返信しよう①',
    prompt: 'Your friend Emma asks: “What did you do last Sunday?” and “Who did you go with?” Write a reply to Emma.',
    japanesePrompt: '友達のEmmaから「先週の日曜日に何をしましたか」「誰と行きましたか」と聞かれました。2つの質問に答える返信を書こう。',
    wordRange: '15〜25語',
    checklist: ['2つの質問に答えた', '文の最初を大文字にした', '文末にピリオドをつけた'],
    modelAnswer: 'I visited a museum with my father last Sunday. We saw many interesting pictures there.',
    explanation: '「何をしたか」と「誰と行ったか」の2点を短い英文で答えます。with + 人で「～と一緒に」を表せます。',
  },
  {
    id: 'email-02',
    kind: 'email',
    title: 'メールに返信しよう②',
    prompt: 'Your friend Leo asks: “What food do you like?” and “When do you usually eat it?” Write a reply to Leo.',
    japanesePrompt: '友達のLeoから「どんな食べ物が好きですか」「いつそれをよく食べますか」と聞かれました。2つの質問に答える返信を書こう。',
    wordRange: '15〜25語',
    checklist: ['好きな食べ物を書いた', '食べる時間を書いた', 'I like / I usually eat の形を使った'],
    modelAnswer: 'I like curry and rice very much. I usually eat it with my family on Sunday evenings.',
    explanation: '好きなものはI like ～、習慣はI usually eat ～で書き始めるとまとめやすいです。',
  },
  {
    id: 'opinion-01',
    kind: 'opinion',
    title: '自分の意見を書こう①',
    prompt: 'Question: Do you think students should read books every day?',
    japanesePrompt: '「生徒は毎日本を読むべきだと思いますか」という質問に、理由を2つ書いて答えよう。',
    wordRange: '25〜35語を目標',
    checklist: ['I think / I do not thinkで意見を書いた', '理由を2つ書いた', 'becauseやalsoで文をつないだ'],
    modelAnswer: 'I think students should read books every day. First, they can learn many new words. Also, reading is a good way to relax after a busy school day.',
    explanation: '意見 → Firstの理由 → Alsoの理由、の3つに分けると書きやすくなります。',
  },
  {
    id: 'opinion-02',
    kind: 'opinion',
    title: '自分の意見を書こう②',
    prompt: 'Question: Do you like studying English with friends?',
    japanesePrompt: '「友達と一緒に英語を勉強するのが好きですか」という質問に、理由を2つ書いて答えよう。',
    wordRange: '25〜35語を目標',
    checklist: ['Yes / Noの意見を書いた', '理由を2つ書いた', '友達と学ぶ具体的なよさを書いた'],
    modelAnswer: 'Yes, I do. I can ask my friends questions, and we can practice speaking together. Studying with friends is fun, and it helps me keep practicing every week.',
    explanation: '「質問できる」「一緒に練習できる」のように、具体的な理由を2つ考えます。',
  },
];
