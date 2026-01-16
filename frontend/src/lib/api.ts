import axios from "axios";

import type { Sentence } from "@/types/voca";

import { useAuthStore } from "../store/auth";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ReviewStat {
  id: number;
  user_id: string;
  word_id: number;
  state: number;
  step: number | null;
  stability: number;
  difficulty: number;
  due: Date;
  last_reviewed_at: Date;
}

export const reviewSentence = async (
  sentenceId: number,
  rating: string
): Promise<ReviewStat> => {
  if (USE_MOCK_API) {
    console.log("mock review sent");
    return {
      id: 1,
      user_id: "mock-user-id",
      word_id: 1,
      state: 1,
      step: 1,
      stability: 1,
      difficulty: 1,
      due: new Date(),
      last_reviewed_at: new Date(),
    };
  }
  const ratingNum = { again: 1, hard: 2, good: 3, easy: 4 }[rating];
  const response = await api.post<ReviewStat>(
    `/sentences/${sentenceId}/review?rating=${ratingNum}`
  );
  return {
    ...response.data,
    due: new Date(response.data.due),
    last_reviewed_at: new Date(response.data.last_reviewed_at),
  };
};

export const getSentences = async (wordIds: number[]): Promise<Sentence[]> => {
  if (USE_MOCK_API) {
    console.log("mock getSentences called");
    return [];
  }
  const response = await api.get<Sentence[]>("/sentences", {
    params: { q: wordIds },
    paramsSerializer: {
      indexes: null, // no brackets
    },
  });
  return response.data;
};

export const getUnseenSentences = async (language: string = "Eng"): Promise<Sentence[]> => {
  if (USE_MOCK_API) {
    console.log("mock getUnseenSentences called");
    return [];
  }
  const response = await api.get<Sentence[]>("/sentences/unseen", {
    params: { language },
  });

  if (response.data.length <= 0) {
    console.error("No unseen sentences left");
    throw new Error("No unseen sentences left");
  }
  return response.data;
};

export const getDueSoonWordIds = async (language: string = "Eng"): Promise<number[]> => {
  if (USE_MOCK_API) {
    console.log("mock getDueSoonWordIds called");
    return [];
  }
  const response = await api.get<number[]>("/words/due-soon", {
    params: { language },
  });
  return response.data;
};

export default api;
