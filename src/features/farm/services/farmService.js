import apiService from "@shared-services/ApiService";

export const farmService = {
  async getUserFarms(token, userIdArg, includeInactive = false) {
    let userId = userIdArg;
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

    // Official endpoint: /api/v1/farms/tenant/{userId}
    // Since apiClient already has /api, we just add /v1/farms/tenant/{userId}
    const finalUrl = `/v1/farms/tenant/${userId}?includeInactive=${includeInactive}`;
    console.log(`📡 Fetching farms from URL: ${finalUrl}`);

    const response = await apiClient.get(finalUrl, config);
    const data = response.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.farms)) return data.farms;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.farms)) return data.data.farms;
    if (Array.isArray(data?.items)) return data.items;
    
    return [];
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
