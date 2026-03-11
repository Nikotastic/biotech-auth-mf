import apiClient from "@shared/utils/apiClient";

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

  async getFarmById(id) {
    // GET /v1/Farms/{id}
    const response = await apiClient.get(`/v1/Farms/${id}`);
    return response.data;
  },

  async createFarm(farmData) {
    // POST /v1/Farms
    console.log("🚀 Creating farm with payload:", farmData);
    const response = await apiClient.post("/v1/Farms", farmData);
    return response.data;
  },
};
