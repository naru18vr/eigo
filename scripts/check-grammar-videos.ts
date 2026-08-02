import { EIKEN4_GRAMMAR_VIDEOS, getEiken4GrammarGuideCategoryId, getEiken4GrammarVideos } from '../data/eiken4GrammarVideos';
import { getRequiredGrammarVideoSummaries } from '../data/eiken4GrammarVideoSummary';
import { EIKEN4_GRAMMAR_VIDEO_PROGRESS_KEY } from '../data/eiken4LearningKeys';
import { areRequiredGrammarVideosConfirmed, getGrammarVideoProgress, getNextGrammarVideoActivity, getRequiredGrammarVideos, markGrammarVideoConfirmed, markGrammarVideoOpened } from '../services/eiken4GrammarVideoProgressService';

const errors: string[] = [];

class MemoryStorage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
if (EIKEN4_GRAMMAR_VIDEOS.length !== 31) errors.push(`動画本数が31本ではない: ${EIKEN4_GRAMMAR_VIDEOS.length}`);
if (new Set(EIKEN4_GRAMMAR_VIDEOS.map(video => video.url)).size !== EIKEN4_GRAMMAR_VIDEOS.length) errors.push('動画URLが重複している');
if (new Set(EIKEN4_GRAMMAR_VIDEOS.map(video => video.id)).size !== EIKEN4_GRAMMAR_VIDEOS.length) errors.push('動画IDが重複している');
if (EIKEN4_GRAMMAR_VIDEOS.some(video => !video.title || !video.grammarId || video.provider !== 'try-it' || !video.loginRequired || !video.url.startsWith('https://student.try-it.jp/videos/'))) errors.push('動画データの必須項目が不足');
if (EIKEN4_GRAMMAR_VIDEOS.filter(video => video.id === 'passive-question-negative').length !== 1) errors.push('受け身の疑問文・否定文が1件ではない');
if (new Set(EIKEN4_GRAMMAR_VIDEOS.map(video => video.chapter)).size !== 9) errors.push('章が9章ではない');
if (EIKEN4_GRAMMAR_VIDEOS.map(video => video.chapter).some((chapter, index, chapters) => index > 0 && chapter < chapters[index - 1])) errors.push('章の順番がそろっていない');
if (getEiken4GrammarGuideCategoryId('future') !== 'future' || getEiken4GrammarGuideCategoryId('conversation') !== 'modal-verb' || getEiken4GrammarGuideCategoryId('passive') !== 'other-eiken4') errors.push('動画から文法ガイドへの対応が不足');

['future', 'conjunction', 'infinitive', 'modal-verb', 'gerund', 'comparative', 'superlative'].forEach(grammarId => {
  const fullIds = getEiken4GrammarVideos(grammarId).filter(video => video.required).map(video => video.id);
  const summaryIds = getRequiredGrammarVideoSummaries(grammarId).map(video => video.id);
  if (fullIds.join('|') !== summaryIds.join('|')) errors.push(`動画進捗用軽量索引が${grammarId}と一致しない`);
});

const futureVideos = getRequiredGrammarVideos('future');
if (futureVideos.length !== 4) errors.push(`未来の必須動画が4本ではない: ${futureVideos.length}`);
if (getNextGrammarVideoActivity('future')?.kind !== 'watch' || getNextGrammarVideoActivity('future')?.video.id !== 'future-going-to') errors.push('初回に未来の1本目を案内できない');
markGrammarVideoOpened('future-going-to', 'future');
if (getGrammarVideoProgress('future-going-to')?.opened !== true) errors.push('動画を開いた記録を保存できない');
if (getNextGrammarVideoActivity('future')?.video.id !== 'future-going-to-question-negative') errors.push('動画を順番に案内できない');
futureVideos.slice(1).forEach(video => markGrammarVideoOpened(video.id, video.grammarId));
if (getNextGrammarVideoActivity('future')?.kind !== 'confirm') errors.push('必須動画後に確認問題を案内できない');
futureVideos.forEach(video => markGrammarVideoConfirmed(video.id, video.grammarId));
if (getNextGrammarVideoActivity('future')) errors.push('全動画確認後も動画が未完了扱いになる');
if (!areRequiredGrammarVideosConfirmed('future')) errors.push('動画確認済みを判定できない');
if (!(localStorage.getItem(EIKEN4_GRAMMAR_VIDEO_PROGRESS_KEY) || '').includes('future-going-to')) errors.push('動画進捗の保存キーがない');

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`動画先行学習チェックOK: ${EIKEN4_GRAMMAR_VIDEOS.length}本・未来${futureVideos.length}本`);
