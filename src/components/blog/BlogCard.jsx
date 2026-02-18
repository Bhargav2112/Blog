import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Bookmark, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function BlogCard({
  post,
  index = 0,
  onToggleFavorite,
  isFavorite,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-500 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              post.cover_image ||
              `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80`
            }
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-amber-500/90 text-slate-900 font-semibold hover:bg-amber-500">
            {post.category || "General"}
          </Badge>

          {/* Featured Badge */}
          {post.is_featured && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              Featured
            </Badge>
          )}

          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(post.id);
              }}
              className="absolute bottom-4 right-4 bg-slate-900/60 backdrop-blur-sm hover:bg-slate-800 text-white"
            >
              <Bookmark
                className={`w-5 h-5 ${isFavorite ? "fill-amber-500 text-amber-500" : ""}`}
              />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.created_at
                ? format(new Date(post.created_at), "MMM d, yyyy")
                : "Recently"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.reading_time || 5} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-400 line-clamp-2 mb-4 flex-1">
            {post.excerpt ||
              "Discover insightful content that will transform your perspective and expand your horizons..."}
          </p>

          {/* Author & Read More */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-900">
                  {post.author_name?.[0] || "A"}
                </span>
              </div>
              <span className="text-sm text-slate-300">
                {post.author_name || "Anonymous"}
              </span>
            </div>

            <Link
              to={`/post/${post.slug || post.id}`}
              className="flex items-center gap-2 text-amber-400 font-medium text-sm group/link"
            >
              Read More
              <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
