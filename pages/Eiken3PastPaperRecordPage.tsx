import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { deletePastPaperResult, loadPastPaperResults, savePastPaperResult } from '../services/eiken3ExamPrepService';
import { completeEiken3MissionForPath } from '../services/eiken3StampCourseService';

const labelForMission = (missionId: string | null) => missionId === 'past-paper-2'
  ? '公式過去問 第2回'
  : missionId === 'past-paper-3'
    ? '公式過去問 第3回'
    : '公式過去問 第1回';

const Eiken3PastPaperRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseMission = searchParams.get('courseMission');
  const [items, setItems] = useState(loadPastPaperResults);
  const [label, setLabel] = useState(() => labelForMission(courseMission));
  const [reading, setReading] = useState('');
  const [listening, setListening] = useState('');
  const [note, setNote] = useState('');
  const [savedForCourse, setSavedForCourse] = useState(false);

  const add = () => {
    const readingScore = Number(reading);
    const listeningScore = Number(listening);
    if (!Number.isInteger(readingScore) || readingScore < 0 || readingScore > 35 || !Number.isInteger(listeningScore) || listeningScore < 0 || listeningScore > 30) return;
    savePastPaperResult({ id: new Date().toISOString(), date: new Date().toLocaleDateString('ja-JP'), label, reading: readingScore, listening: listeningScore, note });
    if (courseMission) {
      completeEiken3MissionForPath(courseMission, '/eiken3/past-papers');
      setSavedForCourse(true);
    }
    setItems(loadPastPaperResults());
    setReading('');
    setListening('');
    setNote('');
  };

  return <div className="flex-grow bg-slate-50 p-4"><div className="mx-auto max-w-2xl">
    <Button onClick={() => navigate(courseMission ? '/eiken3/stamp-course' : '/eiken3')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>{courseMission ? 'スタンプラリーに戻る' : '戻る'}</Button>
    <header className="mt-4 rounded-3xl bg-teal-700 p-6 text-white"><p className="text-sm font-bold text-teal-100">公式過去問を解いたら記録</p><h1 className="mt-1 text-3xl font-extrabold">過去問スコア</h1></header>
    <section className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 p-4"><p className="font-bold text-teal-900">先に公式過去問を解こう</p><p className="mt-1 text-sm leading-6 text-teal-800">英検公式サイトなどで問題を解き、リーディングとリスニングの点数をここへ入力するとスタンプが付くよ。</p></section>
    <section className="mt-4 rounded-2xl bg-white p-5 shadow">
      <input value={label} onChange={event => setLabel(event.target.value)} className="min-h-11 w-full rounded-xl border p-3" aria-label="過去問名"/>
      <div className="mt-3 grid grid-cols-2 gap-3"><label className="text-sm font-bold">リーディング /35<input type="number" min="0" max="35" value={reading} onChange={event => setReading(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border p-3"/></label><label className="text-sm font-bold">リスニング /30<input type="number" min="0" max="30" value={listening} onChange={event => setListening(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border p-3"/></label></div>
      <textarea value={note} onChange={event => setNote(event.target.value)} placeholder="苦手だったところ（任意）" className="mt-3 min-h-24 w-full rounded-xl border p-3"/>
      <Button disabled={reading === '' || listening === ''} onClick={add} className="mt-3 w-full">記録する{courseMission ? '・スタンプをもらう' : ''}</Button>
      {savedForCourse && <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-center font-bold text-emerald-800">記録できたよ！ スタンプが付きました。</div>}
      {savedForCourse && <Button onClick={() => navigate('/eiken3/stamp-course')} className="mt-3 w-full">スタンプラリーへ戻る</Button>}
    </section>
    <div className="mt-4 space-y-3">{[...items].reverse().map(item => { const total = item.reading + item.listening; return <section key={item.id} className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex justify-between"><div><b>{item.label}</b><p className="text-xs text-slate-500">{item.date}</p></div><strong className={total >= 49 ? 'text-emerald-600' : 'text-amber-600'}>{total}/65</strong></div><p className="mt-2 text-sm">読解 {item.reading}/35・聞く {item.listening}/30</p>{item.note && <p className="mt-2 text-sm text-slate-500">{item.note}</p>}<button onClick={() => { deletePastPaperResult(item.id); setItems(loadPastPaperResults()); }} className="mt-2 min-h-11 text-xs text-rose-600">削除</button></section>; })}</div>
  </div></div>;
};

export default Eiken3PastPaperRecordPage;
