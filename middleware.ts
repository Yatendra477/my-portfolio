import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUrl, getSupabaseAnonKey } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect routes under /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseKey) {
    if (!isLoginPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("error", "supabase_not_configured");
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    if (!isLoginPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Check admin authorization
  let isUserAdmin = false;

  try {
    const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
    if (!rpcError && isAdmin === true) {
      isUserAdmin = true;
    }
  } catch {
    // RPC failed or missing
  }

  if (!isUserAdmin) {
    try {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (adminRow) {
        isUserAdmin = true;
      }
    } catch {
      // Table check failed
    }
  }

  if (!isUserAdmin) {
    if (!isLoginPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Logged-in admin visiting /admin/login should be directed to /admin
  if (isLoginPage) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
