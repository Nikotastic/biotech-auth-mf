import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft, Lock } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Página de Acceso No Autorizado (403)
 * Se muestra cuando el usuario intenta acceder a una ruta sin los permisos necesarios
 */
export default function Unauthorized() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/farm-selector");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <ShieldAlert className="w-16 h-16 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Lock className="w-10 h-10 text-red-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100"
        >
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
            403
          </h1>
          <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
            Acceso No Autorizado
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Lo sentimos, no tienes los permisos necesarios para acceder a esta
            página. Si crees que esto es un error, contacta al administrador del
            sistema.
          </p>

          {/* Info Box */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-start">
              <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-1">
                  Razones comunes:
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  <li>
                    Tu rol de usuario no tiene acceso a esta funcionalidad
                  </li>
                  <li>Necesitas permisos adicionales del administrador</li>
                  <li>La sesión puede haber expirado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ir al Inicio
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoBack}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver Atrás
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          ¿Necesitas ayuda? Contacta a{" "}
          <a
            href="mailto:support@biotech.com"
            className="text-green-600 hover:underline"
          >
            support@biotech.com
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
