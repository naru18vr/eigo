import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { getTopListeningCause } from '../services/eiken4ListeningCauseService';
import { speakText } from '../services/speechService';
import { recordReviewAnswer } from '../services/eiken4DailyService';

const tipFor = (cause: string) => cause === '単語を知らなかった' ? '音声の前後にある名詞・動詞を1語ずつ拾おう。'
  : cause === '音がつながって聞こえた' ? '最初はゆっくり、次は本番速度で同じ文を聞こう。'
    : cause === '疑問詞を聞き逃した' ? '最初の Who・When・Where・Why・How に集中しよう。'
      : '音声の前に選択肢の違う部分だけを読もう。';
const matchesCause = (audio: string, cause: string) => cause === '疑問詞を聞き逃した' ? /\b(who|when|where|why|how|what|which)\b/i.test(audio)
  : cause === '音がつながって聞こえた' ? /\b(do you|did you|would you|going to|want to|let me)\b/i.test(audio)
    : true;

const Eiken4ListeningFocusPage: React.FC = () => {
  const navigate = useNavigate();
  const cause = getTopListeningCause() || '選択肢を読むのが遅かった';
  const questions = useMemo(() => {
    const matched = eiken4ListeningQuestions.filter(item => matchesCause(item.audioText, cause));
    return [...matched, ...eiken4ListeningQuestions.filter(item => !matched.includes(item))].slice(0, 6);
  }, [cause]);
  const [index, setIndex] = useState(0); const [selected, setSelected] = useState(''); const [checked, setChecked] = useState(false); const [plays, setPlays] = useState(0); const [score, setScore] = useState(0);
  const current = questions[index];
  if (!current) return <div className="flex-grow bg-slate-50 p-4"><section className="mx-auto mt-12 max-w-xl rounded-3xl bg-white p-7 text-center shadow"><p className="font-bold text-indigo-600">原因別練習 完了</p><h1 className="mt-2 text-4xl font-extrabold">{score} / {questions.length}</h1><Button onClick={() => navigate('/eiken4')} className="mt-6 w-full">英検4級ホームへ</Button></section></div>;
  const correct = selected === current.answer;
  const next = () => { if (!checked) { setChecked(true); if (correct) setScore(value => value + 1); else recordReviewAnswer(`listening-${current.id}`, false, false); return; } setIndex(value => value + 1); setSelected(''); setChecked(false); setPlays(0); };
  const audioSupported=typeof window!=='undefined'&&'speechSynthesis'in window;
  return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>戻る</Button><header className="mt-4 rounded-3xl bg-indigo-700 p-5 text-white"><p className="text-xs font-bold text-indigo-200">あなたの聞き取り原因</p><h1 className="mt-1 text-xl font-extrabold">{cause}</h1><p className="mt-2 text-sm">{tipFor(cause)}</p></header><section className="mt-4 rounded-3xl bg-white p-5 shadow"><div className="flex justify-between text-sm font-bold text-indigo-700"><span>原因別6問</span><span>{index+1}/6</span></div><button disabled={!audioSupported||plays>=2} aria-label={`音声を聞く、残り${2-plays}回`} onClick={()=>{speakText(current.audioText,'en-US',plays===0?.72:.88);setPlays(value=>value+1)}} className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 py-4 font-bold text-white disabled:bg-slate-400"><SpeakerWaveIcon className="mr-2 h-6 w-6"/>音声を聞く（{plays===0?'ゆっくり':'本番速度'}・あと{2-plays}回）</button>{!audioSupported&&<div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm"><b>音声を使えません。</b><p className="mt-1">英文を指で区切りながら読んでください。</p><p className="mt-2 text-slate-600">{current.transcript}</p></div>}<h2 className="mt-5 text-xl font-bold">{current.question}</h2><div className="mt-4 grid gap-2">{current.choices.map(choice=><button disabled={checked} key={choice} onClick={()=>setSelected(choice)} className={`min-h-12 rounded-xl border p-3 text-left font-bold ${checked&&choice===current.answer?'border-emerald-400 bg-emerald-50':selected===choice?'border-indigo-400 bg-indigo-50':'border-slate-200'}`}>{choice}</button>)}</div>{checked&&<div className={`mt-4 rounded-xl border-l-4 p-4 ${correct?'border-emerald-600 bg-emerald-50':'border-rose-600 bg-rose-50'}`}><b>{correct?'○ 正解！':`× 正解：${current.answer}`}</b><p className="mt-2 whitespace-pre-line text-sm">{current.transcript}</p></div>}<Button disabled={!selected} onClick={next} className="mt-5 w-full">{checked?'次へ':'答える'}</Button></section></main></div>;
};
export default Eiken4ListeningFocusPage;
