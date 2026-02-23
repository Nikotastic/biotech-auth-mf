import apiClient from "@shared/utils/apiClient";

export const passwordService = {
  async forgotPassword(email) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },
};
