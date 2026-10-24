/**
 * Server-side Supabase client for Server Components / Route Handlers.
 * Uses NEXT_PUBLIC_ env vars only — never a service_role key.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — cookie setting is a no-op
          }
        },
      },
    }
  );
}
