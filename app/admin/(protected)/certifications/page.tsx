import { createClient } from "@/lib/supabase/server";
import CertificationsManager, { CertificationRow } from "./CertificationsManager";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const supabase = await createClient();

  let certList: CertificationRow[] = [];
  try {
    const { data } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) certList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Certifications</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage accredited credentials, verified issuer certificates, and verification links.
        </p>
      </div>

      <CertificationsManager initialCertifications={certList} />
    </div>
  );
}
