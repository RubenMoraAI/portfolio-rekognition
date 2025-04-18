import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ImageUploaderProvider } from "@/context/ImageUploaderContext";
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = "width=device-width, initial-scale=1.0";

export const metadata: Metadata = {
  metadataBase: new URL("https://rekognition-app.rubenmora.dev"),
  title: "Rekognition App - AI Facial Recognition",
  description:
    "Experience advanced facial recognition with our intelligent image analysis app. Upload images and get accurate, fast results.",
  keywords:
    "facial recognition, AI, image analysis, smart recognition, face detection, computer vision",
  authors: [
    {
      name: "Ruben Mora - Fullstack Software Engineer",
      url: "https://rubenmora.dev",
    },
  ],
  openGraph: {
    title: "Rekognition App - Smart Facial Recognition",
    description:
      "Experience advanced facial recognition with our intelligent image analysis app. Upload images and get accurate, fast results.",
    url: "https://rekognition-app.rubenmora.dev",
    type: "website",
    images: [
      {
        url: "/rekognition-opengraph.png",
        width: 600,
        height: 400,
        alt: "Rekognition App - OpenGraph preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rekognition App - Smart Facial Recognition",
    description:
      "Experience advanced facial recognition with our intelligent image analysis app. Upload images and get accurate, fast results.",
    images: ["/rekognition-x.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
          <ImageUploaderProvider>
            {children}
            <Toaster />
          </ImageUploaderProvider> 
      </body>
    </html>
  );
}
