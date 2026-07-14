import { eiken4CoreExamQuestions, eiken4CoreSentences } from '../data/eiken4Curriculum';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { eiken4Words } from '../data/eiken4Words';
import { DailyProgress, getQuestionById } from './eiken4DailyService';

type WorksheetQuestion = {
  id: string;
  kind: string;
  prompt: string;
  detail: string;
  choices: string[];
  answer: string;
  explanation: string;
};

const hash = (value: string) => {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const candidateIds = [
  ...eiken4Words.map(item => `word-${item.id}`),
  ...eiken4CoreSentences.map(item => `sentence-${item.id}`),
  ...eiken4ListeningQuestions.map(item => `listening-${item.id}`),
  ...eiken4CoreExamQuestions.map(item => `exam-${item.id}`),
];

const makeWorksheet = (progress: DailyProgress): WorksheetQuestion[] => {
  const wrongIds = new Set(progress.answers.filter(answer => !answer.correct).map(answer => answer.id));
  const sourceIds = [...progress.questionIds].sort((a, b) => Number(wrongIds.has(b)) - Number(wrongIds.has(a)));
  const used = new Set(progress.questionIds);

  return sourceIds.map((sourceId, index) => {
    const source = getQuestionById(sourceId, progress.date);
    const sourceWord = sourceId.startsWith('word-') ? eiken4Words.find(item => `word-${item.id}` === sourceId) : undefined;
    const matches = candidateIds.filter(id => {
      if (used.has(id)) return false;
      const question = getQuestionById(id, progress.date);
      if (!question || !source) return false;
      if (sourceWord && id.startsWith('word-')) {
        return eiken4Words.find(item => `word-${item.id}` === id)?.category === sourceWord.category;
      }
      return question.kind === source.kind || (sourceId.startsWith('sentence-') && id.startsWith('sentence-') && question.detail === source.detail);
    });
    const fallback = candidateIds.filter(id => !used.has(id) && id.split('-')[0] === sourceId.split('-')[0]);
    const pool = matches.length ? matches : fallback;
    const pickedId = pool[hash(`${progress.date}-${sourceId}-${index}`) % Math.max(pool.length, 1)] || sourceId;
    used.add(pickedId);
    const picked = getQuestionById(pickedId, progress.date) || source!;
    return {
      id: picked.id,
      kind: picked.kind,
      prompt: picked.prompt,
      detail: pickedId.startsWith('listening-') ? `英文：${picked.transcript?.replace(/\n/g, ' / ') || ''}` : picked.detail,
      choices: picked.choices,
      answer: picked.answer,
      explanation: picked.explanation || '答えと文の意味をもう一度確認しましょう。',
    };
  });
};

const createPage = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1240;
  canvas.height = 1754;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('PDF用の画面を作成できませんでした。');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#111827';
  context.textBaseline = 'top';
  return { canvas, context };
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = [];
  let line = '';
  for (const character of text) {
    if (character === '\n') { lines.push(line); line = ''; continue; }
    if (context.measureText(line + character).width > maxWidth && line) { lines.push(line); line = character; }
    else line += character;
  }
  if (line) lines.push(line);
  return lines;
};

const drawLines = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const lines = wrapText(context, text, maxWidth);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
};

const drawHeader = (context: CanvasRenderingContext2D, date: string, page: string, answers = false) => {
  context.font = 'bold 42px sans-serif';
  context.fillText(answers ? '英検4級 今日の類題プリント【解答・解説】' : '英検4級 今日の類題プリント', 70, 55);
  context.font = '24px sans-serif';
  context.fillText(`学習日：${date.replaceAll('-', '/')}　　名前：____________________`, 70, 120);
  context.textAlign = 'right';
  context.fillText(page, 1170, 120);
  context.textAlign = 'left';
  context.strokeStyle = '#334155';
  context.lineWidth = 2;
  context.beginPath(); context.moveTo(70, 165); context.lineTo(1170, 165); context.stroke();
};

export const downloadDailyWorksheet = async (progress: DailyProgress) => {
  const { jsPDF } = await import('jspdf');
  const questions = makeWorksheet(progress);
  const pages: HTMLCanvasElement[] = [];

  for (let pageIndex = 0; pageIndex < 3; pageIndex++) {
    const { canvas, context } = createPage();
    drawHeader(context, progress.date, `${pageIndex + 1} / 4`);
    let y = 205;
    questions.slice(pageIndex * 5, pageIndex * 5 + 5).forEach((question, localIndex) => {
      const number = pageIndex * 5 + localIndex + 1;
      context.font = 'bold 24px sans-serif';
      context.fillStyle = '#475569';
      context.fillText(`${number}.［${question.kind}］`, 70, y);
      y += 38;
      context.font = '26px sans-serif';
      context.fillStyle = '#111827';
      y = drawLines(context, question.prompt, 90, y, 1060, 36) + 8;
      context.font = '21px sans-serif';
      context.fillStyle = '#475569';
      y = drawLines(context, question.detail, 90, y, 1060, 30) + 8;
      context.font = '23px sans-serif';
      context.fillStyle = '#111827';
      question.choices.forEach((choice, choiceIndex) => {
        y = drawLines(context, `${choiceIndex + 1}) ${choice}`, 110, y, 1020, 31) + 3;
      });
      y += 28;
      context.strokeStyle = '#cbd5e1';
      context.beginPath(); context.moveTo(70, y); context.lineTo(1170, y); context.stroke();
      y += 24;
    });
    pages.push(canvas);
  }

  const { canvas: answerPage, context } = createPage();
  drawHeader(context, progress.date, '4 / 4', true);
  let y = 200;
  questions.forEach((question, index) => {
    context.font = 'bold 22px sans-serif';
    context.fillStyle = '#111827';
    y = drawLines(context, `${index + 1}. ${question.answer}`, 70, y, 1100, 30);
    context.font = '19px sans-serif';
    context.fillStyle = '#475569';
    y = drawLines(context, question.explanation, 95, y + 2, 1075, 27) + 12;
  });
  pages.push(answerPage);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  pages.forEach((page, index) => {
    if (index > 0) pdf.addPage();
    pdf.addImage(page.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  });
  pdf.save(`eiken4-print-${progress.date}.pdf`);
};
