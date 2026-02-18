import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoadingAuth: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    console.log("🔒 AuthProvider: Init");

    const safeSetUser = (u) => {
      if (mounted.current) setUser(u);
    };
    
    // 1. Fetch Profile (Safe with Timeout)
    const fetchProfile = async (uid) => {
      try {
        // Create a timeout promise that rejects after 5 seconds
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
        );

        const fetchPromise = supabase
          .from("profiles")
          .select("role")
          .eq("id", uid)
          .maybeSingle();

        // Race against timeout
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
          
        if (error) return null;
        return data?.role;
      } catch (e) {
        // Timeout or error, just return null (soft fail)
        // console.log("ℹ️ Profile fetch skipped (timeout or error)");
        return null;
      }
    };

    // 2. Enhance User
    const enhanceUser = async (sessionUser) => {
       if (!sessionUser) return null;
       
       const adminEmails = ["bsparmar1221@gmail.com", "admin@gmail.com", import.meta.env.VITE_ADMIN_EMAIL].filter(Boolean);
       let role = adminEmails.includes(sessionUser.email) ? "admin" : "user";
       const dbRole = await fetchProfile(sessionUser.id);
       if (dbRole) role = dbRole;

       return {
         ...sessionUser,
         role,
         full_name: sessionUser.user_metadata?.full_name || sessionUser.email?.split("@")[0],
       };
    };

    // 4. Listener (Setup first to catch partial events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`📣 Auth Event: ${event}`);
      
      try {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
             if (session?.user) {
               const enhanced = await enhanceUser(session.user);
               safeSetUser(enhanced);
             }
          } else if (event === 'SIGNED_OUT') {
             safeSetUser(null);
          }
      } catch (e) {
         console.error("❌ Stats Listener Error:", e);
      } finally {
         // ALWAYS clear loading state after an event if we have a result (or if it's sign out)
          if (mounted.current) setIsLoadingAuth(false);
      }
    });

    // 3. Main Init
    const initAuth = async () => {
      try {
        console.log("⏳ AuthProvider: Validating session...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
           console.error("❌ Auth session error:", error);
           if (error.status === 400 || error.status === 401) {
              await supabase.auth.signOut();
           }
        }

        if (session?.user) {
          console.log("✅ AuthProvider: Session restored");
          const enhanced = await enhanceUser(session.user);
          safeSetUser(enhanced);
        } else {
            console.log("ℹ️ AuthProvider: No active session found via getSession");
            // Do NOT force set null here. Listener will handle "SIGNED_OUT" or "INITIAL_SESSION" if needed.
            // If we force null, we might race with the listener setting the user.
        }
      } catch (err) {
        console.error("❌ Auth init exception:", err);
      } finally {
         // We allow a small delay for listener to potentially fire if it hasn't yet
         // But predominantly, we unset loading here.
         setTimeout(() => {
             if (mounted.current) setIsLoadingAuth(false);
         }, 500); 
      }
    };

    initAuth();

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoadingAuth,
        isAdmin: user?.role === "admin" 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
