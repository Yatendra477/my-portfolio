"use client";

import { motion } from "framer-motion";
import { Mail, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import type { SiteSettings, NavLink } from "@/lib/data";

interface FooterProps {
  settings: SiteSettings;
  navLinks: NavLink[];
}

export default function Footer({ settings, navLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: GithubIcon,
      href: settings.githubUrl,
      label: `${settings.name} on GitHub`,
      isExternal: true,
    },
    {
      icon: LinkedinIcon,
      href: settings.linkedinUrl,
      label: `${settings.name} on LinkedIn`,
      isExternal: true,
    },
    {
      icon: Mail,
      href: `mailto:${settings.contactEmail}`,
      label: `Email ${settings.name}`,
      isExternal: false,
    },
  ];

  return (
    <footer
      className="py-14 sm:py-16"
      style={{
        background: "#050A14",
        borderTop: "1px solid #2A3140",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <a
              href="#home"
              className="flex items-center gap-2 font-bold text-lg text-white no-underline select-none tracking-tight transition-opacity hover:opacity-90"
            >
              <Code2 size={20} className="text-[#A0AEC0] shrink-0" />
              <span>{settings.name}</span>
            </a>
            <p
              className="text-sm leading-relaxed max-w-sm mt-1"
              style={{ color: "#8b9ab3" }}
            >
              {settings.title} specializing in Computer Vision,
              intelligent agents, and backend development.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4 text-white"
            >
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm no-underline transition-colors hover:text-white"
                  style={{ color: "#8b9ab3" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect & Social Icons */}
          <div className="md:col-span-3">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4 text-white"
            >
              Connect
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.isExternal ? "_blank" : undefined}
                  rel={social.isExternal ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center no-underline transition-all duration-200"
                  style={{
                    background: "#0B1220",
                    border: "1px solid #2A3140",
                    color: "#8b9ab3",
                  }}
                  whileHover={{
                    scale: 1.08,
                    borderColor: "#4A5568",
                    color: "#FFFFFF",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon width={17} height={17} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div
          className="pt-8 text-center"
          style={{ borderTop: "1px solid #2A3140" }}
        >
          <p className="text-xs" style={{ color: "#6B7280" }}>
            &copy; {currentYear} {settings.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
