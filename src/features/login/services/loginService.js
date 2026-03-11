import apiClient from "@shared/utils/apiClient";

export const loginService = {
  login: async (credentials) => {
    // Use real API
    try {
      // Call the backend with the expected format: { email, password }
      const response = await apiClient.post("/v1/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;
      console.log("📡 Raw Login Response:", data);

      // Resilient extraction: check both top-level and nested 'data' object
      const actualData = data?.data || data;

      // Resilient ID extraction (handles both camelCase and PascalCase)
      const userId =
        actualData.userId || actualData.id || actualData.Id || actualData.sub;
      const fullName =
        actualData.fullName ||
        actualData.name ||
        actualData.FullName ||
        actualData.Name;
      const email = actualData.email || actualData.Email;
      const token =
        actualData.token ||
        actualData.Token ||
        actualData.jwt ||
        actualData.access_token;

      if (!token) {
        console.warn("⚠️ No token found in responsive! data:", actualData);
      }

      // Adapt to the format expected by the frontend
      return {
        token,
        user: {
          id: userId,
          email: email,
          name: fullName,
          fullName: fullName,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
};
