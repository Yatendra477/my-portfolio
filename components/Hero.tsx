"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Download,
  MessageCircle,
  Briefcase,
  Award,
  Code2,
  Wifi,
} from "lucide-react";
import type { SiteSettings, Project, Certification } from "@/lib/data";

const iconMap = { Briefcase, Award, Code2, Wifi } as Record<
  string,
  React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
>;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface HeroProps {
  settings: SiteSettings;
  projects: Project[];
  certifications: Certification[];
}

export default function Hero({ settings, projects, certifications }: HeroProps) {
  const heroStats =
    settings.heroStats.length > 0
      ? settings.heroStats.map((s) => ({
          icon: iconMap[s.icon] ?? Code2,
          label: s.label,
          value:
            s.label === "Projects"
              ? `${projects.length}`
              : s.label === "Certifications"
              ? `${certifications.length}`
              : s.value,
          highlight: s.highlight,
        }))
      : [
          { icon: Briefcase, label: "Projects",       value: `${projects.length}`,       highlight: false },
          { icon: Award,     label: "Certifications", value: `${certifications.length}`, highlight: false },
          { icon: Code2,     label: "LeetCode",       value: "200+",                     highlight: false },
          { icon: Wifi,      label: "Availability",   value: settings.availabilityText,  highlight: true  },
        ];

  return (
    <div
      className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 px-4 sm:px-6 lg:px-8"
      style={{ background: "#F4F4F9" }}
    >
      {/* Subtle background texture/glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,85,104,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* ── Hero Card ── */}
        <motion.div
          className="rounded-3xl overflow-hidden relative p-6 sm:p-8 lg:p-8 xl:p-10"
          style={{
            background:
              "linear-gradient(135deg, #EDEDF5 0%, #D4D6E5 50%, #C2C4D6 100%)",
            border: "1.5px solid rgba(255, 255, 255, 0.85)",
            boxShadow:
              "0 20px 50px -12px rgba(27, 31, 59, 0.12), 0 4px 16px rgba(27, 31, 59, 0.04), 0 1px 0 rgba(255, 255, 255, 0.8) inset",
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_0.95fr] xl:grid-cols-[1.45fr_1fr_0.85fr] gap-4 lg:gap-5 xl:gap-6 items-center">

            {/* ── Column 1: Text ── */}
            <motion.div
              className="order-1 min-w-0 flex flex-col items-center text-center lg:items-start lg:text-left"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Greeting */}
              <p
                className="text-base sm:text-lg font-bold tracking-normal mb-1.5"
                style={{ color: "#1B1F3B" }}
              >
                Hello I&apos;m
              </p>

              {/* Name */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-bold mb-3 font-[family-name:var(--font-display)] tracking-tight leading-tight"
                style={{ color: "#4A5568" }}
              >
                <span className="lg:whitespace-nowrap">{settings.name}</span>
              </h1>

              {/* Static Role */}
              <h2
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-3.5 leading-snug"
                style={{ color: "#4A5568" }}
              >
                {settings.title}
              </h2>

              {/* Description */}
              <p
                className="text-sm md:text-base max-w-lg mb-7 leading-relaxed"
                style={{ color: "#4A5568" }}
              >
                {settings.heroDescription}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-start gap-2 w-full">
                <a
                  href="#projects"
                  className="hero-btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Projects <ArrowRight size={14} />
                </a>
                <a
                  href="#contact"
                  className="hero-btn-outline"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <MessageCircle size={14} /> Contact Me
                </a>
                <a
                  href={settings.resumeUrl}
                  download="Yatendra_Verma_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-ghost"
                  aria-label="Download Resume"
                >
                  <Download size={13} /> Download Resume
                </a>
              </div>
            </motion.div>

            {/* ── Column 2: Profile Cutout Image ── */}
            <motion.div
              className="order-2 min-w-0 flex justify-center items-end relative self-end -mb-6 sm:-mb-8 lg:-mb-8 xl:-mb-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
            >
              {/* Soft radial glow */}
              <div
                className="absolute inset-x-0 top-4 bottom-6 rounded-full blur-2xl opacity-60 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(211,212,226,0.55) 50%, transparent 70%)",
                }}
              />

              {/* Container with exact aspect ratio of profile-cutout (1303 x 1207) */}
              <div className="relative w-[300px] sm:w-[360px] lg:w-[440px] xl:w-[480px] aspect-[1303/1207] max-w-full">
                {/* "HI!" speech-bubble badge */}
                <motion.div
                  className="absolute z-20 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black text-white select-none pointer-events-none"
                  style={{
                    top: "5%",
                    left: "69%",
                    background: "#1B1F3B",
                    boxShadow: "0 4px 16px rgba(27,31,59,0.35)",
                    transformOrigin: "bottom left",
                  }}
                  animate={{ rotate: [0, -4, 4, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  HI!
                  <span
                    className="absolute -bottom-1.5 left-3.5"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderTop: "8px solid #1B1F3B",
                      transform: "rotate(25deg)",
                      display: "block",
                    }}
                  />
                </motion.div>

                {/* Transparent Cutout Image */}
                <Image
                  src={settings.profileImageUrl || "/images/profile-cutout.png"}
                  alt={`${settings.name} - profile cutout`}
                  fill
                  className="object-contain object-bottom drop-shadow-xl"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 440px, 480px"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                  }}
                  priority
                />
              </div>
            </motion.div>

            {/* ── Column 3: Stats Card ── */}
            <motion.div
              className="order-3 min-w-0 flex items-center justify-center lg:justify-end my-auto w-full lg:pr-4 xl:pr-6"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
            >
              <div
                className="w-full min-w-[300px] max-w-[320px] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 sm:gap-5"
                style={{
                  background: "rgba(255, 255, 255, 0.28)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1.5px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 8px 32px rgba(27, 31, 59, 0.06)",
                }}
              >
                {heroStats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <stat.icon
                        size={18}
                        className="flex-shrink-0"
                        style={{
                          color: stat.highlight ? "#16A34A" : "var(--muted)",
                        }}
                      />
                      <span
                        className="text-sm sm:text-base font-medium truncate"
                        style={{ color: "var(--muted)" }}
                      >
                        {stat.label}
                      </span>
                    </div>
                    <span
                      className="text-sm sm:text-base font-bold whitespace-nowrap shrink-0 text-right"
                      style={{
                        color: stat.highlight ? "#16A34A" : "#1B1F3B",
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
