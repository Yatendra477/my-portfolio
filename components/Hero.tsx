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

// ─── Natural image size (1303 × 1207 px) ─────────────────────────────────────
// Max display height is clamp(380px, 62svh, 680px) → ~0.56× natural size – never blurry.

const iconMap = { Briefcase, Award, Code2, Wifi } as Record<
  string,
  React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
>;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Tech chips — real skills only, never over the face
const CHIPS = [
  { label: "Python",          emoji: "🐍", delay: 0,    left: true,  top: "28%" },
  { label: "OpenCV",          emoji: "👁",  delay: 1.2,  left: true,  top: "52%" },
  { label: "FastAPI",         emoji: "⚡", delay: 2.1,  left: false, top: "35%" },
  { label: "Machine Learning",emoji: "🤖", delay: 0.8,  left: false, top: "60%" },
];

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

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      className="hero-card mx-3 sm:mx-4 lg:mx-5 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #EDEDF5 0%, #D8DAE9 45%, #C9CBD8 100%)",
        border: "1.5px solid rgba(255, 255, 255, 0.85)",
        boxShadow:
          "0 20px 60px -12px rgba(27, 31, 59, 0.14), 0 4px 20px rgba(27, 31, 59, 0.05), 0 1px 0 rgba(255, 255, 255, 0.8) inset",
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      {/* ── Depth layer: dot-grid pattern ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(27,31,59,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.055,
        }}
      />

      {/* ── Depth layer: two large white blobs ── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: "55%",
          height: "70%",
          top: "-10%",
          left: "-8%",
          background: "radial-gradient(circle, rgba(255,255,255,0.38) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: "45%",
          height: "60%",
          bottom: "-5%",
          right: "5%",
          background: "radial-gradient(circle, rgba(255,255,255,0.30) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* ── Main inner container ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-10 xl:px-16 h-full min-h-[inherit] flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-stretch py-6 lg:py-0">

        {/* ════════════════════════════════════════
            LEFT — col-span-6, text + stats strip
            ════════════════════════════════════════ */}
        <motion.div
          className="lg:col-span-6 flex flex-col justify-center items-center text-center lg:items-start lg:text-left lg:py-12 order-1 gap-0"
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {/* Greeting */}
          <p
            className="text-base sm:text-lg font-bold tracking-normal mb-2"
            style={{ color: "#1B1F3B" }}
          >
            Hello I&apos;m
          </p>

          {/* Name — ONE line on lg+ */}
          <h1
            className="font-bold mb-2.5 font-[family-name:var(--font-display)] tracking-tight leading-[1.08] lg:whitespace-nowrap"
            style={{ fontSize: "clamp(2.75rem, 5.2vw, 5rem)", color: "#4A5568" }}
          >
            {settings.name}
          </h1>

          {/* Role */}
          <h2
            className="font-semibold mb-3.5 leading-snug"
            style={{ fontSize: "clamp(1.2rem, 1.9vw, 1.6rem)", color: "#6B7280" }}
          >
            {settings.title}
          </h2>

          {/* Description */}
          <p
            className="max-w-xl text-[0.95rem] lg:text-base leading-relaxed mb-6"
            style={{ color: "#4A5568" }}
          >
            {settings.heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 w-full mb-8 sm:mb-10">
            <a href="#projects" className="hero-btn-primary" onClick={scrollTo("projects")}>
              View Projects <ArrowRight size={14} />
            </a>
            <a href="#contact" className="hero-btn-outline" onClick={scrollTo("contact")}>
              <MessageCircle size={14} /> Contact Me
            </a>
            <a
              href={settings.resumeUrl || "#resume"}
              download={settings.resumeUrl ? "Resume.pdf" : undefined}
              target={settings.resumeUrl ? "_blank" : undefined}
              rel={settings.resumeUrl ? "noopener noreferrer" : undefined}
              className="hero-btn-ghost"
              aria-label="Download Resume"
              onClick={!settings.resumeUrl ? scrollTo("resume") : undefined}
            >
              <Download size={13} /> Download Resume
            </a>
          </div>

          {/* ── Stats Strip ── */}
          <motion.div
            className="w-full max-w-xl lg:max-w-none"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          >
            <div
              className="rounded-2xl p-4 xl:p-5"
              style={{
                background: "rgba(255, 255, 255, 0.30)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1.5px solid rgba(255, 255, 255, 0.80)",
                boxShadow: "0 4px 24px rgba(27, 31, 59, 0.07)",
              }}
            >
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-y-3 gap-x-1">
                {heroStats.map((stat, i) => (
                  <div key={i} className={`flex flex-col items-center px-2 ${i < heroStats.length - 1 ? "xl:border-r xl:border-white/50" : ""}`}>
                    <stat.icon
                      size={18}
                      className="mb-1 flex-shrink-0"
                      style={{ color: stat.highlight ? "#16A34A" : "#6B7280" }}
                    />
                    <span
                      className="text-lg xl:text-xl font-black leading-none mb-0.5"
                      style={{ color: stat.highlight ? "#16A34A" : "#1B1F3B" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[0.68rem] font-medium text-center leading-tight"
                      style={{ color: "#6B7280" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════
            RIGHT — col-span-6, portrait stage
            ════════════════════════════════════════ */}
        <div className="lg:col-span-6 relative flex items-end justify-center order-2 mt-6 lg:mt-0 overflow-visible">

          {/* Backdrop: large soft circle */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: "min(92%, 680px)",
              aspectRatio: "1",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              background: "radial-gradient(circle, rgba(255,255,255,0.62) 0%, rgba(230,231,240,0.30) 55%, transparent 72%)",
              borderRadius: "50%",
              filter: "blur(2px)",
            }}
          />
          {/* Thin ring slightly larger */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none rounded-full"
            style={{
              width: "min(98%, 720px)",
              aspectRatio: "1",
              bottom: "-2%",
              left: "50%",
              transform: "translateX(-50%)",
              border: "1px solid rgba(255,255,255,0.45)",
            }}
          />

          {/* Floating tech chips — desktop only, hidden on tablet/mobile */}
          {CHIPS.map((chip) => (
            <motion.div
              key={chip.label}
              aria-hidden="true"
              className="hero-chip hidden lg:flex"
              style={{
                position: "absolute",
                top: chip.top,
                ...(chip.left ? { left: "-2%" } : { right: "-2%" }),
                zIndex: 20,
              }}
              animate={{ y: [0, -7, 0] }}
              transition={{
                duration: 6.5 + chip.delay * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: chip.delay,
              }}
            >
              <span className="mr-1.5 text-sm leading-none">{chip.emoji}</span>
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#1B1F3B" }}>
                {chip.label}
              </span>
            </motion.div>
          ))}

          {/* Portrait wrapper — the EXACT bounding box for the HI! bubble */}
          <motion.div
            className="relative flex items-end justify-center"
            style={{ height: "clamp(380px, 62svh, 680px)" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
          >
            {/* "HI!" speech-bubble — anchored to the portrait wrapper */}
            <motion.div
              className="absolute z-30 px-3.5 py-1.5 rounded-2xl text-sm font-black text-white select-none pointer-events-none"
              style={{
                top: "6%",
                left: "64%",
                background: "#1B1F3B",
                boxShadow: "0 4px 18px rgba(27,31,59,0.38)",
                transformOrigin: "bottom left",
              }}
              animate={{ rotate: [0, -4, 4, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              HI!
              {/* Tail */}
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-3.5"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "8px solid #1B1F3B",
                  transform: "rotate(20deg)",
                  display: "block",
                }}
              />
            </motion.div>

            {/* Cutout image — flush with card bottom, max ~0.56× natural size */}
            <Image
              src={settings.profileImageUrl || "/images/profile-cutout.png"}
              alt={`${settings.name} — portrait`}
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
          </motion.div>
        </div>

        {/* ════════════════════════════════════════
            TABLET stats override (md only, below portrait)
            Hidden on lg+ (stats strip is in the left col)
            Visible on md and below
            ════════════════════════════════════════ */}
        <motion.div
          className="order-3 w-full lg:hidden -mt-12 sm:-mt-14 relative z-20 px-2 pb-4 sm:pb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
        >
          <div
            className="rounded-2xl p-4 mx-auto max-w-md sm:max-w-xl"
            style={{
              background: "rgba(255, 255, 255, 0.32)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1.5px solid rgba(255, 255, 255, 0.82)",
              boxShadow: "0 4px 24px rgba(27, 31, 59, 0.08)",
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              {heroStats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center px-2 py-1">
                  <stat.icon
                    size={16}
                    className="mb-1 flex-shrink-0"
                    style={{ color: stat.highlight ? "#16A34A" : "#6B7280" }}
                  />
                  <span
                    className="text-base font-black leading-none mb-0.5"
                    style={{ color: stat.highlight ? "#16A34A" : "#1B1F3B" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[0.65rem] font-medium text-center leading-tight"
                    style={{ color: "#6B7280" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
