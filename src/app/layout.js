import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import {ThemeProvider} from "./theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Side Project Tracker",
  description: "Can't handle all your side projects? This simple tool will help you track them.",
};

export default function RootLayout({ children }) {

  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-[#0a0a0a] bg-white text-black dark:text-white`}
      >
        <ThemeProvider>
        <Toaster toastOptions={{
          style:{
            background: 'var(--modal-background)',
            color: 'var(--toast-text)',
          }
        }} position="top-center" />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
