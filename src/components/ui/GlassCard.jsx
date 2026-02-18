import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative rounded-2xl backdrop-blur-xl",
        "bg-gradient-to-br from-slate-800/80 to-slate-900/80",
        "border border-slate-700/50",
        hover && "hover:border-amber-500/30 transition-all duration-300",
        glow && "shadow-lg shadow-amber-500/10",
        className,
      )}
      {...props}
    >
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
