"use client";

import React, { useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  Phone,
  Search,
  ExternalLink,
  Inbox,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { toggleMessageReadAction, deleteMessageAction } from "@/lib/actions/admin";

export interface MessageItem {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
}

interface MessagesInboxProps {
  initialMessages: MessageItem[];
}

export default function MessagesInbox({ initialMessages }: MessagesInboxProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showSuccess, showError } = useAdminToast();

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread" && msg.is_read) return false;
    if (filter === "read" && !msg.is_read) return false;
    if (!search.trim()) return true;

    const q = search.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    const nextRead = !currentRead;
    try {
      const res = await toggleMessageReadAction(id, nextRead);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_read: nextRead } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, is_read: nextRead } : null));
        }
        showSuccess(nextRead ? "Marked as read." : "Marked as unread.");
      } else {
        showError(res.error || "Failed to update status.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update.";
      showError(message);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const res = await deleteMessageAction(deletingId);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== deletingId));
        if (selectedMessage?.id === deletingId) setSelectedMessage(null);
        showSuccess("Message deleted.");
        setDeletingId(null);
      } else {
        showError(res.error || "Failed to delete message.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete.";
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 font-[family-name:var(--font-sans)]">
      {/* Top Filter and Search Bar */}
      <div
        className="p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: "#0B1220",
          border: "1px solid #2A3140",
        }}
      >
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-[#4A5568] text-white shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-white border border-[#2A3140]"
            }`}
          >
            All ({messages.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filter === "unread"
                ? "bg-[#4A5568] text-white shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-white border border-[#2A3140]"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === "read"
                ? "bg-[#4A5568] text-white shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-white border border-[#2A3140]"
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sender, subject..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
            style={{
              background: "#050A14",
              border: "1px solid #2A3140",
            }}
          />
        </div>
      </div>

      {/* Message List and Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List Column */}
        <div className={`space-y-2.5 ${selectedMessage ? "lg:col-span-5" : "lg:col-span-12"}`}>
          {filteredMessages.map((msg) => {
            const isSelected = selectedMessage?.id === msg.id;

            return (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.is_read) handleToggleRead(msg.id, false);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? "bg-[#0E1729] border-[#4A5568] shadow-md"
                    : msg.is_read
                    ? "bg-[#080E1A] border-[#2A3140]/60 hover:bg-[#0B1220]"
                    : "bg-[#0B1220] border-[#2A3140] hover:bg-[#0E1729] shadow-sm"
                }`}
              >
                {!msg.is_read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#16A34A]" />
                )}

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={`text-sm truncate ${
                      !msg.is_read ? "font-bold text-white" : "font-medium text-slate-300"
                    }`}
                  >
                    {msg.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                <p
                  className={`text-xs mb-1 truncate ${
                    !msg.is_read ? "font-semibold text-slate-200" : "text-slate-400"
                  }`}
                >
                  {msg.subject || "(No subject)"}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            );
          })}

          {filteredMessages.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400">
              <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">No messages found</p>
              <p className="text-xs text-slate-500 mt-1">
                Submissions from the public contact form will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Selected Message Detailed View */}
        {selectedMessage && (
          <div
            className="lg:col-span-7 p-6 rounded-2xl shadow-xl space-y-6 sticky top-6 animate-in fade-in"
            style={{
              background: "#0B1220",
              border: "1px solid #2A3140",
            }}
          >
            {/* Header / Actions */}
            <div className="flex items-start justify-between gap-4 pb-4" style={{ borderBottom: "1px solid #2A3140" }}>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Subject
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5 break-words font-[family-name:var(--font-display)]">
                  {selectedMessage.subject || "(No subject)"}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatDate(selectedMessage.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.is_read)}
                  title={selectedMessage.is_read ? "Mark unread" : "Mark read"}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {selectedMessage.is_read ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <MailOpen className="w-4 h-4 text-emerald-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingId(selectedMessage.id)}
                  title="Delete message"
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sender Details */}
            <div
              className="p-4 rounded-xl space-y-2"
              style={{
                background: "#050A14",
                border: "1px solid #2A3140",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">From</p>
                  <p className="text-sm font-bold text-white font-[family-name:var(--font-display)]">{selectedMessage.name}</p>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject || ""
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-colors"
                  style={{
                    background: "#4A5568",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#2D3748";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "#4A5568";
                  }}
                >
                  <span>Reply via Email</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono">{selectedMessage.email}</span>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono">{selectedMessage.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">Message Content</span>
              <div
                className="p-4 rounded-xl text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans"
                style={{
                  background: "#050A14",
                  border: "1px solid #2A3140",
                }}
              >
                {selectedMessage.message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Message"
        message="Are you sure you want to permanently delete this contact submission?"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
