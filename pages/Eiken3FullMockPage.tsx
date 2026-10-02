import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { getFullMock, getLegacyFullMock, saveFullMockResult } from '../services/eiken3ExamPrepService';
import { speakText } from '../services/speechService';
import { scheduleMockPriorities } from '../services/eiken3MockPriorityService';
import { clearFullMockAttempt, loadFullMockAttempt, saveFullMockAttempt } from '../services/eiken3FullMockAttemptService';
import { completeEiken3MissionForPath } from '../services/eiken3StampCourseService';
import { eiken3WritingTasks } from '../data/eiken3Writing';
import { localDateKey } from '../services/eiken3DailyService';

const Eiken3FullMockPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const missionId = params.get('courseMission') || undefined;
  const saved = useMemo(() => loadFullMockAttempt(missionId), [missionId]);
  const [legacy, setLegacy] = useState(Boolean(saved && saved.formatVersion !== 2));
  const [seed, setSeed] = useState(saved?.seed || missionId || localDateKey());
  const questions = useMemo(() => legacy ? getLegacyFullMock(seed) : getFullMock(seed), [legacy, seed]);
  const readingTotal = legacy ? 35 : 30;
  const writingTasks = useMemo(() => {
    const variant = missionId === 'full-mock-2' ? 1 : missionId === 'full-mock-3' ? 2 : 0;
    // A distinct pair for each course mission, with one email and one opinion.
    const emails = eiken3WritingTasks.filter(task => task.kind === 'email');
    const opinions = eiken3WritingTasks.filter(task => task.kind === 'opinion');
    return [emails[variant % emails.length], opinions[Math.floor(variant / emails.length) % opinions.length]];
  }, [missionId]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(saved?.index ?? 0);
  const [stage, setStage] = useState<'reading'|'writing'|'listening'>(saved?.stage || 'reading');
  const [remaining, setRemaining] = useState(saved?.remaining ?? 65 * 60);
  const [answers, setAnswers] = useState<Record<string,string>>(saved?.answers || {});
  const [writingAnswers, setWritingAnswers] = useState<Record<string,string>>(saved?.writingAnswers || {});
  const [plays, setPlays] = useState<Record<string,number>>(saved?.plays || {});
  const [selected, setSelected] = useState('');
  const finishGuard = useRef(false);
  const elapsedBase = useRef(saved?.elapsedSeconds || 0);
  const startedAt = useRef(0);
  const current = questions[index];
  const back = () => navigate(missionId ? '/eiken3/stamp-course' : '/eiken3');
  const begin = () => { startedAt.current = Date.now(); setStarted(true); };
  const reset = () => {
    clearFullMockAttempt(); setLegacy(false); setSeed(missionId || localDateKey());
    setIndex(0); setStage('reading'); setRemaining(65 * 60); setAnswers({}); setWritingAnswers({}); setPlays({}); setSelected('');
    elapsedBase.current = 0; finishGuard.current = false; begin();
  };
  const finish = (answerMap: Record<string,string>) => {
    if (finishGuard.current) return;
    const reading = questions.slice(0, readingTotal).filter(q => answerMap[q.id] === q.answer).length;
    const listening = questions.slice(readingTotal).filter(q => answerMap[q.id] === q.answer).length;
    const savedOk = saveFullMockResult({ id: new Date().toISOString(), date: new Date().toLocaleDateString('ja-JP'), reading, listening, readingTotal, listeningTotal: 30, timeUsed: elapsedBase.current + Math.round((Date.now() - startedAt.current) / 1000), answers: answerMap, writingAnswers, courseEligible: Object.keys(answerMap).length > 0 && (legacy || writingTasks.every(task => writingAnswers[task.id]?.trim())), ...(missionId ? { missionId } : {}) });
    if (!savedOk) return;
    finishGuard.current = true;
    setAnswers(answerMap); setFinished(true); clearFullMockAttempt();
    // An incomplete writing submission remains a practice result, without a course stamp.
    if (Object.keys(answerMap).length && (legacy || writingTasks.every(task => writingAnswers[task.id]?.trim()))) completeEiken3MissionForPath(missionId || null, '/eiken3/full-mock');
    scheduleMockPriorities(questions.filter(q => answerMap[q.id] !== q.answer && !q.id.startsWith('full-reading-')).map(q => q.id));
  };
  const toListening = () => { setStage('listening'); setIndex(readingTotal); setSelected(''); setRemaining(25 * 60); };
  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, finished]);
  useEffect(() => {
    if (!started || finished) return;
    saveFullMockAttempt({ index, answers, writingAnswers, remaining, stage, plays, seed, elapsedSeconds: elapsedBase.current + Math.round((Date.now() - startedAt.current) / 1000), ...(legacy ? {} : { formatVersion: 2 as const }), ...(missionId ? { missionId } : {}) });
  }, [started, finished, index, answers, writingAnswers, remaining, stage, plays, seed, legacy, missionId]);
  useEffect(() => {
    if (!started || finished || remaining !== 0) return;
    if (stage !== 'listening') toListening(); else finish(answers);
  }, [started, finished, remaining, stage]);
  const next = () => {
    if (!current || !selected) return;
    const updated = { ...answers, [current.id]: selected };
    setAnswers(updated); setSelected('');
    if (index === readingTotal - 1) { if (legacy) toListening(); else setStage('writing'); }
    else if (index === questions.length - 1) finish(updated);
    else setIndex(value => value + 1);
  };
  const time = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  if (!started) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow"><Button onClick={back} variant="ghost">戻る</Button><h1 className="mt-4 text-3xl font-extrabold">英検3級 フル模試</h1><p className="mt-4 leading-7">読解30問 ＋ 書く2題 ＋ 聞く30問。読解・書く65分、聞く約25分です。</p><p className="mt-3 text-sm text-slate-600">学習用のオリジナル問題です。音声は端末の読み上げを使い、選択肢などは練習向けです。英作文はモデル答案と比較し、自動採点は行いません。</p>{saved && <p className="mt-4 rounded-xl bg-amber-50 p-3">途中の回答が保存されています。{legacy ? '以前の35問形式は、そのまま再開できます。' : '同じ問題・残り時間から再開できます。'}</p>}<Button onClick={begin} className="mt-5 w-full">{saved ? '途中から再開' : '模試を始める'}</Button>{saved && <Button onClick={reset} variant="secondary" className="mt-3 w-full">新形式で最初からやり直す</Button>}</main></div>;
  if (finished) {
    const reading = questions.slice(0, readingTotal).filter(q => answers[q.id] === q.answer).length;
    const listening = questions.slice(readingTotal).filter(q => answers[q.id] === q.answer).length;
    const wrong = questions.filter(q => answers[q.id] !== q.answer);
    const writingDone = !legacy && writingTasks.every(task => writingAnswers[task.id]?.trim());
    return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow"><h1 className="text-3xl font-extrabold">模試の結果</h1><p className="mt-4 text-xl">読解 {reading}/{readingTotal}・聞く {listening}/30</p><p className="mt-3 text-sm text-slate-600">この正答数だけでは英検の合否は判定できません。書く力と面接も練習しましょう。</p>{!legacy && <><p className="mt-4 font-bold">書く練習：{writingDone ? '2題回答済み' : '未回答あり（スタンプはまだ付きません）'}</p>{writingTasks.map(task => <details key={task.id} className="mt-3 rounded-xl border p-4"><summary className="min-h-11 cursor-pointer font-bold">{task.title}・モデル答案と比べる</summary><p className="mt-3 whitespace-pre-wrap">あなた：{writingAnswers[task.id] || '未回答'}</p><p className="mt-3">モデル：{task.modelAnswer}</p><ul className="mt-3 list-inside list-disc">{task.checklist.map(item => <li key={item}>{item}</li>)}</ul></details>)}</>}{wrong.map((q, i) => <details key={q.id} className="mt-3 rounded-xl border p-4"><summary className="min-h-11 cursor-pointer font-bold">{i + 1}. {q.prompt}</summary>{q.passage && <p className="mt-3">{q.passage}</p>}<p className="mt-3">あなた：{answers[q.id] || '未回答'}</p><p className="mt-2 font-bold text-emerald-700">正解：{q.answer}</p><p className="mt-2 text-sm">{q.explanation}</p></details>)}<Button onClick={back} className="mt-5 w-full">{missionId ? 'スタンプラリーへ戻る' : '英検3級へ戻る'}</Button></main></div>;
  }
  if (stage === 'writing') return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-2xl"><p className="font-bold">読解・書く 残り {time}</p><h1 className="mt-3 text-2xl font-extrabold">書く練習・2題</h1>{writingTasks.map(task => <section key={task.id} className="mt-4 rounded-2xl bg-white p-5 shadow"><h2 className="font-bold">{task.title}（{task.wordRange}）</h2><p className="mt-3 leading-7">{task.prompt}</p><textarea aria-label={task.title} value={writingAnswers[task.id] || ''} onChange={event => setWritingAnswers(value => ({ ...value, [task.id]: event.target.value }))} className="mt-4 min-h-40 w-full rounded-xl border p-3"/><p className="mt-2 text-sm">単語数：{(writingAnswers[task.id] || '').trim().split(/\s+/).filter(Boolean).length}</p></section>)}<Button disabled={!writingTasks.every(task => writingAnswers[task.id]?.trim())} onClick={toListening} className="mt-5 w-full">2題を書いた・リスニングへ</Button><Button onClick={back} variant="secondary" className="mt-3 w-full">保存して戻る</Button></main></div>;
  if (!current) return <Button onClick={back}>英検3級へ戻る</Button>;
  const isListening = stage === 'listening';
  return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow"><p className="text-sm font-bold">{current.section}・残り {time}・{index + 1}/{questions.length}問</p>{current.passage && <p className="mt-4 rounded-xl bg-sky-50 p-4 leading-7">{current.passage}</p>}{isListening && <Button disabled={(plays[current.id] || 0) >= 2} onClick={() => { speakText(current.audioText || '', 'en-US', .82); setPlays(value => ({ ...value, [current.id]: (value[current.id] || 0) + 1 })); }} className="mt-4 w-full">音声を聞く（{plays[current.id] || 0}/2回）</Button>}<h1 className="mt-5 whitespace-pre-wrap text-xl font-bold">{current.prompt}</h1><div className="mt-4 space-y-2">{current.choices.map(choice => <button key={choice} onClick={() => setSelected(choice)} aria-pressed={selected === choice} className={`min-h-12 w-full rounded-xl border p-4 text-left font-bold ${selected === choice ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}>{choice}</button>)}</div><Button disabled={!selected} onClick={next} className="mt-5 w-full">{index === questions.length - 1 ? '結果を見る' : index === readingTotal - 1 ? (legacy ? 'リスニングへ' : '書く練習へ') : '次へ'}</Button><Button onClick={back} variant="secondary" className="mt-3 w-full">保存して戻る</Button></main></div>;
};
export default Eiken3FullMockPage;
