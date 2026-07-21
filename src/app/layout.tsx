import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { SkipLink } from "./components/SkipLink";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://faithassociates.co.uk"),
  title: "Faith Associates | Building Standards Across The Globe",
  description:
    "Faith Associates are a global consultancy empowering communities, building standards and protecting places of worship across the world.",
  applicationName: "Faith Associates",
  authors: [{ name: "Faith Associates", url: "https://faithassociates.co.uk" }],
  creator: "Faith Associates",
  publisher: "Faith Associates",
  keywords: [
    "faith institution consultancy",
    "mosque governance",
    "madrassah safeguarding",
    "mosque security",
    "faith leadership",
    "community development",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Faith Associates",
    title: "Faith Associates | Building Standards Across The Globe",
    description:
      "Global consultancy, training and programmes that strengthen faith institutions, leaders and communities.",
    images: [
      {
        url: "/assets/real/mosque-expo-2024-hall.jpg",
        width: 1110,
        height: 550,
        alt: "Faith Associates leaders and partners at Mosque Expo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Faith Associates | Building Standards Across The Globe",
    description:
      "Global consultancy, training and programmes that strengthen faith institutions, leaders and communities.",
    images: ["/assets/real/mosque-expo-2024-hall.jpg"],
  },
  category: "consulting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className={`${sourceSans.className} flex min-h-full flex-col font-sans antialiased`}>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
