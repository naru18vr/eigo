import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import ClockIcon from '../components/shared/ClockIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { getEiken4GrammarVideos } from '../data/eiken4GrammarVideos';
import { eiken4Words } from '../data/eiken4Words';
import { getGrammarCategory } from '../services/eiken4GrammarPracticeService';
import { getGrammarLearningState } from '../services/eiken4GrammarProgressService';
import { getDailyLearningReadiness, getDueReviewCount } from '../services/eiken4DailyService';
import { getNextGrammarVideoActivity } from '../services/eiken4GrammarVideoProgressService';
import { allowLearningStepStart, eiken4LearningSteps, getLearningStepProgress, getLearningStepState, getNextLearningActivity, getNextLearningStep, type LearningStep } from '../services/eiken4StepLearningService';

const stepStyle: Record<string, string> = {
  'まだ': 'bg-slate-100 text-slate-700',
  'がんばり中': 'bg-amber-100 text-amber-900',
  'できた！': 'bg-emerald-100 text-emerald-900',
  'もう一度やろう': 'bg-rose-100 text-rose-900',
  '順番にやろう': 'bg-slate-100 text-slate-500',
};

const stepIcon: Record<string, string> = {
  'まだ': '○', 'がんばり中': '●', 'できた！': '✓', 'もう一度やろう': '↻', '順番にやろう': '🔒',
};

const learningFlow = [
  { icon: '🎥', title: 'トライイット動画を見る', description: '学習する単元の動画を先に見よう。' },
  { icon: '📖', title: '説明と確認問題で理解する', description: '動画の内容を説明と問題で確認しよう。' },
  { icon: '✏️', title: '同じ文法を練習する', description: '今覚えた文法だけを問題で練習しよう。' },
  { icon: '🔀', title: '習った文法をまぜて練習する', description: '覚えた文法を組み合わせて解いてみよう。' },
  { icon: '↻', title: '間違えた問題を復習する', description: '間違えた問題や忘れかけた問題をやろう。' },
  { icon: '🏁', title: '本番問題に挑戦する', description: '文法・単語・長文・リスニングに挑戦しよう。' },
];

const Eiken4HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const [lockedStep, setLockedStep] = useState<LearningStep | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const nextStep = getNextLearningStep();
  const nextActivity = getNextLearningActivity();
  const dailyReadiness = getDailyLearningReadiness();
  const dueReviewCount = getDueReviewCount();
  const activityCategory = nextActivity ? getGrammarCategory(nextActivity.categoryId) : undefined;
  const activeIndex = nextStep ? eiken4LearningSteps.findIndex(step => step.id === nextStep.id) : eiken4LearningSteps.length - 1;
  const compactIndexes = new Set([activeIndex - 1, activeIndex, activeIndex + 1].filter(index => index >= 0 && index < eiken4LearningSteps.length));
  const shownSteps = showAllSteps ? eiken4LearningSteps : eiken4LearningSteps.filter((_, index) => compactIndexes.has(index));
  const videoRecommendation = eiken4LearningSteps.flatMap(step => step.grammarIds).map(id => getGrammarCategory(id)).filter((category): category is NonNullable<typeof category> => Boolean(category)).map(category => {
    const step = eiken4LearningSteps.find(item => item.grammarIds.includes(category.id));
    const state = getGrammarLearningState(category.id);
    const activity = getNextGrammarVideoActivity(category.id);
    const reviewVideo = state.status === 'review-needed' ? getEiken4GrammarVideos(category.id).find(video => video.required) : undefined;
    return { category, step, state, activity: activity || (reviewVideo ? { kind: 'watch' as const, video: reviewVideo } : undefined) };
  }).find(item => item.step && getLearningStepState(item.step) !== '順番にやろう' && !item.state.guideCompleted && item.activity);

  const startFresh = (path: string) => { resetSession(); navigate(path); };
  const openStep = (step: LearningStep) => {
    if (getLearningStepState(step) === '順番にやろう') { setLockedStep(step); return; }
    navigate(`/eiken4/learning-step/${step.id}`);
  };
  const firstCategory = nextStep?.grammarIds[0] ? getGrammarCategory(nextStep.grammarIds[0]) : undefined;
  const openRecommendedStep = () => firstCategory?.guideTopic
    ? navigate(`/eiken4/grammar-guide?topic=${firstCategory.guideTopic}&category=${firstCategory.id}`)
    : nextStep && openStep(nextStep);
  const recommendation = videoRecommendation
    ? { title: `${videoRecommendation.category.title}の動画を${videoRecommendation.activity?.kind === 'confirm' ? '確認しよう' : '見よう'}`, text: `「${videoRecommendation.activity?.video.title}」を見てから、説明と確認問題へ進もう。`, button: videoRecommendation.activity?.kind === 'confirm' ? '確認問題へ進む' : '動画を見る', action: () => navigate(`/eiken4/grammar-guide/${videoRecommendation.category.id}`) }
    : activityCategory && nextActivity
    ? nextActivity.type === 'grammar-practice'
      ? { title: `${activityCategory.title}を問題で確認しよう`, text: 'さっき説明を見た文法を、10問で練習しよう。', button: '練習する', action: () => navigate(`/eiken4/grammar-practice/${activityCategory.id}`) }
      : { title: `${activityCategory.title}の説明を見直そう`, text: 'もう一度説明を見てから、同じ文法を練習しよう。', button: '説明を見る', action: () => navigate(`/eiken4/grammar-guide?topic=${activityCategory.guideTopic || ''}&category=${activityCategory.id}`) }
    : nextStep
      ? { title: `ステップ${activeIndex + 1}　${nextStep.title}`, text: nextStep.summary, button: getLearningStepState(nextStep) === 'がんばり中' || getLearningStepState(nextStep) === 'もう一度やろう' ? 'つづきから' : 'はじめる', action: openRecommendedStep }
      : dueReviewCount > 0
        ? { title: '今日の復習問題をやろう', text: '前に間違えた問題や、忘れかけている問題を復習しよう。', button: '復習する', action: () => navigate('/eiken4/daily') }
        : { title: '習った文法をまぜて確認しよう', text: '全部のステップで覚えた文法を、まとめ問題で確認しよう。', button: 'まとめ問題をやる', action: () => navigate('/eiken4/mixed-review') };

  return <div className="flex-grow bg-gradient-to-b from-indigo-50 via-slate-50 to-white px-4 py-5 sm:p-7">
    <header className="mx-auto mb-5 max-w-xl">
      <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600"><ArrowLeftIcon className="mr-2 h-5 w-5"/>ホームに戻る</Button>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-500 p-6 text-white shadow-xl shadow-indigo-200">
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10"/><div className="absolute -bottom-10 right-16 h-24 w-24 rounded-full bg-white/10"/>
        <div className="relative"><p className="text-xs font-bold tracking-widest text-indigo-100">EIKEN GRADE 4</p><h1 className="mt-2 text-3xl font-extrabold">英検4級の勉強をはじめよう！</h1><p className="mt-3 text-sm leading-6 text-indigo-50">まず動画を見て、説明と確認問題で分かったか確かめよう。<br/>そのあと、同じ文法を問題で練習するよ。</p></div>
      </div>
    </header>

    <main className="mx-auto max-w-xl">
      <section className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
        <p className="text-xs font-bold text-amber-700">つぎにやること</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{recommendation.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.text}</p>
        <Button onClick={recommendation.action} className="mt-4 w-full" size="lg">{recommendation.button}</Button>
      </section>

      <section className="mt-7"><p className="text-xs font-bold tracking-wider text-indigo-600">LEARNING FLOW</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">学習の進め方</h2><div className="mt-4 space-y-2">{learningFlow.map(({ icon, title, description }, index) => <React.Fragment key={title}><div className="flex gap-3 rounded-xl bg-white p-3 shadow-sm"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg" aria-hidden="true">{icon}</span><div><p className="font-bold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{description}</p></div></div>{index < learningFlow.length - 1 && <p className="text-center text-base font-bold text-indigo-300">↓</p>}</React.Fragment>)}</div></section>

      <section id="eiken4-learning-steps" className="mt-8"><p className="text-xs font-bold tracking-wider text-emerald-600">START HERE</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">順番に学ぼう</h2><p className="mt-1 text-sm leading-6 text-slate-600">ステップ1から順番に進めると、英検4級の文法が分かりやすくなるよ。</p><div className="mt-4 space-y-3">{shownSteps.map(step => {
        const index = eiken4LearningSteps.findIndex(item => item.id === step.id); const state = getLearningStepState(step); const progress = getLearningStepProgress(step); const locked = state === '順番にやろう'; const current = index === activeIndex;
        const action = state === 'できた！' ? 'もう一度見る' : state === 'がんばり中' || state === 'もう一度やろう' ? 'つづきから' : locked ? '順番に進む' : 'はじめる';
        return <article key={step.id} className={`rounded-2xl border-2 p-4 shadow-sm ${current ? 'border-amber-300 bg-amber-50 shadow-amber-100' : locked ? 'border-slate-200 bg-slate-50' : state === 'できた！' ? 'border-slate-200 bg-slate-50' : 'border-indigo-100 bg-white'}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${current ? 'bg-amber-200 text-amber-950' : locked ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-800'}`}>{locked ? '🔒' : stepIcon[state]}</span><div className="min-w-0 flex-grow"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-indigo-600">ステップ{index + 1}</p><span className={`rounded-full px-2 py-1 text-xs font-bold ${stepStyle[state]}`}>{stepIcon[state]} {state}</span></div><h3 className="mt-1 text-lg font-extrabold text-slate-900">{step.title}</h3><p className="mt-1 text-sm text-slate-600">{locked ? `ステップ${index}が終わったら進もう。` : step.topics}</p>{current && <p className="mt-2 text-xs font-bold text-amber-800">いまはここを進めよう</p>}{!locked && <p className="mt-2 text-xs text-slate-500">できた：{progress.done} / {progress.total || 1}</p>}</div></div><Button onClick={() => openStep(step)} variant="secondary" className="mt-4 min-h-11 w-full">{action}</Button></article>;
      })}</div>
      <Button onClick={() => setShowAllSteps(open => !open)} aria-expanded={showAllSteps} aria-controls="eiken4-learning-steps" variant="ghost" className="mt-3 w-full text-indigo-700">{showAllSteps ? 'ステップを閉じる' : 'すべてのステップを見る'}</Button>
      {lockedStep && <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4"><p className="font-extrabold text-indigo-950">先に前のステップをやってみよう。</p><p className="mt-1 text-sm leading-6 text-indigo-900">順番に進めると、分かりやすいよ。</p><Button onClick={() => { allowLearningStepStart(lockedStep.id); navigate(`/eiken4/learning-step/${lockedStep.id}`); }} variant="ghost" size="sm" className="mt-3 w-full text-indigo-800">もう習っている場合はここから始める</Button></div>}</section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-cyan-600">PRACTICE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">習ったところを練習しよう</h2><button onClick={() => navigate('/eiken4/grammar-practice-select')} className="mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border-2 border-cyan-300 bg-cyan-50 p-4 text-left shadow-sm active:scale-[.99]"><div><h3 className="text-lg font-extrabold text-slate-900">文法を選んで練習</h3><p className="mt-1 text-sm text-slate-600">今覚えた文法だけを選んで、10問ずつ確認できるよ。</p></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-cyan-600"/></button></section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-indigo-600">TRY-IT</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">トライイット</h2><button type="button" onClick={() => navigate('/eiken4/try-it')} className="mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-4 text-left shadow-sm active:scale-[.99]"><div><h3 className="text-lg font-extrabold text-slate-900">トライイット</h3><p className="mt-1 text-sm leading-6 text-slate-600">英検4級で使う動画を章ごとに確認できるよ。</p><span className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-4 font-bold text-white">動画一覧を見る</span></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-indigo-600"/></button></section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-sky-600">MIXED PRACTICE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">習った文法をまぜて練習しよう</h2><button onClick={() => navigate('/eiken4/mixed-review')} className="mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border-2 border-sky-300 bg-sky-50 p-4 text-left shadow-sm active:scale-[.99]"><div><h3 className="text-lg font-extrabold text-slate-900">習った文法のまとめ問題</h3><p className="mt-1 text-sm text-slate-600">今までに習った文法だけを、まぜて出題するよ。</p></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-sky-600"/></button></section>

      <section className="mt-8"><p className="text-xs font-bold tracking-wider text-emerald-600">REVIEW</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">間違えた問題を復習しよう</h2><button onClick={() => navigate('/eiken4/daily')} className={`mt-4 flex min-h-24 w-full items-center justify-between rounded-2xl border p-4 text-left shadow-sm active:scale-[.99] ${dailyReadiness.canStart ? 'border-emerald-300 bg-white' : 'border-slate-200 bg-slate-50'}`}><div><h3 className="text-lg font-extrabold text-slate-900">今日の復習問題</h3><p className="mt-1 text-sm text-slate-600">前に間違えた問題や、忘れかけている問題を復習するよ。</p></div><ChevronRightIcon className="h-7 w-7 shrink-0 text-emerald-600"/></button></section>

      <section className="mt-9"><p className="text-xs font-bold tracking-wider text-rose-600">CHALLENGE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">力試しをしよう</h2><p className="mt-1 text-sm text-slate-600">習ったことを使って、本番に近い問題に挑戦しよう。</p><div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => navigate('/eiken4/exam-practice')} className="min-h-28 rounded-2xl bg-rose-600 p-4 text-left text-white shadow"><BookOpenIcon className="h-7 w-7"/><h3 className="mt-2 font-extrabold">本番形式10問</h3><p className="mt-1 text-xs opacity-90">文法・会話</p></button><button onClick={() => navigate('/eiken4/mock')} className="min-h-28 rounded-2xl bg-violet-700 p-4 text-left text-white shadow"><ClockIcon className="h-7 w-7"/><h3 className="mt-2 font-extrabold">10分ミニ模試</h3><p className="mt-1 text-xs opacity-90">週1回</p></button><button onClick={() => navigate('/eiken4/listening-practice')} className="min-h-28 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-left"><ClockIcon className="h-7 w-7 text-indigo-700"/><h3 className="mt-2 font-extrabold text-indigo-950">聞く問題</h3><p className="mt-1 text-xs text-indigo-800">3つのパート</p></button><button onClick={() => navigate('/eiken4/reading')} className="min-h-28 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-left"><BookOpenIcon className="h-7 w-7 text-sky-700"/><h3 className="mt-2 font-extrabold text-sky-950">ミニ長文</h3><p className="mt-1 text-xs text-sky-800">読む練習</p></button></div></section>

      <section className="mt-9"><p className="text-xs font-bold tracking-wider text-slate-500">EXTRA PRACTICE</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">もっと練習したいとき</h2><p className="mt-1 text-sm text-slate-600">単語・長文・紙の問題などを、もっと練習したいときに使えるよ。</p><div className="mt-3 grid grid-cols-2 gap-3"><button onClick={() => startFresh('/eiken4/words')} className="rounded-xl border border-indigo-200 bg-white p-4 text-left"><BookOpenIcon className="h-6 w-6 text-indigo-600"/><h3 className="mt-2 font-bold text-slate-900">英単語</h3><p className="text-xs text-slate-500">全{eiken4Words.length}語</p></button><button onClick={() => navigate('/eiken4/weakness')} className="rounded-xl border border-orange-200 bg-white p-4 text-left"><CheckCircleIcon className="h-6 w-6 text-orange-600"/><h3 className="mt-2 font-bold text-slate-900">間違い直し</h3><p className="text-xs text-slate-500">もう一度練習</p></button></div><button onClick={() => navigate('/eiken4/course')} className="mt-4 w-full rounded-xl bg-white p-3 text-sm font-bold text-indigo-700 underline">追加の練習メニューを見る</button></section>

      <section className="mt-9 mb-4"><p className="text-xs font-bold tracking-wider text-slate-500">RECORDS & SETTINGS</p><div className="mt-3 grid grid-cols-2 gap-3"><Link to="/eiken4/progress" className="rounded-xl border border-teal-200 bg-white p-4 text-left"><ClockIcon className="h-6 w-6 text-teal-600"/><h3 className="mt-2 font-bold text-slate-900">学習記録を見る</h3><p className="text-xs text-slate-500">できたことを見る</p></Link><button onClick={() => navigate('/transfer')} className="rounded-xl border border-slate-200 bg-white p-4 text-left"><BookOpenIcon className="h-6 w-6 text-slate-600"/><h3 className="mt-2 font-bold text-slate-900">設定・データ引き継ぎ</h3><p className="text-xs text-slate-500">端末を変えるとき</p></button></div><Link to="/eiken4/result" className="mt-3 block text-center text-sm font-bold text-slate-600 underline">おうちの人へ報告する</Link><button onClick={() => navigate('/storage-recovery')} className="mt-3 w-full text-sm font-bold text-slate-500 underline">学習記録を守る・直す</button></section>
    </main>
  </div>;
};

export default Eiken4HomePage;
