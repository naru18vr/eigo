import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { createTransfer, importTransfer, readTransfer, verifyTransferChecksum } from '../services/learningTransferService';
import { copyTextToClipboard } from '../services/eiken4WorksheetService';

const LearningTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingState = useMemo(() => { const params = new URLSearchParams(location.search); const payload = params.get('data') || ''; const validChecksum = verifyTransferChecksum(payload, params.get('sig')); return { data: validChecksum ? readTransfer(payload) : null, damaged: Boolean(payload) && !validChecksum }; }, [location.search]);
  const incoming = incomingState.data;
  const transfer = useMemo(createTransfer, []);
  const [status, setStatus] = useState('');
  const copy = async () => {
    const message = `英語アプリ引き継ぎリンク（番号 ${transfer.code}）\n${transfer.link}`;
    if (await copyTextToClipboard(message)) setStatus('コピーしました！ Google Chatに貼り付けてください。');
    else { window.prompt('このリンクをコピーしてください', transfer.link); setStatus('リンクを長押ししてコピーしてください。'); }
  };
  const apply = () => {
    if (!incoming) return;
    const count = importTransfer(incoming);
    setStatus(`${count}件の学習記録を取り込みました。`);
    setTimeout(() => window.location.replace(`${window.location.origin}${window.location.pathname}#/eiken4`), 1000);
  };
  return <div className="flex-grow bg-slate-50 p-4"><div className="mx-auto max-w-xl">
    <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5" />英検4級に戻る</Button>
    {incomingState.damaged ? <section className="mt-5 rounded-3xl border border-rose-200 bg-white p-6 text-center shadow"><p className="text-sm font-bold text-rose-600">リンクが途中で切れています</p><h1 className="mt-2 text-2xl font-extrabold">安全のため取り込みませんでした</h1><p className="mt-3 text-sm text-slate-500">Google Chatの一番新しい報告から、リンク全体をもう一度開いてください。</p></section> : incoming ? <section className="mt-5 rounded-3xl bg-white p-6 text-center shadow"><p className="text-sm font-bold text-emerald-600">引き継ぎリンクを確認しました</p><h1 className="mt-2 text-2xl font-extrabold">この端末へ記録を取り込みますか？</h1><p className="mt-3 text-sm text-slate-500">チェックサム一致済み。この端末の記録と安全にまとめます。</p><Button onClick={apply} size="lg" className="mt-6 w-full rounded-2xl bg-emerald-600">取り込む</Button></section> : <>
      <header className="mt-4 rounded-3xl bg-gradient-to-br from-teal-700 to-emerald-500 p-6 text-white"><p className="text-sm font-bold text-teal-100">スマホ ↔ タブレット</p><h1 className="mt-1 text-3xl font-extrabold">記録の引き継ぎ</h1></header>
      <section className="mt-4 rounded-3xl bg-white p-6 text-center shadow"><p className="text-sm font-bold text-slate-500">今回の覚え番号</p><p className="mt-2 text-6xl font-black tracking-[.18em] text-teal-700">{transfer.code}</p><p className="mt-3 text-sm leading-6 text-slate-500">番号はリンクを見分ける目印です。実際の引き継ぎは、Google Chatで送ったリンクを押すだけです。</p><div className="mt-5 grid grid-cols-2 gap-2 text-left text-sm"><div className="rounded-xl bg-slate-50 p-3">学習日数<br/><b>{transfer.summary.activityDays}日</b></div><div className="rounded-xl bg-slate-50 p-3">習得単語<br/><b>{transfer.summary.masteredWords}語</b></div><div className="rounded-xl bg-slate-50 p-3">模試・過去問<br/><b>{transfer.summary.mockResults}回</b></div><div className="rounded-xl bg-slate-50 p-3">最新学習日<br/><b>{transfer.summary.latestLearningDate}</b></div></div><Button onClick={copy} size="lg" className="mt-6 w-full rounded-2xl bg-teal-600">引き継ぎリンクをコピー</Button><p className="mt-3 text-xs text-slate-400">学習記録 {transfer.itemCount}件・圧縮後 {Math.round(transfer.compressionRatio * 100)}%・破損検査つき</p>{transfer.isLong && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-left text-sm font-bold text-amber-800">記録が多くリンクが長くなっています。Google Chatへ貼った後、末尾までリンク色になっていることを確認してください。</div>}</section>
    </>}
    {status && <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-center font-bold text-emerald-700">{status}</p>}
  </div></div>;
};
export default LearningTransferPage;
