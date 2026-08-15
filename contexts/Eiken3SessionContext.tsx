import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Eiken3ResultData = {
  wordTotal: number;
  wordKnown: number;
  wordIds: string[];
  wordQuizTotal: number;
  wordQuizCorrect: number;
  wordQuizWrongWords: string[];
  sentenceTotal: number;
  sentenceCorrect: number;
  weakPoints: string[];
  startedAt?: string;
  durationMinutes?: number;
};

type Eiken3SessionContextType = {
  result: Eiken3ResultData;
  resetSession: () => void;
  completeWords: (wordTotal: number, wordKnown: number, weakPoints: string[], wordIds: string[]) => void;
  completeWordQuiz: (wordQuizTotal: number, wordQuizCorrect: number, wrongWords: string[]) => void;
  completeSentences: (sentenceTotal: number, sentenceCorrect: number, weakPoints: string[]) => void;
};

const initialResult = (): Eiken3ResultData => ({
  wordTotal: 0,
  wordKnown: 0,
  wordIds: [],
  wordQuizTotal: 0,
  wordQuizCorrect: 0,
  wordQuizWrongWords: [],
  sentenceTotal: 0,
  sentenceCorrect: 0,
  weakPoints: [],
  startedAt: new Date().toISOString(),
  durationMinutes: 0,
});

const Eiken3SessionContext = createContext<Eiken3SessionContextType | undefined>(undefined);

const uniqueFirstThree = (items: string[]) => Array.from(new Set(items.filter(Boolean))).slice(0, 3);

export const Eiken3SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState<Eiken3ResultData>(() => initialResult());

  const value = useMemo<Eiken3SessionContextType>(() => {
    const withDuration = (next: Eiken3ResultData): Eiken3ResultData => {
      const started = next.startedAt ? new Date(next.startedAt).getTime() : Date.now();
      const elapsed = Math.max(1, Math.round((Date.now() - started) / 60000));
      return { ...next, durationMinutes: elapsed };
    };

    return {
      result,
      resetSession: () => setResult(initialResult()),
      completeWords: (wordTotal, wordKnown, weakPoints, wordIds) => {
        setResult(current =>
          withDuration({
            ...current,
            wordTotal,
            wordKnown,
            wordIds,
            weakPoints: uniqueFirstThree([...weakPoints, ...current.weakPoints]),
          })
        );
      },
      completeWordQuiz: (wordQuizTotal, wordQuizCorrect, wrongWords) => {
        setResult(current =>
          withDuration({
            ...current,
            wordQuizTotal,
            wordQuizCorrect,
            wordQuizWrongWords: wrongWords,
            weakPoints: uniqueFirstThree([...current.weakPoints, ...wrongWords]),
          })
        );
      },
      completeSentences: (sentenceTotal, sentenceCorrect, weakPoints) => {
        setResult(current =>
          withDuration({
            ...current,
            sentenceTotal,
            sentenceCorrect,
            weakPoints: uniqueFirstThree([...current.weakPoints, ...weakPoints]),
          })
        );
      },
    };
  }, [result]);

  return <Eiken3SessionContext.Provider value={value}>{children}</Eiken3SessionContext.Provider>;
};

export const useEiken3Session = (): Eiken3SessionContextType => {
  const context = useContext(Eiken3SessionContext);
  if (!context) {
    throw new Error('useEiken3Session must be used within Eiken3SessionProvider');
  }
  return context;
};
