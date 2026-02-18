import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44, supabase } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useRealtime } from "@/hooks/useRealtime";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  MessageSquare,
} from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";
import GlassCard from "../components/ui/GlassCard";
import GoldButton from "../components/ui/GoldButton";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. Dashboard Stats (Real-time)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => base44.admin.getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  // 2. Recent Posts
  const { data: recentPostsData, isLoading: postsLoading } = useQuery({
    queryKey: ["admin-recent-posts"],
    queryFn: () => base44.entities.BlogPost.list("-created_at", 5),
  });

  // 3. Categories (for overview)
  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => base44.entities.Category.list(),
  });

  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: () => base44.entities.ContactMessage.list("-created_at", 100),
  });
  
  const recentPosts = recentPostsData || [];
  const isLoading = statsLoading || postsLoading;

  // Real-time subscriptions
  useRealtime(["blog_posts", "profiles", "contact_messages"]);

  const statCards = [
    {
      title: "Total Posts",
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+12%", // Static for now
    },
    {
      title: "Total Views",
      value: stats?.totalViews?.toLocaleString() || 0,
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "+24%",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "+8%",
    },
    {
      title: "Messages",
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      trend: "+5%",
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {user?.full_name || "Admin"}!
            </p>
          </div>
          <Link to={createPageUrl("admincreatepost")}>
            <GoldButton>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </GoldButton>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {stat.title === "Total Posts" && `${stats?.publishedPosts || 0} published, ${stats?.draftPosts || 0} drafts`}
                      {stat.title === "Total Views" && "All time views"}
                      {stat.title === "Total Users" && "Registered users"}
                      {stat.title === "Messages" && `${stats?.unreadMessages || 0} unread`}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg.replace('bg-', 'from-').replace('/10', '/20')} to-${stat.color.replace('text-', '').replace('-500', '-400')}/20 flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Recent Posts</h2>
                <Link
                  to={createPageUrl("AdminPosts")}
                  className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={
                            post.cover_image ||
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&q=80"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              post.status === "published"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {post.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.created_date
                              ? format(new Date(post.created_date), "MMM d")
                              : "Recently"}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={createPageUrl("AdminEditPost") + `?id=${post.id}`}
                        className="text-slate-400 hover:text-white"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No posts yet</p>
                  <Link
                    to={createPageUrl("AdminCreatePost")}
                    className="text-amber-400 hover:underline mt-2 inline-block"
                  >
                    Create your first post
                  </Link>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Quick Actions & Categories */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link
                  to={createPageUrl("AdminCreatePost")}
                  className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Post</span>
                </Link>
                <Link
                  to={createPageUrl("AdminCategories")}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Category</span>
                </Link>
                <Link
                  to={createPageUrl("AdminMessages")}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>View Messages</span>
                  {stats?.unreadMessages > 0 && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
                      {stats.unreadMessages}
                    </span>
                  )}
                </Link>
              </div>
            </GlassCard>

            {/* Categories Overview */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Categories</h2>
                <Link
                  to={createPageUrl("AdminCategories")}
                  className="text-amber-400 hover:text-amber-300 text-sm"
                >
                  Manage
                </Link>
              </div>

              {categories?.length > 0 ? (
                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50"
                    >
                      <span className="text-slate-300">{category.name}</span>
                      <Link 
                        to={createPageUrl("AdminCategories")}
                        className="text-xs text-amber-500 hover:text-amber-400"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No categories created</p>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
