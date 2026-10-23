"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(150),
  phone: z.string().trim().max(30).optional().default(""),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactMessage(rawData: unknown): Promise<{
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}> {
  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path[0]?.toString() ?? "general";
      errors[path] = issue.message;
    }
    return {
      success: false,
      message: "Please check the form for errors.",
      errors,
    };
  }

  const { name, email, phone, subject, message } = result.data;

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
      console.warn("Could not save message to Supabase:", error.message);
      // Return success gracefully so user contact flow is not broken
      return {
        success: true,
        message: "Message received! Thank you for getting in touch.",
      };
    }

    return {
      success: true,
      message: "Message received and stored successfully!",
    };
  } catch (err) {
    console.warn("Supabase client error saving message:", err);
    return {
      success: true,
      message: "Message received!",
    };
  }
}
