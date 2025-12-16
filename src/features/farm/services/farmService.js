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

    // Correct endpoint matching FarmController.cs: [HttpGet("tenant/{tenantId}")] inside [Route("api/[controller]")]
    // So the path is /Farm/tenant/{id}
    const response = await apiClient.get(`/Farm/tenant/${userId}`, config);
    return response.data;
  },
};
