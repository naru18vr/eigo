
export interface Sentence {
  id: string;
  japaneseQuestion: string;
  words: string[]; // Correct words in order. Includes punctuation as separate words if needed.
  grammarTag: string;
  // 英検4級・3級で同じ学習エンジンを使うため、カテゴリIDは各級の定義に任せる。
  grammarCategory?: string;
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

/** 英検3級も出題形式は共通のため、保存データを分けつつ型を共有する。 */
export type Eiken3QuestionType = Eiken4QuestionType;

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
