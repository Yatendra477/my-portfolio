/**
 * scripts/check-content.mjs
 *
 * Verifies live Supabase content:
 *   - env vars are set
 *   - site_settings has one row with a real resume_url
 *   - prints a row-count table for every content table
 *   - flags any table that still contains duplicate natural-key values
 *
 * Usage: npm run check:content
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let hasError = false;

function pass(msg) {
  console.log(`  \u2705  ${msg}`);
}
function fail(msg) {
  console.error(`  \u274C  ${msg}`);
  hasError = true;
}

console.log("\n\uD83D\uDD0D check:content — Verifying live Supabase content\n");

// ── 1. Env vars ────────────────────────────────────────────────
if (!url || !url.trim()) {
  fail("NEXT_PUBLIC_SUPABASE_URL is missing or empty");
} else if (url.includes("/rest/v1")) {
  fail("NEXT_PUBLIC_SUPABASE_URL should NOT contain '/rest/v1'. Use 'https://<project-ref>.supabase.co'");
} else {
  pass(`NEXT_PUBLIC_SUPABASE_URL = ${url.slice(0, 30)}…`);
}

if (!key || !key.trim()) {
  fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or empty");
} else {
  pass(`NEXT_PUBLIC_SUPABASE_ANON_KEY = ${key.slice(0, 12)}…`);
}

if (!url || !key) {
  console.error("\n\u26D4  Cannot proceed without Supabase credentials.\n");
  process.exit(1);
}

const supabase = createClient(url, key);

// ── 2. site_settings spot-check ────────────────────────────────
const { data: settings, error: settingsErr } = await supabase
  .from("site_settings")
  .select("resume_url, resume_updated_at, name, updated_at")
  .order("updated_at", { ascending: false })
  .limit(1)
  .maybeSingle();

if (settingsErr) {
  fail(`Supabase query error: ${settingsErr.message}`);
  console.error("\n\u26D4  Fix the error above and re-run.\n");
  process.exit(1);
}

if (!settings) {
  fail("site_settings table is EMPTY — no rows found.");
  console.error("   → Upload a resume via /admin/resume to create the first row.\n");
  process.exit(1);
} else {
  pass(`site_settings row found (name: "${settings.name}", updated: ${settings.updated_at})`);
}

const resumeUrl = settings.resume_url || "";
if (!resumeUrl) {
  fail("resume_url is empty — no resume has been uploaded yet.");
} else if (resumeUrl === "/resume.pdf") {
  fail(`resume_url is still the hardcoded fallback "/resume.pdf".`);
} else if (resumeUrl.includes("supabase")) {
  pass(`resume_url is a Supabase storage URL: ${resumeUrl.slice(0, 80)}…`);
} else {
  pass(`resume_url is set: ${resumeUrl.slice(0, 80)}…`);
}

const updatedAt = settings.resume_updated_at || "";
if (!updatedAt || updatedAt.includes("[FILL")) {
  fail(`resume_updated_at is empty or placeholder: "${updatedAt}"`);
} else {
  pass(`resume_updated_at = "${updatedAt}"`);
}

// ── 3. Row counts + duplicate detection ───────────────────────
console.log("\n\u{1F4CA}  Row counts per table:\n");

// Each entry: [tableName, naturalKeySQL, labelForDups]
const TABLES = [
  {
    table: "projects",
    dupKey: "lower(trim(title))",
    label: "title",
  },
  {
    table: "certifications",
    dupKey: "lower(trim(title)), lower(trim(issuer))",
    label: "title + issuer",
  },
  {
    table: "achievements",
    dupKey: "lower(trim(title))",
    label: "title",
  },
  {
    table: "education",
    dupKey: "lower(trim(title)), lower(trim(period))",
    label: "title + period",
  },
  {
    table: "experience",
    dupKey: "lower(trim(role)), lower(trim(company)), lower(trim(period))",
    label: "role + company + period",
  },
  {
    table: "about_highlights",
    dupKey: "lower(trim(title))",
    label: "title",
  },
  {
    table: "about_stats",
    dupKey: "lower(trim(label))",
    label: "label",
  },
  {
    table: "skill_categories",
    dupKey: "lower(trim(name))",
    label: "name",
  },
  {
    table: "skills",
    dupKey: "category_id, lower(trim(name))",
    label: "category_id + name",
  },
  {
    table: "section_visibility",
    dupKey: "section_key",
    label: "section_key",
  },
  {
    table: "site_settings",
    dupKey: null, // no natural key; just count
    label: null,
  },
];

const COL_W = 24;
const header =
  "  " +
  "Table".padEnd(COL_W) +
  "Rows".padStart(6) +
  "  Status";
console.log(header);
console.log("  " + "-".repeat(header.length - 2));

for (const { table, dupKey, label } of TABLES) {
  // Count rows
  const { count, error: countErr } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (countErr) {
    console.log(
      `  ${table.padEnd(COL_W)}${"ERR".padStart(6)}  \u274C ${countErr.message}`
    );
    hasError = true;
    continue;
  }

  const rows = count ?? 0;

  // Duplicate check (only for tables with a natural key and more than 1 row)
  let dupMsg = "";
  if (dupKey && rows > 1) {
    // Use a lightweight RPC — fall back to a client-side count check
    // We cannot run arbitrary GROUP BY via the JS client, so we fetch
    // all rows and count in JS.
    let hasDups = false;

    // Fetch just the columns we need based on the dup key.
    const keyColumns = dupKey
      .split(",")
      .map((s) => s.trim())
      // strip SQL functions, keep bare column names
      .map((expr) => expr.replace(/lower\(trim\((\w+)\)\)/, "$1").trim())
      .filter((c) => /^\w+$/.test(c));

    if (keyColumns.length > 0) {
      const { data: allRows, error: fetchErr } = await supabase
        .from(table)
        .select(keyColumns.join(","));

      if (!fetchErr && allRows) {
        const seen = new Set();
        for (const row of allRows) {
          const key = keyColumns
            .map((c) =>
              typeof row[c] === "string"
                ? row[c].toLowerCase().trim()
                : String(row[c] ?? "")
            )
            .join("|");
          if (seen.has(key)) {
            hasDups = true;
            break;
          }
          seen.add(key);
        }
      }
    }

    if (hasDups) {
      dupMsg = `  \u274C DUPLICATES detected on (${label})!`;
      hasError = true;
    }
  }

  const status = dupMsg
    ? dupMsg
    : rows === 0
    ? "  \u26A0\uFE0F  empty"
    : "  \u2705";

  console.log(
    `  ${table.padEnd(COL_W)}${String(rows).padStart(6)}${status}`
  );
}

// ── Summary ────────────────────────────────────────────────────
console.log("");
if (hasError) {
  console.error(
    "\u26D4  Some checks FAILED. Fix the issues above, then re-run npm run check:content\n"
  );
  process.exit(1);
} else {
  console.log("\u2705  All content checks passed!\n");
  process.exit(0);
}
