import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeFlex AI — Your AI Fitness Coach",
  description: "Voice-powered AI fitness trainer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
