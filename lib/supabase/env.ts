/**
 * Safe accessor for Supabase environment variables.
 * Sanitizes URLs (stripping trailing slashes and accidental /rest/v1 paths)
 * so misconfigured environment variables don't break Supabase Auth and APIs.
 */

export function getSupabaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/rest\/v1\/?$/, "");
  url = url.replace(/\/+$/, "");
  return url;
}

export function getSupabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key);
}
