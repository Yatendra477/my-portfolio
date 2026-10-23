"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Check, X, Plus } from "lucide-react";
import { useAdminToast } from "@/components/admin/AdminToast";
import { updateSiteSettingsAction, uploadMediaAction } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/data";

interface HeroSettingsFormProps {
  initialSettings: SiteSettings;
}

export default function HeroSettingsForm({ initialSettings }: HeroSettingsFormProps) {
  const { showSuccess, showError } = useAdminToast();

  const [name, setName] = useState(initialSettings.name || "");
  const [title, setTitle] = useState(initialSettings.title || "");
  const [heroDescription, setHeroDescription] = useState(initialSettings.heroDescription || "");
  const [availabilityText, setAvailabilityText] = useState(initialSettings.availabilityText || "Open to Work");
  const [statusText, setStatusText] = useState(initialSettings.statusText || "");
  const [profileImageUrl, setProfileImageUrl] = useState(initialSettings.profileImageUrl || "");
  const [heroStats, setHeroStats] = useState(
    initialSettings.heroStats?.length
      ? initialSettings.heroStats
      : [
          { icon: "Code2", label: "Projects Completed", value: "5+", highlight: true },
          { icon: "Award", label: "Certifications", value: "5+", highlight: false },
          { icon: "Sparkles", label: "Hackathons & Events", value: "3+", highlight: false },
        ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showError("Profile image must be less than 2 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "avatars");

      const res = await uploadMediaAction(fd);
      if (res.success && res.url) {
        setProfileImageUrl(res.url);
        showSuccess("Profile photo uploaded!");
      } else {
        showError(res.error || "Failed to upload image.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error.";
      showError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatChange = (index: number, key: string, val: string | boolean) => {
    setHeroStats((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };

  const handleAddStat = () => {
    setHeroStats((prev) => [
      ...prev,
      { icon: "Star", label: "New Stat", value: "10+", highlight: false },
    ]);
  };

  const handleRemoveStat = (index: number) => {
    setHeroStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await updateSiteSettingsAction({
        name,
        title,
        hero_description: heroDescription,
        availability_text: availabilityText,
        status_text: statusText,
        profile_image_url: profileImageUrl,
        hero_stats: heroStats,
      });

      if (res.success) {
        showSuccess("Hero profile updated successfully!");
      } else {
        showError(res.error || "Failed to update profile.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save.";
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image & Status Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-6">
        <h2 className="text-lg font-bold text-white">Profile Photo & Availability</h2>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt="Profile preview"
                fill
                className="object-cover"
                sizes="112px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                No Photo
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Profile Image URL (or upload)
              </label>
              <input
                type="text"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="/images/profile-cutout.png or https://..."
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white cursor-pointer transition-colors">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Uploading (max 2MB)...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload New Profile Photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploading}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Availability Badge Text
            </label>
            <input
              type="text"
              value={availabilityText}
              onChange={(e) => setAvailabilityText(e.target.value)}
              placeholder="e.g. Open to Work"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Sub-status Text (Banner)
            </label>
            <input
              type="text"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="e.g. B.Tech CSE '27 • Available for Internships"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        <h2 className="text-lg font-bold text-white">Hero Identity</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yatendra Verma"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Professional Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Python Developer & AI/ML Engineer"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Hero Introduction / Bio
          </label>
          <textarea
            rows={4}
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            placeholder="Introduce your focus, passion, and engineering background..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Hero Counter Stats</h2>
            <p className="text-xs text-slate-400">
              Quick statistics highlighted in the hero section cards
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddStat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stat</span>
          </button>
        </div>

        <div className="space-y-3">
          {heroStats.map((st, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800"
            >
              <div className="w-24">
                <label className="block text-[10px] text-slate-400 uppercase">Value</label>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => handleStatChange(i, "value", e.target.value)}
                  className="w-full px-2.5 py-1 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="flex-1">
                <label className="block text-[10px] text-slate-400 uppercase">Label</label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => handleStatChange(i, "label", e.target.value)}
                  className="w-full px-2.5 py-1 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveStat(i)}
                aria-label="Remove stat"
                className="p-2 text-slate-500 hover:text-rose-400 transition-colors mt-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Save Hero Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
