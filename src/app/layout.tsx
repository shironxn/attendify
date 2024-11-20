import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/nav/navbar";
import { ThemeProvider } from "@/hooks/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import AOSComponent from "@/hooks/aos";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Attendify",
  description: "Lacak kehadiran dengan mudah hanya dengan satu ketukan menggunakan teknologi RFID kami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/cards.svg" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AOSComponent>
            <Navbar />
            <main>
              {children}
            </main>
            <Toaster />
          </AOSComponent>
        </ThemeProvider>
      </body>
    </html>
  );
}
