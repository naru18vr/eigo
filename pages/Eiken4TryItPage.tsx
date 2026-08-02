import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import {
  EIKEN4_GRAMMAR_VIDEOS,
  getEiken4GrammarGuideCategoryId,
  type Eiken4GrammarVideo,
} from '../data/eiken4GrammarVideos';
import {
  getAllGrammarVideoProgress,
  markGrammarVideoOpened,
} from '../services/eiken4GrammarVideoProgressService';

type Filter = 'all' | 'required' | 'optional' | 'unopened' | 'confirmed';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'required', label: '必須動画' },
  { id: 'optional', label: '補助動画' },
  { id: 'unopened', label: 'まだ見ていない' },
  { id: 'confirmed', label: '確認済み' },
];

const chapterNumbers = Array.from(new Set(EIKEN4_GRAMMAR_VIDEOS.map(video => video.chapter))).sort((a, b) => a - b);

const getVideoState = (video: Eiken4GrammarVideo, progress: ReturnType<typeof getAllGrammarVideoProgress>) => {
  const item = progress[video.id];
  if (item?.confirmed) return '確認できた！';
  if (item?.opened) return '開いたよ';
  return 'まだ';
};

const getInitialChapter = (progress: ReturnType<typeof getAllGrammarVideoProgress>) => {
  return EIKEN4_GRAMMAR_VIDEOS.find(video => video.required && !progress[video.id]?.confirmed)?.chapter
    ?? EIKEN4_GRAMMAR_VIDEOS[0]?.chapter
    ?? 1;
};

const Eiken4TryItPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [videoRevision, setVideoRevision] = useState(0);
  const progress = useMemo(() => getAllGrammarVideoProgress(), [videoRevision]);
  const [openChapters, setOpenChapters] = useState<Set<number>>(() => new Set([getInitialChapter(progress)]));

  // 別タブの文法ガイドで確認した状態も、一覧へ戻ったときに反映する。
  useEffect(() => {
    const refresh = () => setVideoRevision(value => value + 1);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
    };
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleVideos = useMemo(() => EIKEN4_GRAMMAR_VIDEOS.filter(video => {
    const item = progress[video.id];
    const matchesFilter = filter === 'all'
      || (filter === 'required' && video.required)
      || (filter === 'optional' && !video.required)
      || (filter === 'unopened' && !item?.opened)
      || (filter === 'confirmed' && Boolean(item?.confirmed));
    const searchable = `${video.title} ${video.chapterTitle} ${video.grammarId}`.toLocaleLowerCase();
    return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
  }), [filter, normalizedQuery, progress]);
  const requiredVideos = useMemo(() => EIKEN4_GRAMMAR_VIDEOS.filter(video => video.required), []);
  const confirmedRequiredCount = useMemo(() => requiredVideos.filter(video => progress[video.id]?.confirmed).length, [progress, requiredVideos]);
  const visibleChapterNumbers = chapterNumbers.filter(chapter => visibleVideos.some(video => video.chapter === chapter));

  const toggleChapter = (chapter: number) => {
    setOpenChapters(previous => {
      const next = new Set(previous);
      if (next.has(chapter)) next.delete(chapter);
      else next.add(chapter);
      return next;
    });
  };

  const openVideo = (video: Eiken4GrammarVideo) => {
    markGrammarVideoOpened(video.id, video.grammarId);
    setVideoRevision(value => value + 1);
  };

  return <div className="flex-grow bg-gradient-to-b from-indigo-50 via-slate-50 to-white px-4 py-5 sm:p-7">
    <main className="mx-auto max-w-2xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="min-h-11">
        <ArrowLeftIcon className="mr-2 h-5 w-5" />英検4級トップへ戻る
      </Button>

      <header className="mt-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white shadow-xl">
        <p className="text-xs font-bold tracking-widest text-indigo-100">TRY-IT VIDEOS</p>
        <h1 className="mt-2 text-3xl font-extrabold">トライイット動画一覧</h1>
        <p className="mt-3 leading-7 text-indigo-50">英検4級の学習で使う動画だよ。<br />見たい単元を選んでね。</p>
        <p className="mt-4 text-xs leading-5 text-indigo-100">※トライイットへのログインが必要です。<br />※動画は新しいタブで開きます。</p>
      </header>

      <section className="mt-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4" aria-label="必須動画の進み具合">
        <p className="text-sm font-extrabold text-emerald-950">必須動画の進み具合</p>
        <p className="mt-1 text-2xl font-extrabold text-emerald-800">{confirmedRequiredCount} / {requiredVideos.length} 確認できた！</p>
        <p className="mt-1 text-xs text-emerald-900">動画を開いただけでは完了にならないよ。動画のあとに確認問題へ進もう。</p>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="try-it-search" className="text-sm font-bold text-slate-800">動画を探す</label>
        <input id="try-it-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="動画タイトルを検索" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
        <div className="mt-3 flex flex-wrap gap-2" aria-label="動画の絞り込み">
          {filters.map(item => <button key={item.id} type="button" onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} className={`min-h-11 rounded-full border px-4 text-sm font-bold ${filter === item.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>{item.label}</button>)}
        </div>
      </section>

      <section className="mt-6 space-y-3">
        {visibleChapterNumbers.map(chapter => {
          const videos = visibleVideos.filter(video => video.chapter === chapter).sort((a, b) => a.order - b.order);
          const chapterTitle = EIKEN4_GRAMMAR_VIDEOS.find(video => video.chapter === chapter)?.chapterTitle || '';
          const open = openChapters.has(chapter);
          return <article key={chapter} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button type="button" onClick={() => toggleChapter(chapter)} aria-expanded={open} className="flex min-h-14 w-full items-center justify-between gap-3 p-4 text-left">
              <span className="font-extrabold text-slate-900">第{chapter}章　{chapterTitle} <span className="ml-1 text-sm font-bold text-slate-500">{videos.length}本</span></span>
              <ChevronRightIcon className={`h-6 w-6 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            {open && <div className="space-y-3 border-t border-slate-100 p-3 sm:p-4">{videos.map(video => {
              const state = getVideoState(video, progress);
              const guideCategoryId = getEiken4GrammarGuideCategoryId(video.grammarId);
              return <article key={video.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold text-indigo-700">第{video.chapter}章　{video.chapterTitle}</p>
                <h2 className="mt-1 text-base font-extrabold leading-6 text-slate-900">{video.title}</h2>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                  <span className={`rounded-full px-2 py-1 ${video.required ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'}`}>{video.required ? '必須動画' : '補助動画'}</span>
                  {!video.required && <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-900">もっと詳しく知りたいとき</span>}
                  <span className="rounded-full bg-white px-2 py-1 text-slate-700">状態：{state}</span>
                </div>
                <div className="mt-3 grid gap-2">
                  <a href={video.url} target="_blank" rel="noopener noreferrer" onClick={() => openVideo(video)} className="flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-center font-bold text-white">動画を見る</a>
                  <p className="text-center text-xs text-slate-600">※トライイットへのログインが必要です</p>
                  {guideCategoryId && <button type="button" onClick={() => navigate(`/eiken4/grammar-guide/${guideCategoryId}`)} className="min-h-11 rounded-xl border border-indigo-300 bg-white px-4 font-bold text-indigo-800">この文法を学習する</button>}
                </div>
              </article>;
            })}</div>}
          </article>;
        })}
        {!visibleChapterNumbers.length && <div className="rounded-2xl bg-white p-7 text-center shadow-sm"><p className="font-extrabold text-slate-900">見つかる動画がないよ。</p><p className="mt-2 text-sm text-slate-600">検索語や絞り込みを変えてみてね。</p></div>}
      </section>
    </main>
  </div>;
};

export default Eiken4TryItPage;
