import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yatendra Verma | Python Developer & AI/ML Engineer",
  description:
    "Portfolio of Yatendra Verma — Python Developer, AI/ML Engineer, and Computer Vision Enthusiast. Specializing in Python, Machine Learning, OpenCV, and backend development. Seeking opportunities in AI, ML, and Python development.",
  keywords: [
    "Yatendra Verma",
    "Software Developer",
    "AI Engineer",
    "Computer Vision",
    "Machine Learning",
    "Python Developer",
    "Full Stack Developer",
    "Portfolio",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Yatendra Verma" }],
  creator: "Yatendra Verma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yatendraverma.dev",
    siteName: "Yatendra Verma Portfolio",
    title: "Yatendra Verma | Python Developer & AI/ML Engineer",
    description:
      "Passionate Python Developer and AI/ML Engineer. Explore my projects, skills, and experience in AI, Computer Vision, and backend development.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yatendra Verma Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yatendra Verma | Python Developer & AI/ML Engineer",
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
        <meta name="theme-color" content="#0A0A0A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Yatendra Verma",
              jobTitle: "Python Developer & AI/ML Engineer",
              url: "https://yatendraverma.dev",
              sameAs: [
                "https://github.com/Yatendra477",
                "https://www.linkedin.com/in/yatendra-verma-0899a6246",
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
                "React",
                "Full Stack Development",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
