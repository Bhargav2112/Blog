import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import { ArrowLeft, Save, Image, X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "../components/admin/AdminLayout";
import GlassCard from "../components/ui/GlassCard";
import GoldButton from "../components/ui/GoldButton";
import { GoldInput, GoldTextarea } from "../components/ui/GoldInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

export default function AdminEditPost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    tags: [],
    status: "draft",
    is_featured: false,
    reading_time: 5,
    author_name: "",
  });

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list(),
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        cover_image: post.cover_image || "",
        category: post.category || "",
        tags: post.tags || [],
        status: post.status || "draft",
        is_featured: post.is_featured || false,
        reading_time: post.reading_time || 5,
        author_name: post.author_name || user?.full_name || "Admin",
      });
    }
  }, [post]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData((prev) => ({ ...prev, cover_image: file_url }));
    toast({
      description: "Image uploaded successfully",
      variant: "default",
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (publishNow = false) => {
    if (!formData.title || !formData.content) {
      toast({
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    // Exclude tags and reading_time as they don't exist in the database schema
    const { tags, reading_time, ...validPostData } = formData;

    const postData = {
      ...validPostData,
      status: publishNow ? "published" : formData.status,
    };

    await base44.entities.BlogPost.update(postId, postData);

    setSaving(false);
    toast({
      description: "Post updated successfully!",
      variant: "default",
    });
    
    if (publishNow) {
        navigate(createPageUrl("blogdetail") + `?id=${postId}`);
    } else {
        navigate(createPageUrl("admin-posts"));
    }
  };

  const handleDelete = async () => {
    await base44.entities.BlogPost.delete(postId);
    toast({
      description: "Post deleted successfully",
      variant: "default",
    });
    navigate(createPageUrl("admin-posts"));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  if (postLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Edit Post
              </h1>
              <p className="text-slate-400 mt-1">Update your blog post</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Title *</Label>
                <GoldInput
                  type="text"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Slug</Label>
                <GoldInput
                  type="text"
                  placeholder="post-url-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Excerpt</Label>
                <GoldTextarea
                  placeholder="Brief summary of the post..."
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <Label className="text-slate-300 mb-4 block">Content *</Label>
              <div className="bg-slate-800 rounded-xl overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  placeholder="Write your post content here..."
                  className="text-white [&_.ql-toolbar]:bg-slate-900 [&_.ql-toolbar]:border-slate-700 [&_.ql-container]:border-slate-700 [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-slate-300"
                />
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Publish</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Featured</Label>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                  />
                </div>

                <div className="pt-4 border-t border-slate-700 space-y-2">
                  <GoldButton
                    className="w-full"
                    onClick={() => handleSubmit(true)}
                    loading={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update & Publish
                  </GoldButton>
                  <GoldButton
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSubmit(false)}
                    loading={saving}
                  >
                    Save Changes
                  </GoldButton>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Cover Image
              </h3>
              {coverPreview || formData.cover_image ? (
                <div className="relative rounded-lg overflow-hidden mb-4">
                  <img
                    src={coverPreview || formData.cover_image}
                    alt="Cover"
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setCoverPreview(null);
                      setFormData({ ...formData, cover_image: "" });
                    }}
                    className="absolute top-2 right-2 bg-slate-900/80 text-white hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : null}
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors">
                <Image className="w-8 h-8 text-slate-500 mb-2" />
                <span className="text-sm text-slate-400">Click to upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Category
              </h3>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <GoldInput
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addTag}
                  className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Reading Time
              </h3>
              <div className="flex items-center gap-2">
                <GoldInput
                  type="number"
                  min="1"
                  value={formData.reading_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reading_time: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-20"
                />
                <span className="text-slate-400">minutes</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDelete}
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
