import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const { data: posts } = useQuery({
  queryKey: ["posts"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("posts") // Your Supabase table name
      .select("*");
    if (error) throw error;
    return data;
  },
});
