import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LoaderProvider } from "@/context/LoaderContext";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import PageTransition from "@/components/layout/PageTransition";
import Loader from "@/components/common/Loader";
import CustomCursor from "@/components/common/CustomCursor";
import Noise from "@/components/common/Noise";
import AmbientGlow from "@/components/common/AmbientGlow";
import Particles from "@/components/common/Particles";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Developer Portfolio",
  description: "A premium interactive developer portfolio showcasing bleeding-edge 3D graphics, smooth scrolling, and immersive physics-based animations.",
  openGraph: {
    title: "Premium Developer Portfolio",
    description: "Bleeding-edge 3D and high-performance smooth animations.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Developer Portfolio",
    description: "Bleeding-edge 3D and high-performance smooth animations.",
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} dark antialiased`}
    >
      <body>
        <LoaderProvider>
          {/* Bottom visual assets (z-indices kept low) */}
          <AmbientGlow />
          <Particles />
          
          {/* Top aesthetic layers (z-indices high, but click-through safe) */}
          <Noise />
          <CustomCursor />
          <Loader />

          {/* Core content container with scroll and page transitions */}
          <SmoothScrollProvider>
            <PageTransition>{children}</PageTransition>
          </SmoothScrollProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
