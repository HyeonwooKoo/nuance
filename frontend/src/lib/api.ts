import axios from "axios";

import { useAuthStore } from "../store/auth";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API;

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

export interface ReviewResponse {
  next_due: Date | null;
}

export const reviewSentence = async (
  sentenceId: number,
  rating: string
): Promise<ReviewResponse> => {
  if (USE_MOCK_API) {
    console.log("mock review sent");
    return { next_due: null };
  }
  const ratingNum = { again: 1, hard: 2, good: 3, easy: 4 }[rating];
  const response = await api.post<ReviewResponse>(
    `/sentences/${sentenceId}/review?rating=${ratingNum}`
  );
  return {
    next_due: response.data.next_due,
  };
};

export default api;
