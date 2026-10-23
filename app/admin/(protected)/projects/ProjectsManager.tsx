"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface ProjectRow {
  id: string;
  title: string;
  description: string;
  category?: string;
  date_text?: string;
  image_url?: string;
  tech?: string[];
  bullets?: string[];
  github_url?: string;
  demo_url?: string;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

interface ProjectsManagerProps {
  initialProjects: ProjectRow[];
}

const projectFields: FormFieldDef[] = [
  { name: "title", label: "Project Title", type: "text", required: true, placeholder: "e.g. AI Lung Cancer Detection System" },
  { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. AI & Machine Learning, Full Stack, Computer Vision" },
  { name: "date_text", label: "Date / Timeline", type: "text", placeholder: "e.g. 2024 or Oct 2024" },
  { name: "description", label: "Project Summary", type: "textarea", required: true, rows: 3 },
  {
    name: "image_url",
    label: "Project Image / Mockup",
    type: "image",
    description: "Upload a JPG, PNG, or WebP (max 2 MB)",
  },
  {
    name: "tech",
    label: "Technology Stack (Chips)",
    type: "chips",
    description: "Add each technology or framework used (e.g. Python, TensorFlow, Next.js, FastAPI)",
    placeholder: "Type tech and click Add...",
  },
  {
    name: "bullets",
    label: "Key Features & Highlights (Bullet Points)",
    type: "chips",
    description: "Add key impact metrics or technical feats",
    placeholder: "Type highlight and click Add...",
  },
  { name: "github_url", label: "GitHub Repository URL", type: "url", placeholder: "https://github.com/..." },
  { name: "demo_url", label: "Live Demo / Video URL", type: "url", placeholder: "https://..." },
  {
    name: "is_featured",
    label: "Feature on Homepage",
    type: "switch",
    description: "Display with prominent badge in the featured filter",
  },
  {
    name: "is_visible",
    label: "Visible on Portfolio",
    type: "switch",
    description: "Show or hide this project from the public website",
  },
];

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [items, setItems] = useState(initialProjects);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <AdminList
        title="Project Showcase"
        description="Software applications, ML pipelines, and research projects."
        items={items}
        newItemLabel="Add New Project"
        formFields={projectFields}
        renderItemSummary={(item) => ({
          title: item.title || "Untitled Project",
          subtitle: `${item.category || ""} • ${item.tech?.join(", ") || ""}`,
          badge: item.category || "Project",
          badges: [
            ...(item.is_featured
              ? [{ text: "★ Featured", color: "warning" as const }]
              : []),
            {
              text: item.is_visible !== false ? "Visible" : "Hidden",
              color: item.is_visible !== false ? ("success" as const) : ("default" as const),
            },
          ],
        })}
        onSave={async (values, id) => {
          const res = await saveRecordAction("projects", values, id);
          if (res.success) {
            if (id) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id ? ({ ...it, ...values } as unknown as ProjectRow) : it
                )
              );
            } else {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...values } as unknown as ProjectRow,
              ]);
            }
          }
          return res;
        }}
        onDelete={async (id) => {
          const res = await deleteRecordAction("projects", id);
          if (res.success) {
            setItems((prev) => prev.filter((it) => it.id !== id));
          }
          return res;
        }}
        onReorder={async (orderedIds) => {
          const res = await reorderTableAction("projects", orderedIds);
          if (res.success) {
            const sorted = [...items].sort(
              (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
            );
            setItems(sorted);
          }
          return res;
        }}
        onToggleVisibility={async (id, isVisible) => {
          const res = await saveRecordAction("projects", { is_visible: isVisible }, id);
          if (res.success) {
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, is_visible: isVisible } : it))
            );
          }
          return res;
        }}
        onToggleFeatured={async (id, isFeatured) => {
          const res = await saveRecordAction("projects", { is_featured: isFeatured }, id);
          if (res.success) {
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, is_featured: isFeatured } : it))
            );
          }
          return res;
        }}
      />
    </div>
  );
}
