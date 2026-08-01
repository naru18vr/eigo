import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import SpeakerWaveIcon from '../components/shared/SpeakerWaveIcon';
import { speakText } from '../services/speechService';
import type { Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { getGrammarGuideCheckQuestions, type GrammarGuideCheckQuestion } from '../data/eiken4GrammarGuideData';
import { getEiken4GrammarVideos } from '../data/eiken4GrammarVideos';
import { getEiken4GrammarCategoriesForGuideTopic, getEiken4GrammarCategoryForGuideTopic, getGrammarCategory } from '../services/eiken4GrammarPracticeService';
import { recordLearningGrammarGuideCheck } from '../services/eiken4StepLearningService';
import { markGrammarGuideCompleted, markGrammarGuideStarted } from '../services/eiken4GrammarProgressService';
import { getGrammarVideoProgress, markGrammarVideoConfirmed, markGrammarVideoOpened } from '../services/eiken4GrammarVideoProgressService';

type Topic = {
  id: string; title: string; level: string; meaning: string; rule: string;
  examples: { en: string; ja: string }[]; mistake: string; tip: string;
};

type TopicCheckState = {
  index: number;
  answers: Record<string, string>;
  result?: 'passed' | 'failed';
};

const topics: Topic[] = [
  { id:'basic', title:'基本の文・たずねる文', level:'最初にここから', meaning:'「私は〜です」と「私は〜します」の2つの形から始めよう。何かをたずねるときは、文のはじめに What や How を置くよ。', rule:'am / is / are は「〜です」。play や study は「する」。毎日のことは動詞をそのまま使うことが多いよ。', examples:[{en:'I am happy.',ja:'私はうれしいです。'},{en:'I study English every day.',ja:'私は毎日英語を勉強します。'}], mistake:'I studying English every day. は×。毎日のことなら I study English every day.。', tip:'文のはじめに、だれのことかを置いてから、動きや様子を言おう。' },
  { id:'present-progressive', title:'現在進行形', level:'大事', meaning:'今している途中のことを表します。', rule:'am / is / are + 動詞ing。「今」を表す now があるときによく使います。', examples:[{en:'I am studying now.',ja:'私は今勉強しています。'},{en:'They are playing soccer.',ja:'彼らはサッカーをしています。'}], mistake:'I am study now. は×。be動詞の後は studying のように ing をつけます。', tip:'now や look が見えたら、be動詞 + ing を考えよう。' },
  { id:'past', title:'過去形・過去進行形', level:'最重要', meaning:'「昨日した」「そのとき、している途中だった」を表します。', rule:'ふつうの過去は 動詞の過去形。途中だった動作は was / were + 動詞ing。疑問文は Did + 主語 + 動詞の原形？', examples:[{en:'I visited Kyoto yesterday.',ja:'私は昨日、京都を訪れました。'},{en:'I was studying at eight.',ja:'私は8時に勉強しているところでした。'}], mistake:'Did you went? は×。Didを使ったら動詞は原形なので Did you go?。', tip:'yesterday、last week、ago が見えたら過去を疑おう。' },
  { id:'future', title:'未来 will / be going to', level:'最重要', meaning:'「〜するつもり」「〜するでしょう」と、これからのことを表します。', rule:'will + 動詞の原形。または am / is / are going to + 動詞の原形。', examples:[{en:'I will help you.',ja:'私があなたを手伝います。'},{en:'We are going to play tennis.',ja:'私たちはテニスをする予定です。'}], mistake:'willの後を plays や played にしない。必ず動詞の原形。', tip:'その場で決めたことはwill、前からの予定はbe going toが基本。' },
  { id:'infinitive', title:'to不定詞', level:'最重要', meaning:'to + 動詞で「〜すること」「〜するために」「〜するための」を表せます。', rule:'want to、like to、need to のまとまりを先に覚えると簡単です。toの後は動詞の原形。', examples:[{en:'I want to be a doctor.',ja:'私は医者になりたいです。'},{en:'I went to the library to study.',ja:'私は勉強するために図書館へ行きました。'}], mistake:'want play は×。want to play とします。', tip:'want / hope / need の後に空所があれば to + 動詞を考えよう。' },
  { id:'gerund', title:'動名詞（動詞ing）', level:'重要', meaning:'動詞にingをつけて「〜すること」という名詞のように使います。', rule:'enjoy / finish / practice の後は 動詞ing。likeの後は to不定詞も動名詞も使えます。', examples:[{en:'I enjoy reading books.',ja:'私は本を読むことを楽しみます。'},{en:'She finished doing her homework.',ja:'彼女は宿題をし終えました。'}], mistake:'enjoy to play は学校英語では×。enjoy playing。', tip:'enjoyを見たら、次の動詞はingと覚えよう。' },
  { id:'comparison', title:'比較級・最上級', level:'最重要', meaning:'2つを比べる「より〜」、3つ以上で「いちばん〜」を表します。', rule:'短い語は -er / -est。長い語は more / most。比較級にはthan、最上級にはtheを使います。', examples:[{en:'Tom is taller than Ken.',ja:'トムはケンより背が高いです。'},{en:'This is the most popular song.',ja:'これはいちばん人気のある歌です。'}], mistake:'more taller は×。tallerだけで「より高い」です。', tip:'good → better → best、many → more → most は特別なので暗記。' },
  { id:'modal', title:'助動詞 must / have to / may', level:'最重要', meaning:'must・have toは「〜しなければならない」、mayは「〜してもよい／〜かもしれない」。', rule:'助動詞の後は動詞の原形。must not は「してはいけない」、do not have to は「しなくてもよい」で意味が違います。', examples:[{en:'You must do your homework.',ja:'あなたは宿題をしなければなりません。'},{en:'You do not have to hurry.',ja:'急ぐ必要はありません。'}], mistake:'must not と do not have to を同じ意味にしない。禁止と「必要なし」の違い。', tip:'英検ではこの意味の違いがよく問われます。' },
  { id:'conjunction', title:'接続詞 when / if / because / that', level:'最重要', meaning:'2つの文を「〜するとき」「もし」「なぜなら」「〜ということ」でつなぎます。', rule:'when=〜するとき、if=もし〜なら、because=〜なので、I think that...=私は〜と思う。', examples:[{en:'Call me when you get home.',ja:'家に着いたら電話して。'},{en:'I stayed home because it was raining.',ja:'雨だったので家にいました。'}], mistake:'未来のことでも when / if の中は基本的に現在形。when you will get home ではなく when you get home。', tip:'空所の前後が文なら、意味に合う接続詞を選ぶ。' },
  { id:'give', title:'give / show / tell + 人 + もの', level:'重要', meaning:'「人にものをあげる・見せる・伝える」の語順です。', rule:'give me a book = give a book to me。show me the picture、tell me the story も同じ語順。', examples:[{en:'My father gave me this bag.',ja:'父は私にこのかばんをくれました。'},{en:'Please show me your ticket.',ja:'私に切符を見せてください。'}], mistake:'explain me は×。explain it to me の形にします。', tip:'give / show / tell の直後に「人」が来る形を覚えよう。' },
  { id:'there', title:'There is / There are', level:'基礎確認', meaning:'「〜があります・います」と、初めて話題に出すものの存在を伝えます。', rule:'1つなら There is、2つ以上なら There are。過去は There was / There were。', examples:[{en:'There is a park near here.',ja:'この近くに公園があります。'},{en:'There were many people.',ja:'たくさんの人がいました。'}], mistake:'There is two books は×。複数なので There are two books。', tip:'直後の名詞が1つか複数かを見る。' },
];

type GrammarGuideCheckSectionProps = {
  topicId: string;
  questions: GrammarGuideCheckQuestion[];
  checkState: TopicCheckState;
  currentQuestion?: GrammarGuideCheckQuestion;
  picked?: string;
  correct: boolean;
  correctCount: number;
  result?: 'passed' | 'failed';
  requiredReady: boolean;
  categories: ReturnType<typeof getEiken4GrammarCategoriesForGuideTopic>;
  onAnswer: (question: GrammarGuideCheckQuestion, choice: string) => void;
  onNext: () => void;
  onReset: () => void;
  onScrollVideos: () => void;
  onScrollExplanation: () => void;
  onStartPractice: (categoryId: Eiken4GrammarCategoryId) => void;
};

const GrammarGuideCheckSection: React.FC<GrammarGuideCheckSectionProps> = ({
  topicId, questions, checkState, currentQuestion, picked, correct, correctCount, result,
  requiredReady, categories, onAnswer, onNext, onReset, onScrollVideos, onScrollExplanation, onStartPractice,
}) => <div id={`grammar-check-${topicId}`} className="mt-5 rounded-xl border-2 border-violet-200 bg-violet-50 p-4">
  <p className="text-xs font-bold text-violet-600">確認問題 {result ? questions.length : Math.min(checkState.index + 1, questions.length)} / {questions.length}</p>
  {!requiredReady && !result && <p className="mt-2 rounded-lg bg-indigo-100 p-3 text-sm font-bold text-indigo-900">まず動画を見てから確認問題へ進もう。動画を使えないときは、上の「説明を読む」を押せます。</p>}
  {result === 'passed' && <div className="mt-3 rounded-xl bg-emerald-100 p-4 text-sm text-emerald-950"><p className="font-extrabold">動画の内容を確認できたよ。</p><p className="mt-1">{questions.length}問中{correctCount}問正解。つぎは同じ文法を問題で練習しよう。</p><div className="mt-4 grid gap-2">{categories.map(category => <Button key={category.id} onClick={() => onStartPractice(category.id)} className="w-full">{categories.length === 1 ? 'この文法を練習する' : `${category.title}を練習する`}</Button>)}</div></div>}
  {result === 'failed' && <div className="mt-3 rounded-xl bg-amber-100 p-4 text-sm text-amber-950"><p className="font-extrabold">もう一度ポイントを確認しよう。</p><p className="mt-1">{questions.length}問中{correctCount}問正解でした。動画や説明をもう一度確認してみよう。</p><div className="mt-4 grid gap-2"><button type="button" onClick={onScrollVideos} className="min-h-11 rounded-xl bg-white px-4 font-bold text-indigo-800">動画をもう一度見る</button><button type="button" onClick={onScrollExplanation} className="min-h-11 rounded-xl bg-white px-4 font-bold text-indigo-800">説明を読み直す</button><button type="button" onClick={onReset} className="min-h-11 rounded-xl border border-amber-400 bg-amber-200 px-4 font-bold text-amber-950">確認問題をやり直す</button></div></div>}
  {!result && currentQuestion && <><p className="mt-3 font-bold text-slate-800">{currentQuestion.prompt}</p><div className="mt-3 grid gap-2">{currentQuestion.choices.map(choice => <button type="button" key={choice} disabled={Boolean(picked) || !requiredReady} onClick={() => onAnswer(currentQuestion, choice)} className={`min-h-11 rounded-lg border p-3 text-left font-semibold ${picked && choice === currentQuestion.correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : picked === choice ? 'border-rose-500 bg-rose-50 text-rose-800' : !requiredReady ? 'border-slate-200 bg-slate-100 text-slate-400' : 'border-violet-200 bg-white text-slate-700'}`}>{choice}</button>)}</div>{picked && <div className={`mt-3 rounded-lg p-3 ${correct ? 'bg-emerald-100' : 'bg-amber-100'}`}><p className="font-bold">{correct ? '正解！' : 'もう一度ポイントを確認しよう。'}</p><p className="mt-1 text-sm">{correct ? currentQuestion.explanation : `正解：${currentQuestion.correctAnswer}。${currentQuestion.explanation}`}</p><p className="mt-2 text-sm font-bold">{checkState.index < questions.length - 1 ? 'つぎの問題へ進もう。' : '最後の問題です。確認結果を見よう。'}</p><button type="button" onClick={onNext} className="mt-3 min-h-11 w-full rounded-xl bg-violet-600 px-4 font-bold text-white">次の確認問題へ</button></div>}</>}
</div>;

const Eiken4GrammarGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { grammarId } = useParams<{ grammarId: string }>();
  const searchParams = new URLSearchParams(location.search);
  const requestedCategory = grammarId || searchParams.get('category');
  const categoryFromRoute = requestedCategory ? getGrammarCategory(requestedCategory) : undefined;
  const requestedTopic = categoryFromRoute?.guideTopic || searchParams.get('topic');
  const guideTopicCategory = categoryFromRoute || (requestedTopic ? getEiken4GrammarCategoryForGuideTopic(requestedTopic) : undefined);
  const [openId, setOpenId] = useState<string | null>(topics.some(topic => topic.id === requestedTopic) ? requestedTopic : topics[0].id);
  const [checkStates, setCheckStates] = useState<Record<string, TopicCheckState>>({});
  const [videoFallback, setVideoFallback] = useState<Record<string, boolean>>({});
  const [, setVideoRevision] = useState(0);
  useEffect(() => {
    if (guideTopicCategory) markGrammarGuideStarted(guideTopicCategory.id);
  }, [guideTopicCategory?.id]);
  useEffect(() => {
    setCheckStates({});
    setVideoFallback({});
  }, [requestedCategory, requestedTopic]);
  const recordGuideCompletion = (categoryId: Eiken4GrammarCategoryId) => {
    markGrammarGuideCompleted(categoryId);
    recordLearningGrammarGuideCheck(categoryId);
  };
  const openVideo = (videoId: string, grammarId: string) => {
    markGrammarVideoOpened(videoId, grammarId);
    setVideoRevision(value => value + 1);
  };
  const confirmRequiredVideos = (videos: ReturnType<typeof getEiken4GrammarVideos>) => {
    // 確認問題の合格後に、開いた必須動画だけを確認済みにする。補助動画は自動完了しない。
    videos.filter(video => video.required && getGrammarVideoProgress(video.id)?.opened).forEach(video => markGrammarVideoConfirmed(video.id, video.grammarId));
  };
  const answerCheck = (topicId: string, question: GrammarGuideCheckQuestion, choice: string) => {
    setCheckStates(previous => {
      const current = previous[topicId] || { index: 0, answers: {} };
      return { ...previous, [topicId]: { ...current, answers: { ...current.answers, [question.id]: choice }, result: undefined } };
    });
  };
  const resetChecks = (topicId: string) => setCheckStates(previous => ({ ...previous, [topicId]: { index: 0, answers: {} } }));
  const finishOrAdvanceCheck = (topicId: string, questions: GrammarGuideCheckQuestion[], videos: ReturnType<typeof getEiken4GrammarVideos>, categories: ReturnType<typeof getEiken4GrammarCategoriesForGuideTopic>) => {
    const current = checkStates[topicId] || { index: 0, answers: {} };
    const currentQuestion = questions[current.index];
    if (!currentQuestion || !current.answers[currentQuestion.id]) return;
    if (current.index < questions.length - 1) {
      setCheckStates(previous => ({ ...previous, [topicId]: { ...current, index: current.index + 1 } }));
      return;
    }
    const correctCount = questions.filter(question => current.answers[question.id] === question.correctAnswer).length;
    const answeredCount = Object.keys(current.answers).length;
    const passed = questions.length > 0 && answeredCount === questions.length && correctCount / questions.length >= 0.8;
    if (passed) {
      confirmRequiredVideos(videos);
      [...categories].reverse().forEach(category => recordGuideCompletion(category.id));
    }
    setCheckStates(previous => ({ ...previous, [topicId]: { ...current, result: passed ? 'passed' : 'failed' } }));
  };
  const handleStartPractice = (categoryId: Eiken4GrammarCategoryId) => {
    recordGuideCompletion(categoryId);
    navigate(`/eiken4/grammar-practice/${categoryId}`);
  };
  if (grammarId && !categoryFromRoute) return <div className="flex-grow bg-slate-50 p-4"><main className="mx-auto max-w-xl"><section className="mt-12 rounded-3xl bg-white p-7 text-center shadow"><h1 className="text-2xl font-extrabold text-slate-900">この文法は見つかりませんでした。</h1><p className="mt-3 text-slate-600">文法を選び直してね。</p><Button onClick={() => navigate('/eiken4/grammar-practice-select')} className="mt-6 w-full">文法選択へ戻る</Button><Button onClick={() => navigate('/eiken4')} variant="ghost" className="mt-2 w-full">英検4級トップへ戻る</Button></section></main></div>;
  return <div className="flex-grow bg-gradient-to-b from-cyan-50 to-white p-4 sm:p-6">
    <div className="mx-auto max-w-2xl">
      <Button onClick={() => navigate(requestedCategory ? '/eiken4/grammar-practice-select' : '/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="h-5 w-5 mr-2"/>{requestedCategory ? '文法選択へ戻る' : '英検4級に戻る'}</Button>
      <header className="mt-4 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white shadow-xl">
        <p className="text-xs font-bold tracking-widest text-cyan-100">ZERO-START GRAMMAR</p><h1 className="mt-2 text-3xl font-bold">はじめての英検4級文法</h1><p className="mt-3 leading-7 text-cyan-50">まず動画を見て、説明と確認問題で分かったか確かめよう。<br />そのあと、同じ文法を問題で練習するよ。</p>
      </header>
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-bold">おすすめの使い方</p><p className="mt-1">動画を見る → 説明と確認問題に取り組む → 同じ文法を練習する。全部を一度に暗記しなくてOKです。</p></div>
      <div className="mt-5 space-y-3">{topics.map((topic,index) => {
        const open = openId === topic.id;
        const questions = getGrammarGuideCheckQuestions(topic.id);
        const checkState = checkStates[topic.id] || { index: 0, answers: {} };
        const currentQuestion = questions[checkState.index];
        const picked = currentQuestion ? checkState.answers[currentQuestion.id] : undefined;
        const correct = picked === currentQuestion?.correctAnswer;
        const checkResult = checkState.result;
        const correctCount = questions.filter(question => checkState.answers[question.id] === question.correctAnswer).length;
        const allCategories = getEiken4GrammarCategoriesForGuideTopic(topic.id);
        const selectedCategory = allCategories.find(category => category.id === requestedCategory);
        const categories = selectedCategory ? [selectedCategory] : allCategories;
        const videos = Array.from(new Map(categories.flatMap(category => getEiken4GrammarVideos(category.id)).map(video => [video.id, video])).values());
        const requiredVideos = videos.filter(video => video.required);
        const optionalVideos = videos.filter(video => !video.required);
        const openedRequiredCount = requiredVideos.filter(video => getGrammarVideoProgress(video.id)?.opened).length;
        const requiredReady = Boolean(videoFallback[topic.id]) || openedRequiredCount === requiredVideos.length;
        const currentVideo = requiredVideos.find(video => !getGrammarVideoProgress(video.id)?.opened);
        return <article key={topic.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button onClick={() => setOpenId(open ? null : topic.id)} className="flex w-full items-center gap-3 p-4 text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-800">{index+1}</span><div className="flex-grow"><p className="text-xs font-bold text-cyan-700">{topic.level}</p><h2 className="text-lg font-bold text-slate-800">{topic.title}</h2></div><ChevronRightIcon className={`h-6 w-6 text-slate-400 transition-transform ${open?'rotate-90':''}`}/></button>
          {open && <div className="border-t border-slate-100 p-5">
            <p id={`grammar-explanation-${topic.id}`} className="text-lg font-bold leading-8 text-slate-800">{topic.meaning}</p>
            {videos.length > 0 && <section id={`grammar-videos-${topic.id}`} className="mt-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4"><p className="text-xs font-bold tracking-wide text-indigo-700">{requiredVideos.length > 0 ? 'まず、この動画を見よう' : 'もっと詳しく知りたいとき'}</p><p className="mt-1 text-sm leading-6 text-indigo-950">トライイットの動画で、文法の形を先に確認できます。</p>{requiredVideos.length > 0 && <p className="mt-2 text-xs font-bold text-indigo-800">必須動画 {openedRequiredCount} / {requiredVideos.length} 本を開きました</p>}<div className="mt-3 space-y-2">{requiredVideos.map((video, videoIndex) => { const progress = getGrammarVideoProgress(video.id); const active = !progress?.opened && video.id === currentVideo?.id; return <div key={video.id} className={`rounded-xl border p-3 ${active ? 'border-indigo-400 bg-white shadow-sm' : 'border-indigo-100 bg-indigo-50/60'}`}><p className="text-xs font-bold text-indigo-700">{videoIndex + 1} / {requiredVideos.length}　{active ? 'つぎに見る動画' : progress?.opened ? '開いたよ' : '順番に見よう'}</p><p className="mt-1 font-bold leading-6 text-slate-900">「{video.title}」</p>{active || progress?.opened ? <a href={video.url} target="_blank" rel="noopener noreferrer" onClick={() => openVideo(video.id, video.grammarId)} className={`mt-2 flex min-h-11 items-center justify-center rounded-xl px-4 text-center font-bold ${active ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 underline'}`}>{active ? 'トライイットで動画を見る' : 'もう一度動画を見る'}</a> : null}</div>; })}</div>{videos.some(video => video.loginRequired) && <p className="mt-3 text-xs leading-5 text-indigo-900">※トライイットへのログインが必要です。<br/>※動画は新しいタブで開きます。<br/>※見終わったら、このページに戻って確認問題を解こう。</p>}{requiredVideos.length > 0 && requiredReady && <div className="mt-4 rounded-xl bg-emerald-100 p-3 text-sm font-bold text-emerald-900"><p>動画を見終わったかな？</p><p className="mt-1 font-normal">分かったか確認問題を解いてみよう。</p><button onClick={() => document.getElementById(`grammar-check-${topic.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="mt-3 min-h-11 w-full rounded-xl bg-emerald-600 px-4 font-bold text-white">確認問題へ進む</button></div>}{requiredVideos.length > 0 && !requiredReady && <button onClick={() => { setVideoFallback(value => ({ ...value, [topic.id]: true })); document.getElementById(`grammar-check-${topic.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="mt-4 min-h-11 w-full rounded-xl border border-indigo-300 bg-white px-4 text-sm font-bold text-indigo-800">動画を見られないときは説明を読む</button>}{optionalVideos.length > 0 && <div className="mt-4 border-t border-indigo-200 pt-3"><p className="text-xs font-bold text-indigo-800">もっと詳しく知りたいとき</p>{optionalVideos.map(video => <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" onClick={() => openVideo(video.id, video.grammarId)} className="mt-2 block rounded-lg bg-white p-3 text-sm font-bold text-indigo-700 underline">{video.title}</a>)}</div>}</section>}
            <div className="mt-4 rounded-xl bg-blue-50 p-4"><p className="text-xs font-bold text-blue-600">作り方</p><p className="mt-1 leading-7 text-blue-950">{topic.rule}</p></div>
            <div className="mt-4 space-y-3">{topic.examples.map(example=><div key={example.en} className="rounded-xl border border-slate-200 p-3"><div className="flex items-start justify-between gap-2"><p className="font-bold text-slate-800">{example.en}</p><button onClick={()=>speakText(example.en,'en-US',.8)} aria-label="例文を聞く" className="shrink-0 rounded-full bg-indigo-50 p-2 text-indigo-700"><SpeakerWaveIcon className="h-5 w-5"/></button></div><p className="mt-1 text-sm text-slate-600">{example.ja}</p></div>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-900"><p className="font-bold">よくある間違い</p><p className="mt-1">{topic.mistake}</p></div><div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900"><p className="font-bold">英検での見つけ方</p><p className="mt-1">{topic.tip}</p></div></div>
            <GrammarGuideCheckSection topicId={topic.id} questions={questions} checkState={checkState} currentQuestion={currentQuestion} picked={picked} correct={correct} correctCount={correctCount} result={checkResult} requiredReady={requiredReady} categories={categories} onAnswer={(question, choice) => answerCheck(topic.id, question, choice)} onNext={() => finishOrAdvanceCheck(topic.id, questions, videos, categories)} onReset={() => resetChecks(topic.id)} onScrollVideos={() => document.getElementById(`grammar-videos-${topic.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} onScrollExplanation={() => document.getElementById(`grammar-explanation-${topic.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} onStartPractice={handleStartPractice} />
          </div>}
        </article>;
      })}</div>
      <Button onClick={() => navigate('/eiken4/sentences')} className="mt-6 w-full" size="lg">並べ替え問題で練習する</Button>
    </div>
  </div>;
};
export default Eiken4GrammarGuidePage;
