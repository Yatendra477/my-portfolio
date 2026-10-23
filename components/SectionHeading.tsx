"use client";

import { motion } from "framer-motion";
import { headingLineVariant, fadeUpVariant } from "@/lib/animations";

interface SectionHeadingProps {
  title: string;
  highlight: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  highlight,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const isLeft = align === "left";
  return (
    <motion.div
      className={isLeft ? "mb-4" : "text-center mb-16"}
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
          className={`text-base md:text-lg ${isLeft ? "" : "max-w-2xl mx-auto"}`}
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </p>
      )}
      <motion.div
        className={`h-[3px] mt-5 rounded-full ${isLeft ? "" : "mx-auto"}`}
        style={{
          background: "linear-gradient(90deg, var(--navy), var(--slate-accent))",
        }}
        variants={headingLineVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      />
    </motion.div>
  );
}
