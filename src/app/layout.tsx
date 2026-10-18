import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const meridianSans = Plus_Jakarta_Sans({
  variable: "--font-meridian-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Merevo Booking Platform",
    template: "%s · Merevo",
  },
  description:
    "Secure multi-tenant booking-request platform for Merevo client businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${meridianSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
