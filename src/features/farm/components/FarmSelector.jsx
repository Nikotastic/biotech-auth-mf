import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Check,
  MapPin,
  Users,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@shared/store/authStore";
import { useToastStore } from "@shared/store/toastStore";
import { farmService } from "../services/farmService";

export default function FarmSelector() {
  const navigate = useNavigate();
  const {
    token,
    setSelectedFarm,
    selectedFarm: storedSelectedFarm,
  } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [farms, setFarms] = useState([]);
  const [selectedFarmLocal, setSelectedFarmLocal] = useState(
    storedSelectedFarm?.id || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        if (!token) {
          // If no token, probably needs login, but let's handle graceful degradation or mock
          setLoading(false);
          return;
        }
        const data = await farmService.getUserFarms(token);
        // Ensure data is an array
        const farmList = Array.isArray(data) ? data : [];
        setFarms(farmList);

        // If there's only one farm, select it by default
        if (farmList.length === 1 && !selectedFarmLocal) {
          setSelectedFarmLocal(farmList[0].id);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        addToast("No se pudieron cargar las granjas", "error");
        // We set farms to empty so user sees the "Create" option
        setFarms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [token]);

  const handleSelect = (farmId) => {
    setSelectedFarmLocal(farmId);
  };

  const onSelectFarm = (farmId) => {
    if (!farmId) {
      addToast("⚠️ Por favor selecciona una granja", "warning");
      return;
    }
    const farm = farms.find((f) => f.id === farmId);
    if (farm) {
      setSelectedFarm(farm);
      addToast(
        `✅ Granja "${farm.name}" seleccionada correctamente`,
        "success"
      );
      setTimeout(() => {
        // Force a hard reload or ensure router knows where dashboard is
        // Usually navigate('/dashboard') is enough if it's SPA
        // But if it's shell, we might need window.location
        window.location.href = "/dashboard";
      }, 300);
    } else {
      addToast("❌ Error al seleccionar la granja", "error");
    }
  };

  const handleCreateFarm = () => {
    addToast("🚧 Funcionalidad de crear granja en construcción", "info");
    // Here you would navigate to /create-farm or open a modal
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-green-900 mb-2"
          >
            {farms.length > 0
              ? "Selecciona tu Granja"
              : "Comenzar con BioTech Farm"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-green-600"
          >
            {farms.length > 0
              ? "Elige la granja que deseas gestionar hoy"
              : "Parece que aún no tienes granjas registradas. ¡Crea la primera!"}
          </motion.p>
        </div>

        {/* Farms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {farms.map((farm, index) => (
            <motion.button
              key={farm.id}
              onClick={() => handleSelect(farm.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all text-left h-full flex flex-col ${
                selectedFarmLocal === farm.id
                  ? "border-green-500 ring-4 ring-green-100"
                  : "border-green-100 hover:border-green-300"
              }`}
            >
              {/* Selected Indicator */}
              {selectedFarmLocal === farm.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}

              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-green-900 mb-2">
                {farm.name}
              </h3>

              <div className="space-y-2 mt-auto">
                {farm.location && (
                  <div className="flex items-center gap-2 text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{farm.location}</span>
                  </div>
                )}
                {/* Mock data fields if real API doesn't return them yet, handle gracefully */}
                <div className="flex items-center gap-2 text-green-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{farm.animals || 0} animales</span>
                </div>
              </div>
            </motion.button>
          ))}

          {/* Create New Farm Card */}
          <motion.button
            onClick={handleCreateFarm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + farms.length * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-white/50 border-2 border-dashed border-green-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-green-50/50 hover:border-green-500 transition-all min-h-[200px]"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-1">
              Registrar Nueva Granja
            </h3>
            <p className="text-sm text-green-600">
              Añade una nueva ubicación a tu cuenta
            </p>
          </motion.button>
        </div>

        {/* Continue Button (Only visible if there are farms to select) */}
        {farms.length > 0 && (
          <motion.button
            onClick={() => onSelectFarm(selectedFarmLocal)}
            disabled={!selectedFarmLocal}
            whileHover={{ scale: selectedFarmLocal ? 1.02 : 1 }}
            whileTap={{ scale: selectedFarmLocal ? 0.98 : 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`w-full py-4 rounded-xl shadow-lg transition-all font-bold text-lg ${
              selectedFarmLocal
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuar al Dashboard
          </motion.button>
        )}

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
  );
}
