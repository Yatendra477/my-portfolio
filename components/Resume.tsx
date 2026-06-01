"use client";

import { motion } from "framer-motion";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { personalInfo, resumeHighlights } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";

export default function Resume() {
  return (
    <section
      id="resume"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="My"
          highlight="Resume"
          subtitle="A snapshot of my professional profile"
        />

        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-10 text-center"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Resume icon */}
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(34,211,238,0.1))",
              }}
            >
              <FileText
                size={40}
                style={{ color: "var(--color-electric-400)" }}
              />
            </div>

            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-heading)" }}
            >
              {personalInfo.fullName}
            </h3>
            <p
              className="text-base mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {personalInfo.titles.slice(0, 3).join(" · ")}
            </p>

            {/* Key Highlights */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {resumeHighlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                  variants={fadeUpVariant}
                >
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "var(--color-emerald-400)" }}
                  />
                  {highlight}
                </motion.div>
              ))}
            </motion.div>

            {/* Download button */}
            <motion.a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base py-3 px-8 inline-flex"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={18} /> Download Resume
            </motion.a>

            <p
              className="text-xs mt-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Last updated: May 2025
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
