import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { eiken4ListeningQuestions } from '../data/eiken4Listening';
import { listeningSection } from '../services/eiken4ExamPrepService';
import { speakText } from '../services/speechService';
import { listeningCauseOptions, recordListeningCause, type ListeningCause } from '../services/eiken4ListeningCauseService';

const sections = [{ title: '第1部 会話の応答', from: 0, to: 12 }, { title: '第2部 会話の内容', from: 12, to: 24 }, { title: '第3部 説明文の内容', from: 24, to: 36 }];

const Eiken4ListeningPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<number | null>(null);
  const questions = useMemo(() => section === null ? [] : eiken4ListeningQuestions.slice(sections[section].from, sections[section].to), [section]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [cause, setCause] = useState<ListeningCause | ''>('');
  const current = questions[index];

  const resetQuestion = () => { setSelected(''); setChecked(false); setPlayCount(0); setCause(''); };
  if (section === null) return <div className="flex-grow bg-slate-50 p-4"><div className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />戻る</Button><header className="mt-4 rounded-3xl bg-gradient-to-br from-indigo-700 to-violet-500 p-6 text-white"><p className="text-sm font-bold opacity-80">本番3部構成</p><h1 className="mt-1 text-3xl font-extrabold">リスニング特訓</h1></header><div className="mt-4 space-y-3">{sections.map((item, i) => <button key={item.title} onClick={() => setSection(i)} className="w-full rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200"><p className="text-xs font-bold text-indigo-600">12問</p><h2 className="mt-1 text-lg font-bold">{item.title}</h2><p className="mt-1 text-sm text-slate-500">音声2回まで・原因別復習 →</p></button>)}</div></div></div>;
  if (index >= questions.length) return <div className="flex-grow bg-slate-50 p-4"><section className="mx-auto mt-10 max-w-xl rounded-3xl bg-white p-7 text-center shadow"><p className="font-bold text-indigo-600">{sections[section].title} 完了</p><h1 className="mt-2 text-4xl font-extrabold">{score} / {questions.length}</h1><Button onClick={() => { setSection(null); setIndex(0); setScore(0); resetQuestion(); }} className="mt-6 w-full">別の部を練習</Button></section></div>;

  const correct = selected === current.answer;
  const audioSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const play = () => { if (!audioSupported || playCount >= 2) return; setPlayCount(value => value + 1); speakText(current.audioText, 'en-US', .82); };
  const advance = () => { if (!checked) { setChecked(true); if (correct) setScore(value => value + 1); return; } if (!correct && cause) recordListeningCause(current.id, cause); setIndex(value => value + 1); resetQuestion(); };

  return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow"><div className="flex justify-between text-sm font-bold text-indigo-700"><span>{listeningSection(sections[section].from + index)}</span><span>{index + 1}/{questions.length}</span></div>{!audioSupported && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">この端末では音声機能を利用できません。Chromeの音声設定を確認してください。</div>}<button disabled={!audioSupported || playCount >= 2} onClick={play} className="mt-5 flex w-full items-center justify-center rounded-2xl bg-indigo-600 py-5 font-bold text-white disabled:bg-slate-400"><SpeakerWaveIcon className="mr-2 h-6 w-6" />音声を聞く（あと{2 - playCount}回）</button><h1 className="mt-5 text-xl font-bold">{current.question}</h1><div className="mt-4 space-y-2">{current.choices.map((choice, i) => <button disabled={checked} key={choice} onClick={() => setSelected(choice)} className={`w-full rounded-xl border p-4 text-left font-bold ${checked && choice === current.answer ? 'border-emerald-400 bg-emerald-50' : selected === choice ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200'}`}>{i + 1}. {choice}</button>)}</div>{checked && <div className={`mt-4 rounded-xl p-4 ${correct ? 'bg-emerald-50' : 'bg-rose-50'}`}><b>{correct ? '正解！' : `正解：${current.answer}`}</b><p className="mt-2 text-sm">{current.explanation}</p><p className="mt-2 whitespace-pre-line text-xs text-slate-500">{current.transcript}</p>{!correct && <fieldset className="mt-4 rounded-xl bg-white p-3"><legend className="text-sm font-bold">聞き取れなかった原因</legend><div className="mt-2 grid gap-2">{listeningCauseOptions.map(item => <label key={item} className="flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm"><input type="radio" checked={cause === item} onChange={() => setCause(item)} />{item}</label>)}</div></fieldset>}</div>}<Button disabled={!selected || (checked && !correct && !cause)} onClick={advance} className="mt-5 w-full">{checked ? (!correct && !cause ? '原因を選んでください' : '次へ') : '答える'}</Button></main></div>;
};
export default Eiken4ListeningPracticePage;
