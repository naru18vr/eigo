const KEY='eiken4ReadingSkillsV1';
export type ReadingSkill='時刻・場所'|'理由'|'人物・物'|'代名詞'|'根拠文';
export const classifyReadingSkill=(text:string):ReadingSkill=>/何時|いつ|どこ|時刻|場所/.test(text)?'時刻・場所':/なぜ|理由|because/.test(text)?'理由':/誰|何を|何が/.test(text)?'人物・物':/it|they|代名詞/.test(text)?'代名詞':'根拠文';
export const loadReadingSkills=():Record<ReadingSkill,number>=>{if(typeof localStorage==='undefined')return{} as Record<ReadingSkill,number>;try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{} as Record<ReadingSkill,number>}};
export const recordReadingSkillWeakness=(prompt:string,explanation:string)=>{if(typeof localStorage==='undefined')return;const map=loadReadingSkills(),skill=classifyReadingSkill(`${prompt} ${explanation}`);map[skill]=(map[skill]||0)+2;localStorage.setItem(KEY,JSON.stringify(map));};
export const topReadingSkill=()=>Object.entries(loadReadingSkills()).sort((a,b)=>b[1]-a[1])[0]?.[0] as ReadingSkill|undefined;
