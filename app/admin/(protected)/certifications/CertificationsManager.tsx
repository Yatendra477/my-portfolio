"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface CertificationRow {
  id: string;
  title: string;
  issuer: string;
  period: string;
  description?: string;
  credential_id?: string;
  credential_url?: string;
  sort_order?: number;
}

interface CertificationsManagerProps {
  initialCertifications: CertificationRow[];
}

const certificationFields: FormFieldDef[] = [
  { name: "title", label: "Certification Title", type: "text", required: true, placeholder: "e.g. Deep Learning Specialization" },
  { name: "issuer", label: "Issuing Organization", type: "text", required: true, placeholder: "e.g. DeepLearning.AI / Coursera" },
  { name: "period", label: "Issue Date / Period", type: "text", required: true, placeholder: "e.g. 2024" },
  { name: "description", label: "Description / Skills Learned", type: "textarea", rows: 2 },
  { name: "credential_id", label: "Credential ID (Optional)", type: "text", placeholder: "e.g. ABC123XYZ" },
  { name: "credential_url", label: "Verification / Credential URL", type: "url", placeholder: "https://coursera.org/verify/..." },
];

export default function CertificationsManager({ initialCertifications }: CertificationsManagerProps) {
  const [items, setItems] = useState(initialCertifications);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <AdminList
        title="Verified Credentials"
        description="Certifications and licenses displayed in the Certifications grid."
        items={items}
        newItemLabel="Add Certification"
        formFields={certificationFields}
        renderItemSummary={(item) => ({
          title: item.title || "Certification",
          subtitle: `${item.issuer || ""} • ${item.period || ""}`,
          badge: item.issuer || item.period,
        })}
        onSave={async (values, id) => {
          const res = await saveRecordAction("certifications", values, id);
          if (res.success) {
            if (id) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id ? ({ ...it, ...values } as unknown as CertificationRow) : it
                )
              );
            } else {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...values } as unknown as CertificationRow,
              ]);
            }
          }
          return res;
        }}
        onDelete={async (id) => {
          const res = await deleteRecordAction("certifications", id);
          if (res.success) {
            setItems((prev) => prev.filter((it) => it.id !== id));
          }
          return res;
        }}
        onReorder={async (orderedIds) => {
          const res = await reorderTableAction("certifications", orderedIds);
          if (res.success) {
            const sorted = [...items].sort(
              (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
            );
            setItems(sorted);
          }
          return res;
        }}
      />
    </div>
  );
}
