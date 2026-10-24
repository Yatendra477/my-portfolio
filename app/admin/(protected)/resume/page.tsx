import { getSiteSettings } from "@/lib/data";
import ResumeUploadCard from "./ResumeUploadCard";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resume Management</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload and manage your professional PDF resume. All &ldquo;Download Resume&rdquo; buttons and &ldquo;Last updated&rdquo; tags across the site update dynamically.
        </p>
      </div>

      <ResumeUploadCard
        currentResumeUrl={settings.resumeUrl || ""}
        currentUpdatedAt={settings.resumeUpdatedAt || ""}
      />
    </div>
  );
}
