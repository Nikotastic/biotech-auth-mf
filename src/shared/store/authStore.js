import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { tokenManager } from "@shared/utils/tokenManager";

/**
 * Auth Store - Manejo centralizado del estado de autenticación
 * Integrado con tokenManager para sincronización entre localStorage y cookies
 */
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
        // Validar que el token no esté expirado antes de guardarlo
        if (tokenManager.isTokenExpired(token)) {
          console.warn("Attempted to set expired token");
          get().logout();
          return;
        }

        // Guardar en cookies usando tokenManager
        tokenManager.setToken(token);

        set({ user, token, isAuthenticated: true });

        // Notify environment of authentication change
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:login", { detail: { user, token } }),
          );
          window.dispatchEvent(new Event("auth-change"));
        }
      },

      setSelectedFarm: (farm) => {
        set({ selectedFarm: farm });

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("farm:selected", { detail: { farm } }),
          );

          try {
            const authStorage = JSON.parse(
              localStorage.getItem("auth-storage") || "{}",
            );
            if (authStorage.state) {
              authStorage.state.selectedFarm = farm;
              localStorage.setItem("auth-storage", JSON.stringify(authStorage));
            }
          } catch (e) {
            console.error("Error manual persisting farm", e);
          }

          window.dispatchEvent(new Event("auth-change"));
        }
      },

      isTokenValid: () => {
        const { token } = get();
        if (!token) return false;

        const isValid = !tokenManager.isTokenExpired(token);

        // Si el token expiró, hacer logout automáticamente
        if (!isValid) {
          console.warn("Token expired, logging out...");
          get().logout();
        }

        return isValid;
      },

      getTokenPayload: () => {
        const { token } = get();
        return tokenManager.decodeToken(token);
      },

      syncTokenFromCookies: () => {
        const cookieToken = tokenManager.getToken();
        const { token: storeToken } = get();

        // Si hay token en cookies pero no en el store, sincronizar
        if (cookieToken && !storeToken) {
          if (!tokenManager.isTokenExpired(cookieToken)) {
            const payload = tokenManager.decodeToken(cookieToken);
            set({
              token: cookieToken,
              isAuthenticated: true,
              // Intentar reconstruir user desde el payload si es posible
              user: payload
                ? {
                    id: payload.userId || payload.sub,
                    email: payload.email,
                    name: payload.name || payload.fullName,
                  }
                : null,
            });
            console.log("✅ Token synchronized from cookies");
          } else {
            // Token en cookies expirado, limpiar
            tokenManager.clearAuth();
          }
        }
      },

      logout: () => {
        window.dispatchEvent(new CustomEvent("auth:logout"));

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedFarm: null,
        });

        localStorage.removeItem("auth-storage");
        tokenManager.clearAuth();

        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-change"));
        }
      },

      updateUser: (userData) => {
        const { user } = get();
        set({
          user: { ...user, ...userData },
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          if (state.token && tokenManager.isTokenExpired(state.token)) {
            console.warn("Stored token expired, clearing auth state");
            state.logout();
          } else if (state.token) {
            tokenManager.setToken(state.token);
          }
        }
      },
    },
  ),
);

if (typeof window !== "undefined") {
  const store = useAuthStore.getState();
  store.syncTokenFromCookies();

  setInterval(
    () => {
      const currentStore = useAuthStore.getState();
      if (currentStore.isAuthenticated) {
        currentStore.isTokenValid();
      }
    },
    5 * 60 * 1000,
  );
}
