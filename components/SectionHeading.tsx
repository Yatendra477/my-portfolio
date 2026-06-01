"use client";

import { motion } from "framer-motion";
import { headingLineVariant, fadeUpVariant } from "@/lib/animations";

interface SectionHeadingProps {
  title: string;
  highlight: string;
  subtitle?: string;
}

export default function SectionHeading({
  title,
  highlight,
  subtitle,
}: SectionHeadingProps) {
  return (
    <motion.div
      className="text-center mb-16"
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-display)]"
        style={{ color: "var(--text-heading)" }}
      >
        {title}{" "}
        <span className="gradient-text">{highlight}</span>
      </h2>
      {subtitle && (
        <p
          className="text-base md:text-lg max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </p>
      )}
      <motion.div
        className="h-[3px] mx-auto mt-5 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-electric-500), var(--color-cyan-400))",
        }}
        variants={headingLineVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      />
    </motion.div>
  );
}
