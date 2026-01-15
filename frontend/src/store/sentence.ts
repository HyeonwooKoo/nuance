import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { getUnseenSentences, reviewSentence } from "@/lib/api";

import type { Rating, Sentence } from "../types/voca";

interface WordID {
  due?: Date;
  wid: number;
}

interface SentenceState {
  isFetching: boolean;
  isWaiting: boolean;
  items: Sentence[];
  dueIds: WordID[];
  unseenIds: WordID[];
  sentenceMap: { [key: number]: Sentence };
  abortController: AbortController;
  actions: SentenceActions;
}

interface SentenceActions {
  init: () => Promise<void>;
  pushUnseenSentences: () => Promise<void>;
  pushItem: () => void;
  reviewItem: (wid: number, sid: number, rating: Rating) => Promise<void>;
  reset: () => void;
}

export const useSentenceStore = create<SentenceState>()(
  devtools(
    persist(
      (set, get) => ({
        isFetching: false,
        isWaiting: false,
        items: [] as Sentence[],
        dueIds: [] as WordID[],
        unseenIds: [] as WordID[],
        sentenceMap: {} as { [key: number]: Sentence },
        abortController: new AbortController(),
        actions: {
          init: async () => {
            if (get().items.length > 0) return;
            get().actions.pushItem();
          },

          pushUnseenSentences: async () => {
            if (get().abortController.signal.aborted) return;
            set({ isFetching: true });
            try {
              const unseenSentences = await getUnseenSentences();
              if (get().abortController.signal.aborted) return;
              const sentencesToPush = unseenSentences.filter((s) =>
                get().unseenIds.every((dueid) => dueid.wid != s.word.id)
              );
              set(({ unseenIds, sentenceMap }) => ({
                isFetching: false,
                unseenIds: [
                  ...unseenIds,
                  ...sentencesToPush.map((s) => ({ wid: s.word.id })),
                ],
                sentenceMap: {
                  ...sentenceMap,
                  ...Object.fromEntries(
                    sentencesToPush.map((s) => [s.word.id, s])
                  ),
                },
              }));
              if (get().isWaiting) {
                get().actions.pushItem();
                set({ isWaiting: false }); 
              }
            } catch (error) {
              if (get().abortController.signal.aborted) return;
              set({ isFetching: false });
            }
          },

          pushItem: () => {
            if (get().dueIds.length > 0) {
              set((prev) => ({
                items: [
                  ...prev.items,
                  prev.sentenceMap[findOldestDueID(prev.dueIds)!.wid],
                ],
              }));
            } else if (get().unseenIds.length > 0) {
              set((prev) => ({
                items: [...prev.items, prev.sentenceMap[prev.unseenIds[0].wid]],
              }));
            } else {
              set({ isWaiting: true });
            }

            if (get().unseenIds.length < 5) {
              get().actions.pushUnseenSentences();
            }
          },

          reviewItem: async (wid, sid, rating) => {
            set(({ dueIds, unseenIds, sentenceMap }) => ({
              dueIds: getRemovedIds(wid, dueIds),
              unseenIds: getRemovedIds(wid, unseenIds),
              sentenceMap: getRemovedMap(wid, sentenceMap),
            }));

            const response = await reviewSentence(sid, rating);
            const next_due = new Date(response.due).getTime();
            const now = new Date().getTime();
            const MIN_20 = 1000 * 60 * 20;
            if (next_due - now < MIN_20) {
              const dueId = { due: response.due, wid };
              set(({ dueIds }) => ({ dueIds: [dueId, ...dueIds] }));
            }
          },

          reset: () => {
            get().abortController.abort();
            set({
              isFetching: false,
              isWaiting: false,
              items: [],
              dueIds: [],
              unseenIds: [],
              sentenceMap: {},
              abortController: new AbortController(),
            });
          },
        },
      }),
      {
        name: "sentence-storage",
        partialize: (state) => ({
          dueIds: state.dueIds,
          unseenIds: state.unseenIds,
          sentenceMap: state.sentenceMap,
        }),
      }
    )
  )
);

function findOldestDueID(ids: WordID[]): WordID | null {
  if (ids.length === 0) return null;
  return ids.reduce((oldest, current) => {
    if (current.due!.getTime() < oldest.due!.getTime()) {
      return current;
    } else {
      return oldest;
    }
  });
}

function getRemovedIds(wid: number, ids: WordID[]): WordID[] {
  return ids.filter((x) => x.wid != wid);
}

function getRemovedMap(
  wid: number,
  map: SentenceState["sentenceMap"]
): SentenceState["sentenceMap"] {
  const { [wid]: _, ...newMap } = map;
  return newMap;
}
