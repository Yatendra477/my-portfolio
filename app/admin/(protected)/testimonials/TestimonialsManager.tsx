"use client";

import React, { useState } from "react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface TestimonialRow {
  id: string;
  quote: string;
  name: string;
  role: string;
  is_visible?: boolean;
  sort_order?: number;
}

interface TestimonialsManagerProps {
  initialTestimonials: TestimonialRow[];
}

const testimonialFields: FormFieldDef[] = [
  { name: "name", label: "Client / Colleague Name", type: "text", required: true, placeholder: "e.g. Alex Morgan" },
  { name: "role", label: "Title & Organization", type: "text", required: true, placeholder: "e.g. Senior ML Engineer, DeepTech Labs" },
  { name: "quote", label: "Testimonial Quote", type: "textarea", required: true, rows: 4, placeholder: "Quote text..." },
  { name: "is_visible", label: "Show on Public Site", type: "switch", description: "Toggle whether this review is visible to public visitors" },
];

export default function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const [items, setItems] = useState(initialTestimonials);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <AdminList
        title="Recommendations & Quotes"
        description="Endorsements shown in the Testimonials carousel."
        items={items}
        newItemLabel="Add Testimonial"
        formFields={testimonialFields}
        renderItemSummary={(item) => ({
          title: item.name || "Anonymous",
          subtitle: `"${item.quote || ""}" — ${item.role || ""}`,
          badge: item.is_visible !== false ? "Visible" : "Hidden",
          badges: [
            {
              text: item.is_visible !== false ? "Visible" : "Hidden",
              color: item.is_visible !== false ? "success" : "default",
            },
          ],
        })}
        onSave={async (values, id) => {
          const res = await saveRecordAction("testimonials", values, id);
          if (res.success) {
            if (id) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === id ? ({ ...it, ...values } as unknown as TestimonialRow) : it
                )
              );
            } else {
              setItems((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...values } as unknown as TestimonialRow,
              ]);
            }
          }
          return res;
        }}
        onDelete={async (id) => {
          const res = await deleteRecordAction("testimonials", id);
          if (res.success) {
            setItems((prev) => prev.filter((it) => it.id !== id));
          }
          return res;
        }}
        onReorder={async (orderedIds) => {
          const res = await reorderTableAction("testimonials", orderedIds);
          if (res.success) {
            const sorted = [...items].sort(
              (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
            );
            setItems(sorted);
          }
          return res;
        }}
        onToggleVisibility={async (id, isVisible) => {
          const res = await saveRecordAction("testimonials", { is_visible: isVisible }, id);
          if (res.success) {
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, is_visible: isVisible } : it))
            );
          }
          return res;
        }}
      />
    </div>
  );
}
