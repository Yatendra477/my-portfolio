"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Code2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import type { SVGProps } from "react";
import type { SiteSettings, NavLink } from "@/lib/data";

type SocialIcon = React.ComponentType<SVGProps<SVGSVGElement>>;

interface NavigationProps {
  navLinks: NavLink[];
  settings: SiteSettings;
}

export default function Navigation({ navLinks, settings }: NavigationProps) {
  const socialLinks: Array<{ href: string; icon: SocialIcon; label: string; isExternal: boolean }> = [
    { href: settings.githubUrl,   icon: GithubIcon,             label: "GitHub profile",  isExternal: true  },
    { href: settings.linkedinUrl, icon: LinkedinIcon,            label: "LinkedIn profile",isExternal: true  },
    { href: `mailto:${settings.contactEmail}`, icon: Mail as unknown as SocialIcon, label: "Email me", isExternal: false },
  ];

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ensure fresh visit without hash begins at the top of the page
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleNavClick = useCallback((href: string) => {
    setIsMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      {/* ── Desktop / Scroll Nav ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center bg-white/40 backdrop-blur-md border-b border-white/50 transition-all duration-300"
        style={{
          boxShadow: isScrolled ? "0 4px 20px rgba(27,31,59,0.06)" : "none",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-container w-full h-full flex items-center">
          <nav className="flex items-center justify-between w-full">

            {/* ── Logo ── */}
            <a
              href="#home"
              className="flex items-center gap-2 font-bold text-base md:text-lg no-underline select-none tracking-tight"
              style={{ color: "var(--navy)" }}
              onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            >
              <Code2 size={20} className="flex-shrink-0" style={{ color: "#4A5568" }} />
              <span>{settings.name}</span>
            </a>

            {/* ── Desktop Center Nav ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeId === link.href.replace("#", "");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className={`nav-link-underline px-3.5 py-2 text-sm font-medium rounded-lg transition-colors no-underline ${isActive ? "active" : ""}`}
                    style={{
                      color: isActive ? "#4A5568" : "var(--muted)",
                    }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* ── Desktop Right: Social Icons ── */}
            <div className="hidden lg:flex items-center gap-1">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target={s.isExternal ? "_blank" : undefined}
                  rel={s.isExternal ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center no-underline transition-all"
                  style={{ color: "var(--muted)" }}
                  whileHover={{ scale: 1.12, color: "#4A5568" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <s.icon width={18} height={18} />
                </motion.a>
              ))}
            </div>

            {/* ── Mobile Hamburger ── */}
            <motion.button
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-0"
              style={{
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(27,31,59,0.12)",
                color: "var(--navy)",
              }}
              onClick={() => setIsMobileOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(27,31,59,0.25)", backdropFilter: "blur(2px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer panel — full width, from top */}
            <motion.div
              className="fixed top-0 left-0 right-0 z-50 lg:hidden"
              style={{
                background: "rgba(74,85,104,0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "0 8px 32px rgba(27,31,59,0.2)",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close row */}
              <div className="flex items-center justify-between px-5 h-16">
                <span className="font-bold text-white text-base flex items-center gap-2">
                  <Code2 size={18} />
                  {settings.name}
                </span>
                <motion.button
                  onClick={() => setIsMobileOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border-0 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Links */}
              <div className="flex flex-col px-4 pb-5 gap-1">
                {navLinks.map((link, i) => {
                  const isActive = activeId === link.href.replace("#", "");
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className="px-4 py-3.5 rounded-xl text-lg font-bold no-underline transition-colors"
                      style={{
                        color: isActive ? "white" : "rgba(255,255,255,0.75)",
                        background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}

                {/* Divider + Social icons */}
                <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "8px 16px" }} />
                <div className="flex items-center gap-3 px-4 pt-1 pb-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.isExternal ? "_blank" : undefined}
                      rel={s.isExternal ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center no-underline transition-all"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <s.icon width={18} height={18} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
