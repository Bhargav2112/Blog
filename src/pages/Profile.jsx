import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Mail,
  Globe,
  Camera,
  Save,
  Twitter,
  Linkedin,
  Github,
  BookOpen,
  Clock,
  Heart,
} from "lucide-react";
import { GoldInput, GoldTextarea } from "../components/ui/GoldInput";
import GoldButton from "../components/ui/GoldButton";
import GlassCard from "../components/ui/GlassCard";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSkeleton } from "../components/common/LoadingSkeleton";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    website: "",
    social_links: {
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate(createPageUrl("Home"));
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const profiles = await base44.entities.UserProfile.filter({
      user_email: user.email,
    });
    if (profiles.length > 0) {
      setProfile(profiles[0]);
      setFormData({
        display_name: profiles[0].display_name || user.full_name || "",
        bio: profiles[0].bio || "",
        website: profiles[0].website || "",
        social_links: profiles[0].social_links || {
          twitter: "",
          linkedin: "",
          github: "",
        },
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        display_name: user.full_name || "",
      }));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    if (profile) {
      await base44.entities.UserProfile.update(profile.id, formData);
    } else {
      const newProfile = await base44.entities.UserProfile.create({
        user_email: user.email,
        ...formData,
      });
      setProfile(newProfile);
    }

    setSaving(false);
    setSaving(false);
    toast({
      description: "Profile updated successfully!",
      variant: "default",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-slate-400">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900"
            >
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <GlassCard className="p-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">
                      {(formData.display_name ||
                        user?.email)?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {formData.display_name || "User"}
                  </h2>
                  <p className="text-slate-400">{user?.email}</p>
                  <p className="text-sm text-amber-400 mt-1 capitalize">
                    {user?.role || "Member"}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <GoldInput
                        type="text"
                        placeholder="Your display name"
                        value={formData.display_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_name: e.target.value,
                          })
                        }
                        className="pl-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <GoldInput
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="pl-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Bio</Label>
                  <GoldTextarea
                    placeholder="Tell us about yourself..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label className="text-slate-300 mb-4 block">
                    Social Links
                  </Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <GoldInput
                        type="text"
                        placeholder="Twitter username"
                        value={formData.social_links.twitter}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            social_links: {
                              ...formData.social_links,
                              twitter: e.target.value,
                            },
                          })
                        }
                        className="pl-12"
                      />
                    </div>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <GoldInput
                        type="text"
                        placeholder="LinkedIn username"
                        value={formData.social_links.linkedin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            social_links: {
                              ...formData.social_links,
                              linkedin: e.target.value,
                            },
                          })
                        }
                        className="pl-12"
                      />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <GoldInput
                        type="text"
                        placeholder="GitHub username"
                        value={formData.social_links.github}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            social_links: {
                              ...formData.social_links,
                              github: e.target.value,
                            },
                          })
                        }
                        className="pl-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <GoldButton onClick={handleSave} loading={saving}>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </GoldButton>
                </div>
              </div>
            </GlassCard>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <GlassCard className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {profile?.reading_history?.length || 0}
                    </p>
                    <p className="text-sm text-slate-400">Articles Read</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {profile?.favorite_posts?.length || 0}
                    </p>
                    <p className="text-sm text-slate-400">Saved Posts</p>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {user?.created_date
                        ? new Date(user.created_date).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )
                        : "New"}
                    </p>
                    <p className="text-sm text-slate-400">Member Since</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Account Settings
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <GoldInput
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-12 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Danger Zone
                  </h4>
                  <p className="text-slate-400 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <GoldButton
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Delete Account
                  </GoldButton>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
