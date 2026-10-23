import { getSectionVisibility } from "@/lib/data";
import SectionVisibilityManager from "./SectionVisibilityManager";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const visibility = await getSectionVisibility();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Section Visibility</h1>
        <p className="text-sm text-slate-400 mt-1">
          Turn individual sections of your portfolio on or off. Hidden sections will automatically be excluded from the homepage and navigation bar.
        </p>
      </div>

      <SectionVisibilityManager initialVisibility={visibility} />
    </div>
  );
}
