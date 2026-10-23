"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, staggerContainer } from "@/lib/animations";
import type { Testimonial } from "@/lib/data";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "CL";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="My"
          highlight="Clients"
          subtitle="Feedback from clients, mentors, and collaborators"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((item, index) => {
            const initials = getInitials(item.name);
            return (
              <motion.div
                key={index}
                className="rounded-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "#F3F4F6",
                  border: "1px solid #D1D5DB",
                }}
                variants={fadeUpVariant}
              >
                <div>
                  {/* 5 Yellow Stars */}
                  <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        size={15}
                        className="fill-[#FACC15] text-[#FACC15]"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className="text-sm sm:text-base leading-relaxed italic mb-6"
                    style={{ color: "#1B1F3B" }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author row */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#D1D5DB]/60">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs tracking-wider"
                    style={{
                      background: "#1B1F3B",
                      color: "#FFFFFF",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-sm font-bold truncate leading-tight font-[family-name:var(--font-display)]"
                      style={{ color: "#1B1F3B" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "#6B7280" }}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
