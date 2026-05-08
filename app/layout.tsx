import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "AcadTrack — Platform E-Learning Universitas Pamulang",
  description:
    "Sistem manajemen pembelajaran digital terintegrasi untuk mahasiswa dan dosen Universitas Pamulang. Kelola tugas, jurnal, kuis, dan penilaian dalam satu platform.",
  openGraph: {
    title: "AcadTrack — Platform E-Learning Universitas Pamulang",
    description:
      "Sistem manajemen pembelajaran digital terintegrasi untuk mahasiswa dan dosen Universitas Pamulang.",
    siteName: "AcadTrack",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
