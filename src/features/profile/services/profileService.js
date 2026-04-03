import apiClient from "@shared/utils/apiClient";

export const profileService = {
  // GET /api/Auth/profile - Get the authenticated user's profile
  getProfile: async () => {
    const response = await apiClient.get("/v1/auth/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await apiClient.put("/v1/auth/profile", userData);
    return response.data;
  },
};

export default profileService;
