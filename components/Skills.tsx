"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { skillCategories } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import {
  fadeUpVariant,
  staggerContainer,
  progressBarVariant,
} from "@/lib/animations";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section
      id="skills"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="Technical"
          highlight="Skills"
          subtitle="Technologies and tools I work with"
        />

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((cat, i) => (
            <motion.button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all border-0 ${
                activeCategory === i ? "" : ""
              }`}
              style={{
                background:
                  activeCategory === i
                    ? "linear-gradient(135deg, var(--color-electric-500), var(--color-electric-600))"
                    : "var(--glass-bg)",
                color:
                  activeCategory === i ? "white" : "var(--text-secondary)",
                border:
                  activeCategory === i
                    ? "1px solid var(--color-electric-500)"
                    : "1px solid var(--glass-border)",
                boxShadow:
                  activeCategory === i
                    ? "0 4px 16px rgba(59,130,246,0.3)"
                    : "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          key={activeCategory}
        >
          {skillCategories[activeCategory].skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="glass-card p-5 group"
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.08 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{skill.icon}</span>
                  <h4
                    className="text-base font-semibold"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {skill.name}
                  </h4>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-electric-400)" }}
                >
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="skill-progress-track">
                <motion.div
                  className="skill-progress-fill"
                  variants={progressBarVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={skill.level}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
