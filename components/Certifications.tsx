"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, Building2 } from "lucide-react";
import { certifications } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="My"
          highlight="Certifications"
          subtitle="Professional credentials and specialized training"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 group relative overflow-hidden"
              variants={fadeUpVariant}
            >
              {/* Gradient accent top */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-electric-500), var(--color-cyan-400))",
                }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(34,211,238,0.1))",
                }}
              >
                <Award
                  size={28}
                  style={{ color: "var(--color-electric-400)" }}
                />
              </div>

              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--text-heading)" }}
              >
                {cert.title}
              </h3>

              <div
                className="flex items-center gap-1.5 text-sm mb-1"
                style={{ color: "var(--color-cyan-400)" }}
              >
                <Building2 size={14} />
                {cert.organization}
              </div>

              <div
                className="flex items-center gap-1.5 text-xs mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                <Calendar size={13} />
                {cert.date}
              </div>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {cert.description}
              </p>

              {cert.credentialUrl && cert.credentialUrl !== "#" && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs py-2 px-4"
                >
                  <ExternalLink size={13} /> Verify Credential
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
