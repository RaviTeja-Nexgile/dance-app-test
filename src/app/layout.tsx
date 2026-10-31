import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dance Studio Pro",
  description: "Learn dance through tutorials, practice with your camera, and track your progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
