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
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">
                Portfolio Admin
              </h1>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Control
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all group"
            >
              <span>View live site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                {isMessages && unreadCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-indigo-700"
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
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-2">
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
