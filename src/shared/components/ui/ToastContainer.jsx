import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

/* ─── Configuración por tipo ─────────────────────────────────────── */
const config = {
  success: {
    icon: CheckCircle,
    bg: "bg-white",
    border: "border-emerald-300",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    message: "text-gray-800",
    bar: "bg-gradient-to-r from-emerald-400 to-green-400",
    glow: "shadow-emerald-500/15",
    closeHover: "hover:bg-gray-100",
    accent: "border-l-4 border-l-emerald-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-white",
    border: "border-red-300",
    iconBg: "bg-red-500",
    iconColor: "text-white",
    message: "text-gray-800",
    bar: "bg-gradient-to-r from-red-400 to-rose-400",
    glow: "shadow-red-500/15",
    closeHover: "hover:bg-gray-100",
    accent: "border-l-4 border-l-red-500",
  },
  info: {
    icon: Info,
    bg: "bg-white",
    border: "border-blue-300",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    message: "text-gray-800",
    bar: "bg-gradient-to-r from-blue-400 to-sky-400",
    glow: "shadow-blue-500/15",
    closeHover: "hover:bg-gray-100",
    accent: "border-l-4 border-l-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-white",
    border: "border-amber-300",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    message: "text-gray-800",
    bar: "bg-gradient-to-r from-amber-400 to-yellow-400",
    glow: "shadow-amber-500/15",
    closeHover: "hover:bg-gray-100",
    accent: "border-l-4 border-l-amber-500",
  },
};

/* ─── Variantes de animación ─────────────────────────────────────── */
const toastVariants = {
  initial: { opacity: 0, y: -32, scale: 0.9, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: "easeInOut" },
  },
};

/* ─── Barra de progreso ──────────────────────────────────────────── */
function ProgressBar({ barClass, duration = 6000 }) {
  return (
    <motion.div
      className={`absolute bottom-0 left-0 h-[3px] rounded-full ${barClass}`}
      initial={{ width: "100%" }}
      animate={{ width: "0%" }}
      transition={{ duration: duration / 1000, ease: "linear" }}
    />
  );
}

/* ─── Toast individual ───────────────────────────────────────────── */
function Toast({ toast, onRemove }) {
  const type = toast.type || "info";
  const cfg = config[type] || config.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        relative overflow-hidden pointer-events-auto
        flex items-start gap-3
        w-full sm:w-auto sm:min-w-[340px] sm:max-w-[420px]
        pl-4 pr-4 py-3.5
        rounded-2xl
        border
        shadow-[0_8px_32px_rgba(0,0,0,0.10)]
        ${cfg.bg} ${cfg.border} ${cfg.accent} ${cfg.glow}
      `}
    >
      {/* Icono de fondo decorativo */}
      <div className="absolute -right-4 -top-4 opacity-[0.04] pointer-events-none">
        <Icon className="w-24 h-24" />
      </div>

      {/* Icono principal */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
          delay: 0.08,
        }}
        className={`flex-shrink-0 w-9 h-9 rounded-xl ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center shadow-sm`}
      >
        <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
      </motion.div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 pr-1">
        <p
          className={`text-sm font-semibold leading-snug tracking-tight ${cfg.message}`}
        >
          {toast.message}
        </p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={() => onRemove(toast.id)}
        className={`
          flex-shrink-0 self-start mt-0.5
          w-7 h-7 flex items-center justify-center
          rounded-lg transition-all duration-150
          opacity-50 hover:opacity-100
          ${cfg.closeHover}
        `}
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Barra de progreso */}
      <ProgressBar barClass={cfg.bar} />
    </motion.div>
  );
}

/* ─── Contenedor principal ───────────────────────────────────────── */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed top-4 sm:top-6 left-0 right-0 sm:left-auto sm:right-5 flex flex-col items-center sm:items-end gap-2.5 sm:gap-3 w-full sm:w-auto sm:max-w-[440px] pointer-events-none px-3 sm:px-0"
      style={{ zIndex: 999999 }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
