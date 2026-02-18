import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GoldButton from "../ui/GoldButton";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "admindashboard" },
  { icon: FileText, label: "Blog Posts", path: "adminposts" },
  { icon: FolderOpen, label: "Categories", path: "admincategories" },
  { icon: Users, label: "Users", path: "adminusers" },
  { icon: MessageSquare, label: "Messages", path: "adminmessages" },
];

export default function AdminSidebar({ user, onLogout }) {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Luxe Blog
            </span>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-4 border-b border-slate-800">
        <Link to={createPageUrl("admincreatepost")}>
          <GoldButton className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </GoldButton>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={createPageUrl(item.path)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <span className="text-sm font-bold text-slate-900">
              {user?.full_name?.[0] || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.full_name || "Admin"}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">View Site</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
