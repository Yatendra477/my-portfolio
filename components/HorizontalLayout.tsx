"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  Children,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { testimonials } from "@/data/portfolio";

// ─── Section index map ────────────────────────────────────────────────────────
export const SECTION_IDS = [
  "home",
  "about",
  "education",
  "skills",
  "experience",
  "projects",
  "certifications",
  "achievements",
  "resume",
  ...(testimonials.length > 0 ? ["testimonials"] : []),
  "contact",
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HorizontalLayout({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const currentRef = useRef(0);
  const isAnimRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const childArray = Children.toArray(children);
  const NUM = childArray.length;

  // ── Core navigation ──────────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number, instant = false) => {
      if (index < 0 || index >= NUM) return;
      if (isAnimRef.current && !instant) return;

      isAnimRef.current = true;
      currentRef.current = index;
      setActiveIndex(index);

      // Broadcast for nav highlighting
      window.dispatchEvent(
        new CustomEvent("sectionChanged", {
          detail: { section: SECTION_IDS[index], index },
        })
      );

      gsap.to(trackRef.current, {
        x: -index * window.innerWidth,
        duration: instant ? 0 : 0.9,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: () => {
          isAnimRef.current = false;
        },
      });
    },
    [NUM]
  );

  // ── Wheel handler with inner-panel scroll awareness ─────────────────────
  useEffect(() => {
    const wrapper = document.getElementById("h-scroll-wrapper");
    if (!wrapper) return;

    let wheelAccum = 0;
    let wheelTimer: ReturnType<typeof setTimeout>;
    let lastNavigate = 0;

    const onWheel = (e: WheelEvent) => {
      const panel = panelsRef.current[currentRef.current];
      if (!panel) return;

      const goingDown = e.deltaY > 0;
      const atBottom =
        panel.scrollHeight - panel.scrollTop - panel.clientHeight < 10;
      const atTop = panel.scrollTop < 10;

      // Allow panel to scroll if not at boundary
      if (goingDown && !atBottom) return;
      if (!goingDown && !atTop) return;

      // At boundary — capture and navigate
      e.preventDefault();

      const now = Date.now();
      if (now - lastNavigate < 600) return; // throttle

      wheelAccum += e.deltaY;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelAccum = 0;
      }, 300);

      if (Math.abs(wheelAccum) >= 60) {
        lastNavigate = now;
        goTo(currentRef.current + (wheelAccum > 0 ? 1 : -1));
        wheelAccum = 0;
      }
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      wrapper.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimer);
    };
  }, [goTo]);

  // ── Touch swipe ─────────────────────────────────────────────────────────
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;

      // Only trigger horizontal navigation if swipe is more horizontal than vertical
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
        goTo(currentRef.current + (dx > 0 ? 1 : -1));
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo]);

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        ["ArrowRight", "ArrowDown"].includes(e.key) &&
        !e.target?.toString().includes("Input")
      )
        goTo(currentRef.current + 1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key))
        goTo(currentRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  // ── Navigation event listener (from nav bar clicks) ─────────────────────
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const { section } = (e as CustomEvent).detail;
      const i = SECTION_IDS.indexOf(section);
      if (i >= 0) goTo(i);
    };
    window.addEventListener("navigateTo", onNavigate);
    return () => window.removeEventListener("navigateTo", onNavigate);
  }, [goTo]);

  // ── Handle resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      goTo(currentRef.current, true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [goTo]);

  // ── Register panel refs ──────────────────────────────────────────────────
  const setPanelRef = (el: HTMLDivElement | null, i: number) => {
    if (el) panelsRef.current[i] = el;
  };

  return (
    // Outer: fixed full-viewport container that clips overflow
    <div
      id="h-scroll-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Sliding track — all panels in a flex row */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: `${NUM * 100}vw`,
          height: "100%",
          willChange: "transform",
        }}
      >
        {childArray.map((child, i) => (
          <div
            key={i}
            ref={(el) => setPanelRef(el as HTMLDivElement, i)}
            className="h-panel"
            data-section={SECTION_IDS[i] ?? i}
            style={{
              width: "100vw",
              minWidth: "100vw",
              height: "100vh",
              // Allow inner scroll for tall sections; boundary detection handles navigation
              overflowY: "auto",
              overflowX: "hidden",
              flexShrink: 0,
              position: "relative",
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* ── Bottom progress dots ──────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        {SECTION_IDS.map((id, i) => (
          <button
            key={id}
            id={`h-dot-${id}`}
            onClick={() => goTo(i)}
            title={id}
            style={{
              pointerEvents: "all",
              width: i === activeIndex ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              background:
                i === activeIndex
                  ? "var(--slate-accent)"
                  : "rgba(255,255,255,0.25)",
              padding: 0,
            }}
            aria-label={`Go to ${id}`}
          />
        ))}
      </div>
    </div>
  );
}
