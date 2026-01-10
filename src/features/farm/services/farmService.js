import apiClient from "@shared/utils/apiClient";

// Mock data
const MOCK_FARMS = [
  {
    id: "farm-1",
    name: "Granja Demo",
    location: "Valle del Cauca, Colombia",
    size: 50,
    animalCount: 120,
    tenantId: "user-1"
  }
];

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const farmService = {
  async getUserFarms(token, userId) {
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API for farms');
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_FARMS.filter(f => f.tenantId === userId);
    }
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

    // Correct endpoint matching FarmController.cs: [HttpGet("tenant/{tenantId}")] inside [Route("api/[controller]")]
    // So the path is /Farm/tenant/{id}
    const response = await apiClient.get(`/Farm/tenant/${userId}`, config);
    return response.data;
  },

  async createFarm(farmData) {
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API - creating farm');
      await new Promise(resolve => setTimeout(resolve, 300));
      const newFarm = {
        id: `farm-${MOCK_FARMS.length + 1}`,
        ...farmData,
        animalCount: 0
      };
      MOCK_FARMS.push(newFarm);
      return newFarm;
    }
    // POST /api/Farm
    const response = await apiClient.post("/Farm", farmData);
    return response.data;
  },
};
