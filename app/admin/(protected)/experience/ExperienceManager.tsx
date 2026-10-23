"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface ExperienceRow {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  type?: string;
  description?: string;
  bullets?: string[];
  tech?: string[];
  sort_order?: number;
}

interface ExperienceManagerProps {
  initialExperience: ExperienceRow[];
}

const experienceFields: FormFieldDef[] = [
  { name: "role", label: "Job Title / Role", type: "text", required: true, placeholder: "e.g. AI / ML Intern" },
  { name: "company", label: "Company / Organization", type: "text", required: true, placeholder: "e.g. Tech Corp" },
  { name: "type", label: "Employment Type", type: "text", placeholder: "e.g. Internship, Full-time, Contract" },
  { name: "period", label: "Time Period / Dates", type: "text", required: true, placeholder: "e.g. June 2024 – August 2024" },
  { name: "location", label: "Location", type: "text", placeholder: "e.g. Remote / New Delhi, India" },
  { name: "description", label: "Short Summary", type: "textarea", rows: 2, placeholder: "Brief context about the role..." },
  {
    name: "bullets",
    label: "Key Responsibilities & Impact (Bullet Points)",
    type: "chips",
    description: "Add each bullet point individually. Click Add after each bullet.",
    placeholder: "Type accomplishment and click Add...",
  },
  {
    name: "tech",
    label: "Tech Stack Used",
    type: "chips",
    description: "Add tools/frameworks (e.g. Python, PyTorch, FastAPI, Docker)",
    placeholder: "Type technology and click Add...",
  },
];

export default function ExperienceManager({ initialExperience }: ExperienceManagerProps) {
  const [items, setItems] = useState(initialExperience);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <AdminList
        title="Experience Timeline"
        description="Career milestones and internship positions."
        items={items}
        newItemLabel="Add Experience"
        formFields={experienceFields}
        renderItemSummary={(item) => ({
          title: `${item.role || "Role"} at ${item.company || "Company"}`,
          subtitle: `${item.period || ""} • ${item.type || ""} • ${item.location || ""}`,
          badge: item.period,
        })}
        onSave={async (values, id) => {
          const res = await saveRecordAction("experience", values, id);
          if (res.success) {
            if (id) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id ? ({ ...it, ...values } as unknown as ExperienceRow) : it
                )
              );
            } else {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...values } as unknown as ExperienceRow,
              ]);
            }
          }
          return res;
        }}
        onDelete={async (id) => {
          const res = await deleteRecordAction("experience", id);
          if (res.success) {
            setItems((prev) => prev.filter((it) => it.id !== id));
          }
          return res;
        }}
        onReorder={async (orderedIds) => {
          const res = await reorderTableAction("experience", orderedIds);
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
