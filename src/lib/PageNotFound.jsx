import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react";
import GoldButton from "../components/ui/GoldButton";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="text-[150px] md:text-[200px] font-bold leading-none">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                4
              </span>
              <span className="relative mx-2">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-slate-700 inline-flex items-center justify-center">
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-amber-400" />
                </div>
              </span>
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                4
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={createPageUrl("Home")}>
            <GoldButton size="lg">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </GoldButton>
          </Link>
          <Link to={createPageUrl("BlogListing")}>
            <GoldButton variant="outline" size="lg">
              <Search className="w-5 h-5 mr-2" />
              Browse Articles
            </GoldButton>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <button
            onClick={() => window.history.back()}
            className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </motion.div>
      </div>
    </div>
  );
}
