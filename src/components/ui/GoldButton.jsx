import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function GoldButton({
  children,
  variant = "primary",
  size = "default",
  loading = false,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40",
    outline:
      "border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10 bg-transparent",
    ghost: "text-amber-500 hover:bg-amber-500/10 bg-transparent",
    dark: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    default: "h-11 px-6",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <Button
      className={cn(
        "rounded-xl transition-all duration-300 transform hover:scale-[1.02]",
        variants[variant],
        sizes[size],
        loading && "opacity-70 cursor-not-allowed",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </Button>
  );
}
