import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { UserProvider } from '@/contexts/UserContext';
import { ThemeProvider } from './Providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrewFlow - 內部管理系統",
  description: "請假與服務紀錄管理系統",
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CrewFlow',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <UserProvider>
            <Navigation />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <div className="container py-4 sm:py-6">
                {children}
              </div>
            </main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
