"use client";

import React from "react";
import AdminForm, { FormFieldDef } from "@/components/admin/AdminForm";
import { updateSiteSettingsAction } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/data";

interface SeoSettingsFormProps {
  initialSettings: SiteSettings;
}

const seoFields: FormFieldDef[] = [
  {
    name: "seo_title",
    label: "Meta Title Tag",
    type: "text",
    required: true,
    placeholder: "Yatendra Verma — Python Developer & AI/ML Engineer",
    description: "Primary title displayed in Google search results and browser tabs",
  },
  {
    name: "seo_description",
    label: "Meta Description",
    type: "textarea",
    required: true,
    rows: 4,
    placeholder: "Portfolio of Yatendra Verma, specializing in AI, Machine Learning, Python, Computer Vision, and Full Stack Development.",
    description: "Summary snippet shown in search engine index results (recommended 150-160 characters)",
  },
  {
    name: "og_image_url",
    label: "Open Graph Social Share Image",
    type: "image",
    description: "Image card preview displayed when your link is shared on LinkedIn, Twitter, Discord, WhatsApp, etc. (max 2 MB)",
  },
];

export default function SeoSettingsForm({ initialSettings }: SeoSettingsFormProps) {
  const initialValues = {
    seo_title: initialSettings.seoTitle || "Yatendra Verma — Python Developer & AI/ML Engineer",
    seo_description:
      initialSettings.seoDescription ||
      "Portfolio of Yatendra Verma, specializing in AI, Machine Learning, Python, Computer Vision, and Full Stack Development.",
    og_image_url: initialSettings.ogImageUrl || "/images/profile-cutout.png",
  };

  return (
    <AdminForm
      title="Search Engine & Social Metadata"
      description="Fine-tune how your portfolio appears in Google searches and social media link previews."
      fields={seoFields}
      initialValues={initialValues}
      submitLabel="Save SEO Configuration"
      onSubmit={async (values) => {
        return await updateSiteSettingsAction(values);
      }}
    />
  );
}
