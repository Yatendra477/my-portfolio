"use client";

import { motion } from "framer-motion";
import { Code2, Trophy, Award, GitBranch } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Achievement } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2,
  Trophy,
  Award,
  GitBranch,
};

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <section
      id="achievements"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Key"
          highlight="Achievements"
          subtitle="Milestones and accomplishments along the way"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {achievements.map((ach, index) => {
            const IconComp = iconMap[ach.icon] || Award;
            return (
              <motion.div
                key={index}
                className="rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "#F3F4F6",
                  border: "1px solid #D1D5DB",
                }}
                variants={fadeUpVariant}
              >
                {/* Icon box */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(209, 213, 219, 0.8)",
                    color: "#1B1F3B",
                  }}
                >
                  <IconComp size={24} className="text-[#1B1F3B]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mb-2"
                    style={{
                      background: "rgba(74, 85, 104, 0.1)",
                      color: "#4A5568",
                      border: "1px solid rgba(74, 85, 104, 0.15)",
                    }}
                  >
                    {ach.category}
                  </span>

                  <h3
                    className="text-base sm:text-lg font-bold mb-1.5 font-[family-name:var(--font-display)] leading-snug group-hover:text-[#4A5568] transition-colors"
                    style={{ color: "#1B1F3B" }}
                  >
                    {ach.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#4A5568" }}
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
