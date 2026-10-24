import Link from "next/link";
import {
  ExternalLink,
  Mail,
  FolderGit2,
  Cpu,
  Briefcase,
  FileText,
  User,
  GraduationCap,
  Award,
  Trophy,
  MessageSquareQuote,
  Eye,
  Search,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const supabase = await createClient();

  // Load counts for dashboard overview
  let unreadMessages = 0;
  let totalProjects = 0;
  let totalExperience = 0;
  let totalSkills = 0;
  let resumeDate = "Not uploaded yet";

  try {
    const [msgRes, projRes, expRes, skillsRes, settingsRes] = await Promise.all([
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("experience").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("site_settings").select("resume_updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    if (typeof msgRes.count === "number") unreadMessages = msgRes.count;
    if (typeof projRes.count === "number") totalProjects = projRes.count;
    if (typeof expRes.count === "number") totalExperience = expRes.count;
    if (typeof skillsRes.count === "number") totalSkills = skillsRes.count;
    if (settingsRes.data?.resume_updated_at) resumeDate = settingsRes.data.resume_updated_at;
  } catch {
    // Supabase fallback
  }

  const quickLinks = [
    { title: "Profile & Hero", desc: "Name, title, bio, hero stats & avatar", href: "/admin/hero", icon: User },
    { title: "Resume (PDF)", desc: `Last updated: ${resumeDate}`, href: "/admin/resume", icon: FileText },
    { title: "Projects", desc: `${totalProjects} projects in portfolio`, href: "/admin/projects", icon: FolderGit2 },
    { title: "Experience", desc: `${totalExperience} career timeline roles`, href: "/admin/experience", icon: Briefcase },
    { title: "Skills", desc: `${totalSkills} skills across categories`, href: "/admin/skills", icon: Cpu },
    { title: "Education", desc: "Degrees, institutions, coursework", href: "/admin/education", icon: GraduationCap },
    { title: "Certifications", desc: "Verified credentials & certificates", href: "/admin/certifications", icon: Award },
    { title: "Achievements", desc: "Honors, hackathons, and awards", href: "/admin/achievements", icon: Trophy },
    { title: "Testimonials", desc: "Client quotes and recommendations", href: "/admin/testimonials", icon: MessageSquareQuote },
    { title: "Section Visibility", desc: "Toggle homepage sections on or off", href: "/admin/sections", icon: Eye },
    { title: "SEO Settings", desc: "Meta tags, titles, description, OG image", href: "/admin/seo", icon: Search },
    { title: "Messages Inbox", desc: `${unreadMessages} unread form submissions`, href: "/admin/messages", icon: Mail, badge: unreadMessages > 0 ? `${unreadMessages} new` : undefined },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="relative overflow-hidden p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
        style={{
          background: "#0B1220",
          border: "1px solid #2A3140",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(74, 85, 104, 0.2)",
                color: "#E2E8F0",
                border: "1px solid rgba(74, 85, 104, 0.4)",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrator Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-[family-name:var(--font-display)]">
              Welcome back, {user.email.split("@")[0]}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed font-[family-name:var(--font-sans)]">
              Manage your portfolio content in real-time. Changes are instantly revalidated and reflected on your live site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all"
              style={{
                background: "#4A5568",
              }}
            >
              <span>View Live Site</span>
              <ExternalLink className="w-4 h-4 text-slate-300" />
            </Link>

            <Link
              href="/admin/messages"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                unreadMessages > 0
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                  : "bg-slate-900/60 text-slate-200 border-slate-700 hover:bg-slate-800"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Inbox ({unreadMessages})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl transition-all group"
          style={{
            background: "#0B1220",
            border: "1px solid #2A3140",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Unread Messages</span>
            <div className={`p-2 rounded-xl ${unreadMessages > 0 ? "bg-rose-500/10 text-rose-400" : "bg-slate-800/80 text-slate-400"}`}>
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 font-[family-name:var(--font-display)]">{unreadMessages}</p>
          <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-2">
            View submissions <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/projects"
          className="p-5 rounded-2xl transition-all group"
          style={{
            background: "#0B1220",
            border: "1px solid #2A3140",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Projects</span>
            <div
              className="p-2 rounded-xl"
              style={{
                background: "rgba(74, 85, 104, 0.2)",
                color: "#E2E8F0",
              }}
            >
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 font-[family-name:var(--font-display)]">{totalProjects}</p>
          <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-2">
            Manage projects <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/skills"
          className="p-5 rounded-2xl transition-all group"
          style={{
            background: "#0B1220",
            border: "1px solid #2A3140",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Skills Listed</span>
            <div
              className="p-2 rounded-xl"
              style={{
                background: "rgba(22, 163, 74, 0.15)",
                color: "#4ADE80",
              }}
            >
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 font-[family-name:var(--font-display)]">{totalSkills}</p>
          <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-2">
            Edit skill categories <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/admin/resume"
          className="p-5 rounded-2xl transition-all group"
          style={{
            background: "#0B1220",
            border: "1px solid #2A3140",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Resume Status</span>
            <div
              className="p-2 rounded-xl"
              style={{
                background: "rgba(250, 204, 21, 0.15)",
                color: "#FACC15",
              }}
            >
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-white mt-3 truncate">{resumeDate}</p>
          <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-2">
            Upload new PDF <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      {/* Quick Navigation Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight font-[family-name:var(--font-display)]">
          Quick Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-2xl transition-all flex items-start gap-4 group"
                style={{
                  background: "#0B1220",
                  border: "1px solid #2A3140",
                }}
              >
                <div
                  className="p-2.5 rounded-xl text-slate-300 transition-colors shrink-0"
                  style={{
                    background: "rgba(74, 85, 104, 0.25)",
                    border: "1px solid rgba(74, 85, 104, 0.4)",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white group-hover:text-slate-200 transition-colors font-[family-name:var(--font-display)]">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-[family-name:var(--font-sans)]">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
