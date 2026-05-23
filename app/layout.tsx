import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watrmark Print Quote Calculator",
  description: "Artwork coverage and print quote calculator for Watrmark Pvt Ltd.",
  metadataBase: new URL("https://www.watrmark.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
