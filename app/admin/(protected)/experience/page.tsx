import { createClient } from "@/lib/supabase/server";
import ExperienceManager, { ExperienceRow } from "./ExperienceManager";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const supabase = await createClient();

  let expList: ExperienceRow[] = [];
  try {
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) expList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Work Experience</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage professional experience, internships, key achievements (bullet points), and technologies used.
        </p>
      </div>

      <ExperienceManager initialExperience={expList} />
    </div>
  );
}
