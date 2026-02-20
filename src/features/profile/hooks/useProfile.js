import { useState, useEffect } from "react";
import { useAuthStore } from "@shared/store/authStore";
import { profileService } from "../services/profileService";

export const useProfile = () => {
  const { user, token, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(user);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getProfile();
      setProfileData(data);
      return data;
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (user) setProfileData(user); // Optimistic
      fetchProfile();
    }
  }, [token]);

  const updateProfile = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await profileService.updateProfile(data);
      setProfileData((prev) => ({ ...prev, ...data }));
      return result;
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
