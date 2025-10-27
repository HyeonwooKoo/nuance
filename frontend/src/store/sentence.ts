import { create } from "zustand";
import { persist } from "zustand/middleware";

import { reviewSentence } from "@/lib/api";

import { dummyItems as allSentences } from "../dummyItems";
import type { Rating, Sentence } from "../types/voca";

interface SentenceState {
  items: Sentence[];
  due_word_ids: number[];
  due_sentences: { [key: number]: Sentence };
  unseen_sentences: Sentence[];
  actions: SentenceActions;
}

interface SentenceActions {
  pushItem: () => void;
  reviewItem: (wid: number, sid: number, rating: Rating) => void;
}

export const useSentenceStore = create<SentenceState>()(
  persist(
    (set, get) => ({
      items: allSentences.slice(0, 1) as Sentence[],
      due_word_ids: [] as number[],
      due_sentences: {} as { [key: number]: Sentence },
      unseen_sentences: [] as Sentence[],
      actions: {
        pushItem: () => {
          if (get().due_word_ids.length > 0) {
            console.log("push a sentence for a due word");
          } else {
            console.log("push a sentence for an unseen word");
          }

          // Implementation for adding a new sentence
          set(({ items }) => {
            const nextIndex = items.length;
            if (nextIndex < allSentences.length) {
              return { items: [...items, allSentences[nextIndex]] };
            }
            return {};
          });
        },
        reviewItem: (_, sid, rating) => {
          // TODO
          reviewSentence(sid, rating);
        },
      },
    }),
    {
      name: "sentence-storage",
      partialize: (state) => ({
        due_word_ids: state.due_word_ids,
        due_sentences: state.due_sentences,
        unseen_sentences: state.unseen_sentences,
      }),
    }
  )
);
