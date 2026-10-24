"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── In-memory rate limiting (max 5 submissions per 10 minutes per IP) ──
const submissionsLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsLog.get(identifier) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  timestamps.push(now);
  submissionsLog.set(identifier, timestamps);

  // Periodic cleanup of stale IPs
  if (submissionsLog.size > 1000) {
    for (const [key, tsList] of submissionsLog.entries()) {
      const active = tsList.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) submissionsLog.delete(key);
      else submissionsLog.set(key, active);
    }
  }

  return false;
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(150, "Email is too long"),
  phone: z.string().trim().max(30, "Phone number is too long").optional().default(""),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200, "Subject is too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message is too long"),
  hp: z.string().optional(), // Honeypot spam trap
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactMessage(rawData: unknown): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}> {
  // Validate input fields with Zod
  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0]?.toString() ?? "general";
      errors[path] = issue.message;
    }
    return {
      success: false,
      message: "Please correct the errors in the form.",
      errors,
    };
  }

  const { name, email, phone, subject, message, hp } = result.data;

  // Bot trap: if honeypot field is filled, silently succeed without writing to database
  if (hp && hp.trim().length > 0) {
    return {
      success: true,
      message: "Thank you for your message! I will get back to you soon.",
    };
  }

  // Rate limiting check by client IP
  let clientIp = "unknown";
  try {
    const headerList = await headers();
    clientIp =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      "unknown";
  } catch {
    // If headers cannot be read in some execution context, fallback safely
  }

  if (isRateLimited(clientIp)) {
    return {
      success: false,
      message: "Too many messages sent. Please wait a few minutes before trying again.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("messages").insert({
      name,
      email,
      phone: phone || "",
      subject,
      message,
      is_read: false,
    });

    if (error) {
      console.error("Database insert error on contact message:", error.message);
      return {
        success: false,
        message: "Unable to deliver your message right now. Please email directly or try again later.",
      };
    }

    revalidatePath("/admin/messages");
    return {
      success: true,
      message: "Thank you for getting in touch! Your message has been sent successfully.",
    };
  } catch (err: unknown) {
    console.error("Error submitting contact message:", err);
    return {
      success: false,
      message: "An unexpected network error occurred. Please try again.",
    };
  }
}
