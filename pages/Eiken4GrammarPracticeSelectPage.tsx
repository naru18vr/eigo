import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { getAvailableGrammarCategories, getGrammarCategorySentences, getGrammarLearningState, loadGrammarPracticeStats } from '../services/eiken4GrammarPracticeService';

const Eiken4GrammarPracticeSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const stats = loadGrammarPracticeStats();
  const categories = getAvailableGrammarCategories();

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
          const result = stats[category.id];
          const accuracy = result?.total ? Math.round(result.correct / result.total * 100) : null;
          const state = getGrammarLearningState(result);
          const stateStyle = state === 'できた' ? 'bg-emerald-100 text-emerald-800' : state === '復習しよう' ? 'bg-rose-100 text-rose-800' : state === '練習中' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';
          return <button key={category.id} onClick={() => navigate(`/eiken4/grammar-practice/${category.id}`)} className="flex min-h-24 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-cyan-300 active:scale-[.99]">
            <div className="min-w-0 flex-grow"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-extrabold text-slate-900">{category.title}</h2><span className={`rounded-full px-2 py-1 text-xs font-bold ${stateStyle}`}>{state}</span></div><p className="mt-1 text-sm text-slate-600">{category.description}</p><p className="mt-2 text-xs text-slate-500">問題数：{getGrammarCategorySentences(category.id).length}問{accuracy !== null ? `・正答率：${accuracy}％` : ''}</p></div>
            <ChevronRightIcon className="h-6 w-6 shrink-0 text-cyan-600" />
          </button>;
        })}
      </div>
      <p className="mt-5 rounded-xl bg-white p-4 text-xs leading-5 text-slate-600 shadow-sm">「できた」は、正答率80％以上の目安です。間違えた問題は、今日のおまかせ問題でも復習できます。</p>
    </main>
  </div>;
};

export default Eiken4GrammarPracticeSelectPage;
