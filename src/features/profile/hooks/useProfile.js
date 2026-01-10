import { useState, useEffect } from "react";
import { useAuthStore } from "@shared/store/authStore";
import apiClient from "@shared/utils/apiClient";
import { profileServiceMock } from "../services/profileServiceMock";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const useProfile = () => {
  const { user, token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(user);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (USE_MOCK_API) {
        const data = await profileServiceMock.getProfile();
        setProfileData(data);
        return data;
      }
      
      const response = await apiClient.get("/auth/profile");
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
      if (user) setProfileData(user); // Optimistic
      fetchProfile();
    }
  }, [token]);

  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_API) {
        await profileServiceMock.updateProfile(data);
        setProfileData((prev) => ({ ...prev, ...data }));
        return { success: true };
      }
      
      // Corrected endpoint path to match ProfileController: api/auth/profile
      const response = await apiClient.put("/auth/profile", data);
      setProfileData((prev) => ({ ...prev, ...data })); // Optimistic or use response if it returns updated data
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
