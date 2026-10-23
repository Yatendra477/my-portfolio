import { getSiteSettings } from "@/lib/data";
import HeroSettingsForm from "./HeroSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile & Hero</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your name, professional title, availability badge, hero stats, and profile photo.
        </p>
      </div>

      <HeroSettingsForm initialSettings={settings} />
    </div>
  );
}
