import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../validations/loginSchema";
import { useToastStore } from "@shared/store/toastStore";
import { farmService } from "@features/farm/services/farmService";
import { handleAuthError } from "@shared/utils/authErrorHandler";
import { ToastContainer } from "@shared/components/ui/ToastContainer";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const addToast = useToastStore((state) => state.addToast);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const loginData = await login(data);
      addToast("✅ Sesión iniciada correctamente. Bienvenido!", "success");

      // Verificar granjas del usuario
      try {
        const farms = await farmService.getUserFarms(
          loginData.token,
          loginData.user.id,
        );

        if (farms?.length > 0) {
          addToast(
            `📊 Se encontraron ${farms.length} granja(s) disponible(s)`,
            "success",
          );
        } else {
          addToast(
            "ℹ️ No tienes granjas registradas. Vamos a crear una.",
            "info",
          );
        }

        // Pequeña pausa para que el usuario vea el mensaje
        setTimeout(() => navigate("/farm-selector"), 800);
      } catch (farmError) {
        console.error("Error al verificar granjas:", farmError);
        addToast(
          "⚠️ No se pudieron cargar las granjas. Redirigiendo...",
          "warning",
        );
        setTimeout(() => navigate("/farm-selector"), 800);
      }
    } catch (err) {
      const { message } = handleAuthError(err);
      addToast(message, "error");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1604832358854-da036644f138?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZmllbGQlMjBncmVlbnxlbnwxfHx8fDE3NjU1NTg5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/95 via-emerald-800/90 to-teal-900/95" />

      {/* Animated Circles */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="w-full max-w-md relative z-10 px-2 sm:px-0">
        {/* Logo and Brand */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-3 sm:mb-4 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            BioTech Farm
          </motion.h1>
          <motion.div
            className="flex items-center justify-center gap-2 text-green-100 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <p className="text-xs sm:text-sm">Sistema de Gestión de Granjas</p>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-green-100/50 transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-6">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-green-900 mb-1.5 sm:mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-green-900 mb-1.5 sm:mb-2"
              >
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors focus:outline-none p-1"
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
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 sm:py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base mt-2"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            className="mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs font-bold text-green-800 mb-1.5">Demo:</p>
            <div className="space-y-0.5">
              <p className="text-[11px] sm:text-xs text-green-700">
                Usuario: user@biotech.com
              </p>
              <p className="text-[11px] sm:text-xs text-green-700">
                Admin: admin@biotech.com
              </p>
            </div>
          </motion.div>

          {/* Switch to Register */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs sm:text-sm text-green-700">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-bold underline-offset-4 hover:underline transition-all"
              >
                Registrarse
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
}
