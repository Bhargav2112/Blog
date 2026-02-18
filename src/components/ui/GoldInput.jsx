import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function GoldInput({ className, ...props }) {
  return (
    <Input
      className={cn(
        "h-12 bg-slate-800/50 border-slate-700 rounded-xl",
        "text-white placeholder:text-slate-400",
        "focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2",
        "transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}

export function GoldTextarea({ className, ...props }) {
  return (
    <Textarea
      className={cn(
        "bg-slate-800/50 border-slate-700 rounded-xl",
        "text-white placeholder:text-slate-400",
        "focus:border-amber-500 focus:ring-amber-500/20 focus:ring-2",
        "transition-all duration-300 resize-none",
        className,
      )}
      {...props}
    />
  );
}
