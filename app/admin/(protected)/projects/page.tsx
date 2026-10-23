import { createClient } from "@/lib/supabase/server";
import ProjectsManager, { ProjectRow } from "./ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  let projectList: ProjectRow[] = [];
  try {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) projectList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Projects</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage featured showcases, project mockups/images (max 2MB), live demo links, repository URLs, and tech stack chips.
        </p>
      </div>

      <ProjectsManager initialProjects={projectList} />
    </div>
  );
}
