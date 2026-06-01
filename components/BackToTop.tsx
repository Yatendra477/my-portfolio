"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show "back to start" button when user navigates away from home (panel index > 0)
    const onSectionChanged = (e: Event) => {
      const { index } = (e as CustomEvent<{ index: number }>).detail;
      setIsVisible(index > 0);
    };
    window.addEventListener("sectionChanged", onSectionChanged);
    return () => window.removeEventListener("sectionChanged", onSectionChanged);
  }, []);

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("navigateTo", { detail: { section: "home" } })
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer border-0"
          style={{
            background:
              "linear-gradient(135deg, var(--color-electric-500), var(--color-electric-600))",
            color: "white",
            boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
          }}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
