import { useState } from "react";
import { loginService } from "../services/loginService";
import { useAuthStore } from "../../../shared/store/authStore";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginService.login(credentials);
      setAuth(data.user, data.token);
      window.dispatchEvent(new Event("auth-change"));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
