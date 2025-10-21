import { create } from "zustand";

import { dummyItems as allSentences } from "../dummyItems";
import type { Sentence } from "../types/voca";

interface SentenceState {
  sentences: Sentence[];
  setSentences: (sentences: Sentence[]) => void;
  addSentence: () => void;
}

export const useSentenceStore = create<SentenceState>((set) => ({
  sentences: allSentences.slice(0, 1),
  setSentences: (sentences) => set({ sentences }),
  addSentence: () => {
    set((state) => {
      const nextIndex = state.sentences.length;
      if (nextIndex < allSentences.length) {
        return { sentences: [...state.sentences, allSentences[nextIndex]] };
      }
      return state; // No more dummy sentences to add
    });
  },
}));
