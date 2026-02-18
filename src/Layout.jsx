import React from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Toast, { useToast } from "./components/common/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

export default function Layout({ children, currentPageName }) {
  const { user } = useAuth(); // We might not need setUser if context handles it, but context exports user.
  // Actually AuthContext exports: { user, isAuthenticated, isLoadingAuth, isAdmin }
  // It does not export setUser usually. Let's check AuthContext again.
  // It exports: user, isAuthenticated, isLoadingAuth, isAdmin.
  
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const handleLogout = async () => {
    await base44.auth.logout();
    // Force reload or redirect triggers auth state change in context usually
    // But if context listens to onAuthStateChange, it should update automatically.
    // base44.auth.logout() likely triggers supabase.auth.signOut()
    navigate("/");
  };

  // Pages that don't need navbar/footer
  const authPages = ["login", "register", "forgot-password"];
  const adminPages = [
    "admindashboard",
    "adminposts",
    "admincategories",
    "adminusers",
    "adminmessages",
    "admin-create-post",
    "admin-edit-post"
  ];
  const isAuthPage = authPages.includes(currentPageName);
  const isAdminPage = adminPages.includes(currentPageName);

  // Global context for child components
  // We can pass the context user.
  const pageContext = {
    user,
    addToast,
    // refreshUser - context handles this now, basically no-op or re-fetch session
    refreshUser: () => {}, 
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --gold-primary: #D4AF37;
          --gold-light: #F5D547;
          --dark-bg: #0F172A;
          --dark-card: #1E293B;
        }
        
        body {
          background: linear-gradient(135deg, #0F172A 0%, #111827 50%, #0F172A 100%);
          min-height: 100vh;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1E293B;
        }
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #64748B;
        }

        /* Selection color */
        ::selection {
          background: rgba(212, 175, 55, 0.3);
          color: white;
        }
      `}</style>

      {!isAuthPage && !isAdminPage && (
        <Navbar user={user} onLogout={handleLogout} />
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPageName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={!isAuthPage && !isAdminPage ? "pt-20" : ""}
        >
          {React.cloneElement(children, { ...pageContext })}
        </motion.main>
      </AnimatePresence>

      {!isAuthPage && !isAdminPage && <Footer />}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
