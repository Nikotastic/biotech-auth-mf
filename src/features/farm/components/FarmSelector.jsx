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
import { ToastContainer } from "@shared/components/ui/ToastContainer";
import { farmService } from "../services/farmService";
import { CreateFarmModal } from "./CreateFarmModal";

export default function FarmSelector() {
  const navigate = useNavigate();
  const {
    token,
    user,
    setSelectedFarm,
    selectedFarm: storedSelectedFarm,
  } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [farms, setFarms] = useState([]);
  const [selectedFarmLocal, setSelectedFarmLocal] = useState(
    storedSelectedFarm?.id || null,
  );
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        if (!token) {
          // If no token, probably needs login, but let's handle graceful degradation or mock
          setLoading(false);
          return;
        }
        const data = await farmService.getUserFarms(token, user?.id);
        // Ensure data is an array
        const farmList = Array.isArray(data) ? data : [];

        setFarms(farmList);

        // If there's only one farm, select it by default
        if (farmList.length === 1 && !selectedFarmLocal) {
          setSelectedFarmLocal(farmList[0].id);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        setFarms([]);
        addToast(
          "Error al cargar tus granjas. Por favor verifica tu conexión.",
          "error",
        );
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
        "success",
      );
      // Navegación inmediata tras selección
      navigate("/dashboard");
    } else {
      addToast("❌ Error al seleccionar la granja", "error");
    }
  };

  const handleCreateFarm = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateFarmSubmit = async (farmData) => {
    try {
      const newFarm = await farmService.createFarm(farmData);
      addToast(`✅ Granja "${farmData.name}" creada exitosamente`, "success");
      // Add new farm to list
      setFarms((prev) => [...prev, newFarm]);
      // Auto-select the new farm
      setSelectedFarmLocal(newFarm.id);
    } catch (error) {
      console.error("Error creating farm:", error);

      // Check if it's a 404 (endpoint doesn't exist)
      if (error.response?.status === 404) {
        addToast(
          "🚧 Funcionalidad en mantenimiento. Pronto podrás crear granjas desde aquí.",
          "warning",
        );
      } else if (error.response?.status === 500) {
        addToast(
          "⚠️ Error del servidor. Por favor intenta más tarde.",
          "error",
        );
      } else {
        addToast(
          "❌ Error al crear la granja. Verifica tu conexión e intenta nuevamente.",
          "error",
        );
      }
      throw error; // Re-throw to let modal handle it
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl px-1 sm:px-0"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg"
            >
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-green-900 mb-2"
            >
              {farms.length > 0
                ? "Selecciona tu Granja"
                : "Comenzar con BioTech Farm"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-green-600 px-4"
            >
              {farms.length > 0
                ? "Elige la granja que deseas gestionar hoy"
                : "Parece que aún no tienes granjas registradas. ¡Crea la primera!"}
            </motion.p>
          </div>

          {/* Farms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {farms.map((farm, index) => (
              <motion.button
                key={farm.id}
                onClick={() => handleSelect(farm.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 transition-all text-left w-full flex flex-row sm:flex-col gap-3 sm:gap-0 items-center sm:items-start ${
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
                    className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                )}

                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 sm:mb-4">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base sm:text-xl font-bold text-green-900 mb-1 sm:mb-2">
                    {farm.name}
                  </h3>

                  <div className="flex flex-row sm:flex-col gap-2 sm:gap-2">
                    {farm.location && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-green-600">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {farm.location}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-green-600">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="text-xs sm:text-sm">
                        {farm.animals || 0} animales
                      </span>
                    </div>
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
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/50 border-2 border-dashed border-green-300 rounded-2xl p-4 sm:p-6 flex sm:flex-col flex-row items-center gap-3 sm:gap-0 justify-start sm:justify-center text-left sm:text-center hover:bg-green-50/50 hover:border-green-500 transition-all min-h-[70px] sm:min-h-[180px]"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 sm:mb-3">
                <Plus className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-0 sm:mb-1">
                  Registrar Nueva Granja
                </h3>
                <p className="text-xs sm:text-sm text-green-600">
                  Añade una nueva ubicación
                </p>
              </div>
            </motion.button>
          </div>

          {/* Continue Button (Only visible if there are farms to select) */}
          {farms.length > 0 && (
            <motion.button
              onClick={() => onSelectFarm(selectedFarmLocal)}
              disabled={!selectedFarmLocal}
              whileHover={{ scale: selectedFarmLocal ? 1.01 : 1 }}
              whileTap={{ scale: selectedFarmLocal ? 0.99 : 1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`w-full py-3 sm:py-4 rounded-xl shadow-lg transition-all font-bold text-base sm:text-lg ${
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
            className="text-center text-[10px] sm:text-xs text-green-600 mt-6"
          >
            © 2026 BioTech Farm Management. Todos los derechos reservados.
          </motion.p>

          {/* Create Farm Modal */}
          <CreateFarmModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateFarmSubmit}
          />
        </motion.div>
      </div>
    </>
  );
}
