import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, FolderOpen, X, Check } from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";
import GlassCard from "../components/ui/GlassCard";
import GoldButton from "../components/ui/GoldButton";
import { GoldInput, GoldTextarea } from "../components/ui/GoldInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function AdminCategories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#D4AF37",
  });

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list(),
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => base44.entities.BlogPost.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        description: "Category created successfully",
        variant: "default",
      });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Category.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        description: "Category updated successfully",
        variant: "default",
      });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Category.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        description: "Category deleted successfully",
        variant: "default",
      });
      setDeleteId(null);
    },
  });

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "", color: "#D4AF37" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      color: category.color || "#D4AF37",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    const slug =
      formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const data = { ...formData, slug };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getPostCount = (categoryName) => {
    return posts?.filter((p) => p.category === categoryName).length || 0;
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Categories
            </h1>
            <p className="text-slate-400 mt-1">
              {categories?.length || 0} categories
            </p>
          </div>
          <GoldButton onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </GoldButton>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${category.color || "#D4AF37"}20`,
                      }}
                    >
                      <FolderOpen
                        className="w-6 h-6"
                        style={{ color: category.color || "#D4AF37" }}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(category.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    /{category.slug}
                  </p>
                  {category.description && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="pt-4 border-t border-slate-700">
                    <span className="text-sm text-slate-400">
                      {getPostCount(category.name)} posts
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">No categories yet</p>
            <GoldButton onClick={openCreateDialog}>
              Create Your First Category
            </GoldButton>
          </GlassCard>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Name *</Label>
              <GoldInput
                type="text"
                placeholder="Category name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Slug</Label>
              <GoldInput
                type="text"
                placeholder="category-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <GoldTextarea
                placeholder="Category description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-12 h-12 rounded-lg cursor-pointer"
                />
                <GoldInput
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <GoldButton
                variant="outline"
                onClick={closeDialog}
                className="flex-1"
              >
                Cancel
              </GoldButton>
              <GoldButton
                onClick={handleSubmit}
                className="flex-1"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                <Check className="w-4 h-4 mr-2" />
                {editingCategory ? "Update" : "Create"}
              </GoldButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this category? Posts in this
              category will become uncategorized.
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
