import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined. Server supabase client will be a no-op stub for build/runtime without env vars.');
}

// Create a real client only when env vars are present. Otherwise export a small stub
// to avoid throwing at build time. The stub returns empty results or an error message
// when operations are attempted.
let supabaseInstance: any;
if (supabaseUrl && supabaseServiceKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
} else {
  const stubQuery = () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    order: () => stubQuery(),
    eq: () => stubQuery(),
    or: () => stubQuery(),
    single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
  });
  supabaseInstance = {
    from: (_table: string) => stubQuery(),
    rpc: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
  };
}

export const supabase = supabaseInstance;
