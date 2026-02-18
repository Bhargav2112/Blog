import { supabase } from "@/lib/supabaseClient";


// Re-export for backward compatibility if needed, but ideally we stop doing this.
export { supabase };

export const base44 = {
  auth: {
    me: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return null;
      return {
        ...user,
        full_name: user.user_metadata?.full_name || "Admin",
        // Set role based on your new correct email
        role: user.email === "bsparmar1221@gmail.com" ? "admin" : "user",
      };
    },
    logout: async () => {
      await supabase.auth.signOut();
      window.location.href = "/Login";
    },
    redirectToLogin: () => {
      window.location.href = "/Login";
    },
  },
  entities: {
    BlogPost: {
      list: async () => {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      },
      create: async (data) => {
        const { data: res, error } = await supabase
          .from("blog_posts")
          .insert([data])
          .select();
        if (error) throw error;
        return res[0];
      },
      update: async (id, data) => {
        const { data: res, error } = await supabase
          .from("blog_posts")
          .update(data)
          .eq("id", id)
          .select();
        if (error) throw error;
        return res[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
      filter: async (query, orderBy, limit) => {
        let builder = supabase.from("blog_posts").select("*");
        
        // Apply filters
        if (query) {
          Object.entries(query).forEach(([key, value]) => {
            builder = builder.eq(key, value);
          });
        }
        
        // Apply ordering
        if (orderBy) {
            const ascending = !orderBy.startsWith("-");
            const column = ascending ? orderBy : orderBy.substring(1);
            builder = builder.order(column, { ascending });
        } else {
            builder = builder.order("created_at", { ascending: false });
        }

        // Apply limit
        if (limit) {
            builder = builder.limit(limit);
        }

        const { data, error } = await builder;
        if (error) throw error;
        return data || [];
      },
      listWithPagination: async ({ pageParam = 0 }) => {
        // User requested: offset logic
        const from = pageParam;
        const to = from + 9; // Limit 10 (0-9)

        console.log(`📡 Fetching posts range: ${from}-${to}`);

        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published") 
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) {
            console.error("❌ API Error:", error);
            throw error;
        }

        return data || [];
      },
    },
    Category: {
      list: async () => {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        if (error) throw error;
        return data || [];
      },
      create: async (data) => {
        const { data: res, error } = await supabase
          .from("categories")
          .insert([data])
          .select();
        if (error) throw error;
        return res[0];
      },
      update: async (id, data) => {
        const { data: res, error } = await supabase
          .from("categories")
          .update(data)
          .eq("id", id)
          .select();
        if (error) throw error;
        return res[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    UserProfile: {
      filter: async (query) => {
        let builder = supabase.from("user_profiles").select("*");
        if (query) {
          Object.entries(query).forEach(([key, value]) => {
            builder = builder.eq(key, value);
          });
        }
        const { data, error } = await builder;
        if (error) throw error;
        return data || [];
      },
      create: async (data) => {
         const { data: res, error } = await supabase
           .from("user_profiles")
           .insert([data])
           .select();
         if (error) throw error;
         return res[0];
      },
      update: async (id, data) => {
         const { data: res, error } = await supabase
           .from("user_profiles")
           .update(data)
           .eq("id", id)
           .select();
         if (error) throw error;
         return res[0];
      },
    },
    User: {
      list: async (orderBy, limit) => {
        // Explicitly select updated_at and created_at
        let builder = supabase.from("profiles").select("id, email, full_name, role, avatar_url, created_at");
        
        if (orderBy) {
             const ascending = !orderBy.startsWith("-");
             const column = ascending ? orderBy : orderBy.substring(1);
             builder = builder.order(column, { ascending });
         } else {
             builder = builder.order("created_at", { ascending: false });
         }
 
         if (limit) {
             builder = builder.limit(limit);
         }
         
        const { data, error } = await builder;
        if (error) throw error;
        return data || [];
      },
      update: async (id, data) => {
         const { data: res, error } = await supabase
           .from("user_profiles")
           .update(data)
           .eq("id", id)
           .select();
         if (error) throw error;
         return res[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("user_profiles")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
    ContactMessage: {
      list: async (orderBy, limit) => {
        let builder = supabase.from("contact_messages").select("*");
        
        if (orderBy) {
             const ascending = !orderBy.startsWith("-");
             const column = ascending ? orderBy : orderBy.substring(1);
             builder = builder.order(column, { ascending });
         } else {
             builder = builder.order("created_at", { ascending: false });
         }
 
         if (limit) {
             builder = builder.limit(limit);
         }
         
        const { data, error } = await builder;
        if (error) throw error;
        return data || [];
      },
      create: async (data) => {
        const { data: res, error } = await supabase
          .from("contact_messages")
          .insert([data])
          .select();
        if (error) throw error;
        return res[0];
      },
       update: async (id, data) => {
        const { data: res, error } = await supabase
          .from("contact_messages")
          .update(data)
          .eq("id", id)
          .select();
        if (error) throw error;
        return res[0];
      },
      delete: async (id) => {
        const { error } = await supabase
          .from("contact_messages")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return true;
      },
    },
  },
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
        return { file_url: data.publicUrl };
      },
    },
  },
  admin: {
    getDashboardStats: async () => {
        const [
            { count: postsCount },
            { data: viewsData },
            { count: usersCount },
            { count: adminsCount },
            { count: messagesCount }
        ] = await Promise.all([
            supabase.from("blog_posts").select("*", { count: "exact", head: true }),
            supabase.from("blog_posts").select("views"),
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
            supabase.from("contact_messages").select("*", { count: "exact", head: true }) // Assuming all for now, or add .eq('read', false) if we had that field
        ]);

        const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

        return {
            totalPosts: postsCount || 0,
            totalViews,
            totalUsers: usersCount || 0,
            totalAdmins: adminsCount || 0,
            unreadMessages: messagesCount || 0 // Placeholder logic for now
        };
    }
  }
};
