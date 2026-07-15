import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { grade1ReviewWords } from '../data/grade1Review';
import { gradeVocabularyMasteryLevel, gradeWordId, loadGradeVocabularyMastery, VocabularyMasteryLevel } from '../services/gradeVocabularyService';

const styles: Record<VocabularyMasteryLevel, string> = { mastered: 'bg-emerald-50 border-emerald-300', consolidating: 'bg-sky-50 border-sky-300', learning: 'bg-amber-50 border-amber-300', new: 'bg-slate-50 border-slate-200' };
const groups = [
  { title: '基本語', from: 0, to: 12 }, { title: '学校・家族', from: 12, to: 24 }, { title: '身の回り', from: 24, to: 36 },
  { title: '動作を表す語', from: 36, to: 54 }, { title: '形容詞・助動詞', from: 54, to: 66 }, { title: '前置詞・接続詞', from: 66, to: 72 },
];

const Grade1VocabularyMapPage: React.FC = () => {
  const navigate = useNavigate();
  const mastery = loadGradeVocabularyMastery(1);
  const counts = grade1ReviewWords.reduce((result, _, index) => { result[gradeVocabularyMasteryLevel(mastery[gradeWordId(1, index)])] += 1; return result; }, { mastered: 0, consolidating: 0, learning: 0, new: 0 });
  return (
    <div className="flex-grow p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <Button onClick={() => navigate('/vocabulary')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2" />英単語に戻る</Button>
      <header className="mt-4 rounded-2xl bg-emerald-600 p-6 text-white shadow-lg"><p className="text-sm font-bold text-emerald-100">中学1年生・全72語</p><h1 className="mt-1 text-3xl font-bold">英単語マップ</h1><p className="mt-2 text-sm text-emerald-50">異なる4日で正解し、直近も正解した単語だけ「覚えた」になります。</p></header>
      <section className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4"><div className="rounded-xl bg-emerald-100 p-3"><p className="text-xs">覚えた</p><p className="text-2xl font-bold text-emerald-800">{counts.mastered}</p></div><div className="rounded-xl bg-sky-100 p-3"><p className="text-xs">定着中</p><p className="text-2xl font-bold text-sky-800">{counts.consolidating}</p></div><div className="rounded-xl bg-amber-100 p-3"><p className="text-xs">練習中</p><p className="text-2xl font-bold text-amber-800">{counts.learning}</p></div><div className="rounded-xl bg-slate-200 p-3"><p className="text-xs">未学習</p><p className="text-2xl font-bold text-slate-700">{counts.new}</p></div></section>
      <div className="mt-5 space-y-5">{groups.map(group => <section key={group.title} className="rounded-xl border border-slate-100 bg-white p-4 shadow"><h2 className="font-bold text-slate-800">{group.title}</h2><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{grade1ReviewWords.slice(group.from, group.to).map((word, offset) => { const index = group.from + offset; const level = gradeVocabularyMasteryLevel(mastery[gradeWordId(1, index)]); return <div key={word.word} className={`rounded-lg border p-2 ${styles[level]}`}><p className="font-bold text-slate-800">{word.word}</p><p className="mt-1 text-xs text-slate-600">{word.meaning}</p></div>; })}</div></section>)}</div>
      <Button onClick={() => navigate('/vocabulary/grade1/quiz')} className="mt-6 w-full">確認テストをする</Button>
    </div>
  );
};

export default Grade1VocabularyMapPage;
