"use client";

import { motion } from "framer-motion";
import { Code2, Trophy, Award, GitBranch } from "lucide-react";
import { achievements } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Code2,
  Trophy,
  Award,
  GitBranch,
};

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="Key"
          highlight="Achievements"
          subtitle="Milestones and accomplishments along the way"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {achievements.map((ach, index) => {
            const IconComp = iconMap[ach.icon];
            return (
              <motion.div
                key={index}
                className="glass-card p-6 flex gap-4 items-start group"
                variants={fadeUpVariant}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,211,238,0.15))",
                    color: "var(--color-cyan-400)",
                  }}
                >
                  {IconComp && (
                    <IconComp size={24} />
                  )}
                </div>
                <div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      color: "var(--color-emerald-400)",
                    }}
                  >
                    {ach.category}
                  </span>
                  <h3
                    className="text-base font-bold mb-1"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {ach.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {ach.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
