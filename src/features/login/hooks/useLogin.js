import { useState } from "react";
import { loginService } from "../services/loginService";
import { useAuthStore } from "@shared/store/authStore";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginService.login(credentials);
      
      // Guardar en el store: setAuth(user, token)
      setAuth(data.user, data.token);
      
      // Notificar cambio de autenticación
      window.dispatchEvent(new Event("auth-change"));
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          "Error al iniciar sesión";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
