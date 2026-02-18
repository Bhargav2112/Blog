import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useRealtime(tables = []) {
  const queryClient = useQueryClient();

  // Create a stable key for the tables array to prevent re-subscription loops
  // when passing a new array literal on every render.
  const tablesKey = JSON.stringify(tables);

  useEffect(() => {
    if (!tables.length) return;

    // console.log("🔌 Setting up realtime subscriptions for:", tables);

    const channels = tables.map((table) => {
      return supabase
        .channel(`public:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            // console.log(`🔄 Real-time change in ${table}:`, payload);
            // Invalidate queries related to this table
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: [table] }); 
            // Also invalidate 'list' queries dependent on this table
             // Invalidating everything matching the table name is a safe catch-all here
             queryClient.invalidateQueries({ queryKey: [table] }); 
          }
        )
        .subscribe((status, err) => {
             if (status === 'CHANNEL_ERROR') {
                 console.warn(`⚠️ Realtime connection error for ${table}:`, err);
             }
        });
    });

    return () => {
      // console.log("🔌 Cleaning up realtime subscriptions");
      channels.forEach((channel) => {
           // Wrap in try-catch to ignore "socket closed" errors during unmount races
           try {
               supabase.removeChannel(channel);
           } catch (e) {
               // Ignore
           }
      });
    };
  }, [tablesKey, queryClient]); // Depend on the stringified key, not the array reference
}
