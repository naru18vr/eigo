import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { eiken3WritingTasks } from '../data/eiken3Writing';
import { completeWritingTask, loadWritingProgress, saveWritingDraft } from '../services/eiken3WritingService';

const countWords = (value: string) => value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;

const Eiken3WritingPage: React.FC = () => {
  const navigate = useNavigate();
  const initial = useMemo(loadWritingProgress, []);
  const firstOpenIndex = eiken3WritingTasks.findIndex(task => !initial.completedTaskIds.includes(task.id));
  const firstOpen = firstOpenIndex === -1 ? eiken3WritingTasks.length - 1 : firstOpenIndex;
  const [index, setIndex] = useState(firstOpen);
  const [draft, setDraft] = useState(initial.drafts[eiken3WritingTasks[firstOpen]?.id] || '');
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(firstOpenIndex === -1);
  const [checks, setChecks] = useState<string[]>([]);
  const [draftSaved, setDraftSaved] = useState(true);
  const task = eiken3WritingTasks[index];
  const words = countWords(draft);
  const updateDraft = (value: string) => { setDraft(value); if (task) setDraftSaved(saveWritingDraft(task.id, value) === true); };
  const submit = () => { if (draft.trim()) setSubmitted(true); };
  const next = () => {
    if (!task || !draft.trim()) return;
    if (!completeWritingTask(task.id)) return;
    const nextIndex = index + 1;
    if (nextIndex >= eiken3WritingTasks.length) { setFinished(true); return; }
    const progress = loadWritingProgress();
    setIndex(nextIndex);
    setDraft(progress.drafts[eiken3WritingTasks[nextIndex].id] || '');
    setSubmitted(false);
    setChecks([]);
  };
  if (!task) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl rounded-3xl bg-white p-7 text-center shadow"><h1 className="text-2xl font-extrabold">書く練習は準備中です</h1><Button onClick={() => navigate('/eiken3')} className="mt-6 w-full">英検3級へ戻る</Button></main></div>;
  if (finished) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><Button onClick={() => navigate('/eiken3')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検3級へ戻る</Button><section className="mt-5 rounded-3xl bg-emerald-50 p-7 text-center shadow"><p className="font-bold text-emerald-700">ライティング練習 完了</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">{eiken3WritingTasks.length}題できた！</h1><p className="mt-3 text-sm leading-6 text-slate-700">自分の答えを書いて、モデル答案と比べる練習ができました。</p><Button onClick={() => { setFinished(false); setIndex(0); setDraft(loadWritingProgress().drafts[eiken3WritingTasks[0].id] || ''); setSubmitted(false); setChecks([]); }} className="mt-6 w-full">もう一度練習する</Button><Button onClick={() => navigate('/eiken3')} variant="secondary" className="mt-3 w-full">英検3級へ戻る</Button></section></main></div>;
  return <div className="flex-grow bg-gradient-to-b from-amber-50 to-white p-4 sm:p-6"><main className="mx-auto max-w-2xl"><Button onClick={() => navigate('/eiken3')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検3級へ戻る</Button><header className="mt-4 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl"><p className="text-xs font-bold tracking-widest text-amber-100">WRITING PRACTICE</p><h1 className="mt-2 text-3xl font-extrabold">英検3級・書く練習</h1><p className="mt-3 text-sm leading-6 text-amber-50">まず自分で書いてから、モデル答案と比べよう。完璧でなくても大丈夫。</p></header><div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"><span className="text-sm font-bold text-amber-700">{index + 1} / {eiken3WritingTasks.length}題</span><span className="text-sm font-bold text-slate-600">{task.kind === 'email' ? 'Eメール' : '英作文'}</span></div><section className="mt-4 rounded-3xl bg-white p-5 shadow"><h2 className="text-xl font-extrabold text-slate-900">{task.title}</h2><p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-slate-800">{task.prompt}</p><p className="mt-3 text-sm leading-6 text-slate-600">{task.japanesePrompt}</p><p className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800">目安：{task.wordRange}</p><textarea value={draft} onChange={event => updateDraft(event.target.value)} placeholder="ここに英文を書こう…" className="mt-4 min-h-40 w-full rounded-2xl border-2 border-slate-200 p-4 text-base leading-7 text-slate-900 outline-none focus:border-amber-400" aria-label="英作文入力"/><div className="mt-2 flex justify-between text-sm"><span className={words > 0 ? 'text-slate-600' : 'text-slate-400'}>単語数：{words}</span><span className="text-slate-500">{draftSaved ? '保存済み' : '保存できませんでした'}</span></div><Button onClick={submit} disabled={!draft.trim()} className="mt-4 w-full bg-amber-600">答え合わせする</Button></section>{submitted && <section className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5"><p className="font-extrabold text-emerald-900">モデル答案</p><p className="mt-3 rounded-xl bg-white p-4 text-sm leading-7 text-slate-800">{task.modelAnswer}</p><p className="mt-3 text-sm leading-6 text-emerald-950">{task.explanation}</p><div className="mt-4 space-y-2">{task.checklist.map(item => <label key={item} className="flex min-h-11 items-center gap-3 rounded-xl bg-white p-3 text-sm font-bold text-slate-800"><input type="checkbox" checked={checks.includes(item)} onChange={event => setChecks(current => event.target.checked ? [...current, item] : current.filter(value => value !== item))} className="h-5 w-5"/>{item}</label>)}</div><Button onClick={next} disabled={checks.length !== task.checklist.length} className="mt-4 w-full bg-emerald-600">{index === eiken3WritingTasks.length - 1 ? '完了する' : '次の問題へ'}</Button></section>}</main></div>;
};

export default Eiken3WritingPage;
