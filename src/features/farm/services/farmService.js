import apiService from "@shared-services/ApiService";

/**
 * Farm Service — Full CRUD
 * Base: /api/v1/farms  (FarmsController uses explicit [Route("api/v1/farms")])
 */
export const farmService = {
  // ── GET /api/v1/farms/tenant/{userId} ─────────────────────────────────────
  async getUserFarms(token, userIdArg, includeInactive = false) {
    let userId = userIdArg;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    if (!userId) {
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

    if (!userId) throw new Error("User ID is required to fetch farms");

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

  // ── GET /api/v1/farms/mine ────────────────────────────────────────────────
  async getMyFarms(includeInactive = false) {
    const response = await apiClient.get(`/v1/farms/mine?includeInactive=${includeInactive}`);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.farms)) return data.farms;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  },

  // ── GET /api/v1/farms/{id} ────────────────────────────────────────────────
  async getFarmById(id) {
    const response = await apiClient.get(`/v1/farms/${id}`);
    return response.data?.data || response.data;
  },

  // ── POST /api/v1/farms ────────────────────────────────────────────────────
  async createFarm(farmData) {
    console.log("🚀 Creating farm with payload:", farmData);
    const response = await apiClient.post("/v1/farms", farmData);
    return response.data?.data || response.data;
  },

  // ── PUT /api/v1/farms/{id} ────────────────────────────────────────────────
  async updateFarm(id, farmData) {
    console.log(`✏️ Updating farm ${id} with payload:`, farmData);
    const response = await apiClient.put(`/v1/farms/${id}`, farmData);
    return response.data?.data || response.data;
  },

  // ── DELETE /api/v1/farms/{id} ─────────────────────────────────────────────
  async deleteFarm(id) {
    console.log(`🗑️ Deleting farm ${id}`);
    const response = await apiClient.delete(`/v1/farms/${id}`);
    return response.data;
  },
};

