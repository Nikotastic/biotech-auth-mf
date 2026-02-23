import apiClient from "@shared/utils/apiClient";
import { profileServiceMock } from "./profileServiceMock";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const profileService = {
  getProfile: async () => {
    if (USE_MOCK_API) {
      return await profileServiceMock.getProfile();
    }
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    if (USE_MOCK_API) {
      return await profileServiceMock.updateProfile(userData);
    }
    const response = await apiClient.put("/auth/profile", userData);
    return response.data;
  },
};
