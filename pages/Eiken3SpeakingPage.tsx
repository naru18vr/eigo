import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { eiken3SpeakingCards } from '../data/eiken3Speaking';
import { completeSpeakingCard, loadSpeakingProgress } from '../services/eiken3SpeakingService';
import { speakText } from '../services/speechService';

const Eiken3SpeakingPage: React.FC = () => {
  const navigate = useNavigate();
  const initial = useMemo(loadSpeakingProgress, []);
  const firstOpenIndex = eiken3SpeakingCards.findIndex(card => !initial.completedCardIds.includes(card.id));
  const firstOpen = firstOpenIndex === -1 ? eiken3SpeakingCards.length : firstOpenIndex;
  const [index, setIndex] = useState(firstOpen);
  const [attempted, setAttempted] = useState(false);
  const card = eiken3SpeakingCards[index];
  const next = () => {
    if (!card || !attempted) return;
    if (!completeSpeakingCard(card.id)) return;
    setAttempted(false);
    setIndex(value => value + 1);
  };
  if (!card) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl rounded-3xl bg-white p-7 text-center shadow"><p className="font-bold text-indigo-700">面接練習 完了</p><h1 className="mt-2 text-3xl font-extrabold">{eiken3SpeakingCards.length}題できた！</h1><p className="mt-3 text-sm leading-6 text-slate-600">カードを読み、質問に声で答える練習ができました。</p><Button onClick={() => { setIndex(0); setAttempted(false); }} className="mt-6 w-full">もう一度練習する</Button><Button onClick={() => navigate('/eiken3')} variant="secondary" className="mt-3 w-full">英検3級へ戻る</Button></main></div>;
  return <div className="flex-grow bg-gradient-to-b from-indigo-50 to-white p-4 sm:p-6"><main className="mx-auto max-w-2xl"><Button onClick={() => navigate('/eiken3')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検3級へ戻る</Button><header className="mt-4 rounded-3xl bg-gradient-to-br from-indigo-700 to-violet-600 p-6 text-white shadow-xl"><p className="text-xs font-bold tracking-widest text-indigo-200">SPEAKING PRACTICE</p><h1 className="mt-2 text-3xl font-extrabold">英検3級・面接練習</h1><p className="mt-3 text-sm leading-6 text-indigo-50">英文を声に出して読み、質問に英語で答えてみよう。録音しなくても練習できます。</p></header><div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"><span className="text-sm font-bold text-indigo-700">{index + 1} / {eiken3SpeakingCards.length}題</span><span className="text-sm font-bold text-slate-600">カードを読んで答える</span></div><section className="mt-4 rounded-3xl bg-white p-5 shadow"><h2 className="text-xl font-extrabold text-slate-900">{card.title}</h2><div className="mt-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-4"><div className="flex items-start justify-between gap-3"><p className="text-base leading-8 text-slate-900">{card.passage}</p><button type="button" onClick={() => speakText(card.passage, 'en-US', .78)} className="shrink-0 rounded-full bg-white p-3 text-indigo-700 shadow" aria-label="カードの英文を聞く"><SpeakerWaveIcon className="h-5 w-5"/></button></div></div><p className="mt-5 text-xs font-bold text-indigo-700">質問</p><h3 className="mt-1 text-xl font-extrabold text-slate-900">{card.question}</h3><button type="button" onClick={() => speakText(card.question, 'en-US', .78)} className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-indigo-200 bg-white font-bold text-indigo-700"><SpeakerWaveIcon className="mr-2 h-5 w-5"/>質問を聞く</button><div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><b>ヒント：</b>{card.tip}</div><Button onClick={() => setAttempted(true)} className="mt-4 w-full bg-indigo-700">声に出して答えた</Button>{attempted && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="font-extrabold text-emerald-900">モデル回答</p><p className="mt-2 rounded-xl bg-white p-3 font-bold leading-7 text-slate-800">{card.modelAnswer}</p><p className="mt-3 text-sm text-emerald-950">自分の答えと比べて、主語・動詞・語順を確認しよう。</p><Button onClick={next} className="mt-4 w-full bg-emerald-600">{index === eiken3SpeakingCards.length - 1 ? '完了する' : '次のカードへ'}</Button></div>}</section></main></div>;
};

export default Eiken3SpeakingPage;
