import { create } from "zustand";
import { persist } from "zustand/middleware";
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

      /**
       * Establece la autenticación del usuario
       * @param {object} user - Datos del usuario
       * @param {string} token - Token JWT
       */
      setAuth: (user, token) => {
        // Validar que el token no esté expirado antes de guardarlo
        if (tokenManager.isTokenExpired(token)) {
          console.warn("Attempted to set expired token");
          get().logout();
          return;
        }

        // Guardar en cookies usando tokenManager
        tokenManager.setToken(token);

        set({
          user,
          token,
          isAuthenticated: true,
        });

        console.log("✅ Authentication set successfully");
      },

      /**
       * Establece la granja seleccionada
       * @param {object} farm - Datos de la granja
       */
      setSelectedFarm: (farm) => {
        set({
          selectedFarm: farm,
        });
      },

      /**
       * Verifica si el token actual es válido
       * @returns {boolean} true si el token es válido
       */
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

      /**
       * Obtiene el payload del token actual
       * @returns {object|null} Payload del token
       */
      getTokenPayload: () => {
        const { token } = get();
        return tokenManager.decodeToken(token);
      },

      /**
       * Sincroniza el token desde cookies al store
       * Útil para recuperar sesión después de recargar la página
       */
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

      /**
       * Cierra la sesión del usuario
       * Limpia todo el estado y las cookies
       */
      logout: () => {
        // Limpiar el estado
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          selectedFarm: null,
        });

        // Eliminar del localStorage
        localStorage.removeItem("auth-storage");

        // Limpiar cookies usando tokenManager
        tokenManager.clearAuth();

        console.log("✅ Logout successful");
      },

      /**
       * Actualiza los datos del usuario sin cambiar el token
       * @param {object} userData - Datos actualizados del usuario
       */
      updateUser: (userData) => {
        const { user } = get();
        set({
          user: { ...user, ...userData },
        });
      },
    }),
    {
      name: "auth-storage",
      // Función para sincronizar después de hidratar desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Verificar validez del token después de hidratar
          if (state.token && tokenManager.isTokenExpired(state.token)) {
            console.warn("Stored token expired, clearing auth state");
            state.logout();
          } else if (state.token) {
            // Sincronizar token válido a cookies
            tokenManager.setToken(state.token);
          }
        }
      },
    },
  ),
);

/**
 * Inicializar sincronización de tokens al cargar el módulo
 */
if (typeof window !== "undefined") {
  // Sincronizar token desde cookies al cargar
  const store = useAuthStore.getState();
  store.syncTokenFromCookies();

  // Verificar validez del token periódicamente (cada 5 minutos)
  setInterval(
    () => {
      const currentStore = useAuthStore.getState();
      if (currentStore.isAuthenticated) {
        currentStore.isTokenValid();
      }
    },
    5 * 60 * 1000,
  ); // 5 minutos
}
