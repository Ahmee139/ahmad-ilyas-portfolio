"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SpotlightTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightText({ children, className }: SpotlightTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Motion values for client-relative mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for liquid-smooth movement and expansion
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });
  const radius = useSpring(0, { stiffness: 150, damping: 25 });

  useEffect(() => {
    // Check for user accessibility prefers-reduced-motion media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Update mouse coordinates relative to the container bounding box
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    radius.set(110); // Diameter is 220px, so radius is 110px
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    radius.set(0); // Smoothly collapse radius to 0px on leave
  };

  // Compile circular clip path mask string
  const clipPath = useTransform(
    [springX, springY, radius],
    ([x, y, r]) => `circle(${r}px at ${x}px ${y}px)`
  );

  // If accessibility prefers-reduced-motion is active, disable the effect
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-visible group select-none w-full"
    >
      {/* 1. Bottom Layer: Default Silver Typography */}
      <div className={className}>
        {children}
      </div>

      {/* 2. Top Layer: Custom Reveal Spotlight Overlay */}
      <motion.div
        className="spotlight-top-layer absolute inset-0 bg-lime-accent text-background-dark pointer-events-none select-none overflow-hidden rounded-lg z-20"
        style={{
          clipPath,
          willChange: "clip-path",
        }}
        aria-hidden="true"
      >
        <div className={className}>
          {children}
        </div>
      </motion.div>

      {/* Inject styling rules to force all elements inside the top layer to turn black */}
      <style jsx global>{`
        .spotlight-top-layer * {
          color: #060606 !important;
          background-color: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
