import { Outfit, Inter, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";

import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Navbar } from "@/components/Navbar";
import { getAuthUser } from "@/app/actions/auth";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "TravelAI - Architect Your Next Journey",
  description: "AI-powered personalized travel itineraries crafted in seconds.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <Navbar user={user} />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <VoiceAssistant />
      </body>
    </html>
  );
}
