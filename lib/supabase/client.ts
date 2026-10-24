/**
 * Browser-side Supabase client.
 * Uses NEXT_PUBLIC_ env vars only — never a service_role key.
 */
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );
}
