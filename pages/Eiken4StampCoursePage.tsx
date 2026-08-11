import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import { buildEiken4CourseDays, EIKEN4_COURSE_DURATIONS, EIKEN4_STAMP_MISSIONS, type Eiken4CourseDuration } from '../data/eiken4StampCourse';
import { loadEiken4StampCourse, selectEiken4StampCourse, setEiken4MissionCompleted, setEiken4StampCourseStartDate } from '../services/eiken4StampCourseService';

const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dateLabel = (startDate: string, offset: number) => {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + offset);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const Eiken4StampCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(loadEiken4StampCourse);
  const [showCoursePicker, setShowCoursePicker] = useState(!progress.duration);
  const completed = useMemo(() => new Set(progress.completedMissionIds), [progress.completedMissionIds]);
  const days = useMemo(() => progress.duration ? buildEiken4CourseDays(progress.duration) : [], [progress.duration]);
  const completedCount = progress.completedMissionIds.length;
  const nextMission = EIKEN4_STAMP_MISSIONS.find(mission => !completed.has(mission.id));

  const chooseCourse = (duration: Eiken4CourseDuration) => {
    const startDate = progress.startDate || localDate();
    selectEiken4StampCourse(duration, startDate);
    setProgress(loadEiken4StampCourse());
    setShowCoursePicker(false);
  };
  const toggleStamp = (missionId: string) => {
    setEiken4MissionCompleted(missionId, !completed.has(missionId));
    setProgress(loadEiken4StampCourse());
  };

  return <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white px-4 py-5">
    <div className="mx-auto max-w-xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm"><ArrowLeftIcon className="mr-2 h-5 w-5"/>英検4級に戻る</Button>
      <header className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 p-6 text-white shadow-lg">
        <div className="absolute -right-5 -top-5 text-7xl opacity-20" aria-hidden="true">🏁</div>
        <p className="text-xs font-bold tracking-widest text-orange-100">EIKEN STAMP RALLY</p>
        <h1 className="mt-2 text-3xl font-extrabold">合格スタンプラリー</h1>
        <p className="mt-2 text-sm leading-6">予定に合わせて1・2・3週間から選べるよ。<br/>途中で変えても、押したスタンプは消えません。</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/30"><div className="h-full rounded-full bg-yellow-300 transition-all" style={{ width: `${Math.round(completedCount / EIKEN4_STAMP_MISSIONS.length * 100)}%` }}/></div>
        <p className="mt-2 font-bold">スタンプ {completedCount} / {EIKEN4_STAMP_MISSIONS.length}</p>
      </header>

      {!progress.duration && <section className="mt-5 rounded-2xl border-2 border-orange-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">期間はあとで決めても大丈夫</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">教科書ワークが終わって、英検を始める日が決まったら選ぼう。何度でも変更できます。</p>
      </section>}

      {(showCoursePicker || !progress.duration) && <section className="mt-5 space-y-3" aria-label="コースを選ぶ">
        {EIKEN4_COURSE_DURATIONS.map(course => <button key={course.days} type="button" onClick={() => chooseCourse(course.days)} className={`min-h-24 w-full rounded-2xl border-2 p-4 text-left shadow-sm ${course.recommended ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-extrabold text-slate-900">{course.label}</h2>{course.recommended && <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">おすすめ</span>}</div>
          <p className="mt-1 text-sm font-bold text-slate-700">{course.pace}・{course.minutes}</p><p className="mt-1 text-sm text-slate-600">{course.description}</p>
        </button>)}
      </section>}

      {progress.duration && !showCoursePicker && <>
        <section className="mt-5 rounded-2xl border border-orange-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold text-orange-700">いまのコース</p><h2 className="text-xl font-extrabold text-slate-900">{progress.duration === 7 ? '1週間' : progress.duration === 14 ? '2週間' : '3週間'}コース</h2></div><button type="button" onClick={() => setShowCoursePicker(true)} className="min-h-11 rounded-xl border border-orange-300 px-4 text-sm font-bold text-orange-800">期間を変える</button></div>
          <label className="mt-4 block text-sm font-bold text-slate-700">スタートする日<input type="date" value={progress.startDate || localDate()} onChange={event => { setEiken4StampCourseStartDate(event.target.value); setProgress(loadEiken4StampCourse()); }} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base"/></label>
          <p className="mt-2 text-xs leading-5 text-slate-500">夏休みの予定が変わっても、開始日と期間はいつでも直せます。</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">※フル模試・公式過去問の日は約65分かかります。時間のある日にずらして大丈夫です。</p>
        </section>

        {nextMission ? <section className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm"><p className="text-xs font-bold text-amber-700">つぎのマス</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">{nextMission.icon} {nextMission.title}</h2><p className="mt-1 text-sm text-slate-600">{nextMission.description}・約{nextMission.estimatedMinutes}分</p><Button onClick={() => navigate(nextMission.path)} className="mt-4 w-full" size="lg">学習を始める</Button></section> : <section className="mt-5 rounded-2xl bg-emerald-600 p-6 text-center text-white shadow-lg"><p className="text-5xl" aria-hidden="true">🏆</p><h2 className="mt-3 text-2xl font-extrabold">GOAL！</h2><p className="mt-2">21個のスタンプが全部そろったよ！</p></section>}

        <section className="mt-7">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-wider text-orange-600">SUGOROKU</p><h2 className="mt-1 text-2xl font-extrabold text-slate-900">ゴールまでの道</h2></div><span className="text-3xl" aria-hidden="true">🏁</span></div>
          <p className="mt-2 text-sm leading-6 text-slate-600">学習を終えたら「スタンプを押す」を押そう。間違えて押したときは、もう一度押すと戻せます。</p>
          <div className="mt-4 space-y-4">{days.map((missions, dayIndex) => {
            const dayDone = missions.every(mission => completed.has(mission.id));
            const current = !dayDone && missions.some(mission => mission.id === nextMission?.id);
            return <article key={dayIndex} className={`relative rounded-3xl border-2 p-4 shadow-sm ${dayDone ? 'border-emerald-300 bg-emerald-50' : current ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white'}`}>
              {dayIndex < days.length - 1 && <div className="absolute -bottom-5 left-8 h-6 border-l-4 border-dotted border-orange-300" aria-hidden="true"/>}
              <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-orange-700">DAY {dayIndex + 1}{progress.startDate ? `　${dateLabel(progress.startDate, dayIndex)}` : ''}</p><h3 className="mt-1 font-extrabold text-slate-900">{dayDone ? 'スタンプできた！' : current ? 'いまはここ' : 'この日にやること'}</h3></div><span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-3xl ${dayDone ? 'rotate-[-8deg] border-rose-400 bg-rose-100' : 'border-dashed border-slate-300 bg-white'}`}>{dayDone ? '🌟' : dayIndex + 1}</span></div>
              <div className="mt-3 space-y-3">{missions.map(mission => {
                const done = completed.has(mission.id);
                return <div key={mission.id} className={`rounded-2xl border p-3 ${done ? 'border-emerald-200 bg-white/70' : 'border-slate-200 bg-white'}`}><div className="flex gap-3"><span className="text-2xl" aria-hidden="true">{done ? '✅' : mission.icon}</span><div className="min-w-0 flex-grow"><p className="font-extrabold text-slate-900">{mission.title}</p><p className="text-xs leading-5 text-slate-600">{mission.description}・約{mission.estimatedMinutes}分</p></div></div><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => navigate(mission.path)} className="min-h-11 rounded-xl border border-indigo-200 bg-indigo-50 px-2 text-sm font-bold text-indigo-800">{done ? 'もう一度やる' : '学習する'}</button><button type="button" onClick={() => toggleStamp(mission.id)} className={`min-h-11 rounded-xl px-2 text-sm font-bold ${done ? 'border border-slate-300 bg-white text-slate-600' : 'bg-rose-500 text-white'}`}>{done ? 'スタンプを戻す' : 'スタンプを押す'}</button></div></div>;
              })}</div>
            </article>;
          })}</div>
        </section>
      </>}
    </div>
  </div>;
};

export default Eiken4StampCoursePage;
