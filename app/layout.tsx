import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
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
  title: "Joshua Vallabhaneni — Engineer & Researcher",
  description:
    "Portfolio of Joshua Vallabhaneni — full-stack engineer and ML researcher at the University of Maryland.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollTriggerCleanup />
          <TopNav />
          <main>{children}</main>
          <footer className="hairline">
            <div className="container-editorial flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-10 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Joshua Vallabhaneni</span>
              <div className="flex items-center gap-6">
                <a href="https://github.com/Joshua-Vallabhaneni" target="_blank" rel="noopener noreferrer" className="link-underline">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/joshua-vallabhaneni" target="_blank" rel="noopener noreferrer" className="link-underline">
                  LinkedIn
                </a>
                <a href="mailto:pjvallabhaneni@gmail.com" className="link-underline">
                  Email
                </a>
                <ModeToggle />
              </div>
            </div>
          </footer>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
