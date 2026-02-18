import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowLeft, Check } from "lucide-react";
import { GoldInput } from "../components/ui/GoldInput";
import GoldButton from "../components/ui/GoldButton";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <Link
          to={createPageUrl("Home")}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Luxe Blog
          </span>
        </Link>

        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot password?
            </h1>
            <p className="text-slate-400 mb-8">
              No worries, we'll send you reset instructions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <GoldInput
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <GoldButton
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                Reset Password
              </GoldButton>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Check your email
            </h1>
            <p className="text-slate-400 mb-8">
              We sent a password reset link to
              <br />
              <span className="text-white">{email}</span>
            </p>

            <GoldButton
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => setSubmitted(false)}
            >
              Didn't receive the email? Try again
            </GoldButton>
          </div>
        )}

        <Link
          to={createPageUrl("Login")}
          className="flex items-center justify-center gap-2 mt-8 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    </div>
  );
}
