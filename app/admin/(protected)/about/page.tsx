import { createClient } from "@/lib/supabase/server";
import AboutManager, { HighlightRow, StatRow } from "./AboutManager";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const supabase = await createClient();

  let highlights: HighlightRow[] = [];
  let stats: StatRow[] = [];

  try {
    const [hRes, sRes] = await Promise.all([
      supabase.from("about_highlights").select("*").order("sort_order", { ascending: true }),
      supabase.from("about_stats").select("*").order("sort_order", { ascending: true }),
    ]);

    if (hRes.data) highlights = hRes.data;
    if (sRes.data) stats = sRes.data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">About & Highlights</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage key highlights, core pillars, and animated counter numbers displayed in the About section.
        </p>
      </div>

      <AboutManager initialHighlights={highlights} initialStats={stats} />
    </div>
  );
}
