import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { forgotPasswordSchema } from "../validations/forgotPasswordSchema";

export default function ForgotPasswordForm() {
  const { sendResetEmail, loading, error, success } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    await sendResetEmail(data.email);
  };

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
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-green-900 mb-2"
            >
              ¿Olvidaste tu contraseña?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-green-600 px-2"
            >
              Ingresa tu email y te enviaremos un enlace para restablecer tu
              contraseña
            </motion.p>
          </div>

          {!success ? (
            /* Form */
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-xs sm:text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-xs sm:text-sm font-medium text-green-900 mb-1.5 sm:mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="tu@email.com"
                    className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
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
                transition={{ delay: 0.6 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 sm:py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                {loading ? "Enviando..." : "Enviar Enlace"}
              </motion.button>
            </form>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 sm:py-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">
                ¡Email Enviado!
              </h3>
              <p className="text-sm sm:text-base text-green-600 px-4">
                Revisa tu bandeja de entrada. Te hemos enviado un enlace para
                restablecer tu contraseña.
              </p>
            </motion.div>
          )}

          {/* Back to Login */}
          <Link to="/login">
            <motion.button
              whileHover={{ x: -3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 mt-4 sm:mt-6 transition-all text-xs sm:text-sm font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Volver al inicio de sesión
            </motion.button>
          </Link>
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
