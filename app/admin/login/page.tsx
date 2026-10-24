"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { loginAdminAction } from "@/lib/actions/admin";

function LoginFormInner() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (urlError === "session_expired") {
      return "Your admin session expired due to inactivity. Please sign in again.";
    }
    if (urlError === "unauthorized") {
      return "Access denied. Your account does not have administrator privileges.";
    }
    if (urlError === "supabase_not_configured") {
      return "Supabase credentials are not configured in .env.local yet.";
    }
    return null;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await loginAdminAction(formData);
      if (res && !res.success) {
        setErrorMessage(res.error || "Failed to log in.");
        setLoading(false);
      }
    } catch {
      // In Next.js redirect throws NEXT_REDIRECT which is caught here if not handled,
      // so if redirection begins we let it complete
    }
  };

  return (
    <div
      className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
      style={{
        background: "#0B1220",
        border: "1px solid #2A3140",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex p-3 rounded-2xl mb-4"
          style={{
            background: "rgba(74, 85, 104, 0.2)",
            color: "#E2E8F0",
            border: "1px solid rgba(74, 85, 104, 0.4)",
          }}
        >
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight font-[family-name:var(--font-display)]">
          Admin Portal
        </h1>
        <p className="text-sm text-slate-400 mt-1.5 font-[family-name:var(--font-sans)]">
          Sign in with authorized administrator credentials
        </p>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-[family-name:var(--font-sans)]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-[family-name:var(--font-sans)]"
              style={{
                background: "rgba(5, 10, 20, 0.8)",
                border: "1px solid #2A3140",
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-[family-name:var(--font-sans)]">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all font-[family-name:var(--font-sans)]"
              style={{
                background: "rgba(5, 10, 20, 0.8)",
                border: "1px solid #2A3140",
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl text-white text-sm font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-[family-name:var(--font-sans)]"
          style={{
            background: "#4A5568",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#2D3748";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#4A5568";
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In to Admin</span>
          )}
        </button>
      </form>

      {/* Footer note: no sign-up link */}
      <div
        className="mt-8 pt-4 text-center"
        style={{ borderTop: "1px solid #2A3140" }}
      >
        <p className="text-xs text-slate-500">
          Protected area. Unauthorized access attempts are monitored and restricted.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 selection:bg-slate-700 selection:text-white"
      style={{ background: "#050A14" }}
    >
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "#4A5568" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: "#2A3140" }}
        />
      </div>

      <Suspense
        fallback={
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-slate-400 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Loading admin portal...</span>
          </div>
        }
      >
        <LoginFormInner />
      </Suspense>
    </div>
  );
}
