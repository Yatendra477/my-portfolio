"use client";

import React, { useState } from "react";
import { FileText, Upload, ExternalLink, Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { uploadResumeAction } from "@/lib/actions/admin";
import { useAdminToast } from "@/components/admin/AdminToast";

interface ResumeUploadCardProps {
  currentResumeUrl: string;
  currentUpdatedAt: string;
}

export default function ResumeUploadCard({
  currentResumeUrl,
  currentUpdatedAt,
}: ResumeUploadCardProps) {
  const [resumeUrl, setResumeUrl] = useState(currentResumeUrl);
  const [updatedAt, setUpdatedAt] = useState(currentUpdatedAt);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useAdminToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setError("Please select a PDF file (.pdf).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please choose a PDF file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await uploadResumeAction(formData);
      if (res.success && res.url) {
        setResumeUrl(res.url);
        if (res.updatedAt) setUpdatedAt(res.updatedAt);
        setSelectedFile(null);
        showSuccess("New resume uploaded! Live site updated.");
      } else {
        setError(res.error || "Failed to upload resume.");
        showError(res.error || "Failed to upload resume.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error.";
      setError(message);
      showError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-[family-name:var(--font-sans)]">
      {/* Current File Status */}
      <div
        className="p-6 rounded-2xl shadow-xl backdrop-blur-md"
        style={{
          background: "#0B1220",
          border: "1px solid #2A3140",
        }}
      >
        <h2 className="text-base font-semibold text-white mb-4 font-[family-name:var(--font-display)]">Current Active Resume</h2>

        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl gap-4"
          style={{
            background: "#050A14",
            border: "1px solid #2A3140",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Yatendra Verma — Resume.pdf</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Last updated: <strong className="text-slate-300 font-medium">{updatedAt}</strong></span>
              </div>
            </div>
          </div>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors self-start sm:self-auto"
            style={{
              background: "#4A5568",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#2D3748";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#4A5568";
            }}
          >
            <span>View / Download Current File</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
          </a>
        </div>
      </div>

      {/* Upload New File */}
      <form
        onSubmit={handleUpload}
        className="p-6 rounded-2xl shadow-xl backdrop-blur-md space-y-5"
        style={{
          background: "#0B1220",
          border: "1px solid #2A3140",
        }}
      >
        <div>
          <h2 className="text-base font-semibold text-white font-[family-name:var(--font-display)]">Upload New Version</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Maximum file size: 5 MB. PDF files only. Upon uploading, the &ldquo;Last updated&rdquo; date will automatically update to the current month &amp; year.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div
          className="border-2 border-dashed rounded-2xl p-8 text-center transition-colors"
          style={{
            background: "#050A14",
            borderColor: "#2A3140",
          }}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-200">
            {selectedFile ? selectedFile.name : "Choose a PDF file from your device"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "PDF up to 5 MB"}
          </p>

          <label
            className="inline-block mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white cursor-pointer transition-colors"
            style={{
              background: "#4A5568",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLLabelElement).style.background = "#2D3748";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLLabelElement).style.background = "#4A5568";
            }}
          >
            <span>Browse Files</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-40"
            style={{
              background: "#4A5568",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#2D3748";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#4A5568";
            }}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Uploading & Publishing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Publish New Resume</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
