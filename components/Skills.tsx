"use client";

import { useRef, useState, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Code2, Cpu, Globe, Palette, BarChart3, Zap, FlaskConical, Layers,
  Database, Leaf, Eye, Scan, Bot, Brain, Binary, GitBranch,
  FolderGit2, Laptop, CircuitBoard, Terminal,
} from "lucide-react";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { SkillCategory } from "@/lib/data";

type IconComp = React.ComponentType<{ size?: number; className?: string }>;
const iconMap: Record<string, IconComp> = {
  Code2, Cpu, Globe, Palette, BarChart3, Zap, FlaskConical, Layers,
  Database, Leaf, Eye, Scan, Bot, Brain, Binary, GitBranch,
  FolderGit2, Laptop, CircuitBoard, Terminal,
};

function levelLabel(level: number): string {
  if (level >= 85) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 55) return "Intermediate";
  return "Beginner";
}

function levelColor(level: number): string {
  if (level >= 85) return "#4ade80";
  if (level >= 70) return "#60a5fa";
  if (level >= 55) return "#f59e0b";
  return "#9ca3af";
}

function SkillCard({ skill, index }: { skill: { name: string; level: number; icon: string; description?: string }; index: number }) {
  const Icon = iconMap[skill.icon] ?? Code2;
  const label = levelLabel(skill.level);
  const color = levelColor(skill.level);

  return (
    <motion.div
      variants={fadeUpVariant}
      transition={{ delay: index * 0.06 }}
      className="group relative flex flex-col gap-3 rounded-2xl p-5 cursor-default select-none transition-all duration-300"
      style={{ background: "#0B1220", border: "1px solid #2A3140" }}
      whileHover={{ boxShadow: "0 0 24px 0 rgba(74,85,104,0.35)", borderColor: "#4A5568", y: -2 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(74,85,104,0.15)" }}>
          <Icon size={20} className="text-[#8b9ab3]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white truncate leading-tight">{skill.name}</h4>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0"
          style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}>
          {label}
        </span>
        <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "#1e2a3a" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.06 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface SkillsProps {
  skillCategories: SkillCategory[];
}

export default function Skills({ skillCategories }: SkillsProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (active + 1) % skillCategories.length;
      setActive(next); tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (active - 1 + skillCategories.length) % skillCategories.length;
      setActive(prev); tabRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault(); setActive(0); tabRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = skillCategories.length - 1;
      setActive(last); tabRefs.current[last]?.focus();
    }
  }

  return (
    <section id="skills" aria-label="Technical Skills" style={{ background: "#050A14", paddingTop: "5rem", paddingBottom: "5rem" }}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-12" variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Technical <span style={{ color: "#4A5568" }}>Skills</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "#6B7280" }}>Technologies and tools I work with</p>
        </motion.div>

        <motion.div
          role="tablist"
          aria-label="Skill categories"
          className="flex flex-nowrap sm:flex-wrap items-center sm:justify-center gap-2 mb-10 overflow-x-auto snap-x no-scrollbar pb-2 sm:pb-0"
          onKeyDown={onKeyDown}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((cat, i) => (
            <button
              key={cat.name}
              id={`skills-tab-${i}`}
              role="tab"
              aria-selected={active === i}
              aria-controls={`skills-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => setActive(i)}
              className="snap-start shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A5568]"
              style={{
                background: active === i ? "linear-gradient(135deg, #4A5568, #2D3748)" : "rgba(255,255,255,0.04)",
                color: active === i ? "#fff" : "#8b9ab3",
                border: active === i ? "1px solid #4A5568" : "1px solid #2A3140",
              }}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {skillCategories.map((cat, i) => (
          <div key={cat.name} id={`skills-panel-${i}`} role="tabpanel" aria-labelledby={`skills-tab-${i}`} style={{ display: active === i ? "block" : "none" }}>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {cat.skills.map((skill, idx) => (
                <SkillCard key={skill.name} skill={skill} index={idx} />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
