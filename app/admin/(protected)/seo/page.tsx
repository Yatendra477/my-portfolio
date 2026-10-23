import { getSiteSettings } from "@/lib/data";
import SeoSettingsForm from "./SeoSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">SEO & Open Graph</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure search engine optimization meta tags, page title, meta description, and the social share preview card (Open Graph image).
        </p>
      </div>

      <SeoSettingsForm initialSettings={settings} />
    </div>
  );
}
