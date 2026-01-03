import apiService from "@shared-services/ApiService";

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

    // Backend route: /api/v1/Farms/tenant/{userId}
    const response = await apiService.get(`/v1/Farms/tenant/${userId}`, config);
    // Backend returns ApiResponse<FarmListResponse> = { success, data: { farms: [...] }, message }
    return response.data?.data || response.data;
  },

  async createFarm(farmData) {
    // POST /api/v1/Farms
    const response = await apiService.post("/v1/Farms", farmData);
    // Backend returns ApiResponse<FarmResponse> = { success, data: {...}, message }
    return response.data?.data || response.data;
  },

  async getFarmById(farmId) {
    // GET /api/v1/Farms/{id}
    if (!farmId) {
      throw new Error("Farm ID is required");
    }
    const response = await apiService.get(`/v1/Farms/${farmId}`);
    // Backend returns ApiResponse<FarmResponse> = { success, data: {...}, message }
    return response.data?.data || response.data;
  },
};
