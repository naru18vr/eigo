export type Eiken3SpeakingCard = {
  id: string;
  title: string;
  passage: string;
  question: string;
  modelAnswer: string;
  tip: string;
};

/** 二次試験の面接を、端末の音声入力に依存せず声に出して練習する教材。 */
export const eiken3SpeakingCards: Eiken3SpeakingCard[] = [
  { id: 'speaking-01', title: '公園のポスター', passage: 'Some students are playing soccer in a park. A girl is reading a book under a tree. A man is walking his dog.', question: 'What is the girl doing?', modelAnswer: 'She is reading a book under a tree.', tip: 'She is + 動詞ingで「彼女は～しています」と答えよう。' },
  { id: 'speaking-02', title: '週末の予定', passage: 'Ken is going to visit his grandmother on Saturday. He will take a train in the morning and have lunch with her.', question: 'What is Ken going to do on Saturday?', modelAnswer: 'He is going to visit his grandmother.', tip: 'He is going to + 動詞で予定を答えよう。' },
  { id: 'speaking-03', title: '学校の活動', passage: 'The students cleaned their classroom after lunch. They put old paper in a box for recycling.', question: 'What did the students do after lunch?', modelAnswer: 'They cleaned their classroom.', tip: '過去の質問にはThey + 過去形で答えよう。' },
  { id: 'speaking-04', title: '好きな活動', passage: 'Mika likes drawing pictures. She has drawn many pictures of animals, and she wants to show them at the school festival.', question: 'What does Mika like doing?', modelAnswer: 'She likes drawing pictures.', tip: 'What does ～ like doing?にはlikes + 動詞ingで答えよう。' },
  { id: 'speaking-05', title: '身近な質問', passage: 'After reading the card, the interviewer asks a question about your daily life.', question: 'What do you usually do after school?', modelAnswer: 'I usually do my homework and practice basketball after school.', tip: 'I usually + 動詞で、いつものことを1つか2つ答えよう。' },
];
