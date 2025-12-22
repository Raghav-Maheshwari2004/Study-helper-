import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 👇 NOTICE THE CURLY BRACES { } HERE!
import { ThemeProvider } from "./context/ThemeContext"; 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudySync - AI Powered Study Planner",
  description: "Transform your study sessions with AI-powered planning and organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}