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

function SkillCard({
  skill,
  index,
}: {
  skill: { name: string; level: number; icon: string; description?: string };
  index: number;
}) {
  const Icon = iconMap[skill.icon] ?? Code2;
  const label = levelLabel(skill.level);

  return (
    <motion.div
      variants={fadeUpVariant}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col gap-3 rounded-2xl p-5 cursor-default select-none transition-all duration-300 w-full sm:w-[260px] shrink-0 shadow-sm hover:shadow-md hover:-translate-y-1"
      style={{
        background: "#FFFFFF",
        border: "1px solid #D1D5DB",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#F3F4F6", border: "1px solid #E5E7EB" }}
        >
          <Icon size={20} className="text-[#4A5568]" />
        </div>
        <div className="min-w-0">
          <h4
            className="text-sm font-semibold truncate leading-tight"
            style={{ color: "#1B1F3B" }}
          >
            {skill.name}
          </h4>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 bg-slate-100 text-slate-700 border border-slate-200">
          {label}
        </span>
        <div
          className="h-1.5 flex-1 rounded-full overflow-hidden"
          style={{ background: "#E5E7EB" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#4A5568" }}
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
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
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    tabRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (active + 1) % skillCategories.length;
      setActive(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (active - 1 + skillCategories.length) % skillCategories.length;
      setActive(prev);
      tabRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
      tabRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = skillCategories.length - 1;
      setActive(last);
      tabRefs.current[last]?.focus();
    }
  }

  return (
    <section
      id="skills"
      aria-label="Technical Skills"
      style={{
        background: "linear-gradient(180deg, #F4F4F9 0%, #EDEDF5 100%)",
        borderTop: "1px solid #D1D5DB",
        borderBottom: "1px solid #D1D5DB",
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3 font-[family-name:var(--font-display)] tracking-tight"
            style={{ color: "#1B1F3B" }}
          >
            Technical Skills
          </h2>
          <p className="text-sm sm:text-base font-normal" style={{ color: "#6B7280" }}>
            Technologies and tools I work with
          </p>
        </motion.div>

        <motion.div
          role="tablist"
          aria-label="Skill categories"
          className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2.5 mb-10 overflow-x-auto snap-x no-scrollbar pb-2 md:pb-0 px-2"
          onKeyDown={onKeyDown}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((cat, i) => {
            const isActive = active === i;
            return (
              <button
                key={cat.name}
                id={`skills-tab-${i}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`skills-panel-${i}`}
                tabIndex={isActive ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                onClick={() => setActive(i)}
                className={`snap-start shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1B1F3B] ${
                  isActive
                    ? "bg-[#1B1F3B] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
                style={{
                  border: isActive ? "1px solid #1B1F3B" : "1px solid #D1D5DB",
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </motion.div>

        {skillCategories.map((cat, i) => (
          <div
            key={cat.name}
            id={`skills-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`skills-tab-${i}`}
            style={{ display: active === i ? "block" : "none" }}
          >
            <motion.div
              className="flex flex-wrap justify-center gap-4"
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
