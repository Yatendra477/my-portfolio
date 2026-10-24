"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-2xl text-slate-100 animate-in zoom-in-95 font-[family-name:var(--font-sans)]"
        style={{
          background: "#0B1220",
          border: "1px solid #2A3140",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2.5 rounded-xl ${
              isDestructive
                ? "bg-rose-500/10 text-rose-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 id="confirm-dialog-title" className="text-lg font-semibold text-white font-[family-name:var(--font-display)]">
            {title}
          </h3>
        </div>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-xl text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            style={{
              background: "rgba(5, 10, 20, 0.6)",
              border: "1px solid #2A3140",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-xl text-white transition-colors disabled:opacity-50 flex items-center gap-2 ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/30"
                : "bg-[#4A5568] hover:bg-[#2D3748] shadow-md"
            }`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
