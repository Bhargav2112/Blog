import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useParams, useSearchParams } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import SearchBar from "../components/blog/SearchBar";
import CategoryFilter from "../components/blog/CategoryFilter";
import { BlogCardSkeleton } from "../components/common/LoadingSkeleton";
import { Sparkles, SlidersHorizontal, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInfinitePosts } from "@/hooks/useInfinitePosts";
import { useQuery } from "@tanstack/react-query";

export default function BlogListing({ user, addToast }) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortParam = searchParams.get("sort") || "latest";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  
  const observerTarget = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: postsLoading,
  } = useInfinitePosts({
    limit: 10,
    sort: sortParam,
    category: slug, // Pass slug directly, API handles it
    searchQuery: debouncedSearch,
  });

  // Flatten posts
  const allPosts = data?.pages?.flat() || [];

  // Fetch categories (for filter UI)
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => base44.entities.Category.list(),
  });

  // Fetch user profile for favorites
  useEffect(() => {
    if (user?.email) {
      base44.entities.UserProfile.filter({ user_email: user.email }).then(
        (profiles) => {
          if (profiles.length > 0) {
            setUserProfile(profiles[0]);
          }
        },
      );
    }
  }, [user]);

  // Handle Sort Change
  const handleSortChange = (newSort) => {
    setSearchParams({ sort: newSort });
  };

  // Infinite Scroll Observer
  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    // console.log("👀 Observer Trigger:", { 
    //   isIntersecting: target.isIntersecting, 
    //   hasNextPage, 
    //   isFetchingNextPage 
    // });
    
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      console.log("🚀 Fetching next page...");
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px", // Load before reaching bottom
      threshold: 0, // Trigger immediately upon entering margin
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);


  // Toggle favorite
  const toggleFavorite = async (postId) => {
    if (!user) {
      addToast?.("Please login to save posts", "warning");
      return;
    }

    const favorites = userProfile?.favorite_posts || [];
    const newFavorites = favorites.includes(postId)
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
        favorite_posts: newFavorites,
      });
      setUserProfile(newProfile);
    }

    addToast?.(
      favorites.includes(postId)
        ? "Removed from favorites"
        : "Added to favorites",
      "success",
    );
  };

  const getPageTitle = () => {
    if (slug) {
       const categoryName = categories?.find(c => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase())?.name || slug;
       return `${categoryName} Articles`;
    }
    if (sortParam === "popular") return "Popular Articles";
    if (sortParam === "trending") return "Trending Now";
    return "All Articles";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">
              Explore Our Blog
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 capitalize"
          >
            {getPageTitle()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-8"
          >
            Discover insightful articles, tutorials, and stories from our
            community of writers.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search articles, tags, topics..."
            />
          </motion.div>
        
        {/* DEBUG OVERLAY */}

      </div>
      </section>

      {/* Filters & Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Controls: Category Filter (Left) & Sort (Right) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            {/* Category Filter - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block" 
            >
              <CategoryFilter
                categories={categories || []}
                selected={slug}
                onSelect={(cat) => {
                   if (!cat) window.location.href = "/"; 
                }}
              />
            </motion.div>
            
             {/* Sort Dropdown */}
            <div className="flex items-center gap-4 self-end md:self-auto">
               <span className="text-sm text-slate-400">Sort by:</span>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {sortParam.charAt(0).toUpperCase() + sortParam.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem onClick={() => handleSortChange("latest")} className="text-slate-300 hover:text-white cursor-pointer">Latest</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("popular")} className="text-slate-300 hover:text-white cursor-pointer">Popular</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange("trending")} className="text-slate-300 hover:text-white cursor-pointer">Trending</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          {/* Category Filter - Mobile */}
          <div className="md:hidden mb-8">
             <Sheet>
               <SheetTrigger asChild>
                <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                   Categories
                </Button>
               </SheetTrigger>
               <SheetContent side="bottom" className="bg-slate-900 border-slate-800">
                  <CategoryFilter 
                      categories={categories || []} 
                      selected={slug} 
                      onSelect={() => {}} 
                   />
               </SheetContent>
             </Sheet>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-400">
              {allPosts.length}{" "}
              {allPosts.length === 1 ? "article" : "articles"} loaded
            </p>
             {(slug || sortParam !== 'latest' || searchQuery) && (
              <Button
                variant="ghost"
                onClick={() => {
                   window.location.href = "/";
                }}
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post, index) => (
              <BlogCard
                key={`${post.id}-${index}`} // unique key in case of dupes (though API shouldn't return dupes if implemented right)
                post={post}
                index={index}
                onToggleFavorite={toggleFavorite}
                isFavorite={userProfile?.favorite_posts?.includes(post.id)}
              />
            ))}
            
            {(postsLoading || isFetchingNextPage) && (
               Array(3).fill(0).map((_, i) => (
                  <BlogCardSkeleton key={`skeleton-${i}`} />
               ))
            )}
          </div>

          {/* Infinite Scroll Sentinel / Loading / End Message */}
          <div 
             ref={observerTarget} 
             className="mt-12 text-center h-20 flex items-center justify-center w-full"
          >
             {isFetchingNextPage && (
                 <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
             )}
             {!hasNextPage && allPosts.length > 0 && (
                <p className="text-slate-500">You've reached the end!</p>
             )}
             {postsLoading && allPosts.length === 0 && (
                // Initial loading handled by skeleton above, but just in case
                <div className="flex flex-col items-center">
                   <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                   <p className="text-slate-400">Loading articles...</p>
                </div>
             )}
          </div>
          
           {!postsLoading && allPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No articles found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
