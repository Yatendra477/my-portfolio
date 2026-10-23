import { createClient } from "@/lib/supabase/server";
import EducationManager, { EducationRow } from "./EducationManager";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const supabase = await createClient();

  let educationList: EducationRow[] = [];
  try {
    const { data } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) educationList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Education</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage academic history, degree details, institutions, locations, and coursework tags.
        </p>
      </div>

      <EducationManager initialEducation={educationList} />
    </div>
  );
}
