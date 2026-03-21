import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import Header from "../components/header";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "T-sender",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", figtree.variable)}>
      <body className="bg-neutral-950 text-neutral-50 antialiased selection:bg-indigo-500/30">
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster richColors position="top-center" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
