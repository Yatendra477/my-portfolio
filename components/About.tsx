"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Code2,
  Brain,
  Eye,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import AnimatedCounter from "./AnimatedCounter";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { SiteSettings, AboutHighlight, AboutStat, SkillCategory } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Lightbulb,
  Code2,
  Brain,
  Eye,
  Users,
  TrendingUp,
};

interface AboutProps {
  settings: SiteSettings;
  highlights: AboutHighlight[];
  stats: AboutStat[];
  skillCategories: SkillCategory[];
}

export default function About({ settings, highlights, stats, skillCategories }: AboutProps) {
  const uniqueSkillsCount = new Set(
    skillCategories.flatMap((category) => category.skills.map((s) => s.name))
  ).size;

  const aboutStats = stats
    .map((s) => {
      // Dynamically update Technologies Learned if we have skill data
      if (s.label === "Technologies Learned" && uniqueSkillsCount > 0) {
        return { ...s, value: uniqueSkillsCount };
      }
      return s;
    })
    .filter((s) => s.value > 0);

  return (
    <div
      className="section"
      style={{ background: "#FFFFFF" }}
    >
      <div className="section-container">
        <SectionHeading
          title="About"
          highlight="Me"
          subtitle="A passionate engineer building the future with code and creativity"
        />

        {/* ── Top Bio Block: Image on Left + Overlapping #F3F4F6 Card ── */}
        <motion.div
          className="relative flex flex-col md:flex-row items-center justify-center mb-16 lg:mb-20 max-w-5xl mx-auto"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Left Column: Portrait Photo */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] lg:max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white shrink-0 z-0 bg-slate-100">
            <Image
              src="/images/profile-v2.png"
              alt={settings.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 380px"
            />
          </div>

          {/* Right Column: Overlapping #F3F4F6 Rounded Card */}
          <div
            className="w-full md:max-w-xl lg:max-w-2xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg relative md:-ml-10 lg:-ml-14 z-10 mt-6 md:mt-0"
            style={{
              background: "#F3F4F6",
              border: "1px solid #D1D5DB",
            }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-2">
              Introduction
            </span>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-[family-name:var(--font-display)] tracking-tight"
              style={{ color: "#1B1F3B" }}
            >
              About Me
            </h3>

            <p
              className="text-base sm:text-lg leading-relaxed mb-4"
              style={{ color: "#4A5568" }}
            >
              I&apos;m{" "}
              <strong style={{ color: "#1B1F3B" }}>{settings.name}</strong>,{" "}
              a {settings.statusText}{" "}specializing in Robotics &amp; Automation at Medicaps
              University, Indore.
            </p>

            <p
              className="text-sm sm:text-base leading-relaxed mb-6"
              style={{ color: "#4A5568" }}
            >
              My passion lies at the intersection of{" "}
              <strong className="font-semibold" style={{ color: "#1B1F3B" }}>
                machine learning
              </strong>
              ,{" "}
              <strong className="font-semibold" style={{ color: "#1B1F3B" }}>
                artificial intelligence
              </strong>
              , and{" "}
              <strong className="font-semibold" style={{ color: "#1B1F3B" }}>
                computer vision
              </strong>
              . I love transforming complex problems into elegant, efficient solutions
              that make a real-world impact.
            </p>

            {/* Dark "Learn More" button (scrolls to Experience) */}
            <a
              href="#experience"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline"
              style={{
                background: "#1B1F3B",
              }}
            >
              Learn More <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

        {/* ── 6 Highlights: 3×2 Grid of Small Cards (1 Col on Mobile) ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {highlights.map((item, index) => {
            const IconComp = iconMap[item.icon];
            return (
              <motion.div
                key={index}
                className="p-6 rounded-2xl group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{
                  background: "#F3F4F6",
                  border: "1px solid #D1D5DB",
                }}
                variants={fadeUpVariant}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 shadow-xs transition-colors duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #D1D5DB",
                    color: "var(--navy)",
                  }}
                >
                  {IconComp && <IconComp size={22} />}
                </div>
                <h4
                  className="text-base sm:text-lg font-bold mb-1.5"
                  style={{ color: "#1B1F3B" }}
                >
                  {item.title}
                </h4>
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

        {/* ── Stats Row using Fixed AnimatedCounter ── */}
        <motion.div
          className="rounded-3xl p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto shadow-sm"
          style={{
            background: "#F3F4F6",
            border: "1px solid #D1D5DB",
          }}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 items-center">
            {aboutStats.map((stat, i) => {
              const isLastAloneOnMobile =
                aboutStats.length % 2 === 1 && i === aboutStats.length - 1;
              return (
                <div
                  key={stat.label}
                  className={
                    isLastAloneOnMobile
                      ? "col-span-2 justify-self-center w-full max-w-[200px] md:col-span-1 md:w-auto"
                      : "w-full"
                  }
                >
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
