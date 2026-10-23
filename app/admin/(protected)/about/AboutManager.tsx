"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface HighlightRow {
  id: string;
  title: string;
  description: string;
  icon?: string;
  sort_order?: number;
}

export interface StatRow {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  sort_order?: number;
}

interface AboutManagerProps {
  initialHighlights: HighlightRow[];
  initialStats: StatRow[];
}

const highlightFields: FormFieldDef[] = [
  { name: "title", label: "Highlight Title", type: "text", required: true, placeholder: "e.g. AI & Problem Solving" },
  { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
  {
    name: "icon",
    label: "Icon",
    type: "select",
    options: [
      { label: "Brain (AI & ML)", value: "Brain" },
      { label: "Code2 (Software & Architecture)", value: "Code2" },
      { label: "Users (Collaboration & Mentorship)", value: "Users" },
      { label: "Lightbulb (Innovation)", value: "Lightbulb" },
      { label: "Eye (Computer Vision)", value: "Eye" },
      { label: "TrendingUp (Growth & Impact)", value: "TrendingUp" },
    ],
  },
];

const statFields: FormFieldDef[] = [
  { name: "label", label: "Counter Label", type: "text", required: true, placeholder: "e.g. Projects Completed" },
  { name: "value", label: "Number Value", type: "number", required: true, placeholder: "5" },
  { name: "suffix", label: "Suffix Symbol", type: "text", placeholder: "+" },
];

export default function AboutManager({
  initialHighlights,
  initialStats,
}: AboutManagerProps) {
  const [highlights, setHighlights] = useState(initialHighlights);
  const [stats, setStats] = useState(initialStats);

  return (
    <div className="space-y-10">
      {/* Highlights Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <AdminList
          title="About Highlights & Strengths"
          description="Pillars showcasing your core strengths, leadership, and technical focus."
          items={highlights}
          newItemLabel="Add Highlight"
          formFields={highlightFields}
          renderItemSummary={(item) => ({
            title: item.title || "Untitled Highlight",
            subtitle: item.description,
            badge: item.icon || "Icon",
          })}
          onSave={async (values, id) => {
            const res = await saveRecordAction("about_highlights", values, id);
            if (res.success) {
              if (id) {
                setHighlights((prev) =>
                  prev.map((h) =>
                    h.id === id ? ({ ...h, ...values } as unknown as HighlightRow) : h
                  )
                );
              } else {
                setHighlights((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), ...values } as unknown as HighlightRow,
                ]);
              }
            }
            return res;
          }}
          onDelete={async (id) => {
            const res = await deleteRecordAction("about_highlights", id);
            if (res.success) {
              setHighlights((prev) => prev.filter((h) => h.id !== id));
            }
            return res;
          }}
          onReorder={async (orderedIds) => {
            const res = await reorderTableAction("about_highlights", orderedIds);
            if (res.success) {
              const sorted = [...highlights].sort(
                (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
              );
              setHighlights(sorted);
            }
            return res;
          }}
        />
      </div>

      {/* Counters / Stats Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <AdminList
          title="Animated Stats & Counters"
          description="Metric counters displayed in the About card grid."
          items={stats}
          newItemLabel="Add Counter"
          formFields={statFields}
          renderItemSummary={(item) => ({
            title: item.label || "Metric",
            subtitle: `Display: ${item.value}${item.suffix || ""}`,
            badge: `${item.value}${item.suffix || ""}`,
          })}
          onSave={async (values, id) => {
            const res = await saveRecordAction("about_stats", values, id);
            if (res.success) {
              if (id) {
                setStats((prev) =>
                  prev.map((s) =>
                    s.id === id ? ({ ...s, ...values } as unknown as StatRow) : s
                  )
                );
              } else {
                setStats((prev) => [
                  ...prev,
                  { id: crypto.randomUUID(), ...values } as unknown as StatRow,
                ]);
              }
            }
            return res;
          }}
          onDelete={async (id) => {
            const res = await deleteRecordAction("about_stats", id);
            if (res.success) {
              setStats((prev) => prev.filter((s) => s.id !== id));
            }
            return res;
          }}
          onReorder={async (orderedIds) => {
            const res = await reorderTableAction("about_stats", orderedIds);
            if (res.success) {
              const sorted = [...stats].sort(
                (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
              );
              setStats(sorted);
            }
            return res;
          }}
        />
      </div>
    </div>
  );
}
