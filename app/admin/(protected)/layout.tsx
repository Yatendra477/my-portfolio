import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  // Fetch unread messages count for the sidebar badge
  let unreadCount = 0;
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    if (!error && typeof count === "number") {
      unreadCount = count;
    }
  } catch {
    // If table doesn't exist or error, keep 0
  }

  return (
    <AdminLayoutWrapper userEmail={user.email} unreadCount={unreadCount}>
      {children}
    </AdminLayoutWrapper>
  );
}
