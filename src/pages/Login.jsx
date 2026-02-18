import React, { useState, useEffect } from "react";
import { supabase } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Sparkles, Mail, Lock } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
       const isAdmin = user.email === "bsparmar1221@gmail.com";
       if (isAdmin) {
         navigate("/admindashboard");
       } else {
         navigate("/profile");
       }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } else {
      const isAdmin = email === "bsparmar1221@gmail.com";
      toast({
        title: isAdmin ? "Welcome Admin" : "Login Successful",
        description: "Redirecting...",
      });
      if (isAdmin) {
        navigate("/admindashboard");
      } else {
        navigate("/profile");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-2 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6 text-slate-900" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password"className="text-slate-300">
                  Password
                </Label>
                <Link 
                  to={createPageUrl("forgot-password")}
                  className="text-xs text-amber-500 hover:text-amber-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 font-bold h-11 mt-2 transition-all duration-300" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link to={createPageUrl("register")} className="text-amber-500 hover:text-amber-400 font-medium hover:underline">
                Sign up
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
