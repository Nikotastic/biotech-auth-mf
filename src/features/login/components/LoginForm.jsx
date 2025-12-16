import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../validations/loginSchema";
import { useToastStore } from "../../../shared/store/toastStore";
import { farmService } from "../../farm/services/farmService";

export default function LoginForm() {
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
      addToast("Sesión iniciada correctamente", "success");
      
      // Verificar si el usuario tiene granjas
      try {
        const farms = await farmService.getUserFarms(loginData.token);
        if (farms && farms.length > 0) {
          // Si tiene granjas, ir al selector
          navigate("/farm-selector");
        } else {
          // Si no tiene granjas, ir directo al dashboard
          navigate("/dashboard");
        }
      } catch (farmError) {
        // Si falla la carga de granjas, ir a farm-selector por defecto
        console.error("Error al verificar granjas:", farmError);
        navigate("/farm-selector");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Credenciales inválidas";
      addToast(msg, "error");
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

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl mb-4 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            BioTech Farm
          </motion.h1>
          <motion.div
            className="flex items-center justify-center gap-2 text-green-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
            <p className="text-sm">Sistema de Gestión de Granjas</p>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-green-100/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-green-900 mb-6">
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
                className="block text-sm font-medium text-green-900 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
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
                className="block text-sm font-medium text-green-900 mb-2"
              >
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm font-semibold text-green-800 mb-2">Demo:</p>
            <p className="text-sm text-green-700">Usuario: user@biotech.com</p>
            <p className="text-sm text-green-700">Admin: admin@biotech.com</p>
          </motion.div>

          {/* Switch to Register */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-green-700">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-medium underline-offset-4 hover:underline transition-all"
              >
                Registrarse
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
