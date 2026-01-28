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
} from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "@shared/hooks/useAuth";
import { useToastStore } from "@shared/store/toastStore";

export default function UserProfile() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { isAuthenticated, selectedFarm, logout } = useAuth();
  const addToast = useToastStore((state) => state.addToast);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    addToast("👋 Cerrando sesión...", "info");
    setTimeout(() => {
      logout();
      // Emitir evento para sincronización
      window.dispatchEvent(new Event("auth-change"));
      // Redirigir al login
      navigate("/login");
    }, 500);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
            <div className="flex gap-3">
              {selectedFarm && (
                <button
                  onClick={handleBackToDashboard}
                  className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Volver al Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {profile.name || "Usuario"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">{profile.email}</p>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  {profile.role || "Usuario"}
                </div>
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
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
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

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Rol en el sistema</p>
                    <p className="text-base font-medium text-gray-800">
                      {profile.role || "Usuario"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Miembro desde</p>
                    <p className="text-base font-medium text-gray-800">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "No disponible"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">Seguridad</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/reset-password")}
                  className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-800">
                        Cambiar Contraseña
                      </p>
                      <p className="text-sm text-gray-500">
                        Actualiza tu contraseña
                      </p>
                    </div>
                  </div>
                  <Edit2 className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
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
    </div>
  );
}
