import EikenPracticeMenu from '../components/EikenPracticeMenu';
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import ClockIcon from '../components/shared/ClockIcon';
import { useEiken3Session } from '../contexts/Eiken3SessionContext';
import { getEiken3GrammarCategory as getGrammarCategory } from '../data/eiken3GrammarCategories';
import { getGrammarLearningState, loadGrammarProgressSnapshot } from '../services/eiken3GrammarProgressService';
import { getLightweightDailyLearningReadiness, getLightweightStampCourseSummary } from '../services/eiken3HomeSummaryService';
import { getAllGrammarVideoProgress, getNextGrammarVideoActivity } from '../services/eiken3GrammarVideoProgressService';
import { allowLearningStepStart, eiken3LearningSteps, getLearningStepProgress, getLearningStepState, getNextLearningActivity, getNextLearningStep, type LearningStep } from '../services/eiken3StepLearningService';

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

const Eiken3HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken3Session();
  const [lockedStep, setLockedStep] = useState<LearningStep | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showLearningFlow, setShowLearningFlow] = useState(false);
  const grammarProgress = useMemo(() => loadGrammarProgressSnapshot(), []);
  const nextStep = getNextLearningStep(undefined, grammarProgress);
  const nextActivity = getNextLearningActivity();
  const dailyReadiness = useMemo(() => getLightweightDailyLearningReadiness(), []);
  const stampCourse = useMemo(() => getLightweightStampCourseSummary(), []);
  const dueReviewCount = dailyReadiness.dueReviewCount;
  const activityCategory = nextActivity ? getGrammarCategory(nextActivity.categoryId) : undefined;
  const activeIndex = nextStep ? eiken3LearningSteps.findIndex(step => step.id === nextStep.id) : eiken3LearningSteps.length - 1;
  const compactIndexes = new Set([activeIndex - 1, activeIndex, activeIndex + 1].filter(index => index >= 0 && index < eiken3LearningSteps.length));
  const shownSteps = showAllSteps ? eiken3LearningSteps : eiken3LearningSteps.filter((_, index) => compactIndexes.has(index));
  const videoProgress = useMemo(() => getAllGrammarVideoProgress(), []);
  const videoRecommendation = useMemo(() => eiken3LearningSteps.flatMap(step => step.grammarIds).map(id => getGrammarCategory(id)).filter((category): category is NonNullable<typeof category> => Boolean(category)).map(category => {
    const step = eiken3LearningSteps.find(item => item.grammarIds.includes(category.id));
    const state = getGrammarLearningState(category.id, grammarProgress);
    const activity = getNextGrammarVideoActivity(category.id, videoProgress);
    return { category, step, state, activity };
  }).find(item => item.step && getLearningStepState(item.step, undefined, grammarProgress) !== '順番にやろう' && !item.state.guideCompleted && item.activity), [grammarProgress, videoProgress]);

  const openStep = (step: LearningStep) => {
    if (getLearningStepState(step, undefined, grammarProgress) === '順番にやろう') { setLockedStep(step); return; }
    navigate(`/eiken3/learning-step/${step.id}`);
  };
  const firstCategory = nextStep?.grammarIds[0] ? getGrammarCategory(nextStep.grammarIds[0]) : undefined;
  const openRecommendedStep = () => firstCategory?.guideTopic
    ? navigate(`/eiken3/grammar-guide?topic=${firstCategory.guideTopic}&category=${firstCategory.id}`)
    : nextStep && openStep(nextStep);
  const recommendation = videoRecommendation
    ? { title: `${videoRecommendation.category.title}の動画を${videoRecommendation.activity?.kind === 'confirm' ? '確認しよう' : '見よう'}`, text: `「${videoRecommendation.activity?.video.title}」を見てから、説明と確認問題へ進もう。`, button: videoRecommendation.activity?.kind === 'confirm' ? '確認問題へ進む' : '動画を見る', action: () => navigate(`/eiken3/grammar-guide/${videoRecommendation.category.id}`) }
    : activityCategory && nextActivity
    ? nextActivity.type === 'grammar-practice'
      ? { title: `${activityCategory.title}を問題で確認しよう`, text: 'さっき説明を見た文法を、10問で練習しよう。', button: '練習する', action: () => navigate(`/eiken3/grammar-practice/${activityCategory.id}`) }
      : { title: `${activityCategory.title}の説明を見直そう`, text: 'もう一度説明を見てから、同じ文法を練習しよう。', button: '説明を見る', action: () => navigate(`/eiken3/grammar-guide?topic=${activityCategory.guideTopic || ''}&category=${activityCategory.id}`) }
    : nextStep
    ? { title: `ステップ${activeIndex + 1}　${nextStep.title}`, text: nextStep.summary, button: getLearningStepState(nextStep, undefined, grammarProgress) === 'がんばり中' || getLearningStepState(nextStep, undefined, grammarProgress) === 'もう一度やろう' ? 'つづきから' : 'はじめる', action: openRecommendedStep }
      : dueReviewCount > 0
        ? { title: '今日の復習問題をやろう', text: '前に間違えた問題や、忘れかけている問題を復習しよう。', button: '復習する', action: () => navigate('/eiken3/daily') }
        : { title: '習った文法をまぜて確認しよう', text: '全部のステップで覚えた文法を、まとめ問題で確認しよう。', button: 'まとめ問題をやる', action: () => navigate('/eiken3/mixed-review') };

  return <div className="flex-grow bg-slate-50 px-4 py-5 sm:p-7">
    <header className="mx-auto mb-5 max-w-2xl">
      <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600"><ArrowLeftIcon className="mr-2 h-5 w-5"/>ホームに戻る</Button>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
        
        <div className="relative"><p className="text-xs font-bold tracking-widest text-indigo-700">英検3級の学習メニュー</p><h1 className="mt-2 text-3xl font-extrabold">英検3級の勉強をはじめよう！</h1><p className="mt-3 text-sm leading-6 text-slate-600">まず動画を見て、説明と確認問題で分かったか確かめよう。<br/>そのあと、同じ文法を問題で練習するよ。</p></div>
      </div>
    </header>

    <main className="mx-auto max-w-2xl">
      <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
        <p className="text-xs font-bold text-indigo-700">迷ったら、ここから</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900">{recommendation.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.text}</p>
        <Button onClick={recommendation.action} className="mt-4 w-full" size="lg">{recommendation.button}</Button>
      </section>

      <section className="mt-5">
        <button type="button" onClick={() => navigate('/eiken3/stamp-course')} className="flex min-h-28 w-full items-center justify-between rounded-3xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-rose-50 p-5 text-left shadow-sm active:scale-[.99]">
          <div className="min-w-0"><p className="text-xs font-bold tracking-wider text-orange-600">{stampCourse.selected ? `${stampCourse.duration}日コース・${stampCourse.completedCount}/27` : '1・2・3週間のコース'}</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">🏁 合格スタンプラリー</h2><p className="mt-1 text-sm leading-6 text-slate-600">{stampCourse.selected ? `スタンプ${stampCourse.completedCount}こ。ゴールまで、つづきから進めよう。` : '1・2・3週間から選んで、ゴールまで見えるよ。期間はあとから変えられます。'}</p><span className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-orange-600 px-4 font-bold text-white">{stampCourse.selected ? 'つづきから' : 'コースを選ぶ'}</span></div><ChevronRightIcon className="ml-2 h-7 w-7 shrink-0 text-orange-600"/>
        </button>
      </section>

      <nav className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="よく使う練習">
        {[{path:'words',icon:'🔤',title:'英単語'},{path:'reading',icon:'📖',title:'長文'},{path:'full-mock',icon:'🏁',title:'フル模試'},{path:'past-papers',icon:'📝',title:'公式過去問'}].map(item=><Link key={item.path} to={`/eiken3/${item.path}`} onClick={()=>{if(item.path==='words')resetSession();}} className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800"><span className="text-xl" aria-hidden="true">{item.icon}</span><span className="text-sm">{item.title}</span></Link>)}
      </nav>
      <section className="mt-7 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-wider text-indigo-600">学習の順番</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">学習の進め方</h2></div><button type="button" onClick={() => setShowLearningFlow(open => !open)} aria-expanded={showLearningFlow} className="min-h-11 shrink-0 rounded-xl border border-indigo-200 px-4 text-sm font-bold text-indigo-700">{showLearningFlow ? '閉じる' : 'ひらく'}</button></div>
        {showLearningFlow && <div className="mt-4 space-y-2">{learningFlow.map(({ icon, title, description }, index) => <React.Fragment key={title}><div className="flex gap-3 rounded-xl bg-indigo-50 p-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg" aria-hidden="true">{icon}</span><div><p className="font-bold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{description}</p></div></div>{index < learningFlow.length - 1 && <p className="text-center text-base font-bold text-indigo-300">↓</p>}</React.Fragment>)}</div>}
      </section>

      <section id="eiken3-learning-steps" className="mt-8"><p className="text-xs font-bold tracking-wider text-emerald-600">文法をひとつずつ</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">順番に学ぼう</h2><p className="mt-1 text-sm leading-6 text-slate-600">ステップ1から順番に進めると、英検3級の文法が分かりやすくなるよ。</p><div className="mt-4 space-y-3">{shownSteps.map(step => {
        const index = eiken3LearningSteps.findIndex(item => item.id === step.id); const state = getLearningStepState(step, undefined, grammarProgress); const progress = getLearningStepProgress(step, undefined, grammarProgress); const locked = state === '順番にやろう'; const current = index === activeIndex;
        const action = state === 'できた！' ? 'もう一度見る' : state === 'がんばり中' || state === 'もう一度やろう' ? 'つづきから' : locked ? '順番に進む' : 'はじめる';
        return <article key={step.id} className={`rounded-2xl border-2 p-4 shadow-sm ${current ? 'border-amber-300 bg-amber-50 shadow-amber-100' : locked ? 'border-slate-200 bg-slate-50' : state === 'できた！' ? 'border-slate-200 bg-slate-50' : 'border-indigo-100 bg-white'}`}><div className="flex items-start gap-3"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${current ? 'bg-amber-200 text-amber-950' : locked ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-800'}`}>{locked ? '🔒' : stepIcon[state]}</span><div className="min-w-0 flex-grow"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-indigo-600">ステップ{index + 1}</p><span className={`rounded-full px-2 py-1 text-xs font-bold ${stepStyle[state]}`}>{stepIcon[state]} {state}</span></div><h3 className="mt-1 text-lg font-extrabold text-slate-900">{step.title}</h3><p className="mt-1 text-sm text-slate-600">{locked ? `ステップ${index}が終わったら進もう。` : step.topics}</p>{current && <p className="mt-2 text-xs font-bold text-amber-800">いまはここを進めよう</p>}{!locked && <p className="mt-2 text-xs text-slate-500">できた：{progress.done} / {progress.total || 1}</p>}</div></div><Button onClick={() => openStep(step)} variant="secondary" className="mt-4 min-h-11 w-full">{action}</Button></article>;
      })}</div>
      <Button onClick={() => setShowAllSteps(open => !open)} aria-expanded={showAllSteps} aria-controls="eiken3-learning-steps" variant="ghost" className="mt-3 w-full text-indigo-700">{showAllSteps ? 'ステップを閉じる' : 'すべてのステップを見る'}</Button>
      {lockedStep && <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4"><p className="font-extrabold text-indigo-950">先に前のステップをやってみよう。</p><p className="mt-1 text-sm leading-6 text-indigo-900">順番に進めると、分かりやすいよ。</p><Button onClick={() => { allowLearningStepStart(lockedStep.id); navigate(`/eiken3/learning-step/${lockedStep.id}`); }} variant="ghost" size="sm" className="mt-3 w-full text-indigo-800">もう習っている場合はここから始める</Button></div>}</section>

      <EikenPracticeMenu level={3} resetSession={resetSession} />
    </main>
  </div>;
};

export default Eiken3HomePage;
