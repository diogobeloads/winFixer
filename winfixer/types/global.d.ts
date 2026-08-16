declare module '@/lib/supabase/client' {
  import type { SupabaseClient } from '@supabase/supabase-js';
  export const supabase: SupabaseClient;
  export function createClient(...args: any[]): SupabaseClient;
}

declare module '@/lib/supabase/server' {
  import type { SupabaseClient } from '@supabase/supabase-js';
  export const supabase: SupabaseClient;
}

declare module '@/types/database' {
  export type ErrorType = any;
  export type Fix = any;
  export type DiagnosticQuestion = any;
  export type Evidence = any;
  export type SearchResult = any;
}

declare module '@/components/*' {
  const component: any;
  export default component;
}
