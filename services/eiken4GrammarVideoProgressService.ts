import type { Eiken4GrammarCategoryId } from '../data/eiken4GrammarCategories';
import { EIKEN4_GRAMMAR_VIDEO_PROGRESS_KEY } from '../data/eiken4LearningKeys';
import { EIKEN4_TOTAL_VIDEO_COUNT, getRequiredGrammarVideoSummaries, type Eiken4GrammarVideoSummary } from '../data/eiken4GrammarVideoSummary';
import { safeSetLearningItem } from './storageHealthService';

export interface GrammarVideoProgress {
  videoId: string;
  grammarId: string;
  opened: boolean;
  openedAt?: string;
  confirmed: boolean;
  confirmedAt?: string;
}

export type GrammarVideoActivity = { kind: 'watch' | 'confirm'; video: Eiken4GrammarVideoSummary };

const read = (): Record<string, GrammarVideoProgress> => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const value = JSON.parse(localStorage.getItem(EIKEN4_GRAMMAR_VIDEO_PROGRESS_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
};

const save = (progress: Record<string, GrammarVideoProgress>) => safeSetLearningItem(EIKEN4_GRAMMAR_VIDEO_PROGRESS_KEY, JSON.stringify(progress));

export const getGrammarVideoProgress = (videoId: string): GrammarVideoProgress | null => read()[videoId] || null;

export const getAllGrammarVideoProgress = () => read();

export const markGrammarVideoOpened = (videoId: string, grammarId: string): void => {
  const progress = read();
  const previous = progress[videoId];
  progress[videoId] = {
    videoId,
    grammarId,
    opened: true,
    openedAt: previous?.openedAt || new Date().toISOString(),
    confirmed: Boolean(previous?.confirmed),
    confirmedAt: previous?.confirmedAt,
  };
  save(progress);
};

export const markGrammarVideoConfirmed = (videoId: string, grammarId: string): void => {
  const progress = read();
  const previous = progress[videoId];
  const timestamp = new Date().toISOString();
  progress[videoId] = {
    videoId,
    grammarId,
    opened: true,
    openedAt: previous?.openedAt || timestamp,
    confirmed: true,
    confirmedAt: previous?.confirmedAt || timestamp,
  };
  save(progress);
};

export const getRequiredGrammarVideos = (grammarId: Eiken4GrammarCategoryId | string) => getRequiredGrammarVideoSummaries(grammarId);

export const getNextGrammarVideoActivity = (grammarId: Eiken4GrammarCategoryId | string, snapshot = read()): GrammarVideoActivity | undefined => {
  const required = getRequiredGrammarVideos(grammarId);
  const unopened = required.find(video => !snapshot[video.id]?.opened);
  if (unopened) return { kind: 'watch', video: unopened };
  const unconfirmed = required.find(video => !snapshot[video.id]?.confirmed);
  return unconfirmed ? { kind: 'confirm', video: unconfirmed } : undefined;
};

export const areRequiredGrammarVideosConfirmed = (grammarId: Eiken4GrammarCategoryId | string, snapshot = read()) => {
  const required = getRequiredGrammarVideos(grammarId);
  return required.length === 0 || required.every(video => snapshot[video.id]?.confirmed);
};

export const getGrammarVideoCount = () => EIKEN4_TOTAL_VIDEO_COUNT;
