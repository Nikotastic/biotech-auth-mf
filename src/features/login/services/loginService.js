import apiClient from '../../../shared/utils/apiClient'
import { tokenManager } from '../../../shared/utils/tokenManager'

export const loginService = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    tokenManager.setToken(response.data.token)
    return response.data
  }
}