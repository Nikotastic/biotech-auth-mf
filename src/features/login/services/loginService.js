import apiClient from '../../../shared/utils/apiClient'

export const loginService = {
  login: async (credentials) => {
    try {
      // Llamar al backend con el formato esperado: { email, password }
      const response = await apiClient.post('/Auth/login', {
        email: credentials.email,
        password: credentials.password
      })
      
      // Backend retorna: { token, expiration, userId, email, fullName }
      const { token, userId, email, fullName } = response.data
      
      // Adaptar al formato que espera el frontend
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