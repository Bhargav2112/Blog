import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bookmark, Sparkles, ArrowRight } from "lucide-react";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/common/LoadingSkeleton";
import GoldButton from "../components/ui/GoldButton";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(createPageUrl("Home"));
    }
  }, [user]);

  // Fetch user profile
  const { data: profiles, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: () =>
      base44.entities.UserProfile.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (profiles?.length > 0) {
      setUserProfile(profiles[0]);
    }
  }, [profiles]);

  // Fetch all posts
  const { data: allPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["allPosts"],
    queryFn: () => base44.entities.BlogPost.filter({ status: "published" }),
  });

  // Get favorite posts
  const favoritePosts =
    allPosts?.filter((post) =>
      userProfile?.favorite_posts?.includes(post.id),
    ) || [];

  const toggleFavorite = async (postId) => {
    const favorites = userProfile?.favorite_posts || [];
    const newFavorites = favorites.filter((id) => id !== postId);

    await base44.entities.UserProfile.update(userProfile.id, {
      favorite_posts: newFavorites,
    });

    setUserProfile({ ...userProfile, favorite_posts: newFavorites });
    setUserProfile({ ...userProfile, favorite_posts: newFavorites });
    toast({
      description: "Removed from favorites",
      variant: "default",
    });
  };

  const isLoading = profileLoading || postsLoading;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6"
          >
            <Bookmark className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-pink-400 font-medium">
              Your Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Saved Articles
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Your personal reading list. Articles you've saved to read later.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
            </div>
          ) : favoritePosts.length > 0 ? (
            <>
              <p className="text-slate-400 mb-8">
                {favoritePosts.length}{" "}
                {favoritePosts.length === 1 ? "article" : "articles"} saved
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoritePosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    index={index}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
                <Bookmark className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No saved articles yet
              </h3>
              <p className="text-slate-400 mb-8">
                Start exploring and save articles you'd like to read later.
              </p>
              <Link to={createPageUrl("BlogListing")}>
                <GoldButton>
                  Browse Articles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GoldButton>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
