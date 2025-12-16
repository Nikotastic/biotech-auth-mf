import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Sparkles,
  Check,
  X as XIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRegister } from "../hooks/useRegister";
import { registerSchema } from "../validations/registerSchema";
import { useToastStore } from "@shared/store/toastStore";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error } = useRegister();
  const addToast = useToastStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      addToast("¡Registro exitoso! Bienvenido a BioTech Farm.", "success");

      // Redirect after successful registration
      window.location.href = "/farm-selector";
    } catch (err) {
      console.error("Register error:", err);

      // Specific error handling
      const errorData = err.response?.data;
      const statusCode = err.response?.status;
      let errorMessage = "Error al registrar usuario";

      if (statusCode === 409 || statusCode === 400) {
        // Email already exists (409 Conflict or 400 Bad Request)
        if (
          errorData?.message?.toLowerCase().includes("email") ||
          errorData?.toLowerCase().includes("email") ||
          errorData?.message?.toLowerCase().includes("already") ||
          errorData?.message?.toLowerCase().includes("existe")
        ) {
          errorMessage =
            "⚠️ Este correo electrónico ya está registrado. Por favor, usa otro correo o inicia sesión.";
        } else {
          errorMessage =
            errorData?.message ||
            errorData ||
            "Datos inválidos. Verifica la información ingresada.";
        }
      } else if (statusCode === 500) {
        // Handle 500 as potential duplicate or server issue
        errorMessage =
          "⚠️ El correo podría estar en uso o hubo un error en el servidor. Intenta iniciar sesión.";
      } else if (statusCode === 422) {
        errorMessage =
          "⚠️ Los datos ingresados no son válidos. Verifica el formato del correo y la contraseña.";
      } else if (!err.response) {
        errorMessage =
          "🔌 No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else {
        errorMessage =
          errorData?.message ||
          errorData ||
          "Error desconocido al registrar usuario";
      }

      addToast(errorMessage, "error");
    }
  };

  const requirements = [
    { label: "Mínimo 6 caracteres", met: password.length >= 6 },
    {
      label: "Las contraseñas coinciden",
      met: password && password === confirmPassword && password.length >= 6,
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1658881070511-c5aa3a883a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBmYXJtJTIwbGl2ZXN0b2NrfGVufDF8fHx8MTc2NTU1ODk5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-green-800/90 to-teal-900/95" />

      {/* Animated Circles */}
      <motion.div
        className="absolute top-10 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"
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
        className="absolute bottom-10 left-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl mb-4 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: -5 }}
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
            <p>Registro de Nueva Granja</p>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Register Card */}
        <motion.div
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-green-100/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-green-900 mb-6">
            Crear Cuenta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="name"
                className="block text-sm font-medium text-green-900 mb-2"
              >
                Nombre Completo
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Juan Pérez"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </motion.div>

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
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-green-900 mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </motion.div>

            {/* Password Requirements */}
            {(password || confirmPassword) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 bg-gray-50/50 p-3 rounded-xl"
              >
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs transition-colors duration-300"
                  >
                    {req.met ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-300" />
                    )}
                    <span
                      className={
                        req.met ? "text-green-700 font-medium" : "text-gray-500"
                      }
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

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
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-green-700">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium underline-offset-4 hover:underline transition-all"
              >
                Iniciar Sesión
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
