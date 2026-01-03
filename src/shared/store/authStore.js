import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedFarm: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Emitir evento para que el Shell y ApiService se enteren
        window.dispatchEvent(
          new CustomEvent("auth:login", { detail: { user, token } })
        );
      },

      setSelectedFarm: (farm) => {
        set({ selectedFarm: farm });
        window.dispatchEvent(
          new CustomEvent("farm:selected", { detail: { farm } })
        );
      },

      logout: () => {
        // Notificar logout al sistema
        window.dispatchEvent(new CustomEvent("auth:logout"));

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
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
