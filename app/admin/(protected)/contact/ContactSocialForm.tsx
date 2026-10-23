"use client";

import React from "react";
import AdminForm, { FormFieldDef } from "@/components/admin/AdminForm";
import { updateSiteSettingsAction } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/data";

interface ContactSocialFormProps {
  initialSettings: SiteSettings;
}

const contactFields: FormFieldDef[] = [
  {
    name: "contact_email",
    label: "Contact Email Address",
    type: "text",
    required: true,
    placeholder: "e.g. yatendraverma.dev@gmail.com",
    description: "Displayed in the Contact card and footer",
  },
  {
    name: "contact_phone",
    label: "Contact Phone Number",
    type: "text",
    placeholder: "e.g. +91 9876543210",
    description: "Direct contact line for recruiters & collaborators",
  },
  {
    name: "contact_location",
    label: "Location / City",
    type: "text",
    placeholder: "e.g. Delhi NCR / Ghaziabad, India",
    description: "Current base of operations and timezone context",
  },
  {
    name: "github_url",
    label: "GitHub Profile URL",
    type: "url",
    placeholder: "https://github.com/Yatendra477",
    description: "Links GitHub icon buttons in hero, navigation, and contact sections",
  },
  {
    name: "linkedin_url",
    label: "LinkedIn Profile URL",
    type: "url",
    placeholder: "https://linkedin.com/in/yatendra-verma-9a6473289",
    description: "Links LinkedIn icon buttons in hero, contact, and footer",
  },
];

export default function ContactSocialForm({ initialSettings }: ContactSocialFormProps) {
  const initialValues = {
    contact_email: initialSettings.contactEmail || "",
    contact_phone: initialSettings.contactPhone || "",
    contact_location: initialSettings.contactLocation || "",
    github_url: initialSettings.githubUrl || "",
    linkedin_url: initialSettings.linkedinUrl || "",
  };

  return (
    <AdminForm
      title="Communication Channels & Links"
      description="Update your contact information and social handles across the website."
      fields={contactFields}
      initialValues={initialValues}
      submitLabel="Save Contact & Social Details"
      onSubmit={async (values) => {
        return await updateSiteSettingsAction(values);
      }}
    />
  );
}
