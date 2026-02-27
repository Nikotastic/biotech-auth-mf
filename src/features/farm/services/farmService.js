import apiClient from "@shared/utils/apiClient";

export const farmService = {
  async getUserFarms(token, userId) {
    // If token is explicitly passed, verify headers, otherwise apiClient handles it
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    if (!userId) {
      console.warn("getUserFarms: No userId provided via arguments");
      // Fallback: try to get from localStorage if not provided
      try {
        const stored = localStorage.getItem("auth-storage");
        if (stored) {
          const parsed = JSON.parse(stored);
          userId = parsed.state?.user?.id;
        }
      } catch (e) {
        console.error("Error reading userId from storage", e);
      }
    }

    if (!userId) {
      throw new Error("User ID is required to fetch farms");
    }

    // Updated to v1 endpoint: GET /api/v1/Farms/tenant/{userId}
    const response = await apiClient.get(`/v1/Farms/tenant/${userId}`, config);
    return response.data;
  },

  async getFarmById(id) {
    // GET /api/v1/Farms/{id}
    const response = await apiClient.get(`/v1/Farms/${id}`);
    return response.data;
  },

  async createFarm(farmData) {
    // POST /api/v1/Farms
    const response = await apiClient.post("/v1/Farms", farmData);
    return response.data;
  },
};
