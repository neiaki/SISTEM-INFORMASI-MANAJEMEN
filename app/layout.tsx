import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "AcadTrack — Manajemen Tugas & Proyek Kuliah",
  description:
    "Platform manajemen tugas dan proyek perkuliahan untuk mahasiswa, dosen, admin, dan staff TU Universitas Pamulang. Submit, review, rekap pengumpulan, semua dalam satu dashboard.",
  openGraph: {
    title: "AcadTrack — Manajemen Tugas & Proyek Kuliah",
    description:
      "Platform manajemen tugas dan proyek perkuliahan untuk mahasiswa dan dosen Universitas Pamulang.",
    siteName: "AcadTrack",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/Unpam-Victor.jpeg", width: 1200, height: 630, alt: "AcadTrack — Manajemen Tugas & Proyek Kuliah" }],
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
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        <link
          rel="preload"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap"
          as="style"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AcadTrack",
              "url": "https://acadtrack.unpam.ac.id",
              "description": "Sistem manajemen pembelajaran digital terintegrasi untuk mahasiswa dan dosen Universitas Pamulang.",
              "publisher": {
                "@type": "Organization",
                "name": "Universitas Pamulang",
                "url": "https://www.unpam.ac.id",
                "logo": { "@type": "ImageObject", "url": "https://acadtrack.unpam.ac.id/Unpam-Victor.jpeg" }
              }
            })
          }}
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
