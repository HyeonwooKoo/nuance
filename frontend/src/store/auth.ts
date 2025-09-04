import { create } from "zustand";

interface User {
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

const initialUser = localStorage.getItem("nuance_user");
const initialToken = localStorage.getItem("nuance_token");

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser ? JSON.parse(initialUser) : null,
  token: initialToken,

  setUser: (user, token) => {
    localStorage.setItem("nuance_user", JSON.stringify(user));
    localStorage.setItem("nuance_token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("nuance_user");
    localStorage.removeItem("nuance_token");
    set({ user: null, token: null });
  },
}));
