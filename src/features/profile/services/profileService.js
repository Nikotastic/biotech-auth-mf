import apiClient from "@shared/utils/apiClient";

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put("/auth/profile", userData);
    return response.data;
  },
};
