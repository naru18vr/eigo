import { eiken4CoreExamQuestions } from '../data/eiken4Curriculum';
import { getLocalDate } from './eiken4ProgressService';
const KEY='eiken4ExamPracticeV1';
const hash=(s:string)=>{let n=0;for(const c of s)n=(Math.imul(n,31)+c.charCodeAt(0))|0;return n>>>0;};
export const getDailyExamQuestions=()=>eiken4CoreExamQuestions.map((q,i)=>({q,n:hash(`${getLocalDate()}-${i}`)})).sort((a,b)=>a.n-b.n).slice(0,10).map(x=>x.q);
export type ExamPracticeResult={date:string;answers:Record<string,string>;completedAt?:string};
export const loadExamPractice=():ExamPracticeResult=>{if(typeof localStorage==='undefined')return{date:getLocalDate(),answers:{}};try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x?.date===getLocalDate()?x:{date:getLocalDate(),answers:{}};}catch{return{date:getLocalDate(),answers:{}}}};
export const saveExamPractice=(x:ExamPracticeResult)=>{if(typeof localStorage!=='undefined')localStorage.setItem(KEY,JSON.stringify(x));};
