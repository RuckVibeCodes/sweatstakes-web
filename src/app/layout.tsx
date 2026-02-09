import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SweatStakes - 6 Week Fitness Challenge",
  description: "Transform your body, win cash prizes. Join the ultimate fitness challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-neutral-950`}>
        <AuthProvider>
          <Navigation />
          <main className="pb-20 md:pb-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
