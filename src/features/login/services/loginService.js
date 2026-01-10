import apiClient from '@shared/utils/apiClient'
import { loginServiceMock } from './loginServiceMock'

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export const loginService = {
  login: async (credentials) => {
    // Use mock service if enabled
    if (USE_MOCK_API) {
      console.log('🧪 Using MOCK API for login');
      return await loginServiceMock.login(credentials);
    }

    // Use real API
    try {
      // Call the backend with the expected format: { email, password }
      const response = await apiClient.post('/Auth/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      // Backend returns: { token, expiration, userId, email, fullName }
      const { token, userId, email, fullName } = response.data
      
      // Adapt to the format expected by the frontend
      return {
        token,
        user: {
          id: userId,
          email: email,
          name: fullName,
          fullName: fullName
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
}