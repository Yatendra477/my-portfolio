"use client";

import { useState, useEffect } from "react";

/**
 * Tracks the currently active section.
 * - Home is guaranteed active at scrollY <= 50 (specifically at scrollY = 0).
 * - Home remains active until About section's top crosses the middle of the viewport.
 * - Subsequent sections become active once their top passes the viewport midpoint.
 * - The last section becomes active when scrolled to the bottom of the page.
 */
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "home");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;

      // Home must be active at scrollY = 0 and at top of page
      if (scrollY <= 50) {
        setActiveId(sectionIds[0] ?? "home");
        ticking = false;
        return;
      }

      // If scrolled to the very bottom, activate the last section
      const totalDocHeight = document.documentElement.scrollHeight;
      const viewportBottom = scrollY + window.innerHeight;
      if (viewportBottom >= totalDocHeight - 40) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        ticking = false;
        return;
      }

      // Middle of the viewport is the trigger threshold
      const midpoint = window.innerHeight * 0.5;

      let currentSection = sectionIds[0];

      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Section top has reached or passed the middle of the viewport
        if (rect.top <= midpoint) {
          currentSection = id;
        } else {
          // Sections are in vertical order; once a section top is below midpoint, break
          break;
        }
      }

      setActiveId(currentSection);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    // Run initial determination
    updateActiveSection();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}
