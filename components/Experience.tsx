"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Experience as ExperienceItem } from "@/lib/data";

interface ExperienceProps {
  experience: ExperienceItem[];
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <div
      className="section"
      style={{ background: "#FFFFFF" }}
    >
      <div className="section-container">
        <SectionHeading
          title="Work"
          highlight="Experience"
          subtitle="Professional journey and contributions"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical Timeline Spine */}
          <div
            className="absolute left-4 sm:left-6 md:left-8 top-4 bottom-4 w-0.5"
            style={{
              background: "linear-gradient(to bottom, #1B1F3B, #4A5568, rgba(74, 85, 104, 0.25))",
            }}
          />

          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={fadeUpVariant}
              >
                {/* Timeline Node */}
                <div
                  className="absolute left-4 sm:left-6 md:left-8 w-8 h-8 rounded-full bg-white border-2 border-[#1B1F3B] -translate-x-1/2 flex items-center justify-center text-[#1B1F3B] shadow-sm z-10 mt-6"
                >
                  <Briefcase size={14} />
                </div>

                {/* Timeline Card */}
                <div
                  className="ml-10 sm:ml-14 md:ml-16 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{
                    background: "#F3F4F6",
                    border: "1px solid #D1D5DB",
                  }}
                >
                  {/* Badges Row: Duration, Type Tag, Location */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    {/* Duration */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white text-[#4A5568] border border-slate-200">
                      <Calendar size={12} /> {exp.period}
                    </span>

                    {/* Type Chip */}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-[#1B1F3B] text-white shadow-xs">
                      {exp.type}
                    </span>

                    {/* Location */}
                    <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                      <MapPin size={12} className="shrink-0" /> {exp.location}
                    </span>
                  </div>

                  {/* Role Title */}
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-1 font-[family-name:var(--font-display)]"
                    style={{ color: "#1B1F3B" }}
                  >
                    {exp.role}
                  </h3>

                  {/* Company */}
                  <p
                    className="text-base font-semibold mb-3"
                    style={{ color: "#4A5568" }}
                  >
                    {exp.company}
                  </p>

                  {/* Overview description */}
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {exp.description}
                  </p>

                  {/* Responsibilities Bullets */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1B1F3B] mb-2.5">
                        Key Responsibilities &amp; Impact:
                      </p>
                      <ul className="space-y-2.5">
                        {exp.bullets.map((resp, i) => (
                          <li
                            key={i}
                            className="text-sm flex items-start gap-2.5 text-[#334155] leading-relaxed"
                          >
                            <CheckCircle2
                              size={16}
                              className="shrink-0 mt-0.5"
                              style={{ color: "var(--slate-accent)" }}
                            />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech Chips */}
                  {exp.tech && exp.tech.length > 0 && (
                    <div className="pt-4 border-t border-slate-200/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1B1F3B] mb-2.5">
                        Technologies &amp; Frameworks:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.tech.map((tech) => (
                          <span
                            key={tech}
                            className="bg-white text-slate-700 border border-slate-200 rounded-full px-3 py-1 text-xs font-medium hover:border-slate-300 transition-colors select-none"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
