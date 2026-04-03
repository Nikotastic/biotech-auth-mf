import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Check,
  MapPin,
  Users,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@shared/store/authStore";
import { useToastStore } from "@shared/store/toastStore";
import { ToastContainer } from "@shared/components/ui/ToastContainer";
import alertService from "@shared/utils/alertService";
import { farmService } from "../services/farmService";
import { CreateFarmModal } from "./CreateFarmModal";
import { EditFarmModal } from "./EditFarmModal";
import apiClient from "@shared/utils/apiClient";

// Helper: normalize farm object from any backend shape
const normalizeFarm = (f, fallback = {}) => {
  const raw = f?.data || f || {};
  const d = raw.data && typeof raw.data === "object" ? raw.data : raw;

  return {
    id: String(d.id || d.Id || fallback.id || Date.now()),
    name: d.name || d.Name || fallback.name || "Granja sin nombre",
    location:
      d.address ||
      d.geographicLocation ||
      d.location ||
      fallback.location ||
      "Sin ubicación",
    animals: d.animals || d.animalCount || 0,
    size: d.size || 0,
    description: d.description || "",
    owner: d.owner || d.Owner || "",
  };
};

export default function FarmSelector() {
  const navigate = useNavigate();
  const { token, user, setSelectedFarm, selectedFarm: storedSelectedFarm } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [farms, setFarms] = useState([]);
  const [selectedFarmLocal, setSelectedFarmLocal] = useState(storedSelectedFarm?.id || null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredFarms = farms.filter(
    (f) =>
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredFarms.length / itemsPerPage);
  const paginatedFarms = filteredFarms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // Fetch farms on mount
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        if (!token) { setLoading(false); return; }
        const response = await farmService.getUserFarms(token, user?.id);
        const baseFarmList = (Array.isArray(response) ? response : []).map((f) => normalizeFarm(f));
        
        // Inyectar granja demo si está vacío
        if (baseFarmList.length === 0) {
           baseFarmList.push({
             id: "demo-farm-id",
             name: "Granja de Prueba 🚀",
             location: "Virtual",
             animals: 0
           });
        }

        setFarms(baseFarmList);

        if (baseFarmList.length === 1 && !selectedFarmLocal) {
          setSelectedFarmLocal(baseFarmList[0].id);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        addToast("Error al cargar granjas", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, [token, user?.id]);

  const handleSelect = (farmId) => setSelectedFarmLocal(farmId);

  const onSelectFarm = async (farmId) => {
    if (!farmId) { addToast("⚠️ Selecciona una granja", "warning"); return; }
    const farm = farms.find((f) => f.id === farmId);
    if (farm) {
      setSelectedFarm(farm);
      alertService.success(`Granja seleccionada: ${farm.name}`, "Éxito");
      navigate("/dashboard");
    }
  };

  const handleCreateFarmSubmit = async (farmData) => {
    try {
      const response = await farmService.createFarm(farmData);
      const normalizedNewFarm = normalizeFarm(response, farmData);
      setFarms((prev) => [...prev, normalizedNewFarm]);
      setSelectedFarmLocal(normalizedNewFarm.id);
      addToast("✅ Granja creada", "success");
    } catch (error) {
      console.error("Error creating farm:", error);
      addToast("❌ Error al crear granja", "error");
      throw error;
    }
  };

  const handleUpdateFarm = async (farmId, farmData) => {
      try {
        const response = await farmService.updateFarm(farmId, farmData);
        const updated = normalizeFarm(response, farmData);
        setFarms((prev) => prev.map((f) => (f.id === farmId ? { ...f, ...updated } : f)));
        addToast("✅ Granja actualizada", "success");
      } catch (error) {
        addToast("❌ Error al actualizar", "error");
        throw error;
      }
  };

  const handleDeleteFarm = async (farmId) => {
      try {
        await farmService.deleteFarm(farmId);
        setFarms((prev) => prev.filter((f) => f.id !== farmId));
        if (selectedFarmLocal === farmId) setSelectedFarmLocal(null);
        addToast("🗑️ Granja eliminada", "success");
      } catch (error) {
        addToast("❌ Error al eliminar", "error");
        throw error;
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-green-600">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-green-600/20">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-green-900 mb-2">Mis Granjas</h1>
            <p className="text-green-600 font-bold uppercase tracking-widest text-xs">Gestión Centralizada BioTech</p>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 items-stretch max-w-4xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400 group-focus-within:text-green-600 transition-colors" />
              <input
                type="text"
                placeholder="Buscar por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-green-100 rounded-2xl bg-white outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all text-green-950 font-bold"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-10 py-5 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all font-black shadow-xl shadow-green-600/20"
            >
              <Plus className="w-6 h-6" />
              NUEVA GRANJA
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedFarms.map((farm, index) => (
              <motion.div
                key={farm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-white rounded-[2rem] p-8 border-2 transition-all group cursor-pointer ${
                  selectedFarmLocal === farm.id
                    ? "border-green-500 ring-8 ring-green-50 backdrop-blur-sm shadow-2xl"
                    : "border-green-50 hover:border-green-200 shadow-sm"
                }`}
                onClick={() => handleSelect(farm.id)}
              >
                {selectedFarmLocal === farm.id && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                    <Check className="w-6 h-6" />
                  </div>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); setEditingFarm(farm); }}
                  className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2 truncate">{farm.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-500">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-tight truncate">{farm.location || "Sin Ubicación"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <Users className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-tight">{farm.animals || 0} Animales</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black tracking-widest text-gray-400">UUID: {String(farm.id).slice(0, 8)}</span>
                  <span className="text-emerald-600 font-black text-xs uppercase">Gestionar →</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer & Continue */}
          <div className="flex flex-col items-center gap-8 max-w-xl mx-auto pb-10">
            {totalPages > 1 && (
              <div className="flex items-center gap-4 bg-white p-3 rounded-full shadow-lg border border-green-50">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-green-50 rounded-full disabled:opacity-20 text-green-600 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <span className="font-black text-green-900 px-6 text-lg">
                  {currentPage} <span className="text-green-300">/</span> {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-green-50 rounded-full disabled:opacity-20 text-green-600 transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            )}

            <button
              onClick={() => onSelectFarm(selectedFarmLocal)}
              disabled={!selectedFarmLocal}
              className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-2xl tracking-widest uppercase ${
                selectedFarmLocal
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-600/30 active:scale-[0.98]"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              ENTRAR AL SISTEMA
            </button>
          </div>
        </motion.div>
      </div>

      <CreateFarmModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateFarmSubmit} />
      <EditFarmModal isOpen={!!editingFarm} farm={editingFarm} onClose={() => setEditingFarm(null)} onUpdate={handleUpdateFarm} onDelete={handleDeleteFarm} />
    </>
  );
}
