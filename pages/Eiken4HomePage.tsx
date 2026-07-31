import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import ClockIcon from '../components/shared/ClockIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { eiken4Words } from '../data/eiken4Words';
import { getDailyLearningReadiness, getDueReviewCount } from '../services/eiken4DailyService';
import { allowLearningStepStart, eiken4LearningSteps, getLearningStepProgress, getLearningStepState, getNextLearningStep, type LearningStep } from '../services/eiken4StepLearningService';

const stepStyle: Record<string, string> = {
  'まだ': 'bg-slate-100 text-slate-700',
  'がんばり中': 'bg-amber-100 text-amber-900',
  'できた！': 'bg-emerald-100 text-emerald-900',
  'もう一度やろう': 'bg-rose-100 text-rose-900',
  '順番にやろう': 'bg-slate-100 text-slate-500',
};

const stepIcon: Record<string, string> = {
  'まだ': '▶', 'がんばり中': '●', 'できた！': '✓', 'もう一度やろう': '↻', '順番にやろう': '🔒',
};

const Eiken4HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const [lockedStep, setLockedStep] = useState<LearningStep | null>(null);
  const nextStep = getNextLearningStep();
  const dailyReadiness = getDailyLearningReadiness();
  const dueReviewCount = getDueReviewCount();

  const startFresh = (path: string) => { resetSession(); navigate(path); };
  const openStep = (step: LearningStep) => {
    if (getLearningStepState(step) === '順番にやろう') { setLockedStep(step); return; }
    navigate(`/eiken4/learning-step/${step.id}`);
  };
  const startRecommended = () => {
    if (nextStep) openStep(nextStep);
    else navigate('/eiken4/daily');
  };
  const recommendationTitle = nextStep ? `ステップ${eiken4LearningSteps.findIndex(step => step.id === nextStep.id) + 1}　${nextStep.title}` : '今日のおまかせ問題で復習しよう';
  const recommendationText = nextStep ? nextStep.summary : '今までに練習した内容から、今日の復習問題が出るよ。';

  return <div className="flex-grow bg-gradient-to-b from-indigo-50 via-slate-50 to-white px-4 py-5 sm:p-7">
    <header className="mx-auto mb-5 max-w-xl">
      <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600"><ArrowLeftIcon className="mr-2 h-5 w-5"/>ホームに戻る</Button>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-500 p-6 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10"/><div className="absolute -bottom-10 right-16 h-24 w-24 rounded-full bg-white/10"/>
        <div className="relative"><p className="text-xs font-bold tracking-widest text-indigo-100">EIKEN GRADE 4</p><h1 className="mt-2 text-3xl font-extrabold">英検4級の勉強をはじめよう！</h1><p className="mt-3 text-sm leading-6 text-indigo-50">まずはステップ1から、順番に進めよう。<br/>文法を覚えてから問題を解くと、よく分かるようになるよ。</p></div>
      </div>
    </header>

    <main className="mx-auto max-w-xl">
      <section className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
        <p className="text-xs font-bold text-amber-700">つぎにやること</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{recommendationTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">{recommendationText}</p>
        <Button onClick={startRecommended} className="mt-4 w-full" size="lg">{nextStep ? (getLearningStepState(nextStep) === 'がんばり中' ? 'つづきから' : 'はじめる') : '復習する'}</Button>
      </section>

      <section className="mt-7"><p className="text-xs font-bold tracking-wider text-indigo-600">LEARNING FLOW</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">学習の進め方</h2><div className="mt-4 space-y-2">{[
        ['1', '文法を覚える'], ['2', '習った文法を練習する'], ['3', 'いろいろな問題に挑戦する'], ['4', '今日の復習をする'], ['5', '本番問題に挑戦する'],
      ].map(([number, label], index) => <React.Fragment key={number}><div className="flex min-h-12 items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-extrabold text-indigo-800">{number}</span><p className="font-bold text-slate-800">{label}</p></div>{index < 4 && <p className="text-center text-lg font-bold text-indigo-300">↓</p>}</React.Fragment>)}</div></section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-emerald-600">START HERE</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">順番に学ぼう</h2><p className="mt-1 text-sm leading-6 text-slate-600">ステップ1から順番に進めると、英検4級の文法が分かりやすくなるよ。</p><div className="mt-4 space-y-3">{eiken4LearningSteps.map((step, index) => {
        const state = getLearningStepState(step); const progress = getLearningStepProgress(step); const locked = state === '順番にやろう';
        const action = state === 'できた！' ? 'もう一度復習する' : state === 'がんばり中' || state === 'もう一度やろう' ? 'つづきから' : locked ? '順番に進めよう' : 'はじめる';
        return <article key={step.id} className={`rounded-2xl border-2 p-4 shadow-sm ${locked ? 'border-slate-200 bg-slate-50' : state === 'できた！' ? 'border-emerald-200 bg-emerald-50' : index === 0 ? 'border-amber-300 bg-white' : 'border-indigo-100 bg-white'}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${locked ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-800'}`}>{locked ? '🔒' : index + 1}</span><div className="min-w-0 flex-grow"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-indigo-600">ステップ{index + 1}</p><span className={`rounded-full px-2 py-1 text-xs font-bold ${stepStyle[state]}`}>{stepIcon[state]} {state}</span></div><h3 className="mt-1 text-lg font-extrabold text-slate-900">{step.title}</h3><p className="mt-1 text-sm text-slate-600">{step.topics}</p><p className="mt-2 text-xs font-bold text-slate-500">できた：{progress.done} / {progress.total || 1}</p></div></div><Button onClick={() => openStep(step)} variant={locked ? 'secondary' : index === 0 ? 'primary' : 'secondary'} className="mt-4 min-h-11 w-full">{action}</Button></article>;
      })}</div>
      {lockedStep && <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4"><p className="font-extrabold text-indigo-950">先に前のステップをやってみよう。</p><p className="mt-1 text-sm leading-6 text-indigo-900">順番に進めると、分かりやすいよ。</p><Button onClick={() => { allowLearningStepStart(lockedStep.id); navigate(`/eiken4/learning-step/${lockedStep.id}`); }} variant="secondary" className="mt-3 w-full">すでに習っている場合は、このステップから始める</Button></div>}</section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-cyan-600">PRACTICE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">習ったところを練習しよう</h2><button onClick={() => navigate('/eiken4/grammar-practice-select')} className="mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border-2 border-cyan-300 bg-cyan-50 p-4 text-left shadow-sm active:scale-[.99]"><div><h3 className="text-lg font-extrabold text-slate-900">文法を選んで練習</h3><p className="mt-1 text-sm text-slate-600">習った文法だけを選んで、10問ずつ練習できるよ。</p></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-cyan-600"/></button></section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-sky-600">MIXED PRACTICE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">習ったことをまぜて練習しよう</h2><button onClick={() => navigate('/eiken4/mixed-review')} className="mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border-2 border-sky-300 bg-sky-50 p-4 text-left shadow-sm active:scale-[.99]"><div><h3 className="text-lg font-extrabold text-slate-900">いろいろな問題に挑戦</h3><p className="mt-1 text-sm text-slate-600">習った文法だけをまぜて、10問ずつ確認できるよ。</p></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-sky-600"/></button></section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-emerald-600">REVIEW</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">覚えたことを復習しよう</h2><button onClick={() => navigate('/eiken4/daily')} className={`mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border p-4 text-left shadow-sm active:scale-[.99] ${dailyReadiness.canStart ? 'border-emerald-300 bg-white' : 'border-slate-200 bg-slate-50'}`}><div><h3 className="text-lg font-extrabold text-slate-900">今日のおまかせ問題</h3><p className="mt-1 text-sm text-slate-600">{dailyReadiness.canStart ? `今までに習った内容から、今日の復習問題が出るよ。${dueReviewCount ? ` 間違えた問題が${dueReviewCount}問あるよ。` : ''}` : 'まずはステップ1を進めると、復習問題が出るようになるよ。'}</p></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-emerald-600"/></button></section>

      <section className="mt-9"><p className="text-xs font-bold tracking-wider text-rose-600">CHALLENGE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">力試しをしよう</h2><p className="mt-1 text-sm text-slate-600">基礎を覚えてから、少しずつ本番に近い問題へ進もう。</p><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => navigate('/eiken4/exam-practice')} className="min-h-28 rounded-2xl bg-rose-600 p-4 text-left text-white shadow"><BookOpenIcon className="h-7 w-7"/><h3 className="mt-2 font-extrabold">本番形式10問</h3><p className="mt-1 text-xs opacity-90">文法・会話</p></button><button onClick={() => navigate('/eiken4/mock')} className="min-h-28 rounded-2xl bg-violet-700 p-4 text-left text-white shadow"><ClockIcon className="h-7 w-7"/><h3 className="mt-2 font-extrabold">10分ミニ模試</h3><p className="mt-1 text-xs opacity-90">週1回</p></button><button onClick={() => navigate('/eiken4/listening-practice')} className="min-h-28 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-left"><ClockIcon className="h-7 w-7 text-indigo-700"/><h3 className="mt-2 font-extrabold text-indigo-950">聞く問題</h3><p className="mt-1 text-xs text-indigo-800">3つのパート</p></button><button onClick={() => navigate('/eiken4/reading')} className="min-h-28 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-left"><BookOpenIcon className="h-7 w-7 text-sky-700"/><h3 className="mt-2 font-extrabold text-sky-950">ミニ長文</h3><p className="mt-1 text-xs text-sky-800">読む練習</p></button></div></section>

      <section className="mt-9"><p className="text-xs font-bold tracking-wider text-slate-500">ほかのメニュー</p><div className="mt-3 grid grid-cols-2 gap-3"><button onClick={() => startFresh('/eiken4/words')} className="rounded-xl border border-indigo-200 bg-white p-4 text-left"><BookOpenIcon className="h-6 w-6 text-indigo-600"/><h3 className="mt-2 font-bold text-slate-900">英単語</h3><p className="text-xs text-slate-500">全{eiken4Words.length}語</p></button><button onClick={() => navigate('/eiken4/weakness')} className="rounded-xl border border-orange-200 bg-white p-4 text-left"><CheckCircleIcon className="h-6 w-6 text-orange-600"/><h3 className="mt-2 font-bold text-slate-900">間違い直し</h3><p className="text-xs text-slate-500">苦手を練習</p></button><Link to="/eiken4/progress" className="rounded-xl border border-teal-200 bg-white p-4 text-left"><ClockIcon className="h-6 w-6 text-teal-600"/><h3 className="mt-2 font-bold text-slate-900">学習の記録</h3><p className="text-xs text-slate-500">できたことを見る</p></Link><Link to="/eiken4/result" className="rounded-xl border border-slate-200 bg-white p-4 text-left"><BookOpenIcon className="h-6 w-6 text-slate-600"/><h3 className="mt-2 font-bold text-slate-900">今日の結果</h3><p className="text-xs text-slate-500">おうちの人へ報告</p></Link></div><button onClick={() => navigate('/eiken4/course')} className="mt-4 w-full rounded-xl bg-white p-3 text-sm font-bold text-indigo-700 underline">今日の勉強の一覧を見る</button><button onClick={() => navigate('/transfer')} className="mt-3 w-full rounded-xl bg-white p-3 text-sm font-bold text-teal-700 underline">スマホ・タブレットの記録を引き継ぐ</button><button onClick={() => navigate('/storage-recovery')} className="mt-2 w-full rounded-xl bg-white p-3 text-sm font-bold text-slate-600 underline">学習記録を守る・直す</button></section>
    </main>
  </div>;
};

export default Eiken4HomePage;
