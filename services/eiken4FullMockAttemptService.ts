const KEY = 'eiken4FullMockAttemptV1';
export type FullMockAttempt = { savedAt:string; index:number; answers:Record<string,string>; remaining:number; stage:'reading'|'listening'; plays:Record<string,number> };
export const loadFullMockAttempt = (): FullMockAttempt | null => { if(typeof localStorage==='undefined')return null;try{const value=JSON.parse(localStorage.getItem(KEY)||'null');return value&&Number.isInteger(value.index)&&value.answers?value:null}catch{return null} };
export const saveFullMockAttempt = (attempt: Omit<FullMockAttempt,'savedAt'>) => { if(typeof localStorage!=='undefined')safeSetLearningItem(KEY,JSON.stringify({...attempt,savedAt:new Date().toISOString()})); };
export const clearFullMockAttempt = () => { if(typeof localStorage!=='undefined')localStorage.removeItem(KEY); };
import { safeSetLearningItem } from './storageHealthService';
