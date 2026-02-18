import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Bookmark,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoldButton from "../components/ui/GoldButton";
import BlogCard from "../components/blog/BlogCard";
import { BlogCardSkeleton } from "../components/common/LoadingSkeleton";

export default function BlogDetail({ user, addToast }) {
  const navigate = useNavigate();
  const { slug } = useParams(); // Using 'slug' as the parameter name
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch post
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      // Try to fetch by slug first if it looks like a slug (string), or ID if numeric/UUID
      // Assuming slug field exists in DB. If not, maybe 'id' is passed in URL.
      // Let's support both: check if it matches UUID pattern or just try filter.
      
      // Attempt 1: Filter by slug
      let posts = await base44.entities.BlogPost.filter({ slug: slug });
      
      if (posts.length === 0) {
        // Attempt 2: Filter by ID (fallback if slug not found or url uses ID)
        posts = await base44.entities.BlogPost.filter({ id: slug });
      }
      
      return posts[0];
    },
    enabled: !!slug,
  });

  // Fetch related posts
  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.category],
    queryFn: () =>
      base44.entities.BlogPost.filter(
        {
          status: "published",
          category: post.category,
        },
        "-created_date",
        4,
      ),
    enabled: !!post?.category,
  });

  // Fetch user profile
  useEffect(() => {
    if (user?.email && post?.id) {
      base44.entities.UserProfile.filter({ user_email: user.email }).then(
        (profiles) => {
          if (profiles.length > 0) {
            setUserProfile(profiles[0]);
            setIsFavorite(profiles[0].favorite_posts?.includes(post.id));
          }
        },
      );
    }
  }, [user, post?.id]);

  // Track view and reading history
  useEffect(() => {
    if (post && user?.email) {
      // Increment views
      base44.entities.BlogPost.update(post.id, {
        views: (post.views || 0) + 1,
      });

      // Add to reading history
      if (userProfile) {
        const history = userProfile.reading_history || [];
        const newHistory = [
          { post_id: post.id, read_at: new Date().toISOString() },
          ...history.filter((h) => h.post_id !== post.id),
        ].slice(0, 50);

        base44.entities.UserProfile.update(userProfile.id, {
          reading_history: newHistory,
        });
      }
    }
  }, [post?.id]);

  const toggleFavorite = async () => {
    if (!user) {
      addToast?.("Please login to save posts", "warning");
      return;
    }

    if (!post) return;

    const favorites = userProfile?.favorite_posts || [];
    const postId = post.id;
    const newFavorites = isFavorite
      ? favorites.filter((id) => id !== postId)
      : [...favorites, postId];

    if (userProfile) {
      await base44.entities.UserProfile.update(userProfile.id, {
        favorite_posts: newFavorites,
      });
      setUserProfile({ ...userProfile, favorite_posts: newFavorites });
    } else {
      const newProfile = await base44.entities.UserProfile.create({
        user_email: user.email,
        favorite_posts: [postId],
      });
      setUserProfile(newProfile);
    }

    setIsFavorite(!isFavorite);
    addToast?.(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      "success",
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast?.("Link copied to clipboard", "success");
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || "");
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Post not found</h1>
        <Link to={createPageUrl("BlogListing")}>
          <GoldButton>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </GoldButton>
        </Link>
      </div>
    );
  }

  const filteredRelated =
    relatedPosts?.filter((p) => p.id !== post.id).slice(0, 3) || [];

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={
              post.cover_image ||
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80"
            }
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </motion.div>

            {/* Category & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              <Badge className="bg-amber-500 text-slate-900 font-semibold">
                {post.category}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Calendar className="w-4 h-4" />
                {post.created_date
                  ? format(new Date(post.created_date), "MMM d, yyyy")
                  : "Recently"}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Clock className="w-4 h-4" />
                {post.reading_time || 5} min read
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/60">
                <Eye className="w-4 h-4" />
                {post.views || 0} views
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              {post.title}
            </motion.h1>

            {/* Author & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-900">
                    {post.author_name?.[0] || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {post.author_name || "Anonymous"}
                  </p>
                  <p className="text-white/60 text-sm">Author</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFavorite}
                  className="text-white/60 hover:text-amber-400 hover:bg-white/10"
                >
                  <Bookmark
                    className={`w-5 h-5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
                  />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-slate-800 border-slate-700"
                  >
                    <DropdownMenuItem
                      onClick={() => shareOnSocial("twitter")}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Twitter className="w-4 h-4 mr-2" /> Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => shareOnSocial("facebook")}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Facebook className="w-4 h-4 mr-2" /> Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => shareOnSocial("linkedin")}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={copyLink}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            {post.content ? (
              <div
                className="text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-slate-400">No content available.</p>
            )}
          </motion.div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-slate-800"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Related Posts */}
      {filteredRelated.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {filteredRelated.map((relatedPost, index) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
