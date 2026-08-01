import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { eiken4LearningSteps, getLearningStep, getLearningStepProgress, getLearningStepState, getStepGrammarCategories, markLearningStepOpened, recordLearningStepCheck } from '../services/eiken4StepLearningService';

const Eiken4StepLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const { stepId } = useParams<{ stepId: string }>();
  const step = getLearningStep(stepId);
  const [picked, setPicked] = useState<string | null>(null);
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!step) return;
    markLearningStepOpened(step.id);
    setVersion(version => version + 1);
  }, [step?.id]);

  if (!step) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検4級に戻る</Button><section className="mt-12 rounded-3xl bg-white p-7 text-center shadow"><h1 className="text-2xl font-extrabold">このステップは見つかりませんでした。</h1><p className="mt-3 text-slate-600">英検4級の画面から、やることを選んでね。</p><Button onClick={() => navigate('/eiken4')} className="mt-6 w-full">英検4級へ戻る</Button></section></main></div>;

  const stepNumber = eiken4LearningSteps.findIndex(item => item.id === step.id) + 1;
  const categories = getStepGrammarCategories(step);
  const progress = getLearningStepProgress(step);
  const state = getLearningStepState(step);
  const checked = Boolean(picked);
  const correct = picked === step.lesson.check.answer;
  const choose = (choice: string) => {
    if (picked) return;
    setPicked(choice);
    recordLearningStepCheck(step.id);
    setVersion(version => version + 1);
  };
  const startFinalPractice = () => {
    navigate('/eiken4/mixed-review?step=7');
  };

  return <div className="flex-grow bg-gradient-to-b from-indigo-50 to-white p-4 sm:p-6">
    <main className="mx-auto max-w-xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検4級に戻る</Button>
      <header className="mt-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white shadow-xl">
        <p className="text-xs font-bold tracking-widest text-indigo-100">STEP {stepNumber}・{state}</p>
        <h1 className="mt-2 text-3xl font-extrabold">{step.title}</h1>
        <p className="mt-3 leading-7 text-indigo-50">{step.summary}</p>
        <p className="mt-4 rounded-xl bg-white/15 p-3 text-sm font-bold">できた：{progress.done} / {progress.total || 1}</p>
      </header>

      <section className="mt-5 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold text-indigo-600">1　説明を見る</p>
        <h2 className="mt-2 text-xl font-extrabold text-slate-900">{step.lesson.title}</h2>
        <p className="mt-3 leading-7 text-slate-700">{step.lesson.message}</p>
        <div className="mt-4 rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">基本の形</p><p className="mt-1 font-bold text-indigo-950">{step.lesson.shape}</p><p className="mt-3 font-bold text-slate-800">{step.lesson.example.en}</p><p className="mt-1 text-sm text-slate-600">{step.lesson.example.ja}</p></div>
      </section>

      <section className="mt-4 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold text-violet-600">2　確認問題</p>
        <h2 className="mt-2 text-lg font-extrabold text-slate-900">{step.lesson.check.question}</h2>
        <div className="mt-4 grid gap-2">{step.lesson.check.choices.map(choice => <button key={choice} onClick={() => choose(choice)} disabled={checked} className={`min-h-12 rounded-xl border-2 p-3 text-left font-bold ${checked && choice === step.lesson.check.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : checked && choice === picked ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-slate-200 bg-white text-slate-800 active:border-violet-500'}`}>{choice}</button>)}</div>
        {checked && <div className={`mt-4 rounded-xl p-4 ${correct ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`}><p className="font-extrabold">{correct ? '正解！ よくできたね。' : `正解は「${step.lesson.check.answer}」だよ。`}</p><p className="mt-2 text-sm leading-6">{step.lesson.check.explanation}</p></div>}
      </section>

      {!step.final && <section className="mt-4 rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold text-cyan-700">3　習った文法を10問ずつ練習</p>
        <h2 className="mt-2 text-xl font-extrabold text-slate-900">やってみよう</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">説明を見てから、同じ文法だけを練習するよ。終わると、このステップの進み具合に反映されます。</p>
        <div className="mt-4 space-y-3">{categories.map(category => <div key={category.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">{category.title}</h3><p className="mt-1 text-sm text-slate-600">{category.description}</p></div><ChevronRightIcon className="h-6 w-6 shrink-0 text-cyan-600"/></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{category.guideTopic && <Button onClick={() => navigate(`/eiken4/grammar-guide?topic=${category.guideTopic}&category=${category.id}`)} variant="secondary" className="min-h-11 w-full">くわしい説明を見る</Button>}<Button onClick={() => navigate(`/eiken4/grammar-practice/${category.id}`)} className="min-h-11 w-full">この文法を練習する</Button></div></div>)}</div>
      </section>}

      {step.final && <section className="mt-4 rounded-3xl border border-rose-100 bg-white p-5 shadow-sm"><p className="text-xs font-bold text-rose-600">3　まとめに挑戦</p><h2 className="mt-2 text-xl font-extrabold text-slate-900">習った文法のまとめ問題</h2><p className="mt-2 text-sm leading-6 text-slate-600">まずは習った文法だけをまぜて確認しよう。そのあと今日の復習問題で、間違えた問題を見直せるよ。</p><Button onClick={startFinalPractice} className="mt-4 w-full" size="lg">習った文法のまとめ問題を始める</Button><div className="mt-3 grid gap-2 sm:grid-cols-2"><Button onClick={() => navigate('/eiken4/words')} variant="secondary" className="min-h-11 w-full">英単語を練習</Button><Button onClick={() => navigate('/eiken4/listening-practice')} variant="secondary" className="min-h-11 w-full">聞く問題を練習</Button></div></section>}

      <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700"><p className="font-bold">次にすること</p><p className="mt-1">{step.final ? 'まずは、習った文法のまとめ問題をやってみよう。' : '確認問題のあと、下の文法を1つずつ練習しよう。'}</p></div>
      <Button onClick={() => navigate('/eiken4')} variant="ghost" className="mb-4 mt-4 w-full">ステップ一覧へ戻る</Button>
    </main>
  </div>;
};

export default Eiken4StepLearningPage;
