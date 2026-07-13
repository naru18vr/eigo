import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ArrowLeftIcon from '../components/shared/ArrowLeftIcon';
import CheckCircleIcon from '../components/shared/CheckCircleIcon';
import {
  getDailySentenceQuestions,
  getDailyWordQuestions,
  loadDailyProgress,
  saveDailyProgress,
} from '../services/eiken4DailyService';

type Question = ReturnType<typeof getDailyWordQuestions>[number] | ReturnType<typeof getDailySentenceQuestions>[number];

const Eiken4DailyPage: React.FC = () => {
  const navigate = useNavigate();
  const questions = useMemo<Question[]>(() => [...getDailyWordQuestions(), ...getDailySentenceQuestions()], []);
  const [progress, setProgress] = useState(loadDailyProgress);
  const [selected, setSelected] = useState<string | null>(null);
  const currentIndex = Math.min(progress.answers.length, questions.length - 1);
  const current = questions[currentIndex];
  const complete = progress.answers.length >= questions.length;
  const correctCount = progress.answers.filter(answer => answer.correct).length;

  const answer = (choice: string) => {
    if (selected) return;
    setSelected(choice);
  };

  const next = () => {
    if (!selected) return;
    const answers = [...progress.answers, { id: current.id, correct: selected === current.answer }];
    const nextProgress = {
      ...progress,
      answers,
      ...(answers.length === questions.length ? { completedAt: new Date().toISOString() } : {}),
    };
    saveDailyProgress(nextProgress);
    setProgress(nextProgress);
    setSelected(null);
  };

  if (complete) {
    return (
      <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
        <div className="mt-12 rounded-2xl bg-white shadow-xl border border-emerald-100 p-7 text-center">
          <CheckCircleIcon className="h-20 w-20 text-emerald-500 mx-auto" />
          <p className="text-emerald-700 font-bold mt-4">今日の学習完了！</p>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">{correctCount} / {questions.length} 問正解</h1>
          <p className="text-slate-600 mt-3">単語10問と文法・会話5問を学習しました。</p>
          <Button onClick={() => navigate('/eiken4')} className="mt-7 w-full">英検4級ホームへ</Button>
        </div>
      </div>
    );
  }

  const answeredCorrectly = selected === current.answer;
  return (
    <div className="flex-grow container mx-auto p-4 sm:p-6 max-w-xl">
      <Button onClick={() => navigate('/eiken4')} variant="ghost" size="sm" className="mb-4 text-slate-600">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />途中で戻る
      </Button>
      <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
        <span>{current.kind}</span><span>{progress.answers.length + 1} / {questions.length}</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-5">
        <div className="h-full bg-indigo-600 transition-all" style={{ width: `${(progress.answers.length / questions.length) * 100}%` }} />
      </div>

      <section className="rounded-2xl bg-white shadow-lg border border-indigo-100 p-6">
        <p className="text-sm text-indigo-600 font-bold">いちばん合う答えを選ぼう</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-3">{current.prompt}</h1>
        <p className="text-sm text-slate-500 mt-2">{current.detail}</p>
        <div className="grid gap-3 mt-6">
          {current.choices.map(choice => {
            const showCorrect = selected && choice === current.answer;
            const showWrong = selected === choice && choice !== current.answer;
            return (
              <button
                key={choice}
                onClick={() => answer(choice)}
                className={`p-4 rounded-xl border-2 text-left font-semibold transition-colors ${
                  showCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' :
                  showWrong ? 'border-rose-500 bg-rose-50 text-rose-800' :
                  'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                }`}
              >{choice}</button>
            );
          })}
        </div>
        {selected && (
          <div className={`mt-5 p-4 rounded-xl ${answeredCorrectly ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <p className="font-bold">{answeredCorrectly ? '正解！' : `正解：${current.answer}`}</p>
            {'explanation' in current && <p className="text-sm text-slate-700 mt-1">{current.explanation}</p>}
            <Button onClick={next} className="mt-4 w-full">次の問題へ</Button>
          </div>
        )}
      </section>
      <p className="text-center text-xs text-slate-500 mt-4">途中で閉じても、今日の続きから再開できます。</p>
    </div>
  );
};

export default Eiken4DailyPage;
