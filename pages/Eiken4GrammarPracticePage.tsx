import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { getGrammarCategory, getGrammarPracticeQuestions, recordGrammarPracticeAnswer, saveGrammarPracticeResult, type GrammarCategoryId, type GrammarPracticeQuestion } from '../services/eiken4GrammarPracticeService';
import { speakText } from '../services/speechService';
import type { DailyAnswer } from '../services/eiken4DailyService';
import { getStepForGrammarCategory, recordLearningGrammarPractice } from '../services/eiken4StepLearningService';

const makeAttemptId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const Eiken4GrammarPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId: routeCategoryId } = useParams<{ categoryId: string }>();
  // クエリ形式は過去の共有URLとの互換用。新規導線は /:categoryId を使う。
  const categoryId = (routeCategoryId || new URLSearchParams(location.search).get('category')) as GrammarCategoryId | null;
  const category = getGrammarCategory(categoryId);
  const [attemptId, setAttemptId] = useState(makeAttemptId);
  const [questions, setQuestions] = useState<GrammarPracticeQuestion[]>(() => category ? getGrammarPracticeQuestions(category.id, attemptId) : []);
  const [answers, setAnswers] = useState<DailyAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const nextAttempt = makeAttemptId();
    setAttemptId(nextAttempt);
    setQuestions(category ? getGrammarPracticeQuestions(category.id, nextAttempt) : []);
    setAnswers([]); setSelected(null); setChecked(false); setSaved(false);
  }, [categoryId]);

  if (!category) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4/grammar-practice-select')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />文法を選ぶ</Button><section className="mt-12 rounded-3xl bg-white p-7 text-center shadow"><h1 className="text-2xl font-extrabold">指定された文法が見つかりませんでした。</h1><p className="mt-3 text-slate-600">文法を選び直してください。</p><Button onClick={() => navigate('/eiken4/grammar-practice-select')} className="mt-6 w-full">文法選択へ戻る</Button><Button onClick={() => navigate('/eiken4')} variant="ghost" className="mt-2 w-full">英検4級トップへ戻る</Button></section></main></div>;
  const current = questions[answers.length];
  const finished = answers.length >= questions.length;
  const correctCount = answers.filter(answer => answer.correct).length;

  const startAgain = (wrongOnly = false) => {
    const nextAttempt = makeAttemptId();
    const source = wrongOnly ? questions.filter((question, index) => !answers[index]?.correct) : getGrammarPracticeQuestions(category.id, nextAttempt);
    setAttemptId(nextAttempt); setQuestions(source); setAnswers([]); setSelected(null); setChecked(false); setSaved(false);
  };

  const next = () => {
    if (!current || !selected || !checked) return;
    const correct = selected === current.answer;
    const nextAnswers = [...answers, { id: current.id, correct }];
    recordGrammarPracticeAnswer(current.id, correct);
    setAnswers(nextAnswers); setSelected(null); setChecked(false);
    if (nextAnswers.length === questions.length && !saved) {
      saveGrammarPracticeResult(category.id, questions.map(question => question.id), nextAnswers);
      recordLearningGrammarPractice(category.id, nextAnswers.filter(answer => answer.correct).length, nextAnswers.length);
      setSaved(true);
    }
  };

  if (!questions.length) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4/grammar-practice-select')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />文法を選ぶ</Button><section className="mt-12 rounded-3xl bg-white p-7 text-center shadow"><h1 className="text-2xl font-extrabold">この文法の問題は現在準備中です。</h1><p className="mt-3 text-slate-600">ほかの文法を選んで練習してみよう。</p><Button onClick={() => navigate('/eiken4/grammar-practice-select')} className="mt-6 w-full">文法選択へ戻る</Button><Button onClick={() => navigate('/eiken4')} variant="ghost" className="mt-2 w-full">英検4級トップへ戻る</Button></section></main></div>;

  if (finished) {
    const passed = correctCount / questions.length >= .8;
    const step = getStepForGrammarCategory(category.id);
    const mainAction = passed
      ? () => navigate(step ? `/eiken4/learning-step/${step.id}` : '/eiken4/grammar-practice-select')
      : () => navigate(category.guideTopic ? `/eiken4/grammar-guide?topic=${category.guideTopic}` : '/eiken4/grammar-practice-select');
    return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl">
      <section className="mt-4 rounded-3xl bg-white p-7 text-center shadow"><CheckCircleIcon className="mx-auto h-16 w-16 text-emerald-500"/><p className="mt-4 font-bold text-cyan-700">{category.title}の練習結果</p><h1 className="mt-2 text-4xl font-extrabold text-slate-900">{correctCount} / {questions.length}</h1><p className="mt-2 text-slate-600">出題数：{questions.length}問・不正解：{questions.length - correctCount}問</p><p className="mt-1 text-slate-600">正答率：{Math.round(correctCount / questions.length * 100)}％</p></section>
      <section className={`mt-4 rounded-2xl p-5 text-center ${passed ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`}><p className="font-extrabold">{passed ? 'よくできました！' : 'ここまでよくがんばったね。'}</p><p className="mt-2 text-sm leading-6">{passed ? 'つぎの文法へ進んでみよう。' : '説明をもう一度見てから、同じ文法を練習してみよう。'}</p><Button onClick={mainAction} className="mt-4 w-full">{passed ? 'つぎの文法へ' : '説明をもう一度見る'}</Button></section>
      <section className="mt-4 rounded-3xl bg-white p-5 shadow"><h2 className="text-left text-xl font-extrabold">間違えた問題の復習</h2>{answers.every(answer => answer.correct) ? <p className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">全問正解！ この文法はよくできています。</p> : <div className="mt-3 space-y-3 text-left">{questions.map((question, index) => !answers[index]?.correct && <details key={question.id} className="rounded-xl border border-rose-200 bg-rose-50 p-4"><summary className="cursor-pointer font-bold text-rose-900">{question.prompt}</summary><p className="mt-3 font-bold text-emerald-700">正解：{question.answer}</p><p className="mt-2 text-sm leading-6 text-slate-700">{question.explanation}</p></details>)}</div>}</section>
      <div className="mt-5 grid gap-2"><Button onClick={() => startAgain()} variant="secondary" className="w-full">同じ文法をもう一度</Button>{answers.some(answer => !answer.correct) && <Button onClick={() => startAgain(true)} variant="secondary" className="w-full">間違えた問題だけ復習</Button>}<Button onClick={() => navigate('/eiken4/grammar-practice-select')} variant="ghost" className="w-full">ほかの文法を選ぶ</Button><Button onClick={() => navigate('/eiken4')} variant="ghost" className="w-full">英検4級トップへ戻る</Button></div>
    </main></div>;
  }

  const selectedCorrect = selected === current.answer;
  return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4/grammar-practice-select')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />文法を選び直す</Button><div className="mt-4 flex items-center justify-between text-sm font-bold text-cyan-800"><span>{category.title}の練習</span><span>{answers.length + 1} / {questions.length}問</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-cyan-600 transition-all" style={{ width: `${answers.length / questions.length * 100}%` }}/></div><section className="mt-5 rounded-3xl border border-cyan-100 bg-white p-6 shadow"><p className="text-sm font-bold text-cyan-700">日本語に合う英文を選ぼう</p><h1 className="mt-4 text-2xl font-extrabold leading-9 text-slate-900">{current.prompt}</h1><p className="mt-2 text-sm text-slate-500">{current.detail}</p><div className="mt-6 grid gap-3">{current.choices.map(choice => <button key={choice} disabled={checked} onClick={() => { setSelected(choice); setChecked(true); }} className={`min-h-12 rounded-xl border-2 p-4 text-left font-bold ${checked && choice === current.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : checked && choice === selected ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-slate-200 bg-white text-slate-800 active:border-cyan-500'}`}>{choice}</button>)}</div>{checked && <div className={`mt-5 rounded-xl p-4 ${selectedCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}><p className="font-extrabold">{selectedCorrect ? '○ 正解！' : `× 正解：${current.answer}`}</p><p className="mt-2 text-sm leading-6 text-slate-700">{current.explanation}</p><button onClick={() => speakText(current.answer, 'en-US', .82)} className="mt-3 inline-flex min-h-11 items-center rounded-full border border-cyan-200 bg-white px-4 text-sm font-bold text-cyan-800"><SpeakerWaveIcon className="mr-2 h-5 w-5"/>正しい英文を聞く</button><Button onClick={next} className="mt-4 w-full">{answers.length + 1 === questions.length ? '結果を見る' : '次の問題へ'}</Button></div>}</section></main></div>;
};

export default Eiken4GrammarPracticePage;
