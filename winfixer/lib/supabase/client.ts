import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not defined. Supabase client will be a no-op stub for build/runtime without env vars.');
}

let supabaseInstance: any;
if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  const stubQuery = () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    order: () => stubQuery(),
    eq: () => stubQuery(),
    or: () => stubQuery(),
    single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
  });
  supabaseInstance = { from: (_table: string) => stubQuery() };
}

export const supabase = supabaseInstance;
