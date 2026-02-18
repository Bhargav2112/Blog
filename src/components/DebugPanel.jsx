import React, { useEffect, useState } from 'react';

import { createClient } from "@supabase/supabase-js";

export default function DebugPanel() {
  const [status, setStatus] = useState('Checking...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function check() {
      try {
        console.log("🔍 DebugPanel: Starting Diagnostic (Fresh Client)...");
        
        // 1. Check Key
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
           setStatus('Missing ENV Variables');
           return;
        }

        // 2. Create ISOLATED Client (No Auth Persistence)
        const tempClient = createClient(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });

        // 3. Simple Connectivity Check (Categories)
        const { data: cats, error: catError } = await tempClient
           .from('categories')
           .select('id')
           .limit(1)
           .maybeSingle(); // lighter query

        if (catError) {
            console.error("❌ Categories Check Failed:", catError);
            setStatus(`Connection Error: ${catError.message}`);
            setError(catError);
            return;
        }
        console.log("✅ Categories connection successful");

        // 3. Main Data Check (posts)
        const { data: posts, error: err } = await tempClient
          .from('blog_posts')
          .select('*')
          .limit(3);
        
        if (err) {
            console.error("❌ Posts Check Failed:", err);
            setError(err);
            setStatus(`RLS/Data Error: ${err.message}`);
        } else {
            setData(posts);
            if (posts.length === 0) {
               setStatus('EMPTY DATABASE - RUN SQL MIGRATION');
            } else {
               setStatus('Success - Data Loaded');
            }
        }
      } catch (e) {
        console.error("❌ DebugPanel Exception:", e);
        setError(e);
        setStatus(`Exception: ${e.message}`);
      }
    }
    check();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/90 text-green-400 border border-green-500 rounded-lg max-w-lg text-xs font-mono overflow-auto max-h-96 shadow-2xl">
      <h3 className="font-bold border-b border-green-800 mb-2">🔍 Debug Panel</h3>
      <div className="mb-2">
        <span className="text-white">Status:</span> {status}
      </div>
      {error && (
        <div className="text-red-500 mb-2">
            <strong>Error:</strong> {JSON.stringify(error, null, 2)}
        </div>
      )}
      {data && (
        <div>
            <div className="text-white mb-1">Found {data.length} posts:</div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      <div className="mt-2 pt-2 border-t border-green-800 text-gray-500">
         Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Missing'}
      </div>
    </div>
  );
}
