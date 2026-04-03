import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  Activity,
  ShoppingCart,
  Package,
  Heart,
  Baby,
  LogOut,
  Settings,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@shared/store/authStore";
import { useToastStore } from "@shared/store/toastStore";
import alertService from "@shared/utils/alertService";
import apiClient from "@shared/utils/apiClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, selectedFarm, logout } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const [animalCount, setAnimalCount] = useState(0);

  useEffect(() => {
    if (selectedFarm?.id) {
      const fetchAnimals = async () => {
        try {
          const res = await apiClient.get(`/v1/animals?farmId=${selectedFarm.id}`);
          const list = res.data?.data || res.data || [];
          setAnimalCount(list.length);
        } catch (err) {
          console.error("Error fetching animal count in dashboard:", err);
          // Fallback simple si falla la API
          setAnimalCount(0);
        }
      };
      fetchAnimals();
    }
  }, [selectedFarm?.id]);

  const handleLogout = () => {
    alertService.success("¡Hasta pronto!", "Sesión Cerrada");
    setTimeout(() => {
      logout();
      // Notify authentication change to sync
      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/";
    }, 800);
  };

  const modules = [
    {
      id: "animals",
      name: "Animales",
      icon: Home,
      color: "bg-blue-500",
      description: "Gestión del rebaño",
    },
    {
      id: "health",
      name: "Salud",
      icon: Heart,
      color: "bg-red-500",
      description: "Control sanitario",
    },
    {
      id: "feeding",
      name: "Alimentación",
      icon: Activity,
      color: "bg-green-500",
      description: "Plan nutricional",
    },
    {
      id: "reproduction",
      name: "Reproducción",
      icon: Baby,
      color: "bg-pink-500",
      description: "Control reproductivo",
    },
    {
      id: "inventory",
      name: "Inventario",
      icon: Package,
      color: "bg-purple-500",
      description: "Gestión de recursos",
    },
    {
      id: "commercial",
      name: "Comercial",
      icon: ShoppingCart,
      color: "bg-orange-500",
      description: "Ventas y compras",
    },
  ];

  const stats = [
    {
      label: "Total Animales",
      value: animalCount.toString(),
      trend: "+5%",
      icon: Home,
    },
    { label: "Alertas Activas", value: "3", trend: "-2", icon: AlertCircle },
    { label: "Productividad", value: "87%", trend: "+12%", icon: TrendingUp },
    { label: "Inventario", value: "95%", trend: "+3%", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {selectedFarm?.name || "Dashboard"}
              </h1>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                {selectedFarm?.location || "Ubicación General"}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">
                  {user?.name || user?.fullName}
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/farm-selector")}
                  className="p-2.5 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all text-gray-500"
                  title="Configurar Granja"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all text-red-500"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <span
                  className={`text-xs font-black px-2 py-1 rounded-md ${
                    stat.trend.startsWith("+")
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Modules */}
        <div>
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-black text-gray-900">Módulos de Gestión</h2>
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">BioTech Suite v1.0</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${module.color} opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                
                <div
                  className={`${module.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}
                >
                  <module.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  {module.name}
                </h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">{module.description}</p>
                
                <div className="mt-6 flex items-center text-emerald-500 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorar módulo →
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
