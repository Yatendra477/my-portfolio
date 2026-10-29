import "server-only";
import { Resend } from "resend";

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  time?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Strips carriage returns and newlines from header fields to prevent email header injection.
 */
function sanitizeHeader(val: string): string {
  return val.replace(/[\r\n]/g, " ").trim();
}

/**
 * Escapes characters with special meaning in HTML to prevent XSS / HTML injection.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a notification email via Resend when a contact form is submitted.
 * Guarantees that secrets are never leaked and errors are safely logged.
 */
export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("[Email Notification] Skipped: RESEND_API_KEY is not configured.");
    return { success: false, error: "MISSING_RESEND_API_KEY" };
  }

  if (!toEmail) {
    console.error("[Email Notification] Skipped: CONTACT_TO_EMAIL is not configured.");
    return { success: false, error: "MISSING_CONTACT_TO_EMAIL" };
  }

  const timestamp = payload.time || new Date().toUTCString();

  // Clean and limit subject to max 120 characters, stripping newlines
  const cleanSubjectInput = sanitizeHeader(payload.subject || "No Subject");
  const subjectHeader = `New portfolio message: ${cleanSubjectInput}`.slice(0, 120);

  const cleanFrom = sanitizeHeader(fromEmail);
  const cleanTo = sanitizeHeader(toEmail);
  const cleanReplyTo = sanitizeHeader(payload.email);

  const textBody = [
    "New Portfolio Contact Message",
    "----------------------------------------",
    `Time:    ${timestamp}`,
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    `Phone:   ${payload.phone?.trim() ? payload.phone.trim() : "Not provided"}`,
    `Subject: ${payload.subject}`,
    "----------------------------------------",
    "Message:",
    payload.message,
    "----------------------------------------",
  ].join("\n");

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone?.trim() ? payload.phone.trim() : "Not provided");
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br/>");
  const safeTime = escapeHtml(timestamp);

  const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #1e293b; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background-color: #1e1b4b; padding: 20px 24px; color: #ffffff;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600;">New Contact Form Message</h2>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px; vertical-align: top;"><strong>Time:</strong></td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${safeTime}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Name:</strong></td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Email:</strong></td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #4f46e5; text-decoration: none;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Phone:</strong></td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${safePhone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;"><strong>Subject:</strong></td>
          <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${safeSubject}</td>
        </tr>
      </table>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Message:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; word-break: break-word;">${safeMessage}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: cleanFrom,
      to: cleanTo,
      replyTo: cleanReplyTo,
      subject: subjectHeader,
      text: textBody,
      html: htmlBody,
    });

    if (error) {
      console.error(
        "[Email Notification] Resend error:",
        error.name || "Error",
        error.message || ""
      );
      return { success: false, error: error.name || "SEND_FAILED" };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[Email Notification] Exception sending email:", errMsg);
    return { success: false, error: "UNEXPECTED_ERROR" };
  }
}

