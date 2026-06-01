"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, ArrowRight, Download, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/Icons";
import { personalInfo } from "@/data/portfolio";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { fadeLeftVariant, fadeRightVariant, staggerContainer } from "@/lib/animations";


const socialLinks = [
  { icon: GithubIcon, href: personalInfo.socialLinks.github, label: "GitHub" },
  { icon: LinkedinIcon, href: personalInfo.socialLinks.linkedin, label: "LinkedIn" },
  { icon: Mail, href: personalInfo.socialLinks.email, label: "Email" },
  { icon: TwitterIcon, href: personalInfo.socialLinks.twitter, label: "Twitter" },
];

export default function Hero() {
  const typedText = useTypingAnimation(personalInfo.titles, 90, 50, 2000);

  return (
    <section
      id="home"
      className="section relative min-h-screen flex items-center overflow-hidden bg-grid"
      style={{ background: "var(--bg-primary)", paddingTop: "6rem" }}
    >
      {/* Background gradient */}
      <div className="hero-gradient" />

      {/* Subtle orb decorations */}
      <div
        className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-30"
        style={{ background: "var(--color-electric-500)" }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-20"
        style={{ background: "var(--color-cyan-400)" }}
      />

      <div className="section-container w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeLeftVariant}
              className="text-sm md:text-base font-medium tracking-widest uppercase mb-4"
              style={{ color: "var(--color-electric-400)" }}
            >
              Hello, I&apos;m
            </motion.p>

            <motion.h1
              variants={fadeLeftVariant}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 font-[family-name:var(--font-display)]"
              style={{ color: "var(--text-heading)" }}
            >
              {personalInfo.firstName}
              <br />
              <span className="gradient-text">{personalInfo.lastName}</span>
            </motion.h1>

            <motion.div
              variants={fadeLeftVariant}
              className="text-lg md:text-xl lg:text-2xl font-medium mb-6 h-8"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>{typedText}</span>
              <motion.span
                className="inline-block w-[3px] h-6 ml-1 align-middle"
                style={{ background: "var(--color-electric-400)" }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>

            <motion.p
              variants={fadeLeftVariant}
              className="text-base md:text-lg max-w-xl mb-8 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {personalInfo.summary}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeLeftVariant}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              <a href="#projects" className="btn-primary">
                View Projects <ArrowRight size={16} />
              </a>
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Download size={16} /> Download Resume
              </a>
              <a href="#contact" className="btn-outline">
                <MessageCircle size={16} /> Contact Me
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={fadeLeftVariant}
              className="flex gap-3 justify-center lg:justify-start"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center no-underline transition-all"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-secondary)",
                  }}
                  whileHover={{
                    scale: 1.15,
                    color: "var(--color-electric-400)",
                    borderColor: "var(--color-electric-500)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon width={18} height={18} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side — Profile Image */}
          <motion.div
            className="flex-shrink-0 relative"
            variants={fadeRightVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">

              {/* Profile glow */}
              <div className="profile-glow" />

              {/* Profile image container */}
              <motion.div
                className="profile-image-wrapper"
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="profile-image-inner">
                  <Image
                    src={personalInfo.profileImage}
                    alt={personalInfo.fullName}
                    width={380}
                    height={380}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: "var(--text-secondary)" }}
        >
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "2px solid var(--glass-border)" }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: "var(--color-electric-400)" }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
