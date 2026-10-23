import { createClient } from "@/lib/supabase/server";
import SkillsManager, { SkillCategoryRow, SkillRow } from "./SkillsManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const supabase = await createClient();

  let categories: SkillCategoryRow[] = [];
  let skills: SkillRow[] = [];

  try {
    const [catRes, skillRes] = await Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
    ]);

    if (catRes.data) categories = catRes.data;
    if (skillRes.data) skills = skillRes.data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Technical Skills</h1>
        <p className="text-sm text-slate-400 mt-1">
          Organize skills into categories (Languages, Frameworks, AI/ML, Cloud) and configure skill proficiency levels and descriptions.
        </p>
      </div>

      <SkillsManager initialCategories={categories} initialSkills={skills} />
    </div>
  );
}
