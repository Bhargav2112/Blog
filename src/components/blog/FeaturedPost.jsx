import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import GoldButton from "../ui/GoldButton";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div className="relative h-[500px] md:h-[600px]">
          <img
            src={
              post.cover_image ||
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80"
            }
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end p-6 md:p-12">
          <div className="max-w-2xl">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-semibold px-4 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {post.category || "General"}
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-lg text-slate-300 mb-6 line-clamp-2 md:line-clamp-3">
              {post.excerpt ||
                "Discover the latest insights and trends that are shaping our world today..."}
            </p>

            {/* Meta & CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-900">
                      {post.author_name?.[0] || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {post.author_name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.created_date
                          ? format(new Date(post.created_date), "MMM d, yyyy")
                          : "Recently"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.reading_time || 5} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={createPageUrl("BlogDetail") + `?id=${post.id}`}
                className="sm:ml-auto"
              >
                <GoldButton className="group/btn">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                </GoldButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
