import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import GradeCard from '../components/GradeCard';
import ChevronRightIcon from '../components/shared/ChevronRightIcon';
import { getLightweightNextStep, getLightweightTodayCourseSteps } from '../services/eiken4CourseSummaryService';
import { getLightweightNextStep as getNext3, getLightweightTodayCourseSteps as getSteps3 } from '../services/eiken3CourseSummaryService';

const HomePage: React.FC = () => {
  const { grades } = useAppContext();
  const completed4 = getLightweightTodayCourseSteps().filter(step => step.done).length;
  const completed3 = getSteps3().filter(step => step.done).length;
  // Show a continuation only when there is real progress, and identify its course.
  const active = completed3 > completed4 ? 3 : 4;
  const completed = active === 3 ? completed3 : completed4;
  const nextStep = active === 3 ? getNext3() : getLightweightNextStep();
  return <main className="home-page">
    <header className="home-intro"><span className="eyebrow">毎日の小さな「できた！」をふやそう</span><h1>今日は、何を<br className="sm:hidden"/>やってみる？</h1><p>コースを選んだら、あとは順番に進むだけ。</p></header>
    {completed > 0 && <Link to={nextStep.path} className="continue-card"><div><span className="eyebrow">英検{active}級・今日のつづき</span><h2>{completed === 5 ? '今日の結果を見る' : nextStep.title}</h2><p>{completed} / 5 完了</p></div><span className="continue-arrow" aria-hidden="true">→</span></Link>}
    <section className="home-section" aria-labelledby="exam-heading"><div className="section-heading"><h2 id="exam-heading">英検にチャレンジ</h2><span>目標の級をえらぼう</span></div><div className="exam-grid">{[{level:4,icon:'🌱',text:'中1・中2の基礎から',color:'green'},{level:3,icon:'🚀',text:'中3の文法・英作文・面接',color:'purple'}].map(item => <Link key={item.level} to={`/eiken${item.level}`} className={`exam-card ${item.color}`}><span className="exam-icon" aria-hidden="true">{item.icon}</span><h3>英検{item.level}級</h3><p>{item.text}</p><span className="exam-action">学習をはじめる <span aria-hidden="true">→</span></span></Link>)}</div></section>
    <section className="home-section" aria-labelledby="school-heading"><div className="section-heading"><h2 id="school-heading">教科書の文法</h2><span>学校の復習はこちら</span></div><div className="space-y-3">{grades.map(grade => <GradeCard key={grade.id} grade={grade}/>)}</div></section>
    <section className="home-section" aria-label="そのほかのメニュー"><Link to="/vocabulary" className="menu-row"><span className="menu-icon" aria-hidden="true">🔤</span><span className="min-w-0 flex-1"><strong>英単語を覚える</strong><small>中1〜中3・カードと確認テスト</small></span><ChevronRightIcon className="h-5 w-5 text-slate-400"/></Link><Link to="/guide" className="menu-row mt-3"><span className="menu-icon" aria-hidden="true">💡</span><span className="min-w-0 flex-1"><strong>はじめての人へ</strong><small>このアプリの使い方を見る</small></span><ChevronRightIcon className="h-5 w-5 text-slate-400"/></Link></section>
    <p className="home-footer">一問できたら、それも一歩。自分のペースで進もう。</p>
  </main>;
};
export default HomePage;
