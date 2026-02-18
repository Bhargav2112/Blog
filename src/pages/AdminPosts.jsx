import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MoreVertical,
  Filter,
  FileText,
} from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";
import GlassCard from "../components/ui/GlassCard";
import GoldButton from "../components/ui/GoldButton";
import { GoldInput } from "../components/ui/GoldInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export default function AdminPosts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => base44.entities.BlogPost.list("-created_date", 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-posts"]);
      toast({
        description: "Post deleted successfully",
        variant: "default",
      });
      setDeleteId(null);
    },
  });

  const filteredPosts =
    posts?.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Blog Posts
            </h1>
            <p className="text-slate-400 mt-1">
              {posts?.length || 0} total posts
            </p>
          </div>
          <Link to={createPageUrl("AdminCreatePost")}>
            <GoldButton>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </GoldButton>
          </Link>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <GoldInput
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex gap-2">
              {["all", "published", "draft"].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  onClick={() => setStatusFilter(status)}
                  className={`capitalize ${
                    statusFilter === status
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Posts Table */}
        <GlassCard className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-400 font-medium">
                      Post
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden lg:table-cell">
                      Views
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden lg:table-cell">
                      Date
                    </th>
                    <th className="text-right p-4 text-slate-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                            <img
                              src={
                                post.cover_image ||
                                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&q=80"
                              }
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate max-w-xs">
                              {post.title}
                            </p>
                            <p className="text-sm text-slate-500 truncate max-w-xs">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          {post.category || "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <Badge
                          className={
                            post.status === "published"
                              ? "bg-green-500/20 text-green-400 border-0"
                              : "bg-yellow-500/20 text-yellow-400 border-0"
                          }
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views || 0}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.created_at
                            ? format(new Date(post.created_at), "MMM d, yyyy")
                            : "-"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-white"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-slate-800 border-slate-700"
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                to={
                                  createPageUrl("BlogDetail") + `?id=${post.id}`
                                }
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={
                                  createPageUrl("AdminEditPost") +
                                  `?id=${post.id}`
                                }
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(post.id)}
                              className="flex items-center gap-2 text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-4">No posts found</p>
              <Link to={createPageUrl("admincreatepost")}>
                <GoldButton>Create Your First Post</GoldButton>
              </Link>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Post
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
