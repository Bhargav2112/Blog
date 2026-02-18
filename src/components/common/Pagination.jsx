import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (showEllipsisStart) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
            <MoreHorizontal className="w-5 h-5" />
          </span>
        ) : (
          <Button
            key={page}
            variant="ghost"
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 rounded-xl transition-all",
              currentPage === page
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold shadow-lg shadow-amber-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800",
            )}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
