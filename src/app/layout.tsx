import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../styles.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const solaimanLipi = localFont({
  src: [
    {
      path: "../assets/fonts/SolaimanLipi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/SolaimanLipi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-solaiman-lipi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MarryLife | দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত প্ল্যাটফর্ম",
  description:
    "আপনার পছন্দের এলাকার দ্বীনদার পাত্র-পাত্রীর বায়োডাটা খুঁজুন ও তৈরি করুন — সম্পূর্ণ বিনামূল্যে।",
  openGraph: {
    title: "MarryLife | দ্বীনদার জীবনসঙ্গী খোঁজার বিশ্বস্ত প্ল্যাটফর্ম",
    description:
      "আপনার পছন্দের এলাকার দ্বীনদার পাত্র-পাত্রীর বায়োডাটা খুঁজুন ও তৈরি করুন — সম্পূর্ণ বিনামূল্যে।",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className={solaimanLipi.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
        <link rel="stylesheet" href="https://fonts.maateen.me/solaiman-lipi/font.css" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
