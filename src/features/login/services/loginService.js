import apiClient from '@shared/utils/apiClient'

export const loginService = {
  login: async (credentials) => {
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