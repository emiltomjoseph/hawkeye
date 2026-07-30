import type { Metadata, Viewport } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Hawkeye — Web Security Assessment",
    template: "%s | Hawkeye",
  },
  description:
    "Scan any URL for HTTPS/SSL configuration, security headers, cookie security, robots.txt analysis, tech stack detection, and get an overall security score.",
  keywords: [
    "web security",
    "security scanner",
    "SSL checker",
    "security headers",
    "vulnerability assessment",
    "website security",
    "HTTPS checker",
    "security audit",
  ],
  authors: [{ name: "Hawkeye Team" }],
  openGraph: {
    title: "Hawkeye — Web Security Assessment",
    description:
      "Full security assessment for any website. Scan HTTPS, headers, cookies, tech stack, and more.",
    type: "website",
    siteName: "Hawkeye",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hawkeye — Web Security Assessment",
    description:
      "Full security assessment for any website. Scan HTTPS, headers, cookies, tech stack, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-bone">
        {/* Skip-to-content link for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-talon focus:px-4 focus:py-2 focus:text-deep focus:font-display focus:text-sm focus:uppercase"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

