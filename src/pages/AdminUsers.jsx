import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Mail,
  Calendar,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "../components/admin/AdminLayout";
import GlassCard from "../components/ui/GlassCard";
import { GoldInput } from "../components/ui/GoldInput";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list("-created_at", 100),
  });

  const filteredUsers =
    users?.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  const adminCount = users?.filter((u) => u.role === "admin").length || 0;
  const userCount = users?.filter((u) => u.role !== "admin").length || 0;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">
            {users?.length || 0} registered users
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {users?.length || 0}
                </p>
                <p className="text-sm text-slate-400">Total Users</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{adminCount}</p>
                <p className="text-sm text-slate-400">Admins</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userCount}</p>
                <p className="text-sm text-slate-400">Regular Users</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Search */}
        <GlassCard className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <GoldInput
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </GlassCard>

        {/* Users List */}
        <GlassCard className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-400 font-medium">
                      User
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden md:table-cell">
                      Role
                    </th>
                    <th className="text-left p-4 text-slate-400 font-medium hidden lg:table-cell">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-slate-800 hover:bg-slate-800/50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-slate-900">
                              {u.full_name?.[0] || u.email?.[0] || "U"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate">
                              {u.full_name || "No name"}
                            </p>
                            <p className="text-sm text-slate-500 sm:hidden truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {u.email}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge
                          className={
                            u.role === "admin"
                              ? "bg-purple-500/20 text-purple-400 border-0"
                              : "bg-slate-700/50 text-slate-400 border-0"
                          }
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {u.role || "user"}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {(u.created_at || u.created_date)
                            ? format(new Date(u.created_at || u.created_date), "MMM d, yyyy")
                            : "-"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No users found</p>
            </div>
          )}
        </GlassCard>
      </div>
    </AdminLayout>
  );
}
