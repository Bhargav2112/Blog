import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { Routes, Route } from "react-router-dom";
import { pagesConfig } from "./pages.config";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import PageNotFound from "./lib/PageNotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import PublicRoute from "@/components/PublicRoute";
import ScrollToTop from "@/components/ScrollToTop";

const { Pages, Layout } = pagesConfig;

// Minimal Loader component
const AppLoader = () => (
  <div className="flex h-screen items-center justify-center bg-slate-950">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
  </div>
);

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();
  const [showSpinner, setShowSpinner] = useState(true);

  // Safety: Even if AuthContext says loading, force rendering content after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
       setShowSpinner(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Sync with actual auth loading state, but respect the timeout force-show logic is separate.
  // Actually, we want to stop showing spinner when isLoadingAuth is false OR timeout hits.
  const isActuallyLoading = isLoadingAuth && showSpinner;

  if (isActuallyLoading) {
    return <AppLoader />;
  }

  // Routes configuration
  const GuestRoutes = ["login", "register", "forgot-password"];
  const AdminRoutes = ["admindashboard", "adminposts", "admincategories", "adminusers", "adminmessages", "admincreatepost", "admineditpost", "admin-create-post", "admin-edit-post"];
  const UserRoutes = ["profile", "savedposts"];

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LayoutWrapper currentPageName="bloglisting"><Pages.bloglisting /></LayoutWrapper>} />
        
        <Route 
          path="/post/:slug" 
          element={<LayoutWrapper currentPageName="blogdetail"><Pages.blogdetail /></LayoutWrapper>} 
        />

         <Route 
          path="/category/:slug" 
          element={<LayoutWrapper currentPageName="bloglisting"><Pages.bloglisting /></LayoutWrapper>} 
        />

        {Object.entries(Pages).map(([path, Page]) => {
          let WrappedElement = (
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          );

          if (GuestRoutes.includes(path)) {
             WrappedElement = <PublicRoute>{WrappedElement}</PublicRoute>;
          } else if (AdminRoutes.includes(path)) {
             WrappedElement = <AdminRoute>{WrappedElement}</AdminRoute>;
          } else if (UserRoutes.includes(path)) {
             WrappedElement = <ProtectedRoute>{WrappedElement}</ProtectedRoute>;
          }

          return (
            <Route
              key={path}
              path={`/${path}`}
              element={WrappedElement}
            />
          );
        })}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <AuthenticatedApp />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
