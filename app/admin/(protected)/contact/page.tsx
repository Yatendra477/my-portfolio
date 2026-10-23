import { getSiteSettings } from "@/lib/data";
import ContactSocialForm from "./ContactSocialForm";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Contact & Social Links</h1>
        <p className="text-sm text-slate-400 mt-1">
          Update the email, telephone, geographic location, and external social media links shown in the header, contact section, and footer.
        </p>
      </div>

      <ContactSocialForm initialSettings={settings} />
    </div>
  );
}
