"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { experience } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import {
  fadeUpVariant,
  staggerContainer,
  timelineDotVariant,
} from "@/lib/animations";

export default function Experience() {
  return (
    <section
      id="experience"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="Work"
          highlight="Experience"
          subtitle="Professional journey and contributions"
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-0.5"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-electric-500), var(--color-cyan-400))",
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
                className="relative pl-14"
                variants={fadeUpVariant}
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute left-5 w-4 h-4 rounded-full -translate-x-1/2 mt-6 z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-electric-500), var(--color-cyan-400))",
                    boxShadow: "0 0 12px rgba(59,130,246,0.4)",
                  }}
                  variants={timelineDotVariant}
                />

                {/* Icon */}
                <div
                  className="absolute left-3 w-8 h-8 rounded-full flex items-center justify-center -translate-x-1/2 mt-6"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "2px solid var(--color-electric-500)",
                    zIndex: 11,
                    left: "20px",
                  }}
                >
                  <Briefcase
                    size={14}
                    style={{ color: "var(--color-electric-400)" }}
                  />
                </div>

                {/* Content Card */}
                <div className="glass-card p-6">
                  {/* Type badge */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      color: "var(--color-emerald-400)",
                    }}
                  >
                    {exp.type}
                  </span>

                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {exp.role}
                  </h3>

                  <p
                    className="text-base font-medium mb-2"
                    style={{ color: "var(--color-electric-400)" }}
                  >
                    {exp.company}
                  </p>

                  <div
                    className="flex flex-wrap gap-4 text-xs mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {exp.location}
                    </span>
                  </div>

                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {exp.description}
                  </p>

                  {/* Responsibilities */}
                  <ul className="space-y-2 mb-4">
                    {exp.responsibilities.map((resp, i) => (
                      <li
                        key={i}
                        className="text-sm flex items-start gap-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: "var(--color-electric-400)" }}
                        />
                        {resp}
                      </li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
