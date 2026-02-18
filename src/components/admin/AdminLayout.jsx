import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminSidebar from "./AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role !== "admin") {
      toast({
        description: "Access denied. Admin privileges required.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user]);

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate("/");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-40 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="text-white"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <span className="text-lg font-bold text-amber-400">Admin</span>
        <Button variant="ghost" size="icon" className="text-slate-400">
          <Bell className="w-5 h-5" />
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
            >
              <AdminSidebar user={user} onLogout={handleLogout} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
