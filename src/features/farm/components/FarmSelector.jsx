import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Check, MapPin, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@shared/store/authStore'
import { useToastStore } from '@shared/store/toastStore'

export default function FarmSelector() {
  const navigate = useNavigate()
  const { setSelectedFarm } = useAuthStore()
  const addToast = useToastStore((state) => state.addToast)
  const [selectedFarm, setSelectedFarmLocal] = useState('1')

  // Mock farms para pruebas
  const farms = [
    {
      id: '1',
      name: 'Finca El Progreso',
      location: 'Valle del Cauca',
      size: '250 hectáreas',
      animals: 156,
      productivity: '95%'
    },
    {
      id: '2',
      name: 'Hacienda Santa Rosa',
      location: 'Antioquia',
      size: '180 hectáreas',
      animals: 98,
      productivity: '92%'
    },
    {
      id: '3',
      name: 'Finca Los Robles',
      location: 'Cundinamarca',
      size: '120 hectáreas',
      animals: 75,
      productivity: '88%'
    }
  ]

  const handleSelect = (farmId) => {
    setSelectedFarmLocal(farmId)
  }

  const onSelectFarm = (farmId) => {
    if (!farmId) {
      addToast("⚠️ Por favor selecciona una granja", "warning")
      return
    }
    const farm = farms.find(f => f.id === farmId)
    if (farm) {
      setSelectedFarm(farm)
      addToast(`✅ Granja "${farm.name}" seleccionada correctamente`, "success")
      setTimeout(() => {
        navigate('/dashboard')
      }, 300)
    } else {
      addToast("❌ Error al seleccionar la granja", "error")
    }
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-green-900 mb-2"
          >
            Selecciona tu Finca
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-green-600"
          >
            Elige la finca que deseas gestionar
          </motion.p>
        </div>

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {farms.map((farm, index) => (
            <motion.button
              key={farm.id}
              onClick={() => handleSelect(farm.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all text-left ${
                selectedFarm === farm.id
                  ? 'border-green-500 ring-4 ring-green-100'
                  : 'border-green-100 hover:border-green-300'
              }`}
            >
              {/* Selected Indicator */}
              {selectedFarm === farm.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Farm Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>

              {/* Farm Info */}
              <h3 className="text-green-900 mb-3">{farm.name}</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{farm.location}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{farm.size}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{farm.animals} animales</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{farm.productivity} productividad</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={() => onSelectFarm(selectedFarm)}
          disabled={!selectedFarm}
          whileHover={{ scale: selectedFarm ? 1.02 : 1 }}
          whileTap={{ scale: selectedFarm ? 0.98 : 1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`w-full py-4 rounded-xl shadow-lg transition-all ${
            selectedFarm
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continuar
        </motion.button>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-green-600 mt-6"
        >
          © 2024 BioTech Farm Management. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  )
}
