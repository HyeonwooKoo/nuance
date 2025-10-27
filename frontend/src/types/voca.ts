export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Word {
  id: number;
  term: string;
  definition: string;
  part_of_speech: string;
  cefr: CEFRLevel;
  pronunciation: string;
}

export interface Sentence {
  id: number;
  text: string;
  due: Date;
  word: Word;
}
