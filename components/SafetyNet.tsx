"use client";

import { useEffect } from "react";

/**
 * Dev-time safety net that scans rendered page text and warns
 * via console.error if forbidden placeholders like "[FILL", "TODO",
 * or "undefined" are present on the page.
 */
export default function SafetyNet() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkRenderedText = () => {
      const text = document.body?.innerText || "";
      const forbidden = ["[FILL", "TODO", "undefined"];
      const violations: string[] = [];

      for (const pattern of forbidden) {
        if (text.includes(pattern)) {
          violations.push(pattern);
        }
      }

      if (violations.length > 0) {
        console.error(
          `[SafetyNet Warning]: Rendered text on page contains forbidden placeholder(s): ${violations.join(
            ", "
          )}`
        );
      }
    };

    // Run check after initial render
    const timer = setTimeout(checkRenderedText, 1500);

    // Monitor live DOM mutations
    const observer = new MutationObserver(() => {
      checkRenderedText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
