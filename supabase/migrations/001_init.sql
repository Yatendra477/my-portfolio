-- =============================================================
-- 001_init.sql — Portfolio Supabase schema
-- Run in the Supabase SQL editor (project: your Supabase project)
-- =============================================================

-- Helper: auto-update updated_at on any table
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ── admins ────────────────────────────────────────────────────
-- Created BEFORE is_admin() so the function can reference it
CREATE TABLE IF NOT EXISTS admins (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  email       text UNIQUE NOT NULL
);

-- Helper: check if the current JWT belongs to a row in admins table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- Revoke execute from anon/public; grant to authenticated only
-- (All policies that call is_admin() are scoped TO authenticated)
REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ── site_settings ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  -- Identity
  name                text NOT NULL DEFAULT '',
  title               text NOT NULL DEFAULT '',
  hero_description    text NOT NULL DEFAULT '',
  availability_text   text NOT NULL DEFAULT 'Open to Work',
  status_text         text NOT NULL DEFAULT '',

  -- Media
  profile_image_url   text NOT NULL DEFAULT '',
  resume_url          text NOT NULL DEFAULT '/resume.pdf',
  resume_updated_at   text NOT NULL DEFAULT '',

  -- Hero stats (stored as JSON to avoid extra table)
  hero_stats          jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Contact
  contact_email       text NOT NULL DEFAULT '',
  contact_phone       text NOT NULL DEFAULT '',
  contact_location    text NOT NULL DEFAULT '',

  -- Social
  github_url          text NOT NULL DEFAULT '',
  linkedin_url        text NOT NULL DEFAULT '',

  -- SEO
  seo_title           text NOT NULL DEFAULT '',
  seo_description     text NOT NULL DEFAULT '',
  og_image_url        text NOT NULL DEFAULT ''
);
DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── section_visibility ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS section_visibility (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  section_key text UNIQUE NOT NULL,
  is_visible  boolean NOT NULL DEFAULT true
);
DROP TRIGGER IF EXISTS trg_section_visibility_updated_at ON section_visibility;
CREATE TRIGGER trg_section_visibility_updated_at
  BEFORE UPDATE ON section_visibility
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── about_highlights ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_highlights (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  icon        text NOT NULL DEFAULT '',
  title       text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT ''
);
DROP TRIGGER IF EXISTS trg_about_highlights_updated_at ON about_highlights;
CREATE TRIGGER trg_about_highlights_updated_at
  BEFORE UPDATE ON about_highlights
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── about_stats ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_stats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  label       text NOT NULL DEFAULT '',
  value       int  NOT NULL DEFAULT 0,
  suffix      text NOT NULL DEFAULT ''
);
DROP TRIGGER IF EXISTS trg_about_stats_updated_at ON about_stats;
CREATE TRIGGER trg_about_stats_updated_at
  BEFORE UPDATE ON about_stats
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── education ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  period      text NOT NULL DEFAULT '',       -- "duration" in data file
  title       text NOT NULL DEFAULT '',       -- "degree"
  subtitle    text NOT NULL DEFAULT '',       -- "field"
  institution text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT '',
  tags        text[] NOT NULL DEFAULT '{}'    -- "coursework"
);
DROP TRIGGER IF EXISTS trg_education_updated_at ON education;
CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── skill_categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  name        text UNIQUE NOT NULL DEFAULT ''
);
DROP TRIGGER IF EXISTS trg_skill_categories_updated_at ON skill_categories;
CREATE TRIGGER trg_skill_categories_updated_at
  BEFORE UPDATE ON skill_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── skills ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  category_id uuid NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon        text NOT NULL DEFAULT '',
  level       int  -- nullable; 0-100
);
DROP TRIGGER IF EXISTS trg_skills_updated_at ON skills;
CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── experience ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  role        text NOT NULL DEFAULT '',
  company     text NOT NULL DEFAULT '',
  period      text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT '',
  type        text NOT NULL DEFAULT 'Internship',
  description text NOT NULL DEFAULT '',
  bullets     text[] NOT NULL DEFAULT '{}',
  tech        text[] NOT NULL DEFAULT '{}'
);
DROP TRIGGER IF EXISTS trg_experience_updated_at ON experience;
CREATE TRIGGER trg_experience_updated_at
  BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  title       text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category    text NOT NULL DEFAULT '',
  date_text   text NOT NULL DEFAULT '',
  bullets     text[] NOT NULL DEFAULT '{}',
  tech        text[] NOT NULL DEFAULT '{}',
  image_url   text NOT NULL DEFAULT '',
  github_url  text NOT NULL DEFAULT '',
  demo_url    text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  is_visible  boolean NOT NULL DEFAULT true
);
DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── certifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  sort_order    int NOT NULL DEFAULT 0,
  title         text NOT NULL DEFAULT '',
  issuer        text NOT NULL DEFAULT '',
  period        text NOT NULL DEFAULT '',
  description   text NOT NULL DEFAULT '',
  credential_id text NOT NULL DEFAULT '',
  credential_url text NOT NULL DEFAULT ''
);
DROP TRIGGER IF EXISTS trg_certifications_updated_at ON certifications;
CREATE TRIGGER trg_certifications_updated_at
  BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── achievements ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  category    text NOT NULL DEFAULT '',
  title       text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon        text NOT NULL DEFAULT 'Award'
);
DROP TRIGGER IF EXISTS trg_achievements_updated_at ON achievements;
CREATE TRIGGER trg_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── testimonials ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  sort_order  int NOT NULL DEFAULT 0,
  quote       text NOT NULL DEFAULT '',
  name        text NOT NULL DEFAULT '',
  role        text NOT NULL DEFAULT '',
  is_visible  boolean NOT NULL DEFAULT true
);
DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON testimonials;
CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── messages ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  name        text NOT NULL DEFAULT '',
  email       text NOT NULL DEFAULT '',
  phone       text NOT NULL DEFAULT '',
  subject     text NOT NULL DEFAULT '',
  message     text NOT NULL DEFAULT '',
  is_read     boolean NOT NULL DEFAULT false
);
DROP TRIGGER IF EXISTS trg_messages_updated_at ON messages;
CREATE TRIGGER trg_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- Row Level Security
-- =============================================================

ALTER TABLE site_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_visibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_highlights   ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE education          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills             ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins             ENABLE ROW LEVEL SECURITY;

-- ── Public read policies (anon) ───────────────────────────────

-- site_settings: public can read
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- section_visibility: public can read
DROP POLICY IF EXISTS "public_read_section_visibility" ON section_visibility;
CREATE POLICY "public_read_section_visibility" ON section_visibility
  FOR SELECT TO anon, authenticated USING (true);

-- about_highlights: public can read
DROP POLICY IF EXISTS "public_read_about_highlights" ON about_highlights;
CREATE POLICY "public_read_about_highlights" ON about_highlights
  FOR SELECT TO anon, authenticated USING (true);

-- about_stats: public can read
DROP POLICY IF EXISTS "public_read_about_stats" ON about_stats;
CREATE POLICY "public_read_about_stats" ON about_stats
  FOR SELECT TO anon, authenticated USING (true);

-- education: public can read
DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education
  FOR SELECT TO anon, authenticated USING (true);

-- skill_categories: public can read
DROP POLICY IF EXISTS "public_read_skill_categories" ON skill_categories;
CREATE POLICY "public_read_skill_categories" ON skill_categories
  FOR SELECT TO anon, authenticated USING (true);

-- skills: public can read
DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills
  FOR SELECT TO anon, authenticated USING (true);

-- experience: public can read
DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience
  FOR SELECT TO anon, authenticated USING (true);

-- projects: public can read only visible rows
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects
  FOR SELECT TO anon, authenticated USING (is_visible = true);

-- certifications: public can read
DROP POLICY IF EXISTS "public_read_certifications" ON certifications;
CREATE POLICY "public_read_certifications" ON certifications
  FOR SELECT TO anon, authenticated USING (true);

-- achievements: public can read
DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements
  FOR SELECT TO anon, authenticated USING (true);

-- testimonials: public can read only visible rows
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (is_visible = true);

-- messages: public can INSERT only
DROP POLICY IF EXISTS "public_insert_messages" ON messages;
CREATE POLICY "public_insert_messages" ON messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ── Admin policies ────────────────────────────────────────────

-- site_settings: admin full access
DROP POLICY IF EXISTS "admin_all_site_settings" ON site_settings;
CREATE POLICY "admin_all_site_settings" ON site_settings
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- section_visibility: admin full access
DROP POLICY IF EXISTS "admin_all_section_visibility" ON section_visibility;
CREATE POLICY "admin_all_section_visibility" ON section_visibility
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- about_highlights: admin full access
DROP POLICY IF EXISTS "admin_all_about_highlights" ON about_highlights;
CREATE POLICY "admin_all_about_highlights" ON about_highlights
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- about_stats: admin full access
DROP POLICY IF EXISTS "admin_all_about_stats" ON about_stats;
CREATE POLICY "admin_all_about_stats" ON about_stats
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- education: admin full access
DROP POLICY IF EXISTS "admin_all_education" ON education;
CREATE POLICY "admin_all_education" ON education
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- skill_categories: admin full access
DROP POLICY IF EXISTS "admin_all_skill_categories" ON skill_categories;
CREATE POLICY "admin_all_skill_categories" ON skill_categories
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- skills: admin full access
DROP POLICY IF EXISTS "admin_all_skills" ON skills;
CREATE POLICY "admin_all_skills" ON skills
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- experience: admin full access
DROP POLICY IF EXISTS "admin_all_experience" ON experience;
CREATE POLICY "admin_all_experience" ON experience
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- projects: admin full access (including hidden rows)
DROP POLICY IF EXISTS "admin_all_projects" ON projects;
CREATE POLICY "admin_all_projects" ON projects
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- certifications: admin full access
DROP POLICY IF EXISTS "admin_all_certifications" ON certifications;
CREATE POLICY "admin_all_certifications" ON certifications
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- achievements: admin full access
DROP POLICY IF EXISTS "admin_all_achievements" ON achievements;
CREATE POLICY "admin_all_achievements" ON achievements
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- testimonials: admin full access (including hidden rows)
DROP POLICY IF EXISTS "admin_all_testimonials" ON testimonials;
CREATE POLICY "admin_all_testimonials" ON testimonials
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- messages: admin can SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "admin_read_messages" ON messages;
CREATE POLICY "admin_read_messages" ON messages
  FOR SELECT TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "admin_update_messages" ON messages;
CREATE POLICY "admin_update_messages" ON messages
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_messages" ON messages;
CREATE POLICY "admin_delete_messages" ON messages
  FOR DELETE TO authenticated USING (is_admin());

-- admins: only admins can read their own table
DROP POLICY IF EXISTS "admin_read_admins" ON admins;
CREATE POLICY "admin_read_admins" ON admins
  FOR SELECT TO authenticated USING (is_admin());

-- =============================================================
-- Storage bucket for media
-- =============================================================
-- Run this only if the bucket doesn't already exist.
-- The SQL editor may not support storage.buckets directly;
-- you can also create it via the Dashboard → Storage.
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read on media bucket
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media');

-- Admin write on media bucket
DROP POLICY IF EXISTS "admin_write_media" ON storage.objects;
CREATE POLICY "admin_write_media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "admin_update_media" ON storage.objects;
CREATE POLICY "admin_update_media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "admin_delete_media" ON storage.objects;
CREATE POLICY "admin_delete_media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND is_admin());
