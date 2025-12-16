import apiClient from '@shared/utils/apiClient'

export const registerService = async (userData) => {
  try {
    // Call the backend with the expected format: { fullName, email, password }
    const response = await apiClient.post('/Auth/register', {
      fullName: userData.name || userData.fullName,
      email: userData.email,
      password: userData.password
    })
    
    // Backend returns { id: userId } with status 201
    const userId = response.data.id || response.data
    
    // Auto-login after registration
    const loginResponse = await apiClient.post('/Auth/login', {
      email: userData.email,
      password: userData.password
    })
    
    // Backend returns: { token, expiration, userId, email, fullName }
    const { token, userId: loginUserId, email, fullName } = loginResponse.data
    
    // Adapt to the format expected by the frontend
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
