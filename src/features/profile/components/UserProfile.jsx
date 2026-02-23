import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Lock,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Building2,
  RefreshCw,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@shared/store/authStore";
import { useToastStore } from "@shared/store/toastStore";

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, selectedFarm, logout } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    addToast("👋 Cerrando sesión...", "info");
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 500);
  };

  const handleChangeFarm = () => {
    navigate("/farm-selector");
  };

  /* Usar datos del store directamente */
  const profile = user
    ? {
        name:
          user.name ||
          user.fullName ||
          user.username ||
          user.email?.split("@")[0] ||
          "Usuario",
        email: user.email || "",
        role: user.role || user.roles?.[0] || "Operador",
        id: user.id || user.userId || user.sub || null,
        createdAt: user.createdAt || user.created_at || null,
      }
    : null;

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
                <div className="flex-1 sm:flex-none">
                  <h2 className="text-base sm:text-xl font-bold text-gray-800 mb-0.5 sm:mb-1">
                    {profile.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 break-all">
                    {profile.email}
                  </p>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {profile.role}
                  </div>
                </div>
              </div>
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
            {/* Información Personal */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-green-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                Información Personal
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {infoItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">
                          {item.label}
                        </p>
                        <p
                          className={`text-sm sm:text-base font-medium text-gray-800 truncate ${
                            item.mono ? "font-mono text-xs" : ""
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                  onClick={() => navigate("/forgot-password")}
                  className="w-full flex items-center justify-between p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group border border-green-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        Cambiar Contraseña
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Actualiza tu contraseña de acceso
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
              <p className="text-green-800 text-xs sm:text-sm">
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
