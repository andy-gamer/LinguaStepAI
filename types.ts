export enum GameMode {
  WORD_MATCH = 'WORD_MATCH',
  SENTENCE_COMPLETION = 'SENTENCE_COMPLETION',
  CLOZE_TEST = 'CLOZE_TEST',
}

export interface BaseQuestion {
  id: string;
  options: string[];
  correctAnswer: string;
}

export interface WordMatchQuestion extends BaseQuestion {
  word: string; // The English word
  // Options will be Chinese definitions
}

export interface SentenceQuestion extends BaseQuestion {
  sentenceParts: string[]; // [Pre-blank, Post-blank]
  // Options will be English words
}

export interface ClozeBlank {
  id: string;
  correctAnswer: string;
  options: string[]; // 4 options for this specific blank
}

export interface ClozePassage {
  title: string;
  textSegments: string[]; // Segments between blanks
  blanks: ClozeBlank[];
}

export type QuestionData = WordMatchQuestion | SentenceQuestion | ClozePassage;

export interface LevelConfig {
  id: number;
  mode: GameMode;
  title: string;
  description: string;
  passingScore: number; // Percentage required to unlock next
  locked: boolean;
  color: string;
}

export interface GameResult {
  score: number;
  total: number;
  passed: boolean;
}