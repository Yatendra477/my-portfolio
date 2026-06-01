"use client";

import { motion } from "framer-motion";
import { Mail, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/Icons";
import { personalInfo, navLinks } from "@/data/portfolio";

const socialLinks = [
  { icon: GithubIcon, href: personalInfo.socialLinks.github, label: "GitHub" },
  { icon: LinkedinIcon, href: personalInfo.socialLinks.linkedin, label: "LinkedIn" },
  { icon: Mail, href: personalInfo.socialLinks.email, label: "Email" },
  { icon: TwitterIcon, href: personalInfo.socialLinks.twitter, label: "Twitter" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-12"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--glass-border)",
      }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Logo & tagline */}
          <div>
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: "var(--text-heading)" }}
            >
              {personalInfo.firstName}
              <span className="gradient-text"> {personalInfo.lastName}</span>
            </h3>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Python Developer & AI/ML Engineer building intelligent solutions
              for the real world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "var(--text-heading)" }}
            >
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.slice(0, 8).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm no-underline transition-colors hover:text-[var(--color-electric-400)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "var(--text-heading)" }}
            >
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center no-underline"
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-secondary)",
                  }}
                  whileHover={{
                    scale: 1.1,
                    borderColor: "var(--color-electric-500)",
                  }}
                  aria-label={social.label}
                >
                  <social.icon width={16} height={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          style={{ borderTop: "1px solid var(--glass-border)" }}
        >
          <p
            className="text-xs w-full text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            © {currentYear} {personalInfo.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
