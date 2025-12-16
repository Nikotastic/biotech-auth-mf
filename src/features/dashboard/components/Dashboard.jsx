import { useNavigate } from 'react-router-dom'
import { 
  Home, Users, Activity, ShoppingCart, 
  Package, Heart, Baby, LogOut, Settings,
  TrendingUp, AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../../shared/store/authStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, selectedFarm, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const modules = [
    { 
      id: 'animals', 
      name: 'Animales', 
      icon: Home, 
      color: 'bg-blue-500',
      description: 'Gestión del rebaño'
    },
    { 
      id: 'health', 
      name: 'Salud', 
      icon: Heart, 
      color: 'bg-red-500',
      description: 'Control sanitario'
    },
    { 
      id: 'feeding', 
      name: 'Alimentación', 
      icon: Activity, 
      color: 'bg-green-500',
      description: 'Plan nutricional'
    },
    { 
      id: 'reproduction', 
      name: 'Reproducción', 
      icon: Baby, 
      color: 'bg-pink-500',
      description: 'Control reproductivo'
    },
    { 
      id: 'inventory', 
      name: 'Inventario', 
      icon: Package, 
      color: 'bg-purple-500',
      description: 'Gestión de recursos'
    },
    { 
      id: 'commercial', 
      name: 'Comercial', 
      icon: ShoppingCart, 
      color: 'bg-orange-500',
      description: 'Ventas y compras'
    }
  ]

  const stats = [
    { label: 'Total Animales', value: selectedFarm?.animalCount || '0', trend: '+5%', icon: Home },
    { label: 'Alertas Activas', value: '3', trend: '-2', icon: AlertCircle },
    { label: 'Productividad', value: '87%', trend: '+12%', icon: TrendingUp },
    { label: 'Inventario', value: '95%', trend: '+3%', icon: Package }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedFarm?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">
                {selectedFarm?.location || 'Ubicación no disponible'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => navigate('/farm-selector')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cambiar granja"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Modules */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Módulos del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{module.name}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
