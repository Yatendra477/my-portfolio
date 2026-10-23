"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, Building2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import { formatDate } from "@/lib/date";
import type { Certification } from "@/lib/data";

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section
      id="certifications"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="My"
          highlight="Certifications"
          subtitle="Professional credentials and specialized training"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="rounded-2xl p-6 flex flex-col h-full transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "#F3F4F6",
                border: "1px solid #D1D5DB",
              }}
              variants={fadeUpVariant}
            >
              {/* Top Row: Icon + Issuer Chip */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(209, 213, 219, 0.8)",
                    color: "#1B1F3B",
                  }}
                >
                  <Award size={22} className="text-[#1B1F3B]" />
                </div>

                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full truncate max-w-[190px]"
                  style={{
                    background: "rgba(74, 85, 104, 0.1)",
                    color: "#4A5568",
                  }}
                  title={cert.issuer}
                >
                  {cert.issuer.split("(")[0].trim()}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-2 font-[family-name:var(--font-display)] leading-snug group-hover:text-[#4A5568] transition-colors"
                style={{ color: "#1B1F3B" }}
              >
                {cert.title}
              </h3>

              {/* Meta: Organization full & Date */}
              <div className="flex flex-col gap-1 text-xs mb-3" style={{ color: "#6B7280" }}>
                <span className="flex items-center gap-1.5 font-medium" style={{ color: "#4A5568" }}>
                  <Building2 size={13} className="shrink-0" />
                  <span className="truncate">{cert.issuer}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="shrink-0" />
                  <span>{formatDate(cert.period)}</span>
                </span>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-4 flex-1"
                style={{ color: "#4A5568" }}
              >
                {cert.description}
              </p>

              {/* Credential link if present */}
              {cert.credentialUrl && cert.credentialUrl.trim() !== "" && cert.credentialUrl !== "#" && (
                <div className="mt-auto pt-3 border-t border-[#D1D5DB]/60">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                    style={{ color: "#1B1F3B" }}
                  >
                    <ExternalLink size={13} /> Verify Credential
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
