import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success:
    "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
  error: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400",
  warning:
    "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400",
  info: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
};

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl bg-gradient-to-r ${colors[toast.type]} border`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium text-white">{toast.message}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeToast(toast.id)}
                className="h-6 w-6 text-slate-400 hover:text-white ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
