import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import SafetyNet from "@/components/SafetyNet";
import { personalInfo, STUDENT_STATUS } from "@/data/portfolio";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://my-portfolio-plum-delta-42.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: `${personalInfo.fullName} | Python Developer & AI/ML Engineer`,
  description: `Portfolio of ${personalInfo.fullName} — ${STUDENT_STATUS}, Python Developer, AI/ML Engineer, and Computer Vision Enthusiast. Specializing in Python, Machine Learning, OpenCV, and backend development. Seeking opportunities in AI, ML, and Python development.`,
  keywords: [
    "Yatendra Verma",
    "Software Developer",
    "AI Engineer",
    "Computer Vision",
    "Machine Learning",
    "Python Developer",
    "Backend Developer",
    "FastAPI",
    "Flask",
    "OpenCV",
    "Portfolio",
  ],
  authors: [{ name: personalInfo.fullName }],
  creator: personalInfo.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${personalInfo.fullName} Portfolio`,
    title: `${personalInfo.fullName} | Python Developer & AI/ML Engineer`,
    description:
      "Passionate Python Developer and AI/ML Engineer. Explore my projects, skills, and experience in AI, Computer Vision, and backend development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${personalInfo.fullName} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalInfo.fullName} | Python Developer & AI/ML Engineer`,
    description:
      "Passionate Python Developer and AI/ML Engineer specializing in Computer Vision and Machine Learning.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#EDEDF5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: personalInfo.fullName,
              jobTitle: "Python Developer & AI/ML Engineer",
              url: SITE_URL,
              sameAs: [
                personalInfo.socialLinks.github,
                personalInfo.socialLinks.linkedin,
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "Medicaps University",
              },
              knowsAbout: [
                "Software Development",
                "Artificial Intelligence",
                "Machine Learning",
                "Computer Vision",
                "Python",
                "FastAPI",
                "OpenCV",
                "Backend Development",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <ThemeProvider>
          <SafetyNet />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
