import { createClient } from '@supabase/supabase-js';

/**
 * Creates a server-side Supabase client.
 * Best practice for backend/SSR environments: disabled session persistence.
 */
export const createServerClient = () => {
  // Handle both Node.js (process.env) and bundler/Vite (import.meta.env) environments
  const supabaseUrl = 
    (typeof process !== 'undefined' && process.env ? process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL : '') ||
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '');

  const supabaseKey = 
    (typeof process !== 'undefined' && process.env ? process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY : '') ||
    (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '');

  if (!supabaseUrl) {
    throw new Error('Supabase URL is required for server-side client initialization.');
  }

  if (!supabaseKey) {
    throw new Error('Supabase Key is required for server-side client initialization.');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};
