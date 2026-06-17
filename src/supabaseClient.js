import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock the client if variables are not provided so the app won't crash 
// completely when users haven't set up Supabase yet, but warn them.
let supabase;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error("Supabase баптауы табылмады. VITE_SUPABASE_URL және VITE_SUPABASE_ANON_KEY мәндерін Netlify Environment Variables ішіне қосыңыз немесе .env.local файлын тексеріңіз.");
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: null, error: new Error("Supabase is not configured") }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase is not configured") }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: async () => ({ data: [], error: null })
        }),
        order: async () => ({ data: [], error: null })
      })
    })
  };
}

export { supabase };
