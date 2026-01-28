import axios from "axios";
import { useAuthStore } from "@shared/store/authStore";
import { tokenManager } from "@shared/utils/tokenManager";

// Get API URL from environment or use mock mode
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
const API_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  "https://api-gateway-bio-tech.up.railway.app/api";

// Cliente de API configurado para el Gateway
const apiClient = axios.create({
  baseURL: USE_MOCK_API ? "http://localhost:9999/mock-api" : API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Interceptor de Request - Agrega el token JWT a cada petición
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token desde el store de Zustand
    const authState = useAuthStore.getState();
    const token = authState.token;

    if (token) {
      // Verificar si el token ha expirado antes de usarlo
      if (tokenManager.isTokenExpired(token)) {
        console.warn("Token expired, logging out...");
        authState.logout();
        // Rechazar la petición si el token expiró
        return Promise.reject(new Error("Token expired"));
      }

      // Agregar token al header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor de Response - Maneja errores de autenticación
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const authState = useAuthStore.getState();

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      console.warn("401 Unauthorized - Token inválido o expirado");

      // Hacer logout y limpiar estado
      authState.logout();

      // Emitir evento para notificar cambio de autenticación
      window.dispatchEvent(new Event("auth-change"));

      // Redirigir al login solo si no estamos ya en la página de login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Manejar errores de permisos
    if (error.response?.status === 403) {
      console.warn("403 Forbidden - No tienes permisos para esta acción");
    }

    // Manejar errores de servidor
    if (error.response?.status >= 500) {
      console.error(
        "Server error:",
        error.response?.status,
        error.response?.data,
      );
    }

    return Promise.reject(error);
  },
);

export default apiClient;
