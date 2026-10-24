"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Info,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  MessageSquareQuote,
  Cpu,
  FolderGit2,
  PhoneCall,
  Search,
  Eye,
  Mail,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { logoutAdminAction } from "@/lib/actions/admin";

interface AdminSidebarProps {
  unreadCount?: number;
  userEmail?: string;
  onNavigate?: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Profile & Hero", icon: User },
  { href: "/admin/resume", label: "Resume (PDF)", icon: FileText },
  { href: "/admin/about", label: "About & Stats", icon: Info },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/skills", label: "Skills", icon: Cpu },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/contact", label: "Contact & Social", icon: PhoneCall },
  { href: "/admin/seo", label: "SEO & Meta", icon: Search },
  { href: "/admin/sections", label: "Section Visibility", icon: Eye },
  { href: "/admin/messages", label: "Messages", icon: Mail, badgeKey: "messages" },
];

export default function AdminSidebar({
  unreadCount = 0,
  userEmail = "Admin",
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 h-full flex flex-col justify-between select-none"
      style={{
        background: "#0B1220",
        borderRight: "1px solid #2A3140",
      }}
    >
      {/* Top Header */}
      <div>
        <div className="p-5 border-b" style={{ borderColor: "#2A3140" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl"
              style={{
                background: "rgba(74, 85, 104, 0.2)",
                color: "#E2E8F0",
                border: "1px solid rgba(74, 85, 104, 0.4)",
              }}
            >
              <ShieldCheck className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide font-[family-name:var(--font-display)]">
                Portfolio Admin
              </h1>
              <span className="text-[11px] font-medium flex items-center gap-1.5 mt-0.5" style={{ color: "#16A34A" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16A34A" }} />
                Live Control
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all group"
              style={{
                background: "rgba(5, 10, 20, 0.6)",
                border: "1px solid #2A3140",
              }}
            >
              <span>View live site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const isMessages = item.badgeKey === "messages";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all"
                style={
                  isActive
                    ? {
                        background: "#4A5568",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                      }
                    : {
                        color: "#94A3B8",
                      }
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                {isMessages && unreadCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-slate-900"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t" style={{ borderColor: "#2A3140", background: "rgba(5, 10, 20, 0.5)" }}>
        <div
          className="px-3 py-2 rounded-xl flex items-center justify-between gap-2"
          style={{ background: "#0B1220", border: "1px solid #2A3140" }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-400 truncate">Logged in as</p>
            <p className="text-xs font-medium text-slate-200 truncate">{userEmail}</p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              title="Log out of admin"
              aria-label="Log out of admin"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
