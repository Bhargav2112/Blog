import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoadingAuth, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // User is logged in but not admin - redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}
