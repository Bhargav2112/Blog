import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Settings,
  BookMarked,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoldButton from "../ui/GoldButton";

export default function Navbar({ user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { data: categories } = useQuery({
    queryKey: ["navbar-categories"],
    queryFn: () => base44.entities.Category.list(),
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const exploreLinks = [
    { name: "Popular", query: "?sort=popular", icon: Zap },
    { name: "New", query: "?sort=new", icon: Clock },
    { name: "Trending", query: "?sort=trending", icon: TrendingUp },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-slate-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
                <Sparkles className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Luxe Blog
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/"
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Blog
              </Link>

              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none">
                    Categories <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                  {categories?.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        to={`/category/${category.slug || category.name}`}
                        className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
                      >
                         <Grid className="w-4 h-4 text-amber-500/70" /> {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      All Categories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Explore Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none">
                    Explore <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                  {exploreLinks.map((link) => (
                    <DropdownMenuItem key={link.name} asChild>
                      <Link
                        to={`/${link.query}`}
                        className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <link.icon className="w-4 h-4 text-amber-500/70" />
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to={createPageUrl("about")}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname.includes("about")
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                About
              </Link>
              <Link
                to={createPageUrl("contact")}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname.includes("contact")
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Search className="w-5 h-5" />
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                        <span className="text-sm font-bold text-slate-900">
                          {user.full_name?.[0] || user.email?.[0] || "U"}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-slate-800 border-slate-700"
                  >
                    {/* User Menu Items... (Keeping existing logic) */}
                    <div className="px-3 py-2 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">
                        {user.full_name || "User"}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link
                        to={createPageUrl("profile")}
                        className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to={createPageUrl("saved-posts")}
                        className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer"
                      >
                         <BookMarked className="w-4 h-4" /> Saved Posts
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem asChild>
                          <Link
                            to={createPageUrl("admindashboard")}
                            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Settings className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onClick={onLogout}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                   {/* Only showing Login for admins in spirit, but generally accessible */}
                  <Link to={createPageUrl("login")}>
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-bold text-amber-400">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/"
                    className="block text-lg font-medium text-slate-300 hover:text-white"
                  >
                    Blog
                  </Link>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Categories
                    </p>
                    <div className="space-y-2 pl-2">
                      {categories?.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.slug || cat.name}`}
                          className="block text-slate-400 hover:text-white"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                   <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Explore
                    </p>
                    <div className="space-y-2 pl-2">
                      {exploreLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={`/${link.query}`}
                          className="block text-slate-400 hover:text-white"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={createPageUrl("about")}
                    className="block text-lg font-medium text-slate-300 hover:text-white"
                  >
                    About
                  </Link>
                  <Link
                    to={createPageUrl("contact")}
                    className="block text-lg font-medium text-slate-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800">
                  {user ? (
                    <div className="space-y-4">
                        {/* User mobile links (keeping existing logic) */}
                         <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-sm font-bold text-slate-900">
                            {user.full_name?.[0] || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.full_name || "User"}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <Link to={createPageUrl("profile")} className="block px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl">Profile</Link>
                      <Link to={createPageUrl("saved-posts")} className="block px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl">Saved Posts</Link>
                      {user.role === "admin" && (
                         <Link to={createPageUrl("admindashboard")} className="block px-4 py-3 text-amber-400 hover:bg-slate-800 rounded-xl">Admin Dashboard</Link>
                      )}
                      <button onClick={onLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl">Logout</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link to={createPageUrl("login")} className="block">
                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                          Login (Admin)
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
