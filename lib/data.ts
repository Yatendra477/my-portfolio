/**
 * lib/data.ts
 * Typed server-side fetchers for every Supabase table.
 * Falls back to static data from data/portfolio.ts when:
 *   - env vars are missing / empty, or
 *   - Supabase returns an error.
 *
 * Each fetcher is a standard async function so Next.js App Router
 * can use `unstable_cache` for ISR-style revalidation.
 */

import { createClient } from "@/lib/supabase/server";
import {
  personalInfo,
  aboutHighlights as staticAboutHighlights,
  stats as staticStats,
  education as staticEducation,
  skillCategories as staticSkillCategories,
  experience as staticExperience,
  projects as staticProjects,
  certifications as staticCertifications,
  achievements as staticAchievements,
  testimonials as staticTestimonials,
  navLinks as staticNavLinks,
  STUDENT_STATUS,
  RESUME_UPDATED,
} from "@/data/portfolio";

// ── Types ─────────────────────────────────────────────────────

export interface SiteSettings {
  name: string;
  title: string;
  heroDescription: string;
  availabilityText: string;
  statusText: string;
  profileImageUrl: string;
  resumeUrl: string;
  resumeUpdatedAt: string;
  heroStats: Array<{ icon: string; label: string; value: string; highlight: boolean }>;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  githubUrl: string;
  linkedinUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}

export interface SectionVisibility {
  [key: string]: boolean;
}

export interface AboutHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface AboutStat {
  label: string;
  value: number;
  suffix: string;
}

export interface Education {
  period: string;
  title: string;
  subtitle: string;
  institution: string;
  location: string;
  tags: string[];
}

export interface SkillItem {
  name: string;
  description: string;
  icon: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: SkillItem[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  bullets: string[];
  tech: string[];
}

export interface Project {
  title: string;
  description: string;
  category: string;
  dateText: string;
  bullets: string[];
  tech: string[];
  imageUrl: string;
  githubUrl: string;
  demoUrl: string;
  isFeatured: boolean;
  isVisible: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  period: string;
  description: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Achievement {
  category: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  isVisible: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}

// ── Helpers ────────────────────────────────────────────────────

function supabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && url.trim() && key && key.trim());
}

// ── Static fallbacks ───────────────────────────────────────────

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  name: personalInfo.fullName,
  title: "Python Developer & AI/ML Engineer",
  heroDescription: personalInfo.summary,
  availabilityText: "Open to Work",
  statusText: STUDENT_STATUS,
  profileImageUrl: personalInfo.profileImage,
  resumeUrl: "",
  resumeUpdatedAt: RESUME_UPDATED,
  heroStats: [
    { icon: "Briefcase", label: "Projects",       value: `${staticProjects.length}`,       highlight: false },
    { icon: "Award",     label: "Certifications", value: `${staticCertifications.length}`, highlight: false },
    { icon: "Code2",     label: "LeetCode",       value: "200+",                           highlight: false },
    { icon: "Wifi",      label: "Availability",   value: "Open to Work",                   highlight: true  },
  ],
  contactEmail: personalInfo.email,
  contactPhone: personalInfo.phone,
  contactLocation: personalInfo.location,
  githubUrl: personalInfo.socialLinks.github,
  linkedinUrl: personalInfo.socialLinks.linkedin,
  seoTitle: "Yatendra Verma | Python Developer & AI/ML Engineer",
  seoDescription:
    "Portfolio of Yatendra Verma — Python Developer and AI/ML Engineer specializing in Computer Vision, Machine Learning, and backend development.",
  ogImageUrl: "",
};

const FALLBACK_SECTION_VISIBILITY: SectionVisibility = {
  home: true,
  about: true,
  education: true,
  skills: true,
  experience: true,
  projects: true,
  certifications: true,
  achievements: true,
  resume: true,
  testimonials: staticTestimonials.length > 0,
  contact: true,
};

// ── Fetchers ────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured()) {
    console.warn("[getSiteSettings] Supabase not configured — using static fallback. Resume URL will be '/resume.pdf'.");
    return FALLBACK_SITE_SETTINGS;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) {
      console.warn("[getSiteSettings] Supabase query returned error or empty:", error?.message ?? "no data");
      return FALLBACK_SITE_SETTINGS;
    }
    return {
      name: data.name,
      title: data.title,
      heroDescription: data.hero_description,
      availabilityText: data.availability_text,
      statusText: data.status_text,
      profileImageUrl: data.profile_image_url,
      resumeUrl: data.resume_url
        ? `${data.resume_url}${data.resume_url.includes("?") ? "&" : "?"}v=${new Date(data.updated_at).getTime()}`
        : "",
      resumeUpdatedAt: data.resume_updated_at,
      heroStats: Array.isArray(data.hero_stats) ? data.hero_stats : [],
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      contactLocation: data.contact_location,
      githubUrl: data.github_url,
      linkedinUrl: data.linkedin_url,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      ogImageUrl: data.og_image_url,
    };
  } catch (err) {
    console.error("[getSiteSettings] Exception:", err);
    return FALLBACK_SITE_SETTINGS;
  }
}

export async function getSectionVisibility(): Promise<SectionVisibility> {
  if (!supabaseConfigured()) return FALLBACK_SECTION_VISIBILITY;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("section_visibility")
      .select("section_key, is_visible");
    if (error || !data) return FALLBACK_SECTION_VISIBILITY;
    const result: SectionVisibility = { ...FALLBACK_SECTION_VISIBILITY };
    for (const row of data) {
      result[row.section_key] = row.is_visible;
    }
    return result;
  } catch {
    return FALLBACK_SECTION_VISIBILITY;
  }
}

export async function getAboutHighlights(): Promise<AboutHighlight[]> {
  if (!supabaseConfigured()) return staticAboutHighlights;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("about_highlights")
      .select("icon, title, description")
      .order("sort_order");
    if (error || !data || data.length === 0) return staticAboutHighlights;
    return data;
  } catch {
    return staticAboutHighlights;
  }
}

export async function getAboutStats(): Promise<AboutStat[]> {
  if (!supabaseConfigured()) {
    return staticStats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("about_stats")
      .select("label, value, suffix")
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return staticStats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix }));
    }
    return data;
  } catch {
    return staticStats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix }));
  }
}

export async function getEducation(): Promise<Education[]> {
  if (!supabaseConfigured()) {
    return staticEducation.map((e) => ({
      period: e.duration,
      title: e.degree,
      subtitle: e.field,
      institution: e.institution,
      location: e.location,
      tags: e.coursework,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("education")
      .select("period, title, subtitle, institution, location, tags")
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return staticEducation.map((e) => ({
        period: e.duration,
        title: e.degree,
        subtitle: e.field,
        institution: e.institution,
        location: e.location,
        tags: e.coursework,
      }));
    }
    return data;
  } catch {
    return staticEducation.map((e) => ({
      period: e.duration,
      title: e.degree,
      subtitle: e.field,
      institution: e.institution,
      location: e.location,
      tags: e.coursework,
    }));
  }
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  if (!supabaseConfigured()) {
    return staticSkillCategories.map((cat) => ({
      name: cat.name,
      skills: cat.skills.map((s) => ({
        name: s.name,
        description: s.description ?? "",
        icon: s.icon,
        level: s.level,
      })),
    }));
  }
  try {
    const supabase = await createClient();
    const { data: cats, error: catErr } = await supabase
      .from("skill_categories")
      .select("id, name")
      .order("sort_order");
    if (catErr || !cats || cats.length === 0) throw new Error("no cats");

    const { data: skills, error: skillErr } = await supabase
      .from("skills")
      .select("category_id, name, description, icon, level")
      .order("sort_order");
    if (skillErr || !skills) throw new Error("no skills");

    return cats.map((cat) => ({
      name: cat.name,
      skills: skills
        .filter((s) => s.category_id === cat.id)
        .map((s) => ({
          name: s.name,
          description: s.description ?? "",
          icon: s.icon,
          level: s.level ?? 0,
        })),
    }));
  } catch {
    return staticSkillCategories.map((cat) => ({
      name: cat.name,
      skills: cat.skills.map((s) => ({
        name: s.name,
        description: s.description ?? "",
        icon: s.icon,
        level: s.level,
      })),
    }));
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!supabaseConfigured()) {
    return staticExperience.map((e) => ({
      role: e.role,
      company: e.company,
      period: e.duration,
      location: e.location,
      type: e.type,
      description: e.description,
      bullets: e.responsibilities,
      tech: e.technologies,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experience")
      .select("role, company, period, location, type, description, bullets, tech")
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return staticExperience.map((e) => ({
        role: e.role,
        company: e.company,
        period: e.duration,
        location: e.location,
        type: e.type,
        description: e.description,
        bullets: e.responsibilities,
        tech: e.technologies,
      }));
    }
    return data;
  } catch {
    return staticExperience.map((e) => ({
      role: e.role,
      company: e.company,
      period: e.duration,
      location: e.location,
      type: e.type,
      description: e.description,
      bullets: e.responsibilities,
      tech: e.technologies,
    }));
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!supabaseConfigured()) {
    return staticProjects.map((p) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      dateText: p.date,
      bullets: p.features,
      tech: p.technologies,
      imageUrl: p.image,
      githubUrl: p.github,
      demoUrl: p.liveDemo,
      isFeatured: p.featured,
      isVisible: true,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("title, description, category, date_text, bullets, tech, image_url, github_url, demo_url, is_featured, is_visible")
      .eq("is_visible", true)
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return staticProjects.map((p) => ({
        title: p.title,
        description: p.description,
        category: p.category,
        dateText: p.date,
        bullets: p.features,
        tech: p.technologies,
        imageUrl: p.image,
        githubUrl: p.github,
        demoUrl: p.liveDemo,
        isFeatured: p.featured,
        isVisible: true,
      }));
    }
    return data.map((p) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      dateText: p.date_text,
      bullets: p.bullets ?? [],
      tech: p.tech ?? [],
      imageUrl: p.image_url,
      githubUrl: p.github_url,
      demoUrl: p.demo_url,
      isFeatured: p.is_featured,
      isVisible: p.is_visible,
    }));
  } catch {
    return staticProjects.map((p) => ({
      title: p.title,
      description: p.description,
      category: p.category,
      dateText: p.date,
      bullets: p.features,
      tech: p.technologies,
      imageUrl: p.image,
      githubUrl: p.github,
      demoUrl: p.liveDemo,
      isFeatured: p.featured,
      isVisible: true,
    }));
  }
}

export async function getCertifications(): Promise<Certification[]> {
  if (!supabaseConfigured()) {
    return staticCertifications.map((c) => ({
      title: c.title,
      issuer: c.organization,
      period: c.date,
      description: c.description,
      credentialId: "",
      credentialUrl: c.credentialUrl,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("title, issuer, period, description, credential_id, credential_url")
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return staticCertifications.map((c) => ({
        title: c.title,
        issuer: c.organization,
        period: c.date,
        description: c.description,
        credentialId: "",
        credentialUrl: c.credentialUrl,
      }));
    }
    return data.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      period: c.period,
      description: c.description,
      credentialId: c.credential_id,
      credentialUrl: c.credential_url,
    }));
  } catch {
    return staticCertifications.map((c) => ({
      title: c.title,
      issuer: c.organization,
      period: c.date,
      description: c.description,
      credentialId: "",
      credentialUrl: c.credentialUrl,
    }));
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  if (!supabaseConfigured()) {
    return staticAchievements.map((a) => ({
      category: a.category,
      title: a.title,
      description: a.description,
      icon: a.icon,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("category, title, description, icon")
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return staticAchievements.map((a) => ({
        category: a.category,
        title: a.title,
        description: a.description,
        icon: a.icon,
      }));
    }
    return data;
  } catch {
    return staticAchievements.map((a) => ({
      category: a.category,
      title: a.title,
      description: a.description,
      icon: a.icon,
    }));
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabaseConfigured()) {
    return staticTestimonials.map((t) => ({
      quote: t.review,
      name: t.name,
      role: t.designation,
      isVisible: true,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("quote, name, role, is_visible")
      .eq("is_visible", true)
      .order("sort_order");
    if (error || !data) {
      return staticTestimonials.map((t) => ({
        quote: t.review,
        name: t.name,
        role: t.designation,
        isVisible: true,
      }));
    }
    return data.map((t) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
      isVisible: t.is_visible,
    }));
  } catch {
    return staticTestimonials.map((t) => ({
      quote: t.review,
      name: t.name,
      role: t.designation,
      isVisible: true,
    }));
  }
}

export async function getNavLinks(visibility: SectionVisibility): Promise<NavLink[]> {
  // Filter static nav links based on section visibility
  return staticNavLinks.filter((link) => {
    const key = link.href.replace("#", "");
    // If not in visibility map, show it by default
    return visibility[key] !== false;
  });
}
