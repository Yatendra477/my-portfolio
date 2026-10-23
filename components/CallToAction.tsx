"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { fadeUpVariant } from "@/lib/animations";

export default function CallToAction() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          className="relative rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #EDEDF5 0%, #E2E4EF 50%, #D3D4E2 100%)",
            border: "1.5px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 12px 32px rgba(27, 31, 59, 0.08)",
          }}
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(74, 85, 104, 0.12)" }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 font-[family-name:var(--font-display)] leading-tight tracking-tight"
                style={{ color: "#1B1F3B" }}
              >
                Let&apos;s build something intelligent together!
              </h2>
              <p
                className="text-sm sm:text-base mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal"
                style={{ color: "#4A5568" }}
              >
                I build AI, computer vision and backend solutions that solve real-world problems.
              </p>

              <div>
                <motion.a
                  href="#contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm shadow-md transition-all duration-200 border border-white/90"
                  style={{
                    background: "#FFFFFF",
                    color: "#1B1F3B",
                  }}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 20px rgba(27, 31, 59, 0.12)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Contact Me
                  <ArrowRight size={16} className="text-[#4A5568] transition-transform group-hover:translate-x-0.5" />
                </motion.a>
              </div>
            </div>

            {/* Right Side: Avatar Image */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 flex items-center justify-center">
                <Image
                  src="/images/profile-cutout.png"
                  alt="Yatendra Verma"
                  fill
                  sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
                  className="object-contain drop-shadow-lg select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
