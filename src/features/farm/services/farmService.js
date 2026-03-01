import apiClient from "@shared/utils/apiClient";

export const farmService = {
  async getUserFarms(token, userIdArg) {
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

    // Official endpoint from your image: /api/v1/Farms/tenant/{userId}
    // Since apiClient already has /api, we just add /v1/Farms/tenant/{userId}
    const finalUrl = `/v1/Farms/tenant/${userId}`;
    console.log(`📡 Fetching farms from URL: ${finalUrl}`);

    const response = await apiClient.get(finalUrl, config);
    return response.data;
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
