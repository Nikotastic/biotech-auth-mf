import apiClient from "@shared/utils/apiClient";
import { registerServiceMock } from "./registerServiceMock";

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const registerService = async (userData) => {
  if (USE_MOCK_API) {
    return await registerServiceMock.register(userData);
  }

  try {
    // Call the backend with the expected format: { fullName, email, password }
    const response = await apiClient.post("/Auth/register", {
      fullName: userData.name || userData.fullName,
      email: userData.email,
      password: userData.password,
    });

    // Backend returns { id: userId } with status 201
    const userId = response.data.id || response.data;

    // Auto-login after registration
    const loginResponse = await apiClient.post("/Auth/login", {
      email: userData.email,
      password: userData.password,
    });

    // Backend returns: { token, expiration, userId, email, fullName }
    const { token, userId: loginUserId, email, fullName } = loginResponse.data;

    // Adapt to the format expected by the frontend
    return {
      token,
      user: {
        id: loginUserId || userId,
        email: email,
        name: fullName,
        fullName: fullName,
      },
    };
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};
