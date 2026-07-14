import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import BookOpenIcon from '../components/shared/BookOpenIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import SparklesIcon from '../components/shared/SparklesIcon';
import ClockIcon from '../components/shared/ClockIcon';
import { useEiken4Session } from '../contexts/Eiken4SessionContext';
import { getDueReviewCount, loadDailyProgress } from '../services/eiken4DailyService';
import { loadReadingProgress } from '../services/eiken4ReadingService';
import { loadGrade1Review } from '../services/grade1ReviewService';

const Eiken4HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { resetSession } = useEiken4Session();
  const dailyProgress = loadDailyProgress();
  const dailyDone = Boolean(dailyProgress.completedAt);
  const dueReviewCount = getDueReviewCount();
  const readingProgress = loadReadingProgress();
  const grade1Progress = loadGrade1Review();

  const startFresh = (path: string) => {
    resetSession();
    navigate(path);
  };

  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4 text-slate-600 hover:text-slate-800">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          ホームに戻る
        </Button>
        <div className="rounded-xl bg-indigo-600 text-white p-5 shadow-lg">
          <p className="text-sm font-semibold opacity-90">中学生向け</p>
          <h1 className="text-3xl font-bold mt-1">英検4級モード</h1>
          <p className="text-sm opacity-90 mt-2">単語と語順を短時間で確認しよう。</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto">
        <button onClick={() => navigate('/eiken4/course')} className="w-full p-6 rounded-2xl shadow-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-left hover:shadow-2xl active:scale-95 transition-all"><div className="flex items-center justify-between"><div><p className="text-sm font-bold opacity-90">毎日はここだけ押せばOK</p><h2 className="text-2xl font-bold mt-1">今日の学習コース</h2><p className="text-sm mt-2">中1復習 → 15分 → 長文 → 英単語 → 紙</p></div><ChevronRightIcon className="h-9 w-9"/></div></button>

        <section className="mt-7"><h2 className="text-lg font-bold text-slate-800">今日のコースを個別に開く</h2><p className="text-sm text-slate-500 mt-1">途中からやり直すときに使います</p><div className="mt-3 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/eiken4/grade1-review')} className="rounded-xl bg-white border-2 border-amber-200 p-4 text-left shadow-sm"><p className="text-xs font-bold text-amber-700">1　{grade1Progress.completedAt ? '完了！' : `${grade1Progress.answers.length}/6`}</p><h3 className="font-bold mt-1">中1おさらい</h3></button>
          <button onClick={() => navigate('/eiken4/daily')} className="rounded-xl bg-white border-2 border-emerald-200 p-4 text-left shadow-sm"><p className="text-xs font-bold text-emerald-700">2　{dailyDone ? '完了！' : `${dailyProgress.answers.length}/${dailyProgress.questionIds.length}`}</p><h3 className="font-bold mt-1">今日の15分</h3><p className="text-xs text-slate-500 mt-1">{dueReviewCount ? `復習${dueReviewCount}問あり` : '18問'}</p></button>
          <button onClick={() => navigate('/eiken4/reading')} className="rounded-xl bg-white border-2 border-sky-200 p-4 text-left shadow-sm"><p className="text-xs font-bold text-sky-700">3　{readingProgress.completedAt ? '完了！' : readingProgress.answers.length ? `${readingProgress.answers.length}/2` : '未実施'}</p><h3 className="font-bold mt-1">ミニ長文</h3></button>
          <button onClick={() => startFresh('/eiken4/words')} className="rounded-xl bg-white border-2 border-indigo-200 p-4 text-left shadow-sm"><p className="text-xs font-bold text-indigo-700">4　8語</p><h3 className="font-bold mt-1">英単語カード</h3></button>
        </div></section>

        <section className="mt-8"><h2 className="text-lg font-bold text-slate-800">余裕がある日に追加</h2><p className="text-sm text-slate-500 mt-1">毎日の必須メニューではありません</p><div className="mt-3 space-y-3">
          <button onClick={() => navigate('/eiken4/exam-practice')} className="w-full rounded-xl bg-rose-50 border border-rose-200 p-4 text-left flex items-center justify-between"><div><p className="text-xs font-bold text-rose-600">本番に慣れる・10問</p><h3 className="font-bold text-slate-800">英検4級 本番形式</h3></div><ChevronRightIcon className="h-6 w-6 text-rose-400"/></button>
          <button onClick={() => startFresh('/eiken4/sentences')} className="w-full rounded-xl bg-amber-50 border border-amber-200 p-4 text-left flex items-center justify-between"><div className="flex items-center"><SparklesIcon className="h-7 w-7 text-amber-500 mr-3"/><div><p className="text-xs font-bold text-amber-600">語順を確認・5問</p><h3 className="font-bold text-slate-800">並べ替え問題</h3></div></div><ChevronRightIcon className="h-6 w-6 text-amber-400"/></button>
        </div></section>

        <section className="mt-8"><h2 className="text-lg font-bold text-slate-800">週1回・記録を見る</h2><div className="mt-3 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/eiken4/mock')} className="rounded-xl bg-violet-700 text-white p-4 text-left shadow"><ClockIcon className="h-7 w-7"/><h3 className="font-bold mt-2">10分ミニ模試</h3><p className="text-xs opacity-90">週1回</p></button>
          <button onClick={() => navigate('/eiken4/progress')} className="rounded-xl bg-teal-600 text-white p-4 text-left shadow"><ClockIcon className="h-7 w-7"/><h3 className="font-bold mt-2">ダッシュボード</h3><p className="text-xs opacity-90">試験まで・苦手</p></button>
          <button onClick={() => navigate('/eiken4/word-map')} className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-left"><BookOpenIcon className="h-7 w-7 text-indigo-600"/><h3 className="font-bold text-indigo-900 mt-2">英単語マップ</h3><p className="text-xs text-indigo-700">全128語</p></button>
          <Link to="/eiken4/result" className="rounded-xl bg-white border border-slate-200 p-4 text-left"><ClockIcon className="h-7 w-7 text-teal-600"/><h3 className="font-bold text-slate-800 mt-2">今日の結果</h3><p className="text-xs text-slate-500">報告用画面</p></Link>
        </div></section>

        <Link to="/guide" className="mt-8 block rounded-xl border border-slate-300 bg-white p-4 text-slate-700 hover:shadow-md transition-all"><div className="flex items-center justify-between"><div><h2 className="font-bold">使い方を見る</h2><p className="text-sm text-slate-500">できること・毎日の進め方</p></div><ChevronRightIcon className="h-6 w-6"/></div></Link>
      </main>
    </div>
  );
};

export default Eiken4HomePage;
