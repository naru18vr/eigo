import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import { getQuestionById, recordQuestionCoverage, recordReviewAnswer } from '../services/eiken4DailyService';
import { completeLearningStep, getNextLearningStep } from '../services/eiken4StepLearningService';
import { loadMixedReviewProgress, saveMixedReviewProgress, startMixedReview, type MixedReviewProgress } from '../services/eiken4MixedReviewService';
import { useAppContext } from '../contexts/AppContext';
import { playCorrectSound, playIncorrectSound } from '../services/soundService';

const Eiken4MixedReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSoundEnabled } = useAppContext();
  const [progress, setProgress] = useState<MixedReviewProgress>(() => loadMixedReviewProgress() || startMixedReview());
  const [selected, setSelected] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const currentId = progress.questionIds[progress.answers.length];
  const current = useMemo(() => currentId ? getQuestionById(currentId, progress.date) : undefined, [currentId, progress.date]);
  const complete = progress.answers.length >= progress.questionIds.length;
  const nextStep = getNextLearningStep();

  const answer = (choice: string) => {
    if (!current || selected) return;
    const correct = choice === current.answer;
    if (isSoundEnabled) (correct ? playCorrectSound : playIncorrectSound)();
    setSelected(choice);
    setResolved(true);
  };

  const next = () => {
    if (!current || !selected || !resolved) return;
    const correct = selected === current.answer;
    recordReviewAnswer(current.id, correct, false);
    recordQuestionCoverage(current.id);
    const nextProgress = { ...progress, answers: [...progress.answers, { id: current.id, correct }] };
    if (nextProgress.answers.length >= nextProgress.questionIds.length) {
      nextProgress.completedAt = new Date().toISOString();
      if (searchParams.get('step') === '7') completeLearningStep('step-7');
    }
    saveMixedReviewProgress(nextProgress);
    setProgress(nextProgress);
    setSelected(null);
    setResolved(false);
  };

  const retry = () => {
    setProgress(startMixedReview());
    setSelected(null);
    setResolved(false);
  };

  if (!progress.questionIds.length) return <div className="flex-grow bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-6"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検4級に戻る</Button><section className="mt-8 rounded-3xl bg-white p-7 text-center shadow"><p className="text-sm font-bold text-cyan-700">習った文法のまとめ問題</p><h1 className="mt-3 text-2xl font-extrabold text-slate-900">まずはステップ1を進めよう。</h1><p className="mt-4 leading-7 text-slate-600">ここでは、習った文法だけをまぜて出すよ。先に文法を練習すると、できる問題が増えるよ。</p><Button onClick={() => navigate(`/eiken4/learning-step/${nextStep?.id || 'step-1'}`)} className="mt-6 w-full" size="lg">ステップ1を始める</Button><Button onClick={() => navigate('/eiken4')} variant="ghost" className="mt-2 w-full">英検4級トップへ戻る</Button></section></main></div>;

  if (complete || !current) {
    const correct = progress.answers.filter(answer => answer.correct).length;
    const incorrect = progress.answers.filter(answer => !answer.correct);
    const accuracy = Math.round((correct / progress.questionIds.length) * 100);
    return <div className="flex-grow bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-6"><main className="mx-auto max-w-xl"><section className="mt-8 rounded-3xl bg-white p-6 text-center shadow"><CheckCircleIcon className="mx-auto h-16 w-16 text-emerald-500"/><p className="mt-4 font-bold text-cyan-700">習った文法のまとめ問題</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">{correct} / {progress.questionIds.length} 問正解</h1><p className="mt-2 text-lg font-bold text-slate-700">正答率 {accuracy}%</p><p className="mt-4 leading-7 text-slate-600">{accuracy >= 80 ? 'よくできました！ 次は今日の復習で、覚えたことを確かめよう。' : 'ここまでよくがんばったね。間違えた問題の説明を見て、もう一度やってみよう。'}</p>{incorrect.length > 0 && <div className="mt-6 text-left"><h2 className="font-extrabold text-slate-900">もう一度見よう</h2><div className="mt-3 space-y-3">{incorrect.map(answer => { const question = getQuestionById(answer.id, progress.date); return question && <article key={answer.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="font-bold text-slate-900">{question.prompt}</p><p className="mt-2 text-sm text-amber-950">正解：{question.answer}</p>{question.explanation && <p className="mt-2 text-sm leading-6 text-slate-700">{question.explanation}</p>}</article>; })}</div></div>}<Button onClick={retry} className="mt-7 w-full" size="lg">もう一度まぜて練習する</Button><Button onClick={() => navigate('/eiken4/daily')} variant="secondary" className="mt-2 w-full">今日の復習問題へ</Button><Button onClick={() => navigate('/eiken4')} variant="ghost" className="mt-2 w-full">英検4級トップへ戻る</Button></section></main></div>;
  }

  const correct = selected === current.answer;
  return <div className="flex-grow bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-6"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>途中で戻る</Button><header className="mt-4 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-600 p-5 text-white shadow"><p className="text-xs font-bold tracking-widest text-cyan-100">MIXED PRACTICE</p><h1 className="mt-2 text-2xl font-extrabold">習った文法のまとめ問題</h1><p className="mt-2 text-sm text-cyan-50">習った文法だけを、まぜて出題するよ。</p><p className="mt-4 rounded-xl bg-white/15 p-3 text-right text-sm font-bold">{progress.answers.length + 1} / {progress.questionIds.length} 問</p></header><section className="mt-5 rounded-3xl border border-cyan-100 bg-white p-6 shadow"><p className="text-sm font-bold text-cyan-700">いちばん合う答えを選ぼう</p><h2 className="mt-4 text-2xl font-extrabold leading-9 text-slate-900">{current.prompt}</h2><p className="mt-2 text-sm text-slate-500">{current.detail}</p><div className="mt-6 grid gap-3">{current.choices.map(choice => <button key={choice} onClick={() => answer(choice)} disabled={Boolean(selected)} className={`min-h-12 rounded-xl border-2 p-4 text-left font-bold ${resolved && choice === current.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : resolved && choice === selected ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-slate-200 bg-white text-slate-800 active:border-cyan-500'}`}>{choice}</button>)}</div>{resolved && <div className={`mt-5 rounded-xl p-4 ${correct ? 'bg-emerald-50' : 'bg-amber-50'}`}><p className="font-extrabold text-slate-900">{correct ? '正解！' : `正解は「${current.answer}」だよ。`}</p>{current.explanation && <p className="mt-2 text-sm leading-6 text-slate-700">{current.explanation}</p>}<Button onClick={next} className="mt-4 w-full">次の問題へ</Button></div>}</section><p className="mt-4 text-center text-xs text-slate-500">間違えた問題は、今日の復習問題でも復習できるよ。</p></main></div>;
};

export default Eiken4MixedReviewPage;
