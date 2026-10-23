"use client";

import { useRef, useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  label,
  duration = 1.5,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Real final value is the default rendered content (never 0 before it animates)
  const [count, setCount] = useState<number>(target);
  const animatedRef = useRef(false);

  useEffect(() => {
    // If target is 0 or already animated, nothing to animate (already at target value)
    if (target <= 0 || animatedRef.current) {
      return;
    }

    // Check prefers-reduced-motion (skips animation, count stays at default final target)
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // If IntersectionObserver is unavailable, count stays at default final target
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    // Safety fallback: after 3 seconds, guarantee final value
    const fallbackTimer = setTimeout(() => {
      setCount(target);
    }, 3000);

    let rafId: number;

    const startAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;
      clearTimeout(fallbackTimer);

      const animDurationMs = duration * 1000;
      let startTime: number | null = null;

      // Start counting up from 0 once triggered
      setCount(0);

      const step = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / animDurationMs, 1);
        // Smooth ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);
        setCount(current);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      rafId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger once when 30% visible
          if (entry.isIntersecting && !animatedRef.current) {
            startAnimation();
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target, duration]);

  // Hide any counter whose value would be 0
  if (target <= 0) return null;

  return (
    <div ref={ref} className="text-center select-none">
      <div className="text-3xl md:text-4xl font-bold gradient-text mb-1 tracking-tight">
        {count}
        {suffix}
      </div>
      <p
        className="text-xs sm:text-sm font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
    </div>
  );
}
