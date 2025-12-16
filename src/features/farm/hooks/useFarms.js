import { useState } from 'react'
import { farmService } from '../services/farmService'
import { useAuthStore } from '@shared/store/authStore'

export const useFarms = () => {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuthStore()

  const fetchFarms = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await farmService.getUserFarms(token)
      setFarms(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las granjas')
      // Mock data para desarrollo si falla la API
      setFarms([
        {
          id: 1,
          name: 'Granja El Progreso',
          location: 'Antioquia, Colombia',
          animalCount: 250,
          area: '50 hectáreas',
          description: 'Granja dedicada a la producción lechera'
        },
        {
          id: 2,
          name: 'Finca La Esperanza',
          location: 'Cundinamarca, Colombia',
          animalCount: 180,
          area: '35 hectáreas',
          description: 'Producción de ganado de carne'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return { farms, loading, error, fetchFarms }
}
