-- =============================================================
-- 002_seed.sql — All current portfolio content (IDEMPOTENT)
-- Run AFTER 001_init.sql in the Supabase SQL editor.
-- Safe to run any number of times — uses ON CONFLICT DO NOTHING
-- on each table's natural key so row counts never grow.
--
-- Does NOT touch: admins, messages, or resume_url / resume_updated_at
-- columns of site_settings (those are managed via the admin UI).
-- =============================================================

-- ── site_settings ─────────────────────────────────────────────
-- site_settings has no natural key — we use an upsert-by-count
-- pattern: insert only if the table is empty.
-- resume_url and resume_updated_at are intentionally excluded
-- so uploading a real resume via the admin UI is never overwritten.
INSERT INTO site_settings (
  name, title, hero_description, availability_text, status_text,
  profile_image_url,
  hero_stats,
  contact_email, contact_phone, contact_location,
  github_url, linkedin_url,
  seo_title, seo_description, og_image_url
)
SELECT
  'Yatendra Verma',
  'Python Developer & AI/ML Engineer',
  'Passionate Python Developer and AI/ML Engineer specializing in Computer Vision, Machine Learning, and backend development. Building intelligent systems that bridge the gap between cutting-edge research and real-world applications.',
  'Open to Work',
  'final-year B.Tech student',
  '/images/profile-cutout.png',
  '[
    {"icon": "Briefcase", "label": "Projects",       "value": "5",          "highlight": false},
    {"icon": "Award",     "label": "Certifications", "value": "5",          "highlight": false},
    {"icon": "Code2",     "label": "LeetCode",       "value": "200+",       "highlight": false},
    {"icon": "Wifi",      "label": "Availability",   "value": "Open to Work","highlight": true}
  ]',
  'yatendrav477@gmail.com',
  '+91-9479607590',
  'Indore, Madhya Pradesh, India',
  'https://github.com/Yatendra477',
  'https://www.linkedin.com/in/yatendra-verma-0899a6246',
  'Yatendra Verma | Python Developer & AI/ML Engineer',
  'Portfolio of Yatendra Verma — Python Developer and AI/ML Engineer specializing in Computer Vision, Machine Learning, and backend development.',
  ''
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- ── section_visibility ────────────────────────────────────────
-- Natural key: section_key (UNIQUE in schema).
INSERT INTO section_visibility (section_key, is_visible) VALUES
  ('home',           true),
  ('about',          true),
  ('education',      true),
  ('skills',         true),
  ('experience',     true),
  ('projects',       true),
  ('certifications', true),
  ('achievements',   true),
  ('resume',         true),
  ('testimonials',   false),  -- hidden until real testimonials are added
  ('contact',        true)
ON CONFLICT (section_key) DO NOTHING;

-- ── about_highlights ─────────────────────────────────────────
-- Natural key: lower(trim(title)) — guarded by uix_about_highlights_title.
INSERT INTO about_highlights (sort_order, icon, title, description) VALUES
  (1, 'Lightbulb', 'Problem Solving',       '200+ LeetCode problems solved. Strong foundation in data structures, algorithms, and computational thinking.'),
  (2, 'Code2',     'Software Engineering',  'Building scalable, maintainable applications with clean architecture and modern development practices.'),
  (3, 'Brain',     'Artificial Intelligence', 'Hands-on experience with ML/DL frameworks, neural networks, and intelligent system design.'),
  (4, 'Eye',       'Computer Vision',       'Specialized in image processing, face recognition, object detection, and real-time visual systems.'),
  (5, 'Users',     'Leadership',            'Active participant in hackathons, tech events, and collaborative engineering projects.'),
  (6, 'TrendingUp','Continuous Learning',   'Always exploring emerging technologies, earning certifications, and expanding technical horizons.')
ON CONFLICT (lower(trim(title))) DO NOTHING;

-- ── about_stats ───────────────────────────────────────────────
-- Natural key: lower(trim(label)) — guarded by uix_about_stats_label.
INSERT INTO about_stats (sort_order, label, value, suffix) VALUES
  (1, 'Projects Completed',    5,   ''),
  (2, 'Certifications Earned', 5,   ''),
  (3, 'Technologies Learned',  21,  '+'),
  (4, 'LeetCode Problems',     200, '+'),
  (5, 'Hackathons',            2,   '+')
ON CONFLICT (lower(trim(label))) DO NOTHING;

-- ── education ─────────────────────────────────────────────────
-- Natural key: (lower(trim(title)), lower(trim(period))) — guarded by uix_education_title_period.
INSERT INTO education (sort_order, period, title, subtitle, institution, location, tags) VALUES
  (1, '2020',        'Secondary (10th Grade)',          'CBSE',                   'Gyan Sagar International School', 'Hoshangabad, India', '{}'),
  (2, '2022',        'Higher Secondary (12th Grade)',   'Science — CBSE',         'Gyan Sagar International School', 'Hoshangabad, India', '{}'),
  (3, '2022 — 2026', 'Bachelor of Technology (B.Tech)', 'Robotics & Automation',  'Medicaps University',             'Indore, India',
   ARRAY['Data Structures','Algorithms','OOP','DBMS','Operating Systems','Computer Networks','Computer Vision','Machine Learning','AI']
  )
ON CONFLICT (lower(trim(title)), lower(trim(period))) DO NOTHING;

-- ── skill_categories & skills ─────────────────────────────────
-- skill_categories natural key: name (UNIQUE in schema).
-- skills natural key: (category_id, lower(trim(name))) — guarded by uix_skills_category_name.
--
-- The CTE inserts categories and returns their ids.
-- Skills then look up each category id by name, so this is
-- safe even if some categories already exist (RETURNING only
-- gives back newly inserted rows; existing ones are fetched
-- via a separate lookup for the skills join).

WITH cats AS (
  -- Insert missing categories; DO NOTHING for existing ones.
  INSERT INTO skill_categories (sort_order, name) VALUES
    (1, 'Programming Languages'),
    (2, 'Frontend'),
    (3, 'Backend'),
    (4, 'Database'),
    (5, 'AI & Computer Vision'),
    (6, 'Tools & Platforms')
  ON CONFLICT (name) DO NOTHING
  RETURNING id, name
),
-- Merge newly inserted ids with pre-existing category ids.
all_cats AS (
  SELECT id, name FROM cats
  UNION ALL
  SELECT sc.id, sc.name
  FROM skill_categories sc
  WHERE sc.name NOT IN (SELECT name FROM cats)
    AND sc.name IN (
      'Programming Languages','Frontend','Backend',
      'Database','AI & Computer Vision','Tools & Platforms'
    )
)
INSERT INTO skills (sort_order, category_id, name, description, icon, level)
SELECT s.sort_order, c.id, s.name, s.description, s.icon, s.level
FROM all_cats c
JOIN (VALUES
  -- Programming Languages
  (1, 'Programming Languages', 'Python',    'Primary language for all projects',          'Code2',        90),
  (2, 'Programming Languages', 'C',         'Systems & embedded programming',             'Cpu',          75),
  -- Frontend
  (1, 'Frontend',              'HTML',      'Semantic markup & structure',                'Globe',        85),
  (2, 'Frontend',              'CSS',       'Styling & responsive layouts',               'Palette',      80),
  (3, 'Frontend',              'Streamlit', 'Python-based data apps & demos',             'BarChart3',    75),
  -- Backend
  (1, 'Backend',               'FastAPI',   'High-performance async REST APIs',           'Zap',          75),
  (2, 'Backend',               'Flask',     'Lightweight web framework',                  'FlaskConical', 70),
  (3, 'Backend',               'Django',    'Full-featured Python web framework',         'Layers',       60),
  -- Database
  (1, 'Database',              'MySQL',     'Relational database design & queries',       'Database',     80),
  (2, 'Database',              'MongoDB',   'NoSQL document-based storage',               'Leaf',         60),
  (3, 'Database',              'PostgreSQL','Advanced open-source RDBMS',                'Database',     65),
  -- AI & Computer Vision
  (1, 'AI & Computer Vision',  'OpenCV',           'Real-time image & video processing',         'Eye',      85),
  (2, 'AI & Computer Vision',  'Image Processing', 'Filters, transforms, feature extraction',     'Scan',     80),
  (3, 'AI & Computer Vision',  'Machine Learning', 'Supervised & unsupervised models',            'Bot',      75),
  (4, 'AI & Computer Vision',  'Deep Learning',    'Neural networks & model training',            'Brain',    65),
  (5, 'AI & Computer Vision',  'Scikit-Learn',     'Classical ML pipelines & evaluation',         'Binary',   70),
  (6, 'AI & Computer Vision',  'NumPy / Pandas',   'Numerical computing & data wrangling',        'BarChart3',80),
  (7, 'AI & Computer Vision',  'spaCy',            'NLP & named entity recognition',              'Bot',      65),
  -- Tools & Platforms
  (1, 'Tools & Platforms',     'Git',          'Version control & branching',                  'GitBranch',   85),
  (2, 'Tools & Platforms',     'GitHub',       'Repository management & collaboration',         'FolderGit2',  90),
  (3, 'Tools & Platforms',     'VS Code',      'Primary code editor',                          'Laptop',      90),
  (4, 'Tools & Platforms',     'Arduino',      'Microcontroller & embedded systems',            'CircuitBoard',75),
  (5, 'Tools & Platforms',     'Linux',        'CLI, scripting & server environments',          'Terminal',    65)
) AS s(sort_order, cat_name, name, description, icon, level)
  ON c.name = s.cat_name
ON CONFLICT (category_id, lower(trim(name))) DO NOTHING;

-- ── experience ────────────────────────────────────────────────
-- Natural key: (lower(trim(role)), lower(trim(company)), lower(trim(period)))
-- Guarded by uix_experience_role_company_period.
INSERT INTO experience (sort_order, role, company, period, location, type, description, bullets, tech) VALUES
  (1,
   'Python Development Intern',
   'Cyber Instant Pvt. Ltd.',
   'Jun 2025 – Jul 2025',
   'Indore, India',
   'Internship',
   'Focused on scripting, automation, and backend development to support security operations and application development.',
   ARRAY[
     'Built server-side web applications using Django and Flask frameworks',
     'Applied unit testing frameworks including unittest and pytest for code reliability',
     'Implemented file handling & I/O for CSV, JSON, XML, and TXT file types',
     'Developed automation scripts to streamline development workflows'
   ],
   ARRAY['Python','Django','Flask','MySQL','GitHub','NumPy','Pandas','Matplotlib']
  )
ON CONFLICT (lower(trim(role)), lower(trim(company)), lower(trim(period))) DO NOTHING;

-- ── projects ──────────────────────────────────────────────────
-- Natural key: lower(trim(title)) — guarded by uix_projects_title.
INSERT INTO projects (sort_order, title, description, category, date_text, bullets, tech, image_url, github_url, demo_url, is_featured, is_visible) VALUES
  (1,
   'Face Recognition Attendance System',
   'Real-time face recognition attendance system with 95%+ accuracy in contactless face detection. Features automated attendance logging, multi-face detection, and a user-friendly GUI interface.',
   'AI/CV',
   'Feb 2025 – Apr 2025',
   ARRAY['95%+ face detection accuracy','Real-time multi-face recognition','Automated attendance logging','Admin dashboard with reports'],
   ARRAY['Python','OpenCV','MySQL','Tkinter'],
   '/images/project-face-v2.png',
   'https://github.com/Yatendra477/FaceRecognition-Attendance-System',
   'https://huggingface.co/spaces/Yatendra477/Face-Attendance-System',
   true, true
  ),
  (2,
   'Non-Profit QuizTutor Bot',
   'Intelligent educational bot designed for non-profits to provide automated tutoring and interactive quizzes. Features natural language processing, automated grading, and learning progress tracking.',
   'Automation',
   '2024',
   ARRAY['Automated tutoring system','Interactive quiz generation','Learning progress tracking','Multi-platform integration'],
   ARRAY['Python','NLP','APIs','Database'],
   '/images/project-quizbot-v2.png',
   'https://github.com/Yatendra477/Non-Profit-QuizTutor-Bot',
   'https://huggingface.co/spaces/Yatendra477/nonprofit-quiz-bot',
   true, true
  ),
  (3,
   'PyShortify — URL Shortener',
   'Python-based URL shortener converting long URLs into compact, shareable links using hashing algorithms with fast redirection and analytics tracking.',
   'Web',
   '2024',
   ARRAY['Custom short URL generation','Fast redirection engine','Click analytics dashboard','RESTful API endpoints'],
   ARRAY['Python','Flask','MySQL'],
   '/images/project-url-v2.png',
   '',
   '',
   false, true
  ),
  (4,
   'NGO Infrastructure System',
   'Comprehensive infrastructure and resource management platform for non-governmental organizations. Features volunteer tracking, donation processing, and operational analytics.',
   'Web',
   '2024',
   ARRAY['Volunteer management','Resource allocation tracking','Donation processing system','Operational analytics dashboard'],
   ARRAY['Python','Django','React','PostgreSQL'],
   '/images/project-ngo-v2.png',
   'https://github.com/vinay-24250/ngo-infrastructure',
   '',
   false, true
  ),
  (5,
   'Non-Profit Support Triage Agent',
   'A production-grade, multi-agent AI system that classifies, enriches, and routes incoming support messages for non-profit organisations using FastAPI and Groq Llama 3.',
   'AI/CV',
   '2024',
   ARRAY['Multi-agent AI orchestration','Intent and urgency classification','Named Entity Recognition (NER)','Deterministic routing rules engine'],
   ARRAY['Python','FastAPI','Llama 3','spaCy'],
   '/images/project-triage-v2.png',
   'https://github.com/Yatendra477/non-profit-triage-agent',
   'https://non-profit-triage-agent.onrender.com/ui/',
   true, true
  )
ON CONFLICT (lower(trim(title))) DO NOTHING;

-- ── certifications ────────────────────────────────────────────
-- Natural key: (lower(trim(title)), lower(trim(issuer)))
-- Guarded by uix_certifications_title_issuer.
INSERT INTO certifications (sort_order, title, issuer, period, description, credential_id, credential_url) VALUES
  (1,
   'Agentic AI',
   'Datagami (IBM Gold Partner / nasscom)',
   'Apr 2026 – May 2026',
   'Successfully completed a Skill-Based Project comprising 80 hours of structured learning and practical training in Agentic AI. Certificate: EDU-2026-2Q7YM',
   'EDU-2026-2Q7YM',
   ''
  ),
  (2,
   'Generative AI',
   'Datagami (IBM Gold Partner / nasscom)',
   'Feb 2026 – Mar 2026',
   'Successfully completed a Skill-Based Project comprising 80 hours of structured learning and practical training in Generative AI. Certificate: EDU-2026-EFWGY',
   'EDU-2026-EFWGY',
   ''
  ),
  (3,
   'DevOps Foundation',
   'Datagami (IBM Gold Partner / nasscom)',
   'Jan 2026 – Feb 2026',
   'Successfully completed a Skill-Based Project comprising 80 hours of structured learning and practical training in DevOps Foundation. Certificate: EDU-2026-FTNC8',
   'EDU-2026-FTNC8',
   ''
  ),
  (4,
   'Smart UAV: AI/ML in Communication & Navigation',
   'IIT Indore (sponsored by MeitY)',
   'Mar 2024',
   '40+ hours hands-on training covering drone basics, AI/ML applications, communications, navigation, and regulations. Aggregate: 10/10.',
   '',
   ''
  ),
  (5,
   'Python Programming',
   'Infosys Springboard',
   '2024',
   'Comprehensive Python 3 certification covering core concepts, clean code practices, and real-world application development.',
   '',
   ''
  )
ON CONFLICT (lower(trim(title)), lower(trim(issuer))) DO NOTHING;

-- ── achievements ──────────────────────────────────────────────
-- Natural key: lower(trim(title)) — guarded by uix_achievements_title.
INSERT INTO achievements (sort_order, category, title, description, icon) VALUES
  (1, 'Competitive Programming', '200+ LeetCode Problems Solved',
   'Consistent problem-solving practice across data structures, algorithms, and competitive programming.',
   'Code2'),
  (2, 'Hackathons',              '2+ Major Hackathons',
   'Active participation in national-level hackathons, building innovative solutions under time constraints.',
   'Trophy'),
  (3, 'Certifications',          'IIT Indore Certified',
   'Scored 10/10 aggregate in Smart UAV program conducted by IIT Indore, sponsored by MeitY.',
   'Award'),
  (4, 'Open Source',             'Open Source Contributor',
   'Active GitHub presence with multiple public repositories and contributions to collaborative projects.',
   'GitBranch')
ON CONFLICT (lower(trim(title))) DO NOTHING;

-- ── testimonials ──────────────────────────────────────────────
-- No real testimonials yet. Section is hidden via section_visibility.
-- Add rows here when you have real quotes. Set is_visible = true to show them.

-- ── admins ────────────────────────────────────────────────────
-- Admin rows are added manually by the owner only.
-- No inserts are included in seed or migration files.
