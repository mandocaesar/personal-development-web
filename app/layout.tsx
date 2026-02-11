import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Skill Tracker - Engineering Competencies",
  description: "Track and assess your engineering competencies with the SWEG-HR framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={inter.variable}>
      <body className="min-h-screen bg-base-100">
        <div className="flex">
          <Navigation />
          <main className="flex-1 ml-64 min-h-screen">
            <div className="container-app py-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
