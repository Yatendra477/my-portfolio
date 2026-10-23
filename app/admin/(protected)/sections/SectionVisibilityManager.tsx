"use client";

import React, { useState } from "react";
import {
  User,
  Info,
  GraduationCap,
  Cpu,
  Briefcase,
  FolderGit2,
  Award,
  Trophy,
  FileText,
  MessageSquareQuote,
  Loader2,
} from "lucide-react";
import { updateSectionVisibilityAction } from "@/lib/actions/admin";
import { useAdminToast } from "@/components/admin/AdminToast";

interface SectionVisibilityManagerProps {
  initialVisibility: Record<string, boolean>;
}

const sectionConfigs = [
  { key: "home", label: "Hero / Introduction", desc: "Top introduction, title, profile avatar, status pill, and CTA buttons", icon: User },
  { key: "about", label: "About Section", desc: "Background story, philosophy pillars, and animated counter statistics", icon: Info },
  { key: "education", label: "Education Timeline", desc: "Academic degrees, universities, and coursework tags", icon: GraduationCap },
  { key: "skills", label: "Skills Matrix", desc: "Interactive category cards and proficiency bars", icon: Cpu },
  { key: "experience", label: "Work Experience", desc: "Internships, career positions, bullet points, and tech stacks", icon: Briefcase },
  { key: "projects", label: "Projects Showcase", desc: "Software repositories, live demos, mockups, and filters", icon: FolderGit2 },
  { key: "certifications", label: "Certifications", desc: "Accredited credentials and verification badges", icon: Award },
  { key: "achievements", label: "Achievements & Honors", desc: "Hackathon rankings, competitive milestones, and awards", icon: Trophy },
  { key: "resume", label: "Resume Section", desc: "Embedded resume preview, highlights, and direct PDF download button", icon: FileText },
  { key: "testimonials", label: "Testimonials", desc: "Recommendations and peer feedback quotes (only visible if items exist)", icon: MessageSquareQuote },
];

export default function SectionVisibilityManager({
  initialVisibility,
}: SectionVisibilityManagerProps) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(initialVisibility);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const { showSuccess, showError } = useAdminToast();

  const handleToggle = async (key: string) => {
    const nextVal = !(visibility[key] !== false);
    setUpdatingKey(key);

    try {
      const res = await updateSectionVisibilityAction(key, nextVal);
      if (res.success) {
        setVisibility((prev) => ({ ...prev, [key]: nextVal }));
        showSuccess(`"${key}" section is now ${nextVal ? "visible" : "hidden"}.`);
      } else {
        showError(res.error || "Failed to update visibility.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update.";
      showError(message);
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white">Homepage Section Controls</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Toggling a section off hides both its content and its link in the navigation menu.
        </p>
      </div>

      <div className="space-y-3">
        {sectionConfigs.map((sec) => {
          const Icon = sec.icon;
          const isVisible = visibility[sec.key] !== false;
          const isPending = updatingKey === sec.key;

          return (
            <div
              key={sec.key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isVisible
                  ? "bg-slate-900/80 border-slate-800"
                  : "bg-slate-950/40 border-slate-800/40 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isVisible
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {sec.label}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                        isVisible
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isVisible ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{sec.desc}</p>
                </div>
              </div>

              <div className="ml-4 shrink-0 flex items-center gap-2">
                {isPending && <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />}
                <button
                  type="button"
                  role="switch"
                  aria-checked={isVisible}
                  disabled={isPending}
                  onClick={() => handleToggle(sec.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
                    isVisible ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isVisible ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
