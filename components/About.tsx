"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Code2,
  Brain,
  Eye,
  Users,
  TrendingUp,
} from "lucide-react";
import { aboutHighlights, stats, personalInfo } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import AnimatedCounter from "./AnimatedCounter";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Lightbulb,
  Code2,
  Brain,
  Eye,
  Users,
  TrendingUp,
};

export default function About() {
  return (
    <section
      id="about"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="About"
          highlight="Me"
          subtitle="A passionate engineer building the future with code and creativity"
        />

        {/* Bio */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            I&apos;m <strong style={{ color: "var(--text-heading)" }}>{personalInfo.fullName}</strong>,
            a B.Tech student specializing in Robotics &amp; Automation at
            Medicaps University, Indore. My passion lies at the intersection of
            <strong style={{ color: "var(--color-electric-400)" }}> machine learning</strong>,{" "}
            <strong style={{ color: "var(--color-cyan-400)" }}>artificial intelligence</strong>, and{" "}
            <strong style={{ color: "var(--color-emerald-400)" }}>computer vision</strong>. I love
            transforming complex problems into elegant, efficient solutions that make
            a real-world impact.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {aboutHighlights.map((item, index) => {
            const IconComp = iconMap[item.icon];
            return (
              <motion.div
                key={index}
                className="glass-card p-6 group cursor-default"
                variants={fadeUpVariant}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    color: "var(--color-electric-400)",
                  }}
                >
                  {IconComp && <IconComp size={24} />}
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-heading)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="glass-card p-8 md:p-12"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((stat, i) => (
              <AnimatedCounter
                key={i}
                target={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
