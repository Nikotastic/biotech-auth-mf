import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedFarm: null,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      setSelectedFarm: (farm) =>
        set({
          selectedFarm: farm,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedFarm: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
