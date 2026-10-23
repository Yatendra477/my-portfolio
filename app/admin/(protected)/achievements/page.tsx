import { createClient } from "@/lib/supabase/server";
import AchievementsManager, { AchievementRow } from "./AchievementsManager";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  const supabase = await createClient();

  let achList: AchievementRow[] = [];
  try {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) achList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Achievements & Honors</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage hackathon wins, competitive programming ranks, coding milestones, and honors.
        </p>
      </div>

      <AchievementsManager initialAchievements={achList} />
    </div>
  );
}
