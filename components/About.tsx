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

        {/* ── Top Bio Block: Non-overlapping Two-Column Grid ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 md:gap-8 lg:gap-12 items-stretch mb-16 lg:mb-20 max-w-5xl mx-auto"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Left Card: Cutout in Lavender Gradient Card */}
          <div
            className="relative rounded-3xl overflow-hidden flex items-end justify-center h-[clamp(320px,55svh,440px)] lg:h-auto lg:min-h-[420px]"
            style={{
              background: "linear-gradient(135deg, #EDEDF5 0%, #D8DAE9 45%, #C9CBD8 100%)",
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
              boxShadow:
                "0 20px 60px -12px rgba(27, 31, 59, 0.14), 0 4px 20px rgba(27, 31, 59, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8) inset",
            }}
          >
            {/* Soft radial glow behind cutout */}
            <div
              aria-hidden="true"
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "80%",
                aspectRatio: "1",
                bottom: "0%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            {/* Cutout image container: ~85% of card height, bottom-aligned and centred */}
            <div className="relative w-full h-[85%] flex items-end justify-center z-10">
              <Image
                src="/images/profile-cutout.png"
                alt={settings.name}
                width={1303}
                height={1207}
                priority
                className="h-full w-auto object-contain object-bottom select-none drop-shadow-xl"
                style={{
                  maxWidth: "100%",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Right Card: Vertically Centred Content */}
          <div
            className="rounded-3xl p-8 lg:p-10 flex flex-col justify-center"
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
              a {settings.statusText} specializing in Robotics &amp; Automation at Medicaps
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

            <div>
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
