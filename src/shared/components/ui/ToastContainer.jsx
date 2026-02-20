import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore } from "../../store/toastStore";

const toastVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

const icons = {
  success: (
    <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
      <CheckCircle className="w-5 h-5" />
    </div>
  ),
  error: (
    <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
      <XCircle className="w-5 h-5" />
    </div>
  ),
  info: (
    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
      <Info className="w-5 h-5" />
    </div>
  ),
  warning: (
    <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500">
      <AlertTriangle className="w-5 h-5" />
    </div>
  ),
};

const colors = {
  success:
    "bg-emerald-50/90 border-emerald-500/20 text-emerald-900 shadow-emerald-500/10",
  error: "bg-rose-50/90 border-rose-500/20 text-rose-900 shadow-rose-500/10",
  info: "bg-sky-50/90 border-sky-500/20 text-sky-900 shadow-sky-500/10",
  warning:
    "bg-amber-50/90 border-amber-500/20 text-amber-900 shadow-amber-500/10",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed top-8 right-6 flex flex-col items-end gap-4 w-full max-w-md pointer-events-none px-4"
      style={{ zIndex: 999999 }}
    >
      <AnimatePresence mode="multiple">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl border-white/30 min-w-[350px] ${
              colors[toast.type] || colors.info
            }`}
          >
            <div className="flex-shrink-0 animate-in zoom-in duration-300">
              {icons[toast.type] || icons.info}
            </div>
            <p className="flex-grow text-sm font-bold tracking-tight">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1.5 hover:bg-black/10 rounded-lg transition-all duration-200 focus:outline-none group"
            >
              <X className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
