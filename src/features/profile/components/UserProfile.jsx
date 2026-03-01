import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Settings,
  Building2,
  Edit2,
  Lock,
  ArrowLeft,
  RefreshCw,
  MapPin,
  ChevronRight,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "../hooks/useProfile";
import { useAuthStore } from "@shared/store/authStore";
import alertService from "@shared/utils/alertService";
import { AnimatePresence } from "framer-motion";
import EditProfileModal from "./EditProfileModal";

export default function UserProfile() {
  const navigate = useNavigate();
  const { profile, logout, isAuthenticated, updateProfile } = useProfile();
  const { selectedFarm } = useAuthStore();

  const [showEditModal, setShowEditModal] = useState(false);

  const handleUpdateProfile = async (data) => {
    try {
      await updateProfile(data);
      alertService.success(
        "Tu perfil se ha actualizado correctamente",
        "¡Éxito!",
      );
      setShowEditModal(false);
    } catch (error) {
      alertService.error(
        "Ocurrió un problema al actualizar. Inténtalo de nuevo.",
        "Error",
      );
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    alertService.info("Cerrando sesión...", "¡Nos vemos pronto!");
    setTimeout(() => {
      logout();
    }, 500);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleChangeFarm = () => {
    navigate("/farm-selector");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const userInitial = profile.name[0]?.toUpperCase() || "U";

  const infoItems = [
    {
      icon: User,
      label: "Nombre completo",
      value: profile.name || "No especificado",
    },
    {
      icon: Mail,
      label: "Correo electrónico",
      value: profile.email || "No especificado",
    },
    {
      icon: Shield,
      label: "Rol en el sistema",
      value: profile.role,
    },
    ...(profile.id
      ? [
          {
            icon: Hash,
            label: "ID de usuario",
            value: profile.id,
            mono: true,
          },
        ]
      : []),
    {
      icon: Calendar,
      label: "Miembro desde",
      value: profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "No disponible",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* ── Header ── */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors group"
                title="Volver al Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600 group-hover:-translate-x-1 transition-all" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                Mi Perfil
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-2 sm:px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {/* ── Avatar Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1 space-y-4"
          >
            {/* Perfil principal */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-green-100">
              <div className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                {/* Avatar con inicial */}
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex-shrink-0 sm:mx-auto sm:mb-4 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl sm:text-4xl">
                    {userInitial}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {profile.name || "Usuario"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
              </div>

              {selectedFarm && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Granja Actual</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-gray-800">
                      {selectedFarm.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Granja activa */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 border-2 border-green-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-green-600" />
                  Granja Activa
                </h3>
                <button
                  onClick={handleChangeFarm}
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium bg-green-50 hover:bg-green-100 px-2 py-1 rounded-md transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Cambiar
                </button>
              </div>
              {selectedFarm ? (
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {selectedFarm.name}
                    </p>
                    {selectedFarm.location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-green-600 shrink-0" />
                        <p className="text-xs text-gray-500 truncate">
                          {selectedFarm.location}
                        </p>
                      </div>
                    )}
                    {selectedFarm.animals !== undefined && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {selectedFarm.animals || selectedFarm.animalCount || 0}{" "}
                        animales
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleChangeFarm}
                  className="w-full p-3 border-2 border-dashed border-green-300 rounded-xl text-sm text-green-600 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Seleccionar granja
                </button>
              )}
            </div>
          </motion.div>

          {/* ── Columna de información ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Información Personal
                </h3>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-green-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="text-base font-medium text-gray-800">
                      {profile.name || "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="text-base font-medium text-gray-800">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                  Seguridad
                </h3>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/reset-password")}
                  className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">
                        Cambiar Contraseña
                      </p>
                      <p className="text-sm text-gray-500">
                        Actualiza tu contraseña
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* Banner de seguridad */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm sm:text-base font-semibold text-green-900 mb-1.5 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                Seguridad de tu cuenta
              </h3>
              <p className="text-green-800 text-sm">
                Tu información está protegida. Recuerda no compartir tu
                contraseña con nadie y cerrar sesión cuando uses dispositivos
                compartidos.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={profile}
            onUpdate={handleUpdateProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
