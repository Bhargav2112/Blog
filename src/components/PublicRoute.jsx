import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated, isLoadingAuth, isAdmin } = useAuth();
  const location = useLocation(); // Keep for potential future use or debugging

  if (isLoadingAuth) {
     return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect based on role if already logged in
    if (isAdmin) {
      return <Navigate to="/admindashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
