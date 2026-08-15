import { eiken3SpeakingCards } from '../data/eiken3Speaking';
import { safeSetLearningItem } from './storageHealthService';

export const EIKEN3_SPEAKING_KEY = 'eiken3SpeakingProgressV1';
export type Eiken3SpeakingProgress = { version: 1; completedCardIds: string[]; updatedAt?: string };

const empty = (): Eiken3SpeakingProgress => ({ version: 1, completedCardIds: [] });

export const loadSpeakingProgress = (): Eiken3SpeakingProgress => {
  if (typeof localStorage === 'undefined') return empty();
  try {
    const saved = JSON.parse(localStorage.getItem(EIKEN3_SPEAKING_KEY) || 'null') as Partial<Eiken3SpeakingProgress> | null;
    const validIds = new Set(eiken3SpeakingCards.map(card => card.id));
    return { version: 1, completedCardIds: Array.from(new Set((saved?.completedCardIds || []).filter(id => validIds.has(id)))), ...(saved?.updatedAt ? { updatedAt: saved.updatedAt } : {}) };
  } catch {
    return empty();
  }
};

export const completeSpeakingCard = (cardId: string) => {
  if (!eiken3SpeakingCards.some(card => card.id === cardId)) return;
  const current = loadSpeakingProgress();
  safeSetLearningItem(EIKEN3_SPEAKING_KEY, JSON.stringify({ version: 1, completedCardIds: Array.from(new Set([...current.completedCardIds, cardId])), updatedAt: new Date().toISOString() } satisfies Eiken3SpeakingProgress));
};
