import React from 'react';
import { Link } from 'react-router-dom';
import { Grade } from '../types';
import ChevronRightIcon from './shared/ChevronRightIcon';
const grades: Record<string, {label:string;hint:string;style:string}> = {
  grade1:{label:'中学1年',hint:'英語の基本から、ゆっくり',style:'bg-emerald-100 text-emerald-800'},
  grade2:{label:'中学2年',hint:'過去・未来・比較を練習',style:'bg-sky-100 text-sky-800'},
  grade3:{label:'中学3年',hint:'現在完了・受け身・関係代名詞',style:'bg-violet-100 text-violet-800'},
};
const GradeCard: React.FC<{grade:Grade}> = ({grade}) => {
  const info=grades[grade.id];
  return <Link to={`/grade/${grade.id}`} className="menu-row"><span className={`grade-number ${info?.style || 'bg-indigo-100 text-indigo-800'}`} aria-hidden="true">{grade.id.replace('grade','')}</span><span className="min-w-0 flex-1"><strong>{info?.label || grade.name}</strong><small>{info?.hint || '学年別の文法を練習'}</small></span><ChevronRightIcon className="h-5 w-5 shrink-0 text-slate-400"/></Link>;
};
export default GradeCard;
