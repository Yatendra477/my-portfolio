"use client";

import React, { useState } from "react";
import { Edit2, Trash2, FolderPlus } from "lucide-react";
import AdminList from "@/components/admin/AdminList";
import { FormFieldDef } from "@/components/admin/AdminForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { saveRecordAction, deleteRecordAction, reorderTableAction } from "@/lib/actions/admin";

export interface SkillCategoryRow {
  id: string;
  name: string;
  sort_order?: number;
}

export interface SkillRow {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  level?: number;
  icon?: string;
  sort_order?: number;
}

interface SkillsManagerProps {
  initialCategories: SkillCategoryRow[];
  initialSkills: SkillRow[];
}

const skillFields: FormFieldDef[] = [
  { name: "name", label: "Skill Name", type: "text", required: true, placeholder: "e.g. Python" },
  { name: "description", label: "Short Description / Focus", type: "text", placeholder: "e.g. Core language for ML and backend APIs" },
  { name: "level", label: "Proficiency Level (0 - 100)", type: "number", required: true, placeholder: "90" },
  { name: "icon", label: "Icon Name (Lucide or tech name)", type: "text", placeholder: "Code2, Database, Brain, Cpu, etc." },
];

export default function SkillsManager({
  initialCategories,
  initialSkills,
}: SkillsManagerProps) {
  const [categories, setCategories] = useState<SkillCategoryRow[]>(initialCategories);
  const [skills, setSkills] = useState<SkillRow[]>(initialSkills);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    initialCategories[0]?.id || ""
  );

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [editingCategory, setEditingCategory] = useState<SkillCategoryRow | null>(null);

  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [isDeletingCat, setIsDeletingCat] = useState(false);

  const { showSuccess, showError } = useAdminToast();

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];
  const activeSkills = skills.filter((s) => s.category_id === activeCategory?.id);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;

    try {
      const res = await saveRecordAction(
        "skill_categories",
        { name: categoryNameInput.trim() },
        editingCategory?.id
      );

      if (res.success) {
        if (editingCategory) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id ? { ...c, name: categoryNameInput.trim() } : c
            )
          );
          showSuccess("Category renamed!");
        } else {
          const newId = crypto.randomUUID();
          setCategories((prev) => [...prev, { id: newId, name: categoryNameInput.trim() }]);
          setActiveCategoryId(newId);
          showSuccess("Category added!");
        }
        setCategoryNameInput("");
        setIsAddingCategory(false);
        setEditingCategory(null);
      } else {
        showError(res.error || "Failed to save category.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save.";
      showError(message);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCatId) return;
    setIsDeletingCat(true);
    try {
      const res = await deleteRecordAction("skill_categories", deletingCatId);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deletingCatId));
        setSkills((prev) => prev.filter((s) => s.category_id !== deletingCatId));
        showSuccess("Category and its skills deleted.");
        setDeletingCatId(null);
        if (activeCategoryId === deletingCatId) {
          const remaining = categories.filter((c) => c.id !== deletingCatId);
          if (remaining.length > 0) setActiveCategoryId(remaining[0].id);
        }
      } else {
        showError(res.error || "Failed to delete category.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete category.";
      showError(message);
    } finally {
      setIsDeletingCat(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs & Selector */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Skill Categories</h2>
            <p className="text-xs text-slate-400">
              Select a category to view and edit its skills, or create a new category.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setCategoryNameInput("");
              setIsAddingCategory(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-900/30 transition-all self-start sm:self-auto"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
        </div>

        {/* Add / Edit Category Dialog */}
        {(isAddingCategory || editingCategory) && (
          <form
            onSubmit={handleSaveCategory}
            className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center gap-3 animate-in fade-in"
          >
            <input
              type="text"
              required
              autoFocus
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="e.g. Cloud & DevOps"
              className="flex-1 px-3.5 py-2 text-sm rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
            >
              {editingCategory ? "Update Name" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCategory(false);
                setEditingCategory(null);
                setCategoryNameInput("");
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Category Pill Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = cat.id === activeCategoryId;
            return (
              <div
                key={cat.id}
                className={`inline-flex items-center rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950"
                    : "bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className="px-3.5 py-2 cursor-pointer"
                >
                  {cat.name}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(cat);
                    setCategoryNameInput(cat.name);
                  }}
                  title="Rename category"
                  aria-label={`Rename ${cat.name}`}
                  className="p-1.5 hover:text-white text-slate-400 hover:bg-black/20"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCatId(cat.id)}
                  title="Delete category"
                  aria-label={`Delete ${cat.name}`}
                  className="p-1.5 hover:text-rose-400 text-slate-400 hover:bg-black/20 mr-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {categories.length === 0 && (
            <p className="text-xs text-slate-500 italic">No categories created yet.</p>
          )}
        </div>
      </div>

      {/* Skills inside Active Category */}
      {activeCategory && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <AdminList
            title={`Skills in "${activeCategory.name}"`}
            description={`Manage technical proficiencies and description tags for ${activeCategory.name}.`}
            items={activeSkills}
            newItemLabel={`Add Skill to ${activeCategory.name}`}
            formFields={skillFields}
            renderItemSummary={(item) => ({
              title: item.name || "Skill",
              subtitle: item.description,
              badge: `${item.level ?? 80}%`,
              badges: [
                {
                  text: `${item.level ?? 80}% Proficiency`,
                  color: "indigo",
                },
              ],
            })}
            onSave={async (values, id) => {
              const payload = {
                ...values,
                category_id: activeCategory.id,
              };
              const res = await saveRecordAction("skills", payload, id);
              if (res.success) {
                if (id) {
                  setSkills((prev) =>
                    prev.map((s) =>
                      s.id === id ? ({ ...s, ...payload } as unknown as SkillRow) : s
                    )
                  );
                } else {
                  setSkills((prev) => [
                    ...prev,
                    { id: crypto.randomUUID(), ...payload } as unknown as SkillRow,
                  ]);
                }
              }
              return res;
            }}
            onDelete={async (id) => {
              const res = await deleteRecordAction("skills", id);
              if (res.success) {
                setSkills((prev) => prev.filter((s) => s.id !== id));
              }
              return res;
            }}
            onReorder={async (orderedIds) => {
              const res = await reorderTableAction("skills", orderedIds);
              if (res.success) {
                const sorted = [...skills].sort(
                  (a, b) => orderedIds.indexOf(a.id) - orderedIds.indexOf(b.id)
                );
                setSkills(sorted);
              }
              return res;
            }}
          />
        </div>
      )}

      {/* Delete Category Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCatId)}
        title="Delete Category"
        message="Are you sure you want to delete this category? All skills inside it will also be deleted."
        isDestructive={true}
        isLoading={isDeletingCat}
        onConfirm={confirmDeleteCategory}
        onCancel={() => setDeletingCatId(null)}
      />
    </div>
  );
}
