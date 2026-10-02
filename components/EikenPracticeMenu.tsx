import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChevronRightIcon from './shared/ChevronRightIcon';
const groups = ['文法', '単語・読む聞く', '本番対策', '記録'] as const;
type Item = { group: number; path:string; title:string; hint:string; icon:string };
const common: Item[] = [
  {group:0,path:'grammar-practice-select',title:'文法を選んで練習',hint:'同じ文法を練習する・10問ずつ',icon:'✏️'},
  {group:0,path:'sentences',title:'英文を並べ替える',hint:'単語をタップして文を作ろう・5問',icon:'🧩'},
  {group:0,path:'try-it',title:'トライイット動画を見る',hint:'動画一覧を見る・章ごとにえらぶ',icon:'🎥'},
  {group:0,path:'grammar-guide',title:'説明と確認問題',hint:'分からないところを読んで確認',icon:'📖'},
  {group:0,path:'mixed-review',title:'習った文法のまとめ問題',hint:'習った文法をまぜて練習しよう',icon:'🔀'},
  {group:0,path:'daily',title:'今日の復習問題',hint:'間違えた問題・忘れかけた問題',icon:'🔄'},
  {group:0,path:'grade1-review',title:'中1のおさらい',hint:'基礎からゆっくり確認',icon:'🌱'},
  {group:1,path:'words',title:'英単語カード',hint:'音を聞いてから確認テスト',icon:'🔤'},
  {group:1,path:'words/quiz',title:'英単語の確認テスト',hint:'覚えた単語を確かめよう',icon:'✅'},
  {group:1,path:'word-challenge',title:'単語をいろんな形で練習',hint:'意味・つづり・聞き取り',icon:'🎯'},
  {group:1,path:'word-map',title:'英単語マップ',hint:'覚えた単語を見る',icon:'🗺️'},
  {group:1,path:'reading',title:'ミニ長文',hint:'読む練習・英文1題',icon:'📚'},
  {group:1,path:'listening-practice',title:'聞く問題',hint:'音声を聞いて答えよう',icon:'🎧'},
  {group:1,path:'listening-focus',title:'聞き取りの苦手を練習',hint:'分からなかったところを確認',icon:'👂'},
  {group:2,path:'full-mock',title:'フル模試',hint:'時間をはかって通し練習',icon:'🏁'},
  {group:2,path:'past-papers',title:'公式過去問',hint:'公式問題を開く・結果を記録',icon:'📝'},
  {group:2,path:'mock',title:'10分ミニ模試',hint:'短い力試しから始めよう',icon:'⏱️'},
  {group:2,path:'exam-practice',title:'本番形式10問',hint:'文法・会話を確認',icon:'🎯'},
  {group:2,path:'weakness',title:'間違い直し',hint:'苦手だった問題に再挑戦',icon:'💪'},
  {group:2,path:'worksheet',title:'紙の練習プリント',hint:'印刷して書いて練習',icon:'📄'},
  {group:3,path:'progress',title:'学習記録を見る',hint:'進み具合・試験日を設定',icon:'📊'},
  {group:3,path:'result',title:'おうちの人へ報告する',hint:'今日の結果をコピー',icon:'💌'},
  {group:3,path:'/transfer',title:'端末を変える・引き継ぐ',hint:'スマホとタブレットの記録を統合',icon:'📱'},
  {group:3,path:'/storage-recovery',title:'学習記録を守る・直す',hint:'保存できないときはこちら',icon:'🛟'},
  {group:3,path:'course',title:'追加の練習メニュー',hint:'1日の練習を順番に確認',icon:'📋'},
];
const EikenPracticeMenu: React.FC<{level:3|4;resetSession:()=>void}> = ({level,resetSession}) => {
  const [group,setGroup]=useState(0); const [query,setQuery]=useState('');
  const items=level===3 ? [...common,{group:2,path:'writing',title:'英作文',hint:'Eメール・自分の意見を書く',icon:'✍️'},{group:2,path:'speaking',title:'面接練習',hint:'音読して、声に出して答える',icon:'🗣️'}] : common;
  const matching=items.filter(item=>query.trim() ? `${item.title} ${item.hint}`.includes(query.trim()) : item.group===group);
  return <section className="mt-7" aria-labelledby="practice-menu-heading"><h2 id="practice-menu-heading" className="text-xl font-extrabold text-slate-900">やりたい練習をえらぼう</h2><p className="mt-1 text-sm text-slate-500">文法・単語・模試。好きな練習へすぐ進めるよ。</p><div className="purpose-tabs mt-4" aria-label="練習の種類">{groups.map((label,index)=><button key={label} type="button" aria-pressed={group===index && !query} onClick={()=>{setGroup(index);setQuery('');}}>{label}</button>)}</div><label className="mt-3 block"><span className="sr-only">練習メニューを探す</span><input className="practice-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="練習を探す（例：模試、単語）"/></label><div className="mt-3 space-y-2" aria-live="polite">{matching.map(item=><Link key={item.path} to={item.path.startsWith('/')?item.path:`/eiken${level}/${item.path}`} onClick={()=>{if(item.path==='words')resetSession();}} className="menu-row"><span className="menu-icon" aria-hidden="true">{item.icon}</span><span className="min-w-0 flex-1"><strong>{item.title}</strong><small>{item.hint}</small></span><ChevronRightIcon className="h-5 w-5 shrink-0 text-slate-400"/></Link>)}{!matching.length&&<div className="rounded-2xl bg-white p-5 text-sm text-slate-600"><p>見つからなかったよ。別の言葉で探してみよう。</p><button type="button" onClick={()=>setQuery('')} className="mt-2 font-bold text-indigo-700">検索を消してメニューへ戻る</button></div>}</div></section>;
};
export default EikenPracticeMenu;
