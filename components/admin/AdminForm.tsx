"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2, Upload, Plus, X, Check, AlertCircle } from "lucide-react";
import { useAdminToast } from "./AdminToast";
import { uploadMediaAction } from "@/lib/actions/admin";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "switch"
  | "chips"
  | "image"
  | "url";

export interface FormFieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  rows?: number;
}

interface AdminFormProps {
  title?: string;
  description?: string;
  fields: FormFieldDef[];
  initialValues?: Record<string, unknown>;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminForm({
  title,
  description,
  fields,
  initialValues = {},
  submitLabel = "Save Changes",
  onCancel,
  onSubmit,
}: AdminFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const field of fields) {
      if (initialValues[field.name] !== undefined) {
        initial[field.name] = initialValues[field.name];
      } else {
        if (field.type === "switch") initial[field.name] = true;
        else if (field.type === "chips") initial[field.name] = [];
        else if (field.type === "number") initial[field.name] = 0;
        else initial[field.name] = "";
      }
    }
    return initial;
  });

  const [chipInputs, setChipInputs] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { showSuccess, showError } = useAdminToast();

  const handleChange = (name: string, val: unknown) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleAddChip = (fieldName: string) => {
    const raw = chipInputs[fieldName]?.trim();
    if (!raw) return;
    const current = Array.isArray(values[fieldName]) ? values[fieldName] : [];
    if (!current.includes(raw)) {
      setValues((prev) => ({ ...prev, [fieldName]: [...current, raw] }));
    }
    setChipInputs((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleRemoveChip = (fieldName: string, chipToRemove: string) => {
    const current = Array.isArray(values[fieldName]) ? values[fieldName] : [];
    setValues((prev) => ({
      ...prev,
      [fieldName]: current.filter((c: string) => c !== chipToRemove),
    }));
  };

  const handleImageUpload = async (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showError("Image must be smaller than 2 MB.");
      return;
    }

    setUploadingField(fieldName);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "images");

      const res = await uploadMediaAction(fd);
      if (res.success && res.url) {
        handleChange(fieldName, res.url);
        showSuccess("Image uploaded successfully!");
      } else {
        showError(res.error || "Failed to upload image.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload error.";
      showError(message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await onSubmit(values);
      if (res.success) {
        showSuccess("Saved successfully!");
        if (onCancel) onCancel();
      } else {
        setFormError(res.error || "Failed to save.");
        showError(res.error || "Failed to save.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormError(message);
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl backdrop-blur-md shadow-xl text-slate-100 font-[family-name:var(--font-sans)]"
      style={{
        background: "#0B1220",
        border: "1px solid #2A3140",
      }}
    >
      {(title || description) && (
        <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #2A3140" }}>
          {title && <h2 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">{title}</h2>}
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      )}

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-5">
        {fields.map((field) => {
          const val = values[field.name];

          if (field.type === "switch") {
            const isChecked = Boolean(val);
            return (
              <div
                key={field.name}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800/80"
              >
                <div>
                  <span className="text-sm font-medium text-slate-200 block">
                    {field.label}
                  </span>
                  {field.description && (
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {field.description}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isChecked}
                  onClick={() => handleChange(field.name, !isChecked)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isChecked ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isChecked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          }

          if (field.type === "image") {
            return (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <div className="flex items-start gap-4">
                  {typeof val === "string" && val ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      <Image
                        src={val}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleChange(field.name, "")}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-slate-300 hover:text-white"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 text-xs shrink-0">
                      <span>No image</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={typeof val === "string" ? val : ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder="Paste image URL or upload below..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white cursor-pointer transition-colors">
                      {uploadingField === field.name ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                          <span>Uploading (max 2MB)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-slate-400" />
                          <span>Upload File (JPG, PNG, WebP)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploadingField === field.name}
                        onChange={(e) => handleImageUpload(field.name, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          }

          if (field.type === "chips") {
            const list: string[] = Array.isArray(val) ? val : [];
            const inputVal = chipInputs[field.name] || "";
            return (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                {field.description && (
                  <p className="text-xs text-slate-400">{field.description}</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputVal}
                    placeholder={field.placeholder || "Type and press Add..."}
                    onChange={(e) =>
                      setChipInputs((prev) => ({ ...prev, [field.name]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddChip(field.name);
                      }
                    }}
                    className="flex-1 px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddChip(field.name)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {list.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs"
                    >
                      {chip}
                      <button
                        type="button"
                        onClick={() => handleRemoveChip(field.name, chip)}
                        aria-label={`Remove ${chip}`}
                        className="hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {list.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No items added yet</span>
                  )}
                </div>
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">
                  {field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>
                <select
                  value={String(val ?? "")}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  style={{
                    background: "#050A14",
                    border: "1px solid #2A3140",
                  }}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">
                  {field.label} {field.required && <span className="text-rose-400">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-slate-400">{field.description}</p>
                )}
                <textarea
                  rows={field.rows || 4}
                  value={String(val ?? "")}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-y"
                  style={{
                    background: "#050A14",
                    border: "1px solid #2A3140",
                  }}
                />
              </div>
            );
          }

          // Default text / number / url
          return (
            <div key={field.name} className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                {field.label} {field.required && <span className="text-rose-400">*</span>}
              </label>
              {field.description && (
                <p className="text-xs text-slate-400">{field.description}</p>
              )}
              <input
                type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                value={String(val ?? "")}
                placeholder={field.placeholder}
                required={field.required}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    field.type === "number" ? Number(e.target.value) : e.target.value
                  )
                }
                className="w-full px-3.5 py-2 text-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
                style={{
                  background: "#050A14",
                  border: "1px solid #2A3140",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 flex items-center justify-end gap-3" style={{ borderTop: "1px solid #2A3140" }}>
        {onCancel && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            style={{
              background: "rgba(5, 10, 20, 0.6)",
              border: "1px solid #2A3140",
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium rounded-xl text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
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
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
