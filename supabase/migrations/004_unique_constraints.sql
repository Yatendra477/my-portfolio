-- =============================================================
-- 004_unique_constraints.sql — Natural-key unique indexes
-- Run AFTER 003_deduplicate.sql.
-- Adds UNIQUE indexes on every content table's natural key so
-- that duplicate rows can never be inserted again.
--
-- IMPORTANT: deduplication (003_deduplicate.sql) MUST be run
-- first to remove existing duplicates; otherwise these CREATE
-- UNIQUE INDEX statements will fail.
-- =============================================================

-- ── Pre-flight duplicate checks ───────────────────────────────

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(title)), count(*) AS n
    FROM projects
    GROUP BY 1 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'projects still has % duplicate title group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(title)), lower(trim(issuer)), count(*) AS n
    FROM certifications
    GROUP BY 1, 2 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'certifications still has % duplicate (title, issuer) group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(title)), count(*) AS n
    FROM achievements
    GROUP BY 1 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'achievements still has % duplicate title group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(title)), lower(trim(period)), count(*) AS n
    FROM education
    GROUP BY 1, 2 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'education still has % duplicate (title, period) group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(role)), lower(trim(company)), lower(trim(period)), count(*) AS n
    FROM experience
    GROUP BY 1, 2, 3 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'experience still has % duplicate (role, company, period) group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(title)), count(*) AS n
    FROM about_highlights
    GROUP BY 1 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'about_highlights still has % duplicate title group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(label)), count(*) AS n
    FROM about_stats
    GROUP BY 1 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'about_stats still has % duplicate label group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT lower(trim(name)), count(*) AS n
    FROM skill_categories
    GROUP BY 1 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'skill_categories still has % duplicate name group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

DO $$
DECLARE dup_count int;
BEGIN
  SELECT COUNT(*) INTO dup_count
  FROM (
    SELECT category_id, lower(trim(name)), count(*) AS n
    FROM skills
    GROUP BY 1, 2 HAVING count(*) > 1
  ) t;
  IF dup_count > 0 THEN
    RAISE EXCEPTION
      'skills still has % duplicate (category_id, name) group(s). Run 003_deduplicate.sql first.',
      dup_count;
  END IF;
END $$;

-- section_visibility already has UNIQUE on section_key from 001_init.sql — no extra check.

-- ── Unique indexes ────────────────────────────────────────────

-- projects: unique on title (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uix_projects_title
  ON projects (lower(trim(title)));

-- certifications: unique on (title, issuer)
CREATE UNIQUE INDEX IF NOT EXISTS uix_certifications_title_issuer
  ON certifications (lower(trim(title)), lower(trim(issuer)));

-- achievements: unique on title
CREATE UNIQUE INDEX IF NOT EXISTS uix_achievements_title
  ON achievements (lower(trim(title)));

-- education: unique on (title, period)
CREATE UNIQUE INDEX IF NOT EXISTS uix_education_title_period
  ON education (lower(trim(title)), lower(trim(period)));

-- experience: unique on (role, company, period)
CREATE UNIQUE INDEX IF NOT EXISTS uix_experience_role_company_period
  ON experience (lower(trim(role)), lower(trim(company)), lower(trim(period)));

-- about_highlights: unique on title
CREATE UNIQUE INDEX IF NOT EXISTS uix_about_highlights_title
  ON about_highlights (lower(trim(title)));

-- about_stats: unique on label
CREATE UNIQUE INDEX IF NOT EXISTS uix_about_stats_label
  ON about_stats (lower(trim(label)));

-- skill_categories: already has UNIQUE on name from 001_init.sql — no extra index needed.

-- skills: unique on (category_id, name)
CREATE UNIQUE INDEX IF NOT EXISTS uix_skills_category_name
  ON skills (category_id, lower(trim(name)));

-- section_visibility: already has UNIQUE on section_key from 001_init.sql — no extra index needed.
