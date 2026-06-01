"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Search,
  Star,
  Calendar,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { projects } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";

const categories = ["All", "AI/CV", "Web", "Automation"];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      id="projects"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="Featured"
          highlight="Projects"
          subtitle="Showcasing my best work and technical capabilities"
        />

        {/* Controls */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all border-0"
                style={{
                  background:
                    activeCategory === cat
                      ? "linear-gradient(135deg, var(--color-electric-500), var(--color-electric-600))"
                      : "var(--glass-bg)",
                  color:
                    activeCategory === cat ? "white" : "var(--text-secondary)",
                  border:
                    activeCategory === cat
                      ? "1px solid var(--color-electric-500)"
                      : "1px solid var(--glass-border)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div
            className="relative w-full sm:w-64"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                className="glass-card overflow-hidden group"
                variants={fadeUpVariant}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {/* Project Image */}
                <div
                  className="relative h-48 overflow-hidden rounded-t-[20px]"
                  style={{ background: "var(--bg-tertiary)" }}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl opacity-30">
                        {project.category === "AI/CV" ? "🤖" : project.category === "Web" ? "🌐" : "⚡"}
                      </div>
                    </div>
                  )}

                  {/* Featured badge */}
                  {project.featured && (
                    <div
                      className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(59,130,246,0.9)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Star size={11} /> Featured
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,25,47,0.8), transparent)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        color: "var(--color-electric-400)",
                      }}
                    >
                      {project.category}
                    </span>
                    {project.date && (
                      <span
                        className="text-xs flex items-center gap-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Calendar size={11} />
                        {project.date}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-bold mb-2 group-hover:text-[var(--color-electric-400)] transition-colors"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed mb-4 line-clamp-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1 mb-4">
                    {project.features.slice(0, 3).map((f, i) => (
                      <li
                        key={i}
                        className="text-xs flex items-center gap-1.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ background: "var(--color-emerald-400)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-2 px-4 flex-1 justify-center"
                      >
                        <GithubIcon width={14} height={14} /> GitHub
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-2 px-4 flex-1 justify-center"
                      >
                        <ExternalLink size={14} /> Launch App
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
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
            No projects found matching your criteria.
          </motion.p>
        )}
      </div>
    </section>
  );
}
