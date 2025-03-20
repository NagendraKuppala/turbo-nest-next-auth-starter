import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "KwikDeals | The Best Deals, Coupons, Discounts & Flyers in Canada",
    template: "%s | KwikDeals",
  },
  description:
    "Join KwikDeals - Canada's community-driven platform where savvy shoppers discover, share, and get rewarded for posting the best deals, coupons, and discounts.",
  keywords:
    "deals, coupons, promo codes, discounts, savings, Canada, tipping, deal sharing, community deals",
  metadataBase: new URL("https://kwikdeals.net"),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://kwikdeals.net",
    siteName: "KwikDeals",
    title: "KwikDeals - The best Deals, Discounts, Coupons & Flyers in Canada",
    description:
      "Discover unbeatable deals curated by a community of smart shoppers. Save money and get tipped for sharing great deals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KwikDeals - The best Deals, Discounts, Coupons & Flyers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KwikDeals",
    creator: "@KwikDeals",
    title: "KwikDeals - The best Deals, Discounts, Coupons & Flyers in Canada",
    description:
      "Discover unbeatable deals curated by a community of smart shoppers. Save money and get tipped for sharing great deals.",
    images: ["/og-twitter.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "flex min-h-screen flex-col px-4"
        )}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
