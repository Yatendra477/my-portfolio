import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * Checks whether the current session belongs to an authorized admin.
 * Performs a user lookup, then verifies against is_admin() RPC and admins table.
 */
export async function verifyAdmin(): Promise<{
  authorized: boolean;
  user: AdminUser | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return { authorized: false, user: null };
    }

    // 1. Try is_admin() RPC function
    try {
      const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
      if (!rpcError && isAdmin === true) {
        return {
          authorized: true,
          user: { id: user.id, email: user.email },
        };
      }
    } catch {
      // If RPC fails (e.g. migration not run or function missing), fallback to admins table
    }

    // 2. Query admins table directly
    try {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("id, email")
        .eq("email", user.email)
        .maybeSingle();

      if (adminRow) {
        return {
          authorized: true,
          user: { id: user.id, email: user.email },
        };
      }
    } catch {
      // Table query failed
    }

    return { authorized: false, user: null };
  } catch {
    return { authorized: false, user: null };
  }
}

/**
 * Server-side guard for server components and pages.
 * Redirects to /admin/login if the user is not an authorized admin.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const { authorized, user } = await verifyAdmin();

  if (!authorized || !user) {
    redirect("/admin/login");
  }

  return user;
}
