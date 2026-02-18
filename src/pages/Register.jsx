import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { GoldInput } from "../components/ui/GoldInput";
import GoldButton from "../components/ui/GoldButton";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth(); // Check if already logged in handled by Route Guard, but good to have

  const handleRegister = async () => {
    if (!email || !password || !fullName || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    
    // Supabase SignUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Account Created",
        description: "Welcome to Luxe Blog! You are now automatically logged in.",
      });
      // Redirect to home
      navigate("/");
    }
    setLoading(false);
  };

  const benefits = [
    "Access to exclusive content",
    "Save your favorite articles",
    "Personalized reading experience",
    "Join the community discussions",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80"
            alt="Register"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="relative h-full flex items-center justify-end px-12">
          <div className="max-w-md text-right">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start your journey today
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Create an account and unlock a world of premium content and
              features.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 justify-end text-slate-300"
                >
                  {benefit}
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-amber-400" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link
            to={createPageUrl("home")}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Luxe Blog
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
          <p className="text-slate-400 mb-8">
            Join our community of readers and writers
          </p>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <GoldInput
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="pl-12"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <GoldInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <GoldInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="pl-12 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <GoldInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="pl-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={setAgreed}
                className="border-slate-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-400 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  to={createPageUrl("terms")}
                  className="text-amber-400 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to={createPageUrl("privacy")}
                  className="text-amber-400 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <GoldButton
              className="w-full"
              size="lg"
              onClick={handleRegister}
              loading={loading}
              disabled={!agreed}
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </GoldButton>
          </div>

          <p className="mt-8 text-center text-slate-400">
            Already have an account?{" "}
            <Link
              to={createPageUrl("login")}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
