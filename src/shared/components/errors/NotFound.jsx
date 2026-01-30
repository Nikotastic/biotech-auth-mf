import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Página de No Encontrado (404)
 * Se muestra cuando el usuario intenta acceder a una ruta que no existe
 */
export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/farm-selector");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              404
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4"
            >
              <FileQuestion className="w-16 h-16 text-blue-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Página No Encontrada
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida. Verifica la URL o regresa al inicio.
          </p>

          {/* Search suggestion */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <div className="flex items-start">
              <Search className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">
                  ¿Qué puedes hacer?
                </p>
                <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Verifica que la URL esté escrita correctamente</li>
                  <li>Regresa a la página anterior</li>
                  <li>Ve al inicio y navega desde allí</li>
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
            className="text-blue-600 hover:underline"
          >
            support@biotech.com
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
