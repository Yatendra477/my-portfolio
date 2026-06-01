"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/data/portfolio";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import ThemeToggle from "./ThemeToggle";
import { navVariant, mobileMenuVariant } from "@/lib/animations";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(true); // always styled in horizontal mode
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
  const activeId = useScrollSpy(sectionIds);

  useEffect(() => {
    setIsScrolled(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const section = href.replace("#", "");
    // Dispatch event for HorizontalLayout to intercept
    window.dispatchEvent(
      new CustomEvent("navigateTo", { detail: { section } })
    );
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled
            ? "1px solid var(--glass-border)"
            : "1px solid transparent",
          boxShadow: isScrolled ? "var(--shadow-glass)" : "none",
        }}
        variants={navVariant}
        initial="hidden"
        animate="visible"
      >
        <div className="section-container">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              className="text-xl font-bold no-underline"
              style={{ color: "var(--text-heading)" }}
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#home");
              }}
            >
              {personalInfo.firstName}
              <span className="gradient-text"> {personalInfo.lastName}</span>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`nav-link-underline px-3 py-2 text-sm font-medium rounded-lg transition-colors no-underline ${
                    activeId === link.href.replace("#", "")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    color:
                      activeId === link.href.replace("#", "")
                        ? "var(--color-electric-400)"
                        : "var(--text-secondary)",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <motion.button
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-0"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                }}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden flex flex-col pt-20 px-6 pb-8"
              style={{
                background: "var(--bg-secondary)",
                borderLeft: "1px solid var(--glass-border)",
              }}
              variants={mobileMenuVariant}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="px-4 py-3 rounded-xl text-base font-medium no-underline transition-colors"
                    style={{
                      color:
                        activeId === link.href.replace("#", "")
                          ? "var(--color-electric-400)"
                          : "var(--text-secondary)",
                      background:
                        activeId === link.href.replace("#", "")
                          ? "rgba(59,130,246,0.1)"
                          : "transparent",
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
