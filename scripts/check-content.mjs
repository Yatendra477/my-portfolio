/**
 * scripts/check-content.mjs
 * Verifies that the public site fetches live data from Supabase,
 * not hardcoded fallbacks. Checks:
 * - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * - site_settings table has at least one row
 * - resume_url column is a Supabase storage URL (not "/resume.pdf")
 * - resume_updated_at is non-empty
 *
 * Usage: npm run check:content
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let hasError = false;

function pass(msg) {
  console.log(`  ✅  ${msg}`);
}
function fail(msg) {
  console.error(`  ❌  ${msg}`);
  hasError = true;
}

console.log("\n🔍 check:content — Verifying live Supabase content\n");

// 1. Env vars
if (!url || !url.trim()) {
  fail("NEXT_PUBLIC_SUPABASE_URL is missing or empty");
} else {
  pass(`NEXT_PUBLIC_SUPABASE_URL = ${url.slice(0, 30)}…`);
}

if (!key || !key.trim()) {
  fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty");
} else {
  pass(`NEXT_PUBLIC_SUPABASE_ANON_KEY = ${key.slice(0, 12)}…`);
}

if (!url || !key) {
  console.error("\n⛔  Cannot proceed without Supabase credentials.\n");
  process.exit(1);
}

// 2. Query site_settings
const supabase = createClient(url, key);

const { data, error } = await supabase
  .from("site_settings")
  .select("resume_url, resume_updated_at, name, updated_at")
  .order("updated_at", { ascending: false })
  .limit(1)
  .maybeSingle();

if (error) {
  fail(`Supabase query error: ${error.message}`);
  console.error("\n⛔  Fix the error above and re-run.\n");
  process.exit(1);
}

if (!data) {
  fail("site_settings table is EMPTY — no rows found.");
  console.error("   → Upload a resume via /admin/resume to create the first row.\n");
  process.exit(1);
} else {
  pass(`site_settings row found (name: "${data.name}", updated: ${data.updated_at})`);
}

// 3. resume_url check
const resumeUrl = data.resume_url || "";
if (!resumeUrl) {
  fail("resume_url is empty — no resume has been uploaded yet.");
} else if (resumeUrl === "/resume.pdf") {
  fail(`resume_url is still the hardcoded fallback "/resume.pdf".`);
} else if (resumeUrl.includes("supabase")) {
  pass(`resume_url is a Supabase storage URL: ${resumeUrl.slice(0, 80)}…`);
} else {
  pass(`resume_url is set: ${resumeUrl.slice(0, 80)}…`);
}

// 4. resume_updated_at check
const updatedAt = data.resume_updated_at || "";
if (!updatedAt || updatedAt.includes("[FILL")) {
  fail(`resume_updated_at is empty or placeholder: "${updatedAt}"`);
} else {
  pass(`resume_updated_at = "${updatedAt}"`);
}

// Summary
console.log("");
if (hasError) {
  console.error("⛔  Some checks FAILED. Fix the issues above.\n");
  process.exit(1);
} else {
  console.log("✅  All content checks passed!\n");
  process.exit(0);
}
