"use client";

import React, { useState } from "react";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Search,
} from "lucide-react";
import AdminForm, { FormFieldDef } from "./AdminForm";
import ConfirmDialog from "./ConfirmDialog";
import { useAdminToast } from "./AdminToast";

export interface AdminListItem {
  id: string;
  sort_order?: number;
  is_visible?: boolean;
  is_featured?: boolean;
}

interface AdminListProps<T extends AdminListItem> {
  title: string;
  description?: string;
  items: T[];
  newItemLabel?: string;
  formFields: FormFieldDef[];
  searchKeys?: (keyof T)[];
  renderItemSummary: (item: T) => {
    title: string;
    subtitle?: string;
    badge?: string;
    badges?: Array<{ text: string; color?: "default" | "success" | "warning" | "indigo" }>;
  };
  onSave: (values: Record<string, unknown>, id?: string) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onReorder?: (orderedIds: string[]) => Promise<{ success: boolean; error?: string }>;
  onToggleVisibility?: (id: string, isVisible: boolean) => Promise<{ success: boolean; error?: string }>;
  onToggleFeatured?: (id: string, isFeatured: boolean) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminList<T extends AdminListItem>({
  title,
  description,
  items,
  newItemLabel = "Add Item",
  formFields,
  searchKeys = [],
  renderItemSummary,
  onSave,
  onDelete,
  onReorder,
  onToggleVisibility,
  onToggleFeatured,
}: AdminListProps<T>) {
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showSuccess, showError } = useAdminToast();

  // Filter items
  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    if (searchKeys.length > 0) {
      return searchKeys.some((k) => {
        const val = item[k];
        return typeof val === "string" && val.toLowerCase().includes(q);
      });
    }
    const summary = renderItemSummary(item);
    return (
      summary.title.toLowerCase().includes(q) ||
      (summary.subtitle && summary.subtitle.toLowerCase().includes(q))
    );
  });

  // Reorder handlers
  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!onReorder) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const orderedIds = newItems.map((it) => it.id);
    const res = await onReorder(orderedIds);
    if (res.success) {
      showSuccess("Order updated!");
    } else {
      showError(res.error || "Failed to reorder items.");
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (item: T) => {
    if (!onToggleVisibility) return;
    const current = item.is_visible !== false;
    const res = await onToggleVisibility(item.id, !current);
    if (res.success) {
      showSuccess(current ? "Hidden from public site." : "Visible on public site.");
    } else {
      showError(res.error || "Failed to update visibility.");
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (item: T) => {
    if (!onToggleFeatured) return;
    const current = Boolean(item.is_featured);
    const res = await onToggleFeatured(item.id, !current);
    if (res.success) {
      showSuccess(current ? "Unmarked from featured." : "Marked as featured!");
    } else {
      showError(res.error || "Failed to update featured state.");
    }
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await onDelete(deletingId);
      if (res.success) {
        showSuccess("Item deleted successfully.");
        setDeletingId(null);
      } else {
        showError(res.error || "Failed to delete item.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete.";
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-[family-name:var(--font-display)]">{title}</h2>
          {description && <p className="text-sm text-slate-400 mt-1 font-[family-name:var(--font-sans)]">{description}</p>}
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-md transition-all self-start sm:self-auto font-[family-name:var(--font-sans)]"
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
          <Plus className="w-4 h-4" />
          <span>{newItemLabel}</span>
        </button>
      </div>

      {/* Search box if > 3 items */}
      {items.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 font-[family-name:var(--font-sans)]"
            style={{
              background: "#0B1220",
              border: "1px solid #2A3140",
            }}
          />
        </div>
      )}

      {/* Create / Edit Form Modal or Inline */}
      {(isCreating || editingItem) && (
        <div
          className="p-6 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2"
          style={{
            background: "#0B1220",
            border: "1px solid #2A3140",
          }}
        >
          <AdminForm
            title={editingItem ? "Edit Item" : newItemLabel}
            fields={formFields}
            initialValues={(editingItem as unknown as Record<string, unknown>) || {}}
            submitLabel={editingItem ? "Update Item" : "Create Item"}
            onCancel={() => {
              setIsCreating(false);
              setEditingItem(null);
            }}
            onSubmit={async (values) => {
              const res = await onSave(values, editingItem?.id);
              if (res.success) {
                setIsCreating(false);
                setEditingItem(null);
              }
              return res;
            }}
          />
        </div>
      )}

      {/* List items */}
      <div className="space-y-2.5">
        {filteredItems.map((item, idx) => {
          const summary = renderItemSummary(item);
          const isVisible = item.is_visible !== false;
          const isFeatured = Boolean(item.is_featured);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl transition-all gap-4"
              style={{
                background: "#0B1220",
                border: "1px solid #2A3140",
              }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Reorder controls */}
                {onReorder && (
                  <div className="flex flex-col gap-0.5 shrink-0 text-slate-500">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      aria-label="Move item up"
                      className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === filteredItems.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      aria-label="Move item down"
                      className="p-1 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Summary information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {summary.title}
                    </h3>
                    {summary.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-300 font-medium">
                        {summary.badge}
                      </span>
                    )}
                    {summary.badges?.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className={`px-2 py-0.5 text-xs rounded-md font-medium ${
                          b.color === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : b.color === "warning"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : b.color === "indigo"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {b.text}
                      </span>
                    ))}
                  </div>
                  {summary.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {summary.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {onToggleFeatured && (
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(item)}
                    title={isFeatured ? "Featured project" : "Mark featured"}
                    className={`p-2 rounded-lg transition-colors ${
                      isFeatured
                        ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFeatured ? "fill-amber-400" : ""}`} />
                  </button>
                )}

                {onToggleVisibility && (
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(item)}
                    title={isVisible ? "Visible on site" : "Hidden from site"}
                    className={`p-2 rounded-lg transition-colors ${
                      isVisible
                        ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingItem(item);
                  }}
                  title="Edit item"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingId(item.id)}
                  title="Delete item"
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            No entries found. Click <span className="text-white font-medium">&ldquo;{newItemLabel}&rdquo;</span> to add one.
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Item"
        message="Are you sure you want to permanently delete this item? This action cannot be undone."
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
