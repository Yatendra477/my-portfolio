/**
 * scripts/check-email.mjs
 *
 * Sends ONE test email to CONTACT_TO_EMAIL using Resend.
 * Prints ONLY "OK" on success or the error code on failure.
 * NEVER prints or leaks the API key.
 *
 * Usage: npm run check:email
 */

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY?.trim();
const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
const fromEmail =
  process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";

if (!apiKey) {
  console.error("MISSING_RESEND_API_KEY");
  process.exit(1);
}

if (!toEmail) {
  console.error("MISSING_CONTACT_TO_EMAIL");
  process.exit(1);
}

// Clean and sanitize headers
const cleanFrom = fromEmail.replace(/[\r\n]/g, " ").trim();
const cleanTo = toEmail.replace(/[\r\n]/g, " ").trim();

try {
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: cleanFrom,
    to: cleanTo,
    subject: "Test Email - Portfolio Contact Verification",
    text: "This is a test email sent from npm run check:email to verify your Resend email setup.",
  });

  if (error) {
    // Print only the error name/code, never the API key
    console.error(error.name || (error.statusCode ? `ERROR_${error.statusCode}` : "SEND_FAILED"));
    process.exit(1);
  }

  if (!data?.id) {
    console.error("NO_ID_RETURNED");
    process.exit(1);
  }

  console.log("OK");
  process.exit(0);
} catch (err) {
  console.error(err?.code || err?.name || "UNEXPECTED_ERROR");
  process.exit(1);
}

