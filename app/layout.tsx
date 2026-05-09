import type { Metadata } from "next";
import { NotificationProvider } from '@/context/NotificationContext';
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

export const metadata: Metadata = {
  // 基础标题与模板：子页面会自动变为 "产品名 | Ale Statue Vault"
  title: {
    default: "Ale Statue Vault | Artisan GK Statues & Resin Collectibles",
    template: "%s | Ale Statue Vault",
  },
  description: "Discover museum-grade, 1/4 and 1/6 scale hand-painted resin statues. Ale Statue Vault curates limited edition GK masterpieces from world-class studios with secure global shipping.",
  keywords: ["Artisan GK Statues", "Resin Collectibles", "Hand-painted Statues", "AleToys", "1/4 Scale Statue", "Anime Masterpieces"],
  
  // Open Graph：用于 Facebook, WhatsApp, Discord 预览
  openGraph: {
    title: "Ale Statue Vault | Elite Resin Collectibles",
    description: "Hand-painted limited edition masterpieces for discerning collectors.",
    url: "https://www.aletoys.com",
    siteName: "Ale Statue Vault",
    images: [
      {
        url: "https://www.aletoys.com/og-image.jpg", // ⚠️ 请在 public 文件夹放一张名为 og-image.jpg 的震撼雕像图
        width: 1200,
        height: 630,
        alt: "Ale Statue Vault - Elite Artisan Statues",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter (X) 预览
  twitter: {
    card: "summary_large_image",
    title: "Ale Statue Vault | Artisan GK Statues",
    description: "Premium hand-painted resin masterpieces. Worldwide shipping.",
    images: ["https://www.aletoys.com/og-image.jpg"],
  },

  // 这里的 metadataBase 很重要，用于生成绝对路径链接
  metadataBase: new URL("https://www.aletoys.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
      <NotificationProvider>{children}</NotificationProvider></body>
    </html>
  );
}
