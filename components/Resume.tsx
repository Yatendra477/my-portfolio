"use client";

import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { resumeHighlights } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { SiteSettings } from "@/lib/data";

interface ResumeProps {
  settings: SiteSettings;
}

export default function Resume({ settings }: ResumeProps) {
  const showLastUpdated = Boolean(
    settings.resumeUpdatedAt &&
      typeof settings.resumeUpdatedAt === "string" &&
      settings.resumeUpdatedAt.trim() !== "" &&
      !settings.resumeUpdatedAt.includes("[FILL")
  );

  return (
    <section
      id="resume"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="My"
          highlight="Resume"
          subtitle="A snapshot of my professional profile"
        />

        <div className="max-w-3xl mx-auto">
          <motion.div
            className="rounded-3xl p-8 sm:p-10 text-center relative shadow-sm"
            style={{
              background: "#F3F4F6",
              border: "1px solid #D1D5DB",
            }}
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Top icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(209, 213, 219, 0.8)",
                color: "#1B1F3B",
              }}
            >
              <FileText size={26} className="text-[#1B1F3B]" />
            </div>

            <h3
              className="text-2xl font-bold mb-1 font-[family-name:var(--font-display)]"
              style={{ color: "#1B1F3B" }}
            >
              {settings.name}
            </h3>
            <p
              className="text-sm mb-7 font-medium"
              style={{ color: "#6B7280" }}
            >
              {settings.title}
            </p>

            {/* Snapshot Highlights */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 text-left max-w-2xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {resumeHighlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5 text-sm p-2.5 rounded-xl transition-colors hover:bg-white/60"
                  variants={fadeUpVariant}
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "#4A5568" }}
                  />
                  <span className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: "#1B1F3B" }}>
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Dark Download button */}
            <motion.a
              href={settings.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Yatendra Verma's Resume PDF"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all duration-200"
              style={{
                background: "#4A5568",
              }}
              whileHover={{ scale: 1.03, backgroundColor: "#2D3748" }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} /> Download Resume
            </motion.a>

            {showLastUpdated && (
              <p className="text-xs mt-4" style={{ color: "#6B7280" }}>
                Last updated: {settings.resumeUpdatedAt}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
