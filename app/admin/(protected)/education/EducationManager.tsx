"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface EducationRow {
  id: string;
  title: string;
  subtitle: string;
  institution: string;
  period: string;
  location?: string;
  tags?: string[];
  sort_order?: number;
}

interface EducationManagerProps {
  initialEducation: EducationRow[];
}

const educationFields: FormFieldDef[] = [
  { name: "title", label: "Degree / Program Title", type: "text", required: true, placeholder: "e.g. Bachelor of Technology (B.Tech)" },
  { name: "subtitle", label: "Field of Study", type: "text", required: true, placeholder: "e.g. Computer Science & Engineering" },
  { name: "institution", label: "Institution / University", type: "text", required: true, placeholder: "e.g. SRM Institute of Science and Technology" },
  { name: "period", label: "Duration / Period", type: "text", required: true, placeholder: "e.g. 2023 – 2027" },
  { name: "location", label: "Location", type: "text", placeholder: "e.g. Ghaziabad, India" },
  {
    name: "tags",
    label: "Key Coursework & Focus Areas (Tags)",
    type: "chips",
    description: "Add subjects or specializations (e.g. Data Structures, Machine Learning, DBMS)",
    placeholder: "Type subject and click Add...",
  },
];

export default function EducationManager({ initialEducation }: EducationManagerProps) {
  const [items, setItems] = useState(initialEducation);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <AdminList
        title="Academic Degrees"
        description="Degrees and academic qualifications shown in the Education timeline."
        items={items}
        newItemLabel="Add Education"
        formFields={educationFields}
        renderItemSummary={(item) => ({
          title: `${item.title || "Degree"} — ${item.institution || ""}`,
          subtitle: `${item.subtitle || ""} • ${item.period || ""} • ${item.location || ""}`,
          badge: item.period,
        })}
        onSave={async (values, id) => {
          const res = await saveRecordAction("education", values, id);
          if (res.success) {
            if (id) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id ? ({ ...it, ...values } as unknown as EducationRow) : it
                )
              );
            } else {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...values } as unknown as EducationRow,
              ]);
            }
          }
          return res;
        }}
        onDelete={async (id) => {
          const res = await deleteRecordAction("education", id);
          if (res.success) {
            setItems((prev) => prev.filter((it) => it.id !== id));
          }
          return res;
        }}
        onReorder={async (orderedIds) => {
          const res = await reorderTableAction("education", orderedIds);
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
