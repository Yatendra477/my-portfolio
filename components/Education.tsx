"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Award } from "lucide-react";
import { education } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import {
  fadeUpVariant,
  staggerContainer,
  timelineDotVariant,
  tagVariant,
} from "@/lib/animations";

export default function Education() {
  return (
    <section
      id="education"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="My"
          highlight="Education"
          subtitle="Academic journey shaping my technical foundation"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div
            className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-electric-500), var(--color-cyan-400), var(--color-emerald-400))",
            }}
          />

          <motion.div
            className="space-y-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {education.map((edu, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-start gap-4 md:gap-8`}
                variants={fadeUpVariant}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 mt-6 md:mt-8"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-electric-500), var(--color-cyan-400))",
                    boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                  }}
                  variants={timelineDotVariant}
                />

                {/* Content card */}
                <div
                  className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] glass-card p-6 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  {/* Duration badge */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      color: "var(--color-electric-400)",
                    }}
                  >
                    {edu.duration}
                  </span>

                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: "var(--text-heading)" }}
                  >
                    <GraduationCap
                      size={18}
                      className="inline mr-2"
                      style={{ color: "var(--color-electric-400)" }}
                    />
                    {edu.degree}
                  </h3>

                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--color-cyan-400)" }}
                  >
                    {edu.field}
                  </p>

                  <p
                    className="text-sm mb-1 flex items-center gap-1"
                    style={{
                      color: "var(--text-secondary)",
                      justifyContent:
                        index % 2 === 0 ? "flex-end" : "flex-start",
                    }}
                  >
                    <MapPin size={13} />
                    {edu.institution}, {edu.location}
                  </p>

                  {/* CGPA removed as requested */}

                  {/* Coursework tags */}
                  {edu.coursework.length > 0 && (
                    <motion.div
                      className={`flex flex-wrap gap-1.5 ${
                        index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                      }`}
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {edu.coursework.map((course) => (
                        <motion.span
                          key={course}
                          className="tech-tag"
                          variants={tagVariant}
                        >
                          {course}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
