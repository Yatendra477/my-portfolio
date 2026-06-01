"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Copy,
  Check,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { personalInfo } from "@/data/portfolio";
import SectionHeading from "./SectionHeading";
import { fadeUpVariant, fadeLeftVariant, fadeRightVariant } from "@/lib/animations";

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: personalInfo.location,
    href: "#",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "Yatendra Verma",
    href: personalInfo.socialLinks.linkedin,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "Yatendra477",
    href: personalInfo.socialLinks.github,
  },
];

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here (Formspree, EmailJS, etc.)
    alert("Thank you for your message! I'll get back to you soon.");
    setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="section-container">
        <SectionHeading
          title="Get In"
          highlight="Touch"
          subtitle="Have a question or want to work together? Let's connect!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            variants={fadeLeftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: "var(--text-heading)" }}
            >
              Contact Information
            </h3>

            {contactCards.map((card) => (
              <div
                key={card.label}
                className="glass-card p-4 flex items-center gap-4 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                  }}
                >
                  <card.icon
                    width={20}
                    height={20}
                    style={{ color: "var(--color-electric-400)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-medium mb-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {card.label}
                  </p>
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-sm font-medium no-underline truncate block"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {card.value}
                  </a>
                </div>
                {card.label !== "Location" && (
                  <motion.button
                    onClick={() => handleCopy(card.value, card.label)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "var(--glass-bg)",
                      color: "var(--text-secondary)",
                    }}
                    whileTap={{ scale: 0.85 }}
                    title="Copy to clipboard"
                  >
                    {copied === card.label ? (
                      <Check size={14} style={{ color: "var(--color-emerald-400)" }} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </motion.button>
                )}
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeRightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8">
              <h3
                className="text-xl font-bold mb-6"
                style={{ color: "var(--text-heading)" }}
              >
                Send a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="text-xs font-medium mb-1.5 block"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-medium mb-1.5 block"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="text-xs font-medium mb-1.5 block"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({ ...formState, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-medium mb-1.5 block"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-primary)",
                    }}
                    placeholder="Collaboration opportunity"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="text-xs font-medium mb-1.5 block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Your message here..."
                />
              </div>

              <motion.button
                type="submit"
                className="btn-primary w-full justify-center text-base py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={18} /> Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
