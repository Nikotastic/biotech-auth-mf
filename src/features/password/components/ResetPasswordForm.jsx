import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, AlertTriangle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useResetPassword } from "../hooks/useResetPassword";
import { resetPasswordSchema } from "../validations/resetPasswordSchema";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, loading, error } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password);
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full border-2 border-amber-100"
        >
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Enlace no válido
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Este enlace para restablecer la contraseña ha expirado o no es
            válido. Solicita uno nuevo desde tu correo.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            <Mail className="w-4 h-4" />
            Solicitar nuevo enlace
          </button>
          <button
            onClick={() => navigate("/login")}
            className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-2 sm:px-0"
      >
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-green-100 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-green-900 mb-2"
            >
              Nueva Contraseña
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-green-600"
            >
              Ingresa tu nueva contraseña para recuperar el acceso
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-center font-medium"
              >
                <p className="text-xs sm:text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* New Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-xs sm:text-sm font-medium text-green-900 mb-1.5 sm:mb-2">
                Nueva Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-11 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-xs sm:text-sm font-medium text-green-900 mb-1.5 sm:mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full pl-11 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700 p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 sm:py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base mt-2"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[10px] sm:text-xs text-green-600 mt-6"
        >
          © 2026 BioTech Farm Management. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
