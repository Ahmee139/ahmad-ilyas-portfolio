"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";
import { gsap } from "@/utils/gsap-setup";

export default function Loader() {
  const { isLoading, progress, setProgress, finishLoading } = useLoader();
  const [timelineStarted, setTimelineStarted] = useState(false);

  // References for GSAP timeline targeting
  const loaderRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const greenOverlayRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLHeadingElement>(null);

  // Loader progress simulator (exact copy of original design to maintain visual look)
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment progress randomly for a realistic look
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading, setProgress]);

  // Synchronized GSAP Timeline Sequence triggered when loading reaches 100%
  useEffect(() => {
    if (progress >= 100 && !timelineStarted && isLoading) {
      setTimelineStarted(true);

      const tl = gsap.timeline({
        onComplete: () => {
          // Only reveal the Hero and unmount loader AFTER the green wipe has fully finished
          finishLoading();
        },
      });

      // 1. Cover the screen with the Lime Green overlay panel
      tl.to(greenOverlayRef.current, {
        y: "0%",
        duration: 0.9,
        ease: "power4.inOut",
      })
      // 2. Simultaneously fade out the compiling loader HUD content slightly before cover
      .to(hudRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.inOut",
      }, "-=0.6")
      // 3. Reveal and lift the centered "Next.js Developer" text inside the green overlay
      .to(centerTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      // 4. Hold the text for impact, then fade it out upward
      .to(centerTextRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power3.in",
        delay: 0.8,
      })
      // 5. Slide the green overlay panel upward and out of view to reveal the Hero underneath
      .to(greenOverlayRef.current, {
        y: "-100%",
        duration: 0.9,
        ease: "power4.inOut",
      });
    }
  }, [progress, timelineStarted, isLoading, finishLoading]);

  // If loading has fully finished, unmount the loader
  if (!isLoading) return null;

  const logoText = "PORTFOLIO";

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 w-full h-full bg-background-dark z-[9999] select-none overflow-hidden"
    >
      {/* 1. Black Loader HUD Panel (compiling stage) */}
      <div
        ref={hudRef}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <div className="w-[80vw] max-w-md flex flex-col items-center gap-6">
          {/* Logo letters reveal stagger */}
          <div className="flex gap-1.5 md:gap-3">
            {logoText.split("").map((char, index) => (
              <motion.span
                key={index}
                className="text-xl md:text-2xl font-display font-semibold text-silver-secondary tracking-[0.2em]"
                initial={{ opacity: 0, y: 25, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Thin Loading Progress Line */}
          <div className="relative w-full h-[1px] bg-white/15 overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-lime-accent"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>

          {/* Progress status HUD info */}
          <div className="w-full flex justify-between font-mono text-[9px] tracking-widest text-silver-primary/30 uppercase select-none">
            <span>Compiling Pipelines</span>
            <motion.span>{Math.round(progress)}%</motion.span>
          </div>
        </div>
      </div>

      {/* 2. Lime Green Swipe Transition Overlay Panel */}
      <div
        ref={greenOverlayRef}
        className="absolute inset-0 w-full h-full bg-lime-accent z-50 flex items-center justify-center"
        style={{
          transform: "translateY(100%)", // Started off-screen at bottom
          willChange: "transform",
        }}
      >
        <h2
          ref={centerTextRef}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter text-background-dark uppercase text-center select-none"
          style={{
            opacity: 0,
            transform: "translateY(30px)",
            willChange: "transform, opacity",
          }}
        >
          Next.js Developer
        </h2>
      </div>
    </div>
  );
}
