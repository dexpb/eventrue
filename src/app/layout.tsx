"use client";
import { SessionProvider } from "next-auth/react";

import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-zinc-950 text-zinc-300 font-inter`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
