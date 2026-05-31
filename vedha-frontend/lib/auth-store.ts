// lib/auth-store.ts — Zustand auth store
import { create } from "zustand";

interface User {
  id: number;
  name: string;
  email: string;
  goal: string;
  role: "student" | "company" | "employee";
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:  null,
  token: null,

  setAuth: (user, token) => {
    localStorage.setItem("vedha_token", token);
    localStorage.setItem("vedha_user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("vedha_token");
    localStorage.removeItem("vedha_user");
    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("vedha_token");
    const user  = localStorage.getItem("vedha_user");
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },
}));