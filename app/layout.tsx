import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import TopNav from "./components/TopNav";
import { ScrollTriggerCleanup } from "./components/motion/ScrollTriggerCleanup";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Joshua Vallabhaneni Portfolio",
  description:
    "Portfolio of Joshua Vallabhaneni — full-stack engineer and ML researcher at the University of Maryland.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <ScrollTriggerCleanup />
          <TopNav />
          <main>{children}</main>
          <footer className="hairline">
            <div className="container-editorial flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-10 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Joshua Vallabhaneni</span>
              <span>College Park, MD</span>
            </div>
          </footer>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
