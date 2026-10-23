"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import SectionHeading from "./SectionHeading";
import { fadeLeftVariant, fadeRightVariant } from "@/lib/animations";
import type { SiteSettings } from "@/lib/data";
import { submitContactMessage } from "@/lib/actions/contact";

interface ContactProps {
  settings: SiteSettings;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

export default function Contact({ settings }: ContactProps) {
  const contactCards = [
    {
      icon: Mail,
      label: "Email",
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
      ariaLabel: `Email ${settings.name}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings.contactPhone,
      href: `tel:${settings.contactPhone}`,
      ariaLabel: `Call ${settings.contactPhone}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: settings.contactLocation,
      href: "https://maps.google.com/?q=Indore,+Madhya+Pradesh,+India",
      ariaLabel: "View location on Google Maps",
    },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: settings.name,
      href: settings.linkedinUrl,
      ariaLabel: "LinkedIn profile",
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      value: "Yatendra477",
      href: settings.githubUrl,
      ariaLabel: "GitHub profile",
    },
  ];
  const [copied, setCopied] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!formState.name.trim() || formState.name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim() || !emailRegex.test(formState.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (formState.phone.trim() && formState.phone.trim().length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!formState.subject.trim() || formState.subject.trim().length < 3) {
      errors.subject = "Please enter a subject (at least 3 characters).";
    }

    if (!formState.message.trim() || formState.message.trim().length < 10) {
      errors.message = "Please enter a message (at least 10 characters).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Save submission to messages table
      await submitContactMessage(formState);

      // Keep existing submit behavior
      alert("Thank you for your message! I'll get back to you soon.");
      setSuccessMessage("Thank you for your message! I'll get back to you soon.");
      setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
      setFormErrors({});
    } catch {
      // In case of unexpected issue
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Get In"
          highlight="Touch"
          subtitle="Have a question or want to work together? Let's connect!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* ── Left Column: Contact Info + Organic Blob Avatar Decoration ── */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-6"
            variants={fadeLeftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div>
              <h3
                className="text-xl font-bold mb-1 font-[family-name:var(--font-display)]"
                style={{ color: "#1B1F3B" }}
              >
                Contact Information
              </h3>
              <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                Feel free to connect directly through any of these platforms.
              </p>
            </div>

            {/* Contact list cards */}
            <div className="space-y-3">
              {contactCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 group hover:shadow-sm"
                    style={{
                      background: "#F3F4F6",
                      border: "1px solid #D1D5DB",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(209, 213, 219, 0.8)",
                        color: "#1B1F3B",
                      }}
                    >
                      <IconComponent
                        width={18}
                        height={18}
                        className="text-[#1B1F3B]"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: "#6B7280" }}
                      >
                        {card.label}
                      </p>
                      <a
                        href={card.href}
                        target={card.href.startsWith("http") ? "_blank" : undefined}
                        rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm font-semibold no-underline truncate block transition-colors hover:text-[#4A5568]"
                        style={{ color: "#1B1F3B" }}
                        aria-label={card.ariaLabel}
                      >
                        {card.value}
                      </a>
                    </div>

                    {card.label !== "Location" && (
                      <button
                        type="button"
                        onClick={() => handleCopy(card.value, card.label)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border border-[#D1D5DB]/80 bg-white text-[#6B7280] hover:text-[#1B1F3B] hover:border-[#4A5568] transition-all shadow-2xs"
                        aria-label={`Copy ${card.label} to clipboard`}
                        title="Copy to clipboard"
                      >
                        {copied === card.label ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reference Organic Blob + "Hi!" Speech Bubble Decoration */}
            <div
              className="relative rounded-3xl p-6 overflow-hidden flex flex-col items-center justify-center min-h-[200px]"
              style={{
                background: "#F3F4F6",
                border: "1px solid #D1D5DB",
              }}
            >
              {/* Soft gray organic blob in the background */}
              <div
                className="absolute w-44 h-44 rounded-[50%_60%_70%_40%/60%_40%_60%_50%] pointer-events-none blur-xs"
                style={{ background: "#D3D4E2", opacity: 0.8 }}
              />

              {/* Standing avatar with Hi! bubble */}
              <div className="relative z-10 w-36 h-48 flex items-center justify-center">
                <Image
                  src="/images/profile-cutout.png"
                  alt="Yatendra Verma"
                  fill
                  sizes="144px"
                  className="object-contain drop-shadow-md select-none pointer-events-none"
                />

                {/* Dark "Hi!" speech bubble with tail pointing toward head */}
                <div
                  className="absolute -top-1 -right-2 z-20 px-3 py-1 rounded-full font-bold text-xs shadow-md select-none flex items-center justify-center"
                  style={{ background: "#1B1F3B", color: "#FFFFFF" }}
                >
                  Hi!
                  <div
                    className="absolute -bottom-1 left-2.5 w-2 h-2 rotate-45"
                    style={{ background: "#1B1F3B" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: The Contact Form ── */}
          <motion.div
            className="lg:col-span-7"
            variants={fadeRightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm"
              style={{
                background: "#F3F4F6",
                border: "1px solid #D1D5DB",
              }}
            >
              <div className="mb-6">
                <h3
                  className="text-xl font-bold mb-1 font-[family-name:var(--font-display)]"
                  style={{ color: "#1B1F3B" }}
                >
                  Send a Message
                </h3>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Fill in your details and I will get back to you as soon as possible.
                </p>
              </div>

              {/* Status / Success message */}
              {successMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium shadow-xs"
                >
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                    style={{ color: "#4A5568" }}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                    value={formState.name}
                    onChange={(e) => {
                      setFormState({ ...formState, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "#FFFFFF",
                      border: formErrors.name ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
                      color: "#1B1F3B",
                    }}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p id="name-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" /> {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                    style={{ color: "#4A5568" }}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                    value={formState.email}
                    onChange={(e) => {
                      setFormState({ ...formState, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "#FFFFFF",
                      border: formErrors.email ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
                      color: "#1B1F3B",
                    }}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p id="email-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" /> {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Phone */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                    style={{ color: "#4A5568" }}
                  >
                    Phone <span className="text-xs font-normal text-[#6B7280]">(optional)</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    aria-invalid={Boolean(formErrors.phone)}
                    aria-describedby={formErrors.phone ? "phone-error" : undefined}
                    value={formState.phone}
                    onChange={(e) => {
                      setFormState({ ...formState, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "#FFFFFF",
                      border: formErrors.phone ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
                      color: "#1B1F3B",
                    }}
                    placeholder="+91 94796 XXXXX"
                  />
                  {formErrors.phone && (
                    <p id="phone-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" /> {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                    style={{ color: "#4A5568" }}
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(formErrors.subject)}
                    aria-describedby={formErrors.subject ? "subject-error" : undefined}
                    value={formState.subject}
                    onChange={(e) => {
                      setFormState({ ...formState, subject: e.target.value });
                      if (formErrors.subject) setFormErrors({ ...formErrors, subject: undefined });
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: "#FFFFFF",
                      border: formErrors.subject ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
                      color: "#1B1F3B",
                    }}
                    placeholder="Project Inquiry / Job Opportunity"
                  />
                  {formErrors.subject && (
                    <p id="subject-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" /> {formErrors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold uppercase tracking-wider mb-1.5 block"
                  style={{ color: "#4A5568" }}
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(formErrors.message)}
                  aria-describedby={formErrors.message ? "message-error" : undefined}
                  rows={5}
                  value={formState.message}
                  onChange={(e) => {
                    setFormState({ ...formState, message: e.target.value });
                    if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                  style={{
                    background: "#FFFFFF",
                    border: formErrors.message ? "1.5px solid #EF4444" : "1px solid #D1D5DB",
                    color: "#1B1F3B",
                  }}
                  placeholder="Share details about your project, timeline, or question..."
                />
                {formErrors.message && (
                  <p id="message-error" role="alert" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" /> {formErrors.message}
                  </p>
                )}
              </div>

              {/* Full-width Dark "Send Message" Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "#1B1F3B",
                }}
                whileHover={!isLoading ? { scale: 1.01, backgroundColor: "#2D3748" } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
