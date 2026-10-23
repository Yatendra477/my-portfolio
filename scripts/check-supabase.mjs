const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !url.trim()) {
  console.error("Missing or empty NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

if (!key || !key.trim()) {
  console.error("Missing or empty NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

if (/['"`]/.test(url)) {
  console.error("URL must not contain quotes");
  process.exit(1);
}

if (/\s/.test(url)) {
  console.error("URL must not contain spaces");
  process.exit(1);
}

if (url.endsWith("/")) {
  console.error("URL must not have a trailing slash");
  process.exit(1);
}

if (!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(url)) {
  console.error("URL must look like https://<ref>.supabase.co");
  process.exit(1);
}

const WRONG_KEY_MESSAGE =
  "Wrong key: use the publishable or anon key, never a secret or service_role key";

if (key.startsWith("sb_secret_")) {
  console.error(WRONG_KEY_MESSAGE);
  process.exit(1);
}

const parts = key.split(".");
if (parts.length === 3) {
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(jsonStr);
    if (payload && payload.role === "service_role") {
      console.error(WRONG_KEY_MESSAGE);
      process.exit(1);
    }
  } catch {
    // Ignore JSON parsing errors if not a standard JWT payload
  }
}

try {
  const response = await fetch(`${url}/auth/v1/health`, {
    headers: {
      apikey: key,
    },
  });

  await response.text();
  if (response.ok) {
    console.log(`OK ${response.status}`);
    process.exitCode = 0;
  } else {
    console.log(`FAILED ${response.status}`);
    process.exitCode = 1;
  }
} catch {
  console.log("FAILED (network error)");
  process.exitCode = 1;
}
