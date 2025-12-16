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

      logout: () => {
        // Limpiar el estado
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedFarm: null,
        });
        
        // Eliminar explícitamente del localStorage
        localStorage.removeItem("auth-storage");
        
        // Limpiar cualquier cookie relacionada
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
