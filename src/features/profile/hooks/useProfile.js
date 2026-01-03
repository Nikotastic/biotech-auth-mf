import { useState, useEffect } from "react";
import { useAuthStore } from "@shared/store/authStore";
import apiService from "@shared-services/ApiService";

export const useProfile = () => {
  const { user, token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(user);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/auth/profile");
      setProfileData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch to ensure we have latest data
    if (token) {
      if (user) setProfileData(user);
      // fetchProfile(); // Evitar sobrescritura con datos vacíos del backend
    }
  }, [token]);

  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Corrected endpoint path to match ProfileController: api/auth/profile
      const response = await apiService.put("/auth/profile", data);

      const updatedData = {
        ...profileData,
        ...data,
        name: data.fullName || data.name || profileData.name,
      };
      setProfileData(updatedData);

      // Actualizar el store global para persistencia (localStorage)
      const { setAuth } = useAuthStore.getState();
      setAuth(updatedData, token);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al actualizar perfil";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // Notificar cambio de autenticación para sincronizar
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  };

  return {
    profile: profileData,
    loading,
    error,
    updateProfile,
    logout: handleLogout,
    isAuthenticated: !!token,
  };
};
