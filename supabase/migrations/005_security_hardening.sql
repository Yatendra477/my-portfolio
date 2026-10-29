-- =============================================================
-- 005_security_hardening.sql — Database-level security constraints
-- Run in the Supabase SQL Editor
--
-- 1. Adds length and sanity check constraints to the `messages` table.
--    This prevents attackers who extract the public anon key from
--    spamming the Supabase REST API directly with unbounded payloads
--    or bypass application-level Zod validation.
-- =============================================================

-- ── 1. Messages table payload constraints ─────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_messages_lengths'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT chk_messages_lengths
      CHECK (
        length(name) <= 100 AND
        length(email) <= 150 AND
        length(phone) <= 30 AND
        length(subject) <= 200 AND
        length(message) <= 5000
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_messages_non_empty'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT chk_messages_non_empty
      CHECK (
        length(trim(name)) >= 2 AND
        length(trim(email)) >= 5 AND
        length(trim(subject)) >= 3 AND
        length(trim(message)) >= 10
      );
  END IF;
END $$;

-- ── 2. Ensure RLS on media storage and messages ───────────────

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- ── 3. Keep is_admin() search_path safe ───────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

