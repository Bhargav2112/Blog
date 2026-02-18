import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoldInput } from "../ui/GoldInput";
import { Button } from "@/components/ui/button";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search articles...",
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className={`relative rounded-xl transition-all duration-300 ${
          isFocused ? "ring-2 ring-amber-500/50" : ""
        }`}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <GoldInput
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 text-base"
        />
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChange("")}
                className="h-8 w-8 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
