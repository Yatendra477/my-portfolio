"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldAlert, LogOut, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logoutAdminAction } from "@/lib/actions/admin";

// ── Centralized Inactivity Configuration ──────────────────────────────
export const INACTIVITY_CONFIG = {
  TIMEOUT_MS: 15 * 60 * 1000, // 15 minutes total inactivity
  WARNING_MS: 60 * 1000,       // 60 seconds warning dialog duration
  ACTIVITY_THROTTLE_MS: 2000,  // Record activity at most once every 2 seconds
};

const STORAGE_KEY = "admin_last_active_timestamp";
const SYNC_CHANNEL = "admin_inactivity_channel";

export default function AdminInactivityWatcher() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lastActivityRef = useRef<number>(0);
  const lastRecordedRef = useRef<number>(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Broadcast activity to other browser tabs
  const broadcastActivity = (timestamp: number) => {
    try {
      if (typeof window !== "undefined" && "localStorage" in window) {
        localStorage.setItem(STORAGE_KEY, timestamp.toString());
      }
      channelRef.current?.postMessage({ type: "ACTIVITY", timestamp });
    } catch {
      // Ignore storage/broadcast errors
    }
  };

  // Perform secure sign out and redirect with reason
  const performLogout = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      channelRef.current?.postMessage({ type: "LOGOUT" });
    } catch {
      // Fallback
    }
    router.push("/admin/login?error=session_expired");
  }, [router]);

  // Record user activity
  const handleUserActivity = useCallback(() => {
    const now = Date.now();
    // Throttle event handlers to prevent performance overhead
    if (now - lastRecordedRef.current < INACTIVITY_CONFIG.ACTIVITY_THROTTLE_MS) {
      return;
    }
    lastRecordedRef.current = now;
    lastActivityRef.current = now;
    broadcastActivity(now);

    // If warning was visible and user actively interacted, dismiss warning
    setShowWarning((prev) => {
      if (prev) {
        setSecondsRemaining(Math.round(INACTIVITY_CONFIG.WARNING_MS / 1000));
      }
      return false;
    });
  }, []);

  // "Stay logged in" action
  const handleStayLoggedIn = async () => {
    setIsRefreshing(true);
    try {
      const supabase = createClient();
      await supabase.auth.getSession();
      const now = Date.now();
      lastActivityRef.current = now;
      broadcastActivity(now);
      setShowWarning(false);
      setSecondsRemaining(Math.round(INACTIVITY_CONFIG.WARNING_MS / 1000));
    } catch {
      // Fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initialize timestamp
    lastActivityRef.current = Date.now();
    broadcastActivity(lastActivityRef.current);

    // Setup cross-tab sync via BroadcastChannel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channelRef.current = new BroadcastChannel(SYNC_CHANNEL);
      channelRef.current.onmessage = (event) => {
        if (event.data?.type === "ACTIVITY" && typeof event.data.timestamp === "number") {
          lastActivityRef.current = Math.max(lastActivityRef.current, event.data.timestamp);
          setShowWarning(false);
        } else if (event.data?.type === "LOGOUT") {
          router.push("/admin/login?error=session_expired");
        }
      };
    }

    // Storage event fallback for cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const ts = parseInt(e.newValue, 10);
        if (!isNaN(ts)) {
          lastActivityRef.current = Math.max(lastActivityRef.current, ts);
          setShowWarning(false);
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    // Meaningful user activity event listeners
    const activityEvents = ["mousemove", "pointerdown", "keydown", "touchstart", "click"];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Check timer every 1 second
    const timerInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const warningThreshold = INACTIVITY_CONFIG.TIMEOUT_MS - INACTIVITY_CONFIG.WARNING_MS;

      if (elapsed >= INACTIVITY_CONFIG.TIMEOUT_MS) {
        clearInterval(timerInterval);
        performLogout();
      } else if (elapsed >= warningThreshold) {
        setShowWarning(true);
        const remaining = Math.max(
          0,
          Math.ceil((INACTIVITY_CONFIG.TIMEOUT_MS - elapsed) / 1000)
        );
        setSecondsRemaining(remaining);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      window.removeEventListener("storage", handleStorage);
      channelRef.current?.close();
    };
  }, [handleUserActivity, performLogout, router]);

  if (!showWarning) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="inactivity-title"
      aria-describedby="inactivity-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
    >
      <div
        className="w-full max-w-md p-6 sm:p-7 rounded-2xl shadow-2xl border"
        style={{
          background: "#0B1220",
          borderColor: "#2A3140",
          color: "#F3F4F6",
        }}
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              color: "#EF4444",
              border: "1px solid rgba(239, 68, 68, 0.25)",
            }}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 id="inactivity-title" className="text-base font-bold text-white tracking-tight">
              Session Timeout Warning
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin panel automatic security logout
            </p>
          </div>
        </div>

        <p id="inactivity-desc" className="text-sm text-slate-300 leading-relaxed mb-6">
          You have been inactive for nearly 15 minutes. For your security, you will be
          automatically signed out in:
        </p>

        {/* Big countdown badge */}
        <div
          className="flex items-center justify-center gap-2 p-4 rounded-xl mb-6 font-mono font-bold text-2xl"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid #2A3140",
            color: secondsRemaining <= 15 ? "#EF4444" : "#FACC15",
          }}
        >
          <Clock className="w-5 h-5 animate-pulse" />
          <span>{secondsRemaining}s remaining</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={async () => {
              await logoutAdminAction();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border transition-colors flex items-center justify-center gap-2"
            style={{
              background: "transparent",
              borderColor: "#2A3140",
            }}
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Log Out Now</span>
          </button>

          <button
            type="button"
            onClick={handleStayLoggedIn}
            disabled={isRefreshing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: "#4A5568",
            }}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Refreshing Session...</span>
              </>
            ) : (
              <span>Stay Logged In</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
