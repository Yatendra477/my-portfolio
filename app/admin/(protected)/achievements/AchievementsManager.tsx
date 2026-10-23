"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface AchievementRow {
  id: string;
  category: string;
  title: string;
  description: string;
  icon?: string;
  sort_order?: number;
}

interface AchievementsManagerProps {
  initialAchievements: AchievementRow[];
}

const achievementFields: FormFieldDef[] = [
  { name: "title", label: "Achievement Title", type: "text", required: true, placeholder: "e.g. 1st Place — National Hackathon" },
  { name: "category", label: "Category / Tag", type: "text", required: true, placeholder: "e.g. Hackathon, Coding, Academic" },
  { name: "description", label: "Description / Impact", type: "textarea", required: true, rows: 3 },
  {
    name: "icon",
    label: "Icon",
    type: "select",
    options: [
      { label: "Award (Honor)", value: "Award" },
      { label: "Trophy (Winner)", value: "Trophy" },
      { label: "Code2 (Technical)", value: "Code2" },
      { label: "GitBranch (Open Source)", value: "GitBranch" },
    ],
  },
];

export default function AchievementsManager({ initialAchievements }: AchievementsManagerProps) {
  const [items, setItems] = useState(initialAchievements);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <AdminList
        title="Honors & Awards"
        description="Recognition and competitive milestones."
        items={items}
        newItemLabel="Add Achievement"
        formFields={achievementFields}
        renderItemSummary={(item) => ({
          title: item.title || "Achievement",
          subtitle: `${item.category || ""} • ${item.description || ""}`,
          badge: item.category || "Honor",
        })}
        onSave={async (values, id) => {
          const res = await saveRecordAction("achievements", values, id);
          if (res.success) {
            if (id) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id ? ({ ...it, ...values } as unknown as AchievementRow) : it
                )
              );
            } else {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...values } as unknown as AchievementRow,
              ]);
            }
          }
          return res;
        }}
        onDelete={async (id) => {
          const res = await deleteRecordAction("achievements", id);
          if (res.success) {
            setItems((prev) => prev.filter((it) => it.id !== id));
          }
          return res;
        }}
        onReorder={async (orderedIds) => {
          const res = await reorderTableAction("achievements", orderedIds);
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
