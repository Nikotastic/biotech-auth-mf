import { useState, useEffect } from 'react'
import { useAuthStore } from '@shared/store/authStore'
import apiClient from '@shared/utils/apiClient'

export const useProfile = () => {
  const { user, token, logout } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [profileData, setProfileData] = useState(user)

  useEffect(() => {
    if (user) {
      setProfileData(user)
    }
  }, [user])

  const updateProfile = async (data) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.put('/profile', data)
      setProfileData(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar perfil'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    // Notificar cambio de autenticación para sincronizar
    window.dispatchEvent(new Event("auth-change"))
    window.location.href = '/'
  }

  return { 
    profile: profileData, 
    loading, 
    error, 
    updateProfile,
    logout: handleLogout,
    isAuthenticated: !!token
  }
}
