"use client";

import { useState, useEffect } from "react";

/**
 * In horizontal-scroll mode, the active section is broadcast via the
 * "sectionChanged" CustomEvent from HorizontalLayout.
 * Falls back to IntersectionObserver for any vertical-scroll contexts.
 */
export function useScrollSpy(sectionIds: string[], _offset = 100) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    // Primary: listen for horizontal-layout broadcasts
    const onSectionChanged = (e: Event) => {
      const { section } = (e as CustomEvent<{ section: string; index: number }>).detail;
      if (sectionIds.includes(section)) {
        setActiveId(section);
      }
    };

    window.addEventListener("sectionChanged", onSectionChanged);
    return () => window.removeEventListener("sectionChanged", onSectionChanged);
  }, [sectionIds]);

  return activeId;
}
