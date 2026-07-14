import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookOpenIcon from './shared/BookOpenIcon';

const references = [
  { number:1,id:'past',level:'最重要',title:'過去形・過去進行形',pattern:/過去|yesterday|last week|ago|was doing|were doing|called/i,point:'過去形／was・were＋動詞ing／Did＋動詞の原形を確認しよう。' },
  { number:2,id:'future',level:'最重要',title:'未来 will / be going to',pattern:/未来|will|going to|tomorrow|next week/i,point:'will または be going to の後は動詞の原形です。' },
  { number:3,id:'infinitive',level:'最重要',title:'to不定詞',pattern:/不定詞|want to|need to|hope to|to＋動詞|ために|what to|how to/i,point:'to＋動詞の原形で「すること・するために」を表します。' },
  { number:4,id:'gerund',level:'重要',title:'動名詞（動詞ing）',pattern:/動名詞|enjoy|finish|singing|reading|swimming/i,point:'動詞ingを「〜すること」という名詞のように使います。' },
  { number:5,id:'comparison',level:'最重要',title:'比較級・最上級',pattern:/比較|最上級|than|as .* as|the highest|more|most/i,point:'「より〜」は比較級、「いちばん〜」は the＋最上級です。' },
  { number:6,id:'modal',level:'最重要',title:'助動詞 must / have to / may',pattern:/助動詞|must|have to|may i|should|してはいけ|しなければ/i,point:'助動詞の後は動詞の原形。must not と do not have to の違いにも注意。' },
  { number:7,id:'conjunction',level:'最重要',title:'接続詞 when / if / because / that',pattern:/接続詞|when|if|because|\bso\b|するとき|もし|なので/i,point:'前後の文がどんな意味でつながるかを考えます。' },
  { number:8,id:'give',level:'重要',title:'give / show / tell ＋ 人 ＋ もの',pattern:/give|show|tell|teach|人＋物/i,point:'動詞のすぐ後に「人」、その次に「もの」を置きます。' },
  { number:9,id:'there',level:'基礎確認',title:'There is / There are',pattern:/there is|there are|there was|there were/i,point:'1つなら is、2つ以上なら are。過去は was / were です。' },
];

const Eiken4GrammarReference: React.FC<{source:string}> = ({source}) => {
  const navigate=useNavigate(); const item=references.find(reference=>reference.pattern.test(source));
  if(!item)return null;
  return <div className="mt-4 rounded-xl border-2 border-cyan-300 bg-cyan-50 p-4 text-left"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white">{item.number}</span><div><p className="text-xs font-bold text-cyan-700">{item.level}</p><p className="text-lg font-bold text-slate-900">{item.title}</p></div></div><p className="mt-3 text-sm leading-6 text-slate-700">{item.point}</p><button onClick={()=>navigate(`/eiken4/grammar-guide?topic=${item.id}`)} className="mt-3 inline-flex items-center font-bold text-cyan-800"><BookOpenIcon className="mr-2 h-5 w-5"/>この文法を最初から読む</button></div>;
};
export default Eiken4GrammarReference;
