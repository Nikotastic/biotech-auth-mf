import axios from "axios";

// Cliente de API configurado para el Gateway
const apiClient = axios.create({
  baseURL: "https://api-gateway-bio-tech.up.railway.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token JWT en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage");
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData?.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("auth-storage");
      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
