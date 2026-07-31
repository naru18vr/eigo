import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { getAvailableGrammarCategories, getGrammarCategorySentences } from '../services/eiken4GrammarPracticeService';
import { getGrammarLearningState, getGrammarStatusLabel } from '../services/eiken4GrammarProgressService';

const Eiken4GrammarPracticeSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const categories = getAvailableGrammarCategories();

  const openCategory = (category: typeof categories[number]) => {
    const state = getGrammarLearningState(category.id);
    if (!state.guideViewed && category.guideTopic) navigate(`/eiken4/grammar-guide/${category.id}`);
    else navigate(`/eiken4/grammar-practice/${category.id}${state.status === 'review-needed' ? '?mode=review' : ''}`);
  };

  return <div className="flex-grow bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-6">
    <main className="mx-auto max-w-xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />英検4級に戻る</Button>
      <header className="mt-4 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-xl">
        <p className="text-xs font-bold tracking-widest text-cyan-100">STEP BY STEP</p>
        <h1 className="mt-2 text-3xl font-extrabold">練習する文法を選ぼう</h1>
        <p className="mt-3 leading-7 text-cyan-50">まだ習っていない文法は後回しにして、習ったところから練習できます。</p>
      </header>
      <p className="mt-5 text-sm font-bold text-slate-600">1回10問まで。文法ごとの問題だけが出ます。</p>
      <div className="mt-3 space-y-3">
        {categories.map(category => {
          const state = getGrammarLearningState(category.id);
          const label = getGrammarStatusLabel(state.status);
          const stateStyle = state.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : state.status === 'review-needed' ? 'bg-rose-100 text-rose-800' : state.status === 'in-progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';
          const action = !state.guideViewed ? '説明を見る' : state.status === 'review-needed' ? '復習する' : state.practiced ? 'もう一度練習する' : '練習する';
          const ariaLabel = `${category.title}の${action}。状態は${label}です`;
          return <button key={category.id} onClick={() => openCategory(category)} aria-label={ariaLabel} className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-extrabold text-slate-900">{category.title}</h2><span className={`rounded-full px-2 py-1 text-xs font-bold ${stateStyle}`}>状態：{label}</span></div><p className="mt-1 text-sm text-slate-600">{category.description}</p><p className="mt-2 text-xs text-slate-500">問題：{getGrammarCategorySentences(category.id).length}問</p>{state.practiced ? <p className="mt-2 text-sm font-bold text-slate-700">{state.attemptedCount}問中{state.correctCount}問正解・正答率{state.accuracy}％</p> : state.guideViewed ? <p className="mt-2 text-xs font-bold text-amber-700">説明を見たよ</p> : <p className="mt-2 text-xs font-bold text-cyan-700">まだ習っていない文法だよ。まず説明を見よう</p>}</div><span className={`mt-3 flex min-h-11 w-full items-center justify-center rounded-xl px-4 font-bold ${state.status === 'not-started' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>{action}</span></button>;
        })}
      </div>
      <p className="mt-5 rounded-xl bg-white p-4 text-xs leading-5 text-slate-600 shadow-sm">「できた！」は、5問以上に答えて正答率80％以上が目安です。<br/><br/>前に間違えた問題は、「今日の復習問題」でもう一度練習できます。</p>
    </main>
  </div>;
};

export default Eiken4GrammarPracticeSelectPage;
