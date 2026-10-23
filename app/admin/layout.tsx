import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Yatendra Verma Portfolio",
  description: "Secure content management and portfolio administration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
