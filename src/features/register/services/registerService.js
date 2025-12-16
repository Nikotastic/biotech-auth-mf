import apiClient from '../../../shared/utils/apiClient'

export const registerService = async (userData) => {
  try {
    // Llamar al backend con el formato esperado: { fullName, email, password }
    const response = await apiClient.post('/Auth/register', {
      fullName: userData.name || userData.fullName,
      email: userData.email,
      password: userData.password
    })
    
    // Backend retorna { id: userId } con status 201
    const userId = response.data.id || response.data
    
    // Auto-login después del registro
    const loginResponse = await apiClient.post('/Auth/login', {
      email: userData.email,
      password: userData.password
    })
    
    // Backend retorna: { token, expiration, userId, email, fullName }
    const { token, userId: loginUserId, email, fullName } = loginResponse.data
    
    // Adaptar al formato que espera el frontend
    return {
      token,
      user: {
        id: loginUserId || userId,
        email: email,
        name: fullName,
        fullName: fullName
      }
    }
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}
