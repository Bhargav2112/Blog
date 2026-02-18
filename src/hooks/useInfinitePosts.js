import { useInfiniteQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useInfinitePosts({ 
  limit = 10, 
  sort = "latest", 
  category = null, 
  searchQuery = null 
} = {}) {
  
  return useInfiniteQuery({
    queryKey: ["posts", "infinite", { limit, sort, category, searchQuery }],
    
    queryFn: ({ pageParam = 0 }) => base44.entities.BlogPost.listWithPagination({ pageParam }),
    
    initialPageParam: 0,
    
    getNextPageParam: (lastPage, allPages) => {
      // If last page has fewer than 10 items, we've reached the end
      if (!lastPage || lastPage.length < 10) return undefined;
      
      // Calculate next offset
      return allPages.length * 10;
    },
    
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
}
