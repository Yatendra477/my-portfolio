"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Image from "next/image";
import { ExternalLink, Star, Clock } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Project } from "@/lib/data";

const categories = ["All", "AI/CV", "Web", "Automation"];

// Render/Hugging Face links need the wake-up note
function needsWakeNote(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("onrender.com") || url.includes("huggingface.co/spaces");
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() =>
    projects.filter((p) =>
      activeCategory === "All" || p.category === activeCategory
    ), [activeCategory, projects]);

  return (
    <section id="projects" className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header row: heading on left, filter pills on right */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div>
            <SectionHeading
              title="Featured"
              highlight="Projects"
              subtitle="Showcasing my best work and technical capabilities"
              align="left"
            />
          </div>

          {/* Filter pills */}
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2 md:shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 border-0
                           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A5568]"
                style={{
                  background: activeCategory === cat
                    ? "linear-gradient(135deg, var(--slate-accent), var(--slate-accent-hover))"
                    : "var(--glass-bg)",
                  color: activeCategory === cat ? "white" : "var(--text-secondary)",
                  border: activeCategory === cat
                    ? "1px solid var(--slate-accent)"
                    : "1px solid var(--glass-border)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, projectIdx) => (
              <motion.article
                key={project.title}
                aria-label={project.title}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md lg:max-w-none flex flex-col glass-card overflow-hidden group"
                variants={fadeUpVariant}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Project Image */}
                <div
                  className="relative aspect-video w-full overflow-hidden rounded-t-[20px]"
                  style={{ background: "var(--bg-tertiary)" }}
                >
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      loading={projectIdx === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl opacity-30">
                        {project.category === "AI/CV" ? "🤖" : project.category === "Web" ? "🌐" : "⚡"}
                      </div>
                    </div>
                  )}

                  {/* Top badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    {/* Platform badge */}
                    {project.demoUrl?.includes("huggingface.co/spaces") ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-200 bg-[rgba(15,23,42,0.85)] border border-slate-600/40 backdrop-blur-md shadow-sm shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" />
                        Hugging Face
                      </div>
                    ) : project.demoUrl?.includes("onrender.com") ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-200 bg-[rgba(15,23,42,0.85)] border border-slate-600/40 backdrop-blur-md shadow-sm shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Render
                      </div>
                    ) : (
                      <span />
                    )}

                    {project.isFeatured && (
                      <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0"
                        style={{
                          background: "linear-gradient(135deg, var(--navy), var(--slate-accent))",
                          color: "white",
                          boxShadow: "0 2px 10px rgba(27,31,59,0.25)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <Star size={11} /> Featured
                      </div>
                    )}
                  </div>

                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(10,25,47,0.8), transparent)" }}
                  />
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category chip */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(74,85,104,0.1)", color: "var(--slate-accent)" }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold mb-2 group-hover:text-[var(--slate-accent)] transition-colors"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {project.title}
                  </h3>

                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
                    {project.description}
                  </p>

                  {/* Feature bullets */}
                  <ul className="space-y-1 mb-4">
                    {(project.bullets ?? []).slice(0, 3).map((f, i) => (
                      <li key={i} className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--slate-accent)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.tech ?? []).map((tech) => (
                      <span key={tech} className="tech-tag text-xs">{tech}</span>
                    ))}
                  </div>

                  {/* Wake-up note for Render / Hugging Face */}
                  {needsWakeNote(project.demoUrl) && (
                    <p className="flex items-center gap-1.5 text-[11px] mb-3" style={{ color: "#9ca3af" }}>
                      <Clock size={11} className="shrink-0" />
                      May take ~1 min to wake up
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="mt-auto pt-4 flex items-center gap-2.5 w-full">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="flex-1 h-9 px-3 rounded-lg border border-[rgba(27,31,59,0.35)] text-xs font-semibold text-[#1B1F3B] hover:bg-[rgba(27,31,59,0.06)] flex items-center justify-center gap-1.5 transition-colors no-underline whitespace-nowrap"
                      >
                        <GithubIcon width={14} height={14} /> GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Launch ${project.title}`}
                        className="flex-1 h-9 px-3 rounded-lg bg-[#4A5568] hover:bg-[#2D3748] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors no-underline shadow-sm whitespace-nowrap"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {!project.githubUrl && !project.demoUrl && (
                      <span className="w-full h-9 px-3 rounded-lg border border-dashed border-[rgba(27,31,59,0.25)] text-xs font-medium text-[var(--text-secondary)] flex items-center justify-center gap-1.5 select-none bg-[rgba(27,31,59,0.02)]">
                        Showcase Project
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.p
            className="text-center py-12 text-sm"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects found for this category.
          </motion.p>
        )}
      </div>
    </section>
  );
}
