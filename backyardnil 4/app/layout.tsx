import type { Metadata } from "next";
import { Saira_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";

const sairaCondensed = Saira_Condensed({
  variable: "--font-saira-condensed",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BackyardNIL — Where Local Brands Meet Local Legends",
  description:
    "The first NIL platform built for high school athletes — and the parents behind them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sairaCondensed.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-turf text-chalk">
        {children}
      </body>
    </html>
  );
}
