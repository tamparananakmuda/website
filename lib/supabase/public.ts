import { createClient as createSupabaseClient } from '@supabase/supabase-js';

type UntypedClient = ReturnType<typeof createSupabaseClient<any>>;

let client: UntypedClient | null = null;

export function createPublicClient(): UntypedClient {
  if (client) return client;

  client = createSupabaseClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  return client;
}
