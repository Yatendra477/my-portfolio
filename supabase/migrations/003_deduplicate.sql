-- =============================================================
-- 003_deduplicate.sql — Portfolio Database Cleanup & Deduplication
-- Safe, idempotent script to remove duplicate rows from multiple seed runs,
-- retaining the most recently updated entry for each item.
-- =============================================================

-- 1. Deduplicate site_settings (keep only the single most recently updated record)
DELETE FROM site_settings
WHERE id NOT IN (
  SELECT id FROM site_settings
  ORDER BY updated_at DESC, created_at DESC
  LIMIT 1
);

-- 2. Deduplicate projects (keep newest record per project title)
DELETE FROM projects
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(title))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM projects
  ) ranked
  WHERE rnum > 1
);

-- 3. Deduplicate experience (keep newest record per role + company)
DELETE FROM experience
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(role)), lower(trim(company))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM experience
  ) ranked
  WHERE rnum > 1
);

-- 4. Deduplicate education (keep newest record per degree + school)
DELETE FROM education
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(degree)), lower(trim(school))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM education
  ) ranked
  WHERE rnum > 1
);

-- 5. Deduplicate certifications (keep newest record per certificate name)
DELETE FROM certifications
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(name))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM certifications
  ) ranked
  WHERE rnum > 1
);

-- 6. Deduplicate achievements (keep newest record per achievement title)
DELETE FROM achievements
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(title))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM achievements
  ) ranked
  WHERE rnum > 1
);

-- 7. Deduplicate about_highlights (keep newest record per title)
DELETE FROM about_highlights
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(title))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM about_highlights
  ) ranked
  WHERE rnum > 1
);

-- 8. Deduplicate about_stats (keep newest record per label)
DELETE FROM about_stats
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(label))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM about_stats
  ) ranked
  WHERE rnum > 1
);

-- 9. Deduplicate skills (keep newest record per category)
DELETE FROM skills
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY lower(trim(category))
      ORDER BY updated_at DESC, created_at DESC
    ) as rnum
    FROM skills
  ) ranked
  WHERE rnum > 1
);
