import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diamond Center Antwerp | Cinematic 3D",
  description: "A cinematic 3D render of the Diamond Center in Antwerp, Belgium.",
  openGraph: {
    type: "website",
    title: "Diamond Center Antwerp | Cinematic 3D",
    description: "Explore a cinematic 3D experience of the Diamond Center in Antwerp, Belgium.",
    url: "https://agentic-c5899b8a.vercel.app",
    siteName: "Diamond Center Antwerp"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  minimumScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
