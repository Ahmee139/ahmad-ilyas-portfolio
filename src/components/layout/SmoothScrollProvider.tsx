"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { gsap } from "@/utils/gsap-setup";
import { useLoader } from "@/context/LoaderContext";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<React.ElementRef<typeof ReactLenis> | null>(null);
  const { isLoading } = useLoader();

  // 1. Hook up GSAP Ticker synchronization
  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.on("scroll", () => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.update();
        });
      });
    }

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // 2. Lock/Unlock scrolling programmatically during loader lifecycle
  useEffect(() => {
    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      if (isLoading) {
        lenisInstance.stop();
        // Tell browser not to restore scroll positions, and force absolute top scroll
        if (typeof window !== "undefined") {
          window.history.scrollRestoration = "manual";
          window.scrollTo(0, 0);
        }
      } else {
        // Force Lenis to snap to the top immediately upon loader completion
        lenisInstance.scrollTo(0, { immediate: true });
        lenisInstance.start();
      }
    }
  }, [isLoading]);

  return (
    <ReactLenis
      ref={lenisRef}
      autoRaf={false}
      root
      options={{
        duration: 1.2,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  );
}
