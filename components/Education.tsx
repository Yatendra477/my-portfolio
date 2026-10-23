"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Education as EducationItem } from "@/lib/data";

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  return (
    <div
      className="section"
      style={{ background: "#F4F4F9" }}
    >
      <div className="section-container">
        <SectionHeading
          title="My"
          highlight="Education"
          subtitle="Academic journey shaping my technical foundation"
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
            {education.map((edu, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={fadeUpVariant}
              >
                {/* Timeline Node */}
                <div
                  className="absolute left-4 sm:left-6 md:left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-[#1B1F3B] -translate-x-1/2 flex items-center justify-center text-[#1B1F3B] shadow-sm z-10 mt-6"
                >
                  <GraduationCap size={15} />
                </div>

                {/* Rounded Education Card */}
                <div
                  className="ml-10 sm:ml-14 md:ml-16 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #D1D5DB",
                  }}
                >
                  {/* Duration Badge */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-[#4A5568] border border-slate-200">
                      <Calendar size={12} /> {edu.period}
                    </span>
                  </div>

                  {/* Degree & Field */}
                  <h3
                    className="text-lg sm:text-xl font-bold mb-1"
                    style={{ color: "#1B1F3B" }}
                  >
                    {edu.title}
                  </h3>

                  <p
                    className="text-sm font-semibold mb-2"
                    style={{ color: "#4A5568" }}
                  >
                    {edu.subtitle}
                  </p>

                  {/* Institution & Location */}
                  <p
                    className="flex items-center gap-1.5 text-xs mb-3 text-[#6B7280]"
                  >
                    <MapPin size={13} className="shrink-0" />
                    <span>{edu.institution}, {edu.location}</span>
                  </p>

                  {/* Coursework & Subjects as Pill Tags */}
                  {edu.tags && edu.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#1B1F3B] mb-2.5">
                        Key Subjects &amp; Coursework:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {edu.tags.map((course) => (
                          <span
                            key={course}
                            className="bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-3 py-1 text-xs font-medium hover:border-slate-300 transition-colors select-none"
                          >
                            {course}
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
