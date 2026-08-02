
export interface Sentence {
  id: string;
  japaneseQuestion: string;
  words: string[]; // Correct words in order. Includes punctuation as separate words if needed.
  grammarTag: string;
  grammarCategory?: import('./data/eiken4GrammarCategories').Eiken4GrammarCategoryId;
  explanation: string;
  /** 英検4級の出題形式。既存問題は並べ替えとして扱い、追加問題では形式を明示する。 */
  questionType?: Eiken4QuestionType;
}

export type Eiken4QuestionType =
  | 'reorder'
  | 'fill-blank'
  | 'sentence-choice'
  | 'response'
  | 'dialogue'
  | 'error-correction';

export interface Unit {
  id: string;
  title: string;
  sentences: Sentence[];
}

export interface Grade {
  id: string;
  name: string;
  units: Unit[];
  iconColor?: string; 
  aiDefaultConfig?: {
    unitFocus: string;
  };
}

export interface UserProgress {
  [sentenceId: string]: {
    correct: boolean;
    attempts: number;
  };
}
