"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { testimonials } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant } from "@/lib/animations";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  const testimonial = testimonials[current];

  return (
    <section
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="What People"
          highlight="Say"
          subtitle="Testimonials from mentors, colleagues, and collaborators"
        />

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-10 text-center relative"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Quote icon */}
            <Quote
              size={40}
              className="mx-auto mb-6 opacity-30"
              style={{ color: "var(--color-electric-400)" }}
            />

            {/* Review text */}
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base md:text-lg leading-relaxed mb-8 italic"
              style={{ color: "var(--text-primary)" }}
            >
              &ldquo;{testimonial.review}&rdquo;
            </motion.p>

            {/* Author */}
            <motion.div
              key={`author-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-electric-500), var(--color-cyan-400))",
                }}
              >
                <User size={24} style={{ color: "white" }} />
              </div>
              <div>
                <h4
                  className="text-base font-semibold"
                  style={{ color: "var(--text-heading)" }}
                >
                  {testimonial.name}
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {testimonial.designation}
                </p>
              </div>
            </motion.div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button
                  onClick={prev}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-0"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-secondary)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={18} />
                </motion.button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="w-2 h-2 rounded-full cursor-pointer border-0 transition-all"
                      style={{
                        background:
                          i === current
                            ? "var(--color-electric-400)"
                            : "var(--glass-border)",
                        transform: i === current ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={next}
                  className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-0"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-secondary)",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
