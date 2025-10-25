import axios from "axios";

import { useAuthStore } from "../store/auth";

const MOCK_API = true;

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
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
  message: string;
}

export const reviewSentence = async (
  sentenceId: number,
  rating: string
): Promise<ReviewResponse> => {
  if (MOCK_API) {
    console.log("mock review sent");
    return { message: "good" };
  }
  const ratingNum = { again: 1, hard: 2, good: 3, easy: 4 }[rating];
  const response = await api.post<ReviewResponse>(
    `/sentences/${sentenceId}/review?rating=${ratingNum}`
  );
  return response.data;
};

export default api;
