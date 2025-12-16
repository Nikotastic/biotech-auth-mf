import { useState } from 'react'
import { registerService } from '../services/registerService'
import { useAuthStore } from '@shared/store/authStore'

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const setAuth = useAuthStore((state) => state.setAuth)

  const register = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await registerService(userData)
      
      // Save to store: setAuth(user, token)
      setAuth(response.user, response.token)
      
      // Notify authentication change
      window.dispatchEvent(new Event('auth-change'))
      
      return response
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          'Error al registrar usuario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}
