import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(null)}
        className={cn(
          "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
          !selected
            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/25"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
        )}
      >
        All Posts
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category.id || category.slug}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(category.slug || category.name)}
          className={cn(
            "px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
            selected === (category.slug || category.name)
              ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg shadow-amber-500/25"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white",
          )}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
}
