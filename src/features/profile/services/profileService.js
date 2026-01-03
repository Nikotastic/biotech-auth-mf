import apiService from "@shared-services/ApiService";

export const profileService = {
  // GET /api/Auth/profile - Get the authenticated user's profile
  getProfile: async () => {
    try {
      const response = await apiService.get("/Auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // PUT /api/Auth/profile - Update the authenticated user's profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiService.put("/Auth/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
};

export default profileService;
