import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HGS_football_manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`bg-gray-50 min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`} cz-shortcut-listen="true"
      >
        {children}
      </body>
    </html>
  );
}
