"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

// ── Allowlist of tables that generic CRUD helpers may operate on ──
const ALLOWED_TABLES = new Set([
  "projects",
  "experience",
  "education",
  "skills",
  "skill_categories",
  "certifications",
  "achievements",
  "testimonials",
  "about_highlights",
  "about_stats",
  "section_visibility",
]);

function assertAllowedTable(table: string): void {
  if (!ALLOWED_TABLES.has(table)) {
    throw new Error(`Table "${table}" is not in the allowed list.`);
  }
}

// ── Auth Actions ───────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAdminAction(formData: FormData) {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid credentials",
    };
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "Invalid email or password",
    };
  }

  // Check admin verification
  let isAdmin = false;
  try {
    const { data: isAdm } = await supabase.rpc("is_admin");
    if (isAdm === true) isAdmin = true;
  } catch {
    // fallback
  }

  if (!isAdmin) {
    const { data: adminRow } = await supabase
      .from("admins")
      .select("id")
      .eq("email", authData.user.email ?? "")
      .maybeSingle();

    if (adminRow) isAdmin = true;
  }

  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Access denied. This account does not have admin permissions.",
    };
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── Site Settings Action ───────────────────────────────────────

const siteSettingsSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  hero_description: z.string().optional(),
  availability_text: z.string().optional(),
  status_text: z.string().optional(),
  profile_image_url: z.string().optional(),
  resume_url: z.string().optional(),
  resume_updated_at: z.string().optional(),
  hero_stats: z.array(z.record(z.string(), z.unknown())).optional(),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_location: z.string().optional(),
  github_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  og_image_url: z.string().optional(),
});

export async function updateSiteSettingsAction(rawValues: Record<string, unknown>) {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(rawValues);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const supabase = await createClient();

  // Find existing active row or insert
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let error;
  if (existing?.id) {
    const res = await supabase
      .from("site_settings")
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    error = res.error;
  } else {
    const res = await supabase.from("site_settings").insert({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    });
    error = res.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/hero");
  revalidatePath("/admin/contact");
  revalidatePath("/admin/seo");
  revalidatePath("/admin/resume");
  return { success: true };
}

// ── File Upload Actions (Resume & Media) ─────────────────────────

export async function uploadResumeAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File | null;

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please select a PDF file to upload." };
  }

  // Max 5 MB validation
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: "File exceeds maximum size of 5 MB." };
  }

  // PDF validation (both MIME and extension must match)
  const isPdfMime = file.type === "application/pdf" || file.type === "application/x-pdf";
  const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMime || !isPdfExt) {
    return { success: false, error: "Only PDF files are allowed." };
  }

  const supabase = await createClient();
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  const storagePath = `resumes/resume-${timestamp}-${randomId}.pdf`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: "Storage upload failed: " + uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(storagePath);
  const publicUrl = publicUrlData.publicUrl;

  // Format current date e.g. "October 2026"
  const now = new Date();
  const updatedDateStr = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Update site settings targeting the active row
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let dbError;
  if (existing?.id) {
    const res = await supabase
      .from("site_settings")
      .update({
        resume_url: publicUrl,
        resume_updated_at: updatedDateStr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    dbError = res.error;
  } else {
    const res = await supabase.from("site_settings").insert({
      resume_url: publicUrl,
      resume_updated_at: updatedDateStr,
      updated_at: new Date().toISOString(),
    });
    dbError = res.error;
  }

  if (dbError) {
    console.error("[uploadResume] DB write failed:", dbError.message);
    return { success: false, error: "File uploaded but failed to save URL: " + dbError.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/resume");
  return {
    success: true,
    url: publicUrl,
    updatedAt: updatedDateStr,
  };
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  const rawFolder = formData.get("folder")?.toString() || "images";

  // Sanitize folder: strip path traversal, only allow a-z, 0-9, hyphens, underscores
  const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 30) || "images";

  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please select an image file to upload." };
  }

  // Max 2 MB validation
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: "Image exceeds maximum size of 2 MB." };
  }

  // Type validation: strictly validate MIME and matching extension
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const rawExt = file.name.split(".").pop()?.toLowerCase() || "";
  const normalizedExt = rawExt === "jpeg" ? "jpg" : rawExt;
  const expectedExt = mimeToExt[file.type];

  if (!expectedExt || expectedExt !== normalizedExt) {
    return { success: false, error: "Only JPG, PNG, and WebP images are allowed." };
  }

  const storagePath = `${folder}/${crypto.randomUUID()}.${expectedExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return { success: false, error: "Upload failed: " + uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(storagePath);
  return { success: true, url: publicUrlData.publicUrl };
}

// ── Section Visibility Actions ─────────────────────────────────

export async function updateSectionVisibilityAction(sectionKey: string, isVisible: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("section_visibility")
    .upsert(
      { section_key: sectionKey, is_visible: isVisible },
      { onConflict: "section_key" }
    );

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/sections");
  return { success: true };
}

// ── Generic Reorder Helper ─────────────────────────────────────

export async function reorderTableAction(table: string, orderedIds: string[]) {
  await requireAdmin();
  assertAllowedTable(table);
  const supabase = await createClient();

  // Update sort_order for each id
  const updates = orderedIds.map((id, index) =>
    supabase.from(table).update({ sort_order: index }).eq("id", id)
  );

  await Promise.all(updates);

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// ── Generic Delete Helper ──────────────────────────────────────

export async function deleteRecordAction(table: string, id: string) {
  await requireAdmin();
  assertAllowedTable(table);
  const supabase = await createClient();

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// ── Unique-constraint error translator ────────────────────────
// Postgres error code 23505 = unique_violation.
// Map index names to human-readable "already exists" messages.

const UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
  uix_projects_title:
    "A project with this title already exists. Please use a different title.",
  uix_certifications_title_issuer:
    "A certification with this title and issuer already exists.",
  uix_achievements_title:
    "An achievement with this title already exists. Please use a different title.",
  uix_education_title_period:
    "An education entry with this degree and period already exists.",
  uix_experience_role_company_period:
    "An experience entry with this role, company, and period already exists.",
  uix_about_highlights_title:
    "A highlight with this title already exists. Please use a different title.",
  uix_about_stats_label:
    "A stat with this label already exists. Please use a different label.",
  uix_skills_category_name:
    "A skill with this name already exists in this category.",
  // skill_categories uses a schema-level UNIQUE constraint named differently:
  skill_categories_name_key:
    "A skill category with this name already exists.",
  // section_visibility schema-level unique:
  section_visibility_section_key_key:
    "This section key already exists in the visibility table.",
};

function friendlyError(err: { code?: string; message: string }): string {
  if (err.code !== "23505") return err.message;

  // The Postgres message contains "Key (...) conflicts with ... \"<index_name>\""
  // or the detail field names the constraint. Extract the constraint/index name.
  const match = err.message.match(/"([^"]+)"/);
  const key = match?.[1] ?? "";
  return (
    UNIQUE_CONSTRAINT_MESSAGES[key] ??
    "This entry already exists. Please change the highlighted fields and try again."
  );
}

// ── Generic Upsert Helper ──────────────────────────────────────

export async function saveRecordAction(
  table: string,
  data: Record<string, unknown>,
  id?: string
) {
  await requireAdmin();
  assertAllowedTable(table);
  const supabase = await createClient();

  let error;
  if (id) {
    const res = await supabase.from(table).update(data).eq("id", id);
    error = res.error;
  } else {
    // Determine sort_order if not provided
    if (data.sort_order === undefined) {
      const { data: lastItem } = await supabase
        .from(table)
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      data.sort_order = (lastItem?.sort_order ?? -1) + 1;
    }
    const res = await supabase.from(table).insert(data);
    error = res.error;
  }

  if (error) {
    return { success: false, error: friendlyError(error) };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

// ── Messages Actions ───────────────────────────────────────────

export async function toggleMessageReadAction(id: string, isRead: boolean) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { success: true };
}
