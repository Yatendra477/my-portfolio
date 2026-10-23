"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck, ExternalLink } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { AdminToastProvider } from "./AdminToast";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  userEmail: string;
  unreadCount: number;
}

export default function AdminLayoutWrapper({
  children,
  userEmail,
  unreadCount,
}: AdminLayoutWrapperProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-white">Portfolio Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View live website"
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          />
        )}

        {/* Mobile Drawer Menu */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar
            userEmail={userEmail}
            unreadCount={unreadCount}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </div>

        {/* Desktop Fixed Sidebar */}
        <div className="hidden md:block shrink-0 h-screen sticky top-0">
          <AdminSidebar userEmail={userEmail} unreadCount={unreadCount} />
        </div>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminToastProvider>
  );
}
