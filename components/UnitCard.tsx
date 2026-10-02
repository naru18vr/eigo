import React from 'react';
import { Link } from 'react-router-dom';
import { Unit } from '../types';
import ChevronRightIcon from './shared/ChevronRightIcon';
const UnitCard: React.FC<{unit:Unit;gradeId:string;colorClass?:string}> = ({unit,gradeId}) => {
  const title=unit.title.replace(/^Unit\s+\d+:\s*/,'');
  const label=unit.title.match(/^Unit\s+\d+/)?.[0] || 'ユニット';
  if(!unit.sentences.length) return <div className="menu-row opacity-60"><span><strong>{label}</strong><small>{title}・準備中</small></span></div>;
  return <Link to={`/grade/${gradeId}/unit/${unit.id}/sets`} className="unit-card"><div className="flex items-center justify-between gap-3"><span className="unit-label">{label}</span><ChevronRightIcon className="h-5 w-5 text-slate-400"/></div><h3 className="mt-3 font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm text-slate-500">{unit.sentences.length}問・少しずつ練習できるよ</p><span className="mt-4 block font-bold text-indigo-700">問題を選ぶ →</span></Link>;
};
export default UnitCard;
