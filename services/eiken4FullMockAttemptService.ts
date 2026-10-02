const KEY = 'eiken4FullMockAttemptV1';
export type FullMockAttempt = { savedAt:string; index:number; answers:Record<string,string>; remaining:number; stage:'reading'|'listening'; plays:Record<string,number>; missionId?:string; seed?:string };
export const loadFullMockAttempt = (missionId?:string): FullMockAttempt | null => { if(typeof localStorage==='undefined')return null;try{const value=JSON.parse(localStorage.getItem(KEY)||'null') as FullMockAttempt|null;return value&&Number.isInteger(value.index)&&value.index>=0&&value.index<65&&value.answers&&typeof value.answers==='object'&&!Array.isArray(value.answers)&&Number.isFinite(value.remaining)&&value.remaining>=0&&value.remaining<=35*60&&['reading','listening'].includes(value.stage)&&value.missionId===missionId?value:null}catch{return null} };
export const saveFullMockAttempt = (attempt: Omit<FullMockAttempt,'savedAt'>) => { if(typeof localStorage!=='undefined')safeSetLearningItem(KEY,JSON.stringify({...attempt,savedAt:new Date().toISOString()})); };
export const clearFullMockAttempt = () => { if(typeof localStorage!=='undefined')localStorage.removeItem(KEY); };
import { safeSetLearningItem } from './storageHealthService';
