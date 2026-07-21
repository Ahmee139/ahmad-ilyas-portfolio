"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<"default" | "hover" | "magnetic" | "spotlight" | "hidden">(() => {
    if (typeof window !== "undefined") {
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      if (isTouchDevice) return "hidden";
    }
    return "default";
  });

  // Cursor positional motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Velocity, stretch & rotation motion values
  const stretchX = useMotionValue(1);
  const stretchY = useMotionValue(1);
  const rotate = useMotionValue(0);

  // Springs for trailing position
  const ringConfig = { damping: 24, stiffness: 220, mass: 0.35 };
  const ringX = useSpring(cursorX, ringConfig);
  const ringY = useSpring(cursorY, ringConfig);

  // Smooth springs for stretching/squishing dynamics
  const stretchConfig = { damping: 20, stiffness: 180, mass: 0.1 };
  const springStretchX = useSpring(stretchX, stretchConfig);
  const springStretchY = useSpring(stretchY, stretchConfig);
  const springRotate = useSpring(rotate, { damping: 30, stiffness: 350 });

  useEffect(() => {
    if (cursorState === "hidden") return;

    // Apply class to document to hide default system pointer
    document.documentElement.classList.add("custom-cursor-active");

    let lastX = -100;
    let lastY = -100;
    let lastTime = Date.now();

    const moveCursor = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastTime || 1;

      // Calculate velocity vector (px per ms)
      const vx = (e.clientX - lastX) / dt;
      const vy = (e.clientY - lastY) / dt;

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;

      // Calculate speed with capping to avoid excessive distortion
      const speed = Math.min(Math.sqrt(vx * vx + vy * vy), 8);
      // Find rotation angle in degrees
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Set stretch X (along movement) and squash Y (across movement)
      stretchX.set(1 + speed * 0.06);
      stretchY.set(1 - speed * 0.04);
      rotate.set(angle);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isSpotlight = target.closest("[data-cursor-spotlight]") || target.closest(".spotlight-text-container");
      const isMagnetic = target.closest("[data-cursor-magnetic]");
      const isInteractive = target.closest("button, a, [role='button'], input, select, textarea");

      if (isSpotlight) {
        setCursorState("spotlight");
      } else if (isMagnetic) {
        setCursorState("magnetic");
      } else if (isInteractive) {
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorState, cursorX, cursorY, stretchX, stretchY, rotate]);

  if (cursorState === "hidden") return null;

  // Visual variants for the trailing outer ring
  const ringVariants = {
    default: {
      opacity: 1,
      scale: 1,
      width: 24,
      height: 24,
      borderColor: "#CFC6B8",
      backgroundColor: "rgba(217, 217, 217, 0)",
    },
    hover: {
      opacity: 1,
      scale: 1,
      width: 48,
      height: 48,
      borderColor: "#F45A37",
      backgroundColor: "rgba(244, 90, 55, 0.04)",
    },
    magnetic: {
      opacity: 1,
      scale: 1,
      width: 60,
      height: 60,
      borderColor: "#F45A37",
      backgroundColor: "rgba(244, 90, 55, 0.08)",
    },
    spotlight: {
      opacity: 0,
      scale: 0,
      width: 24,
      height: 24,
      borderColor: "transparent",
      backgroundColor: "transparent",
    },
  };

  // Visual variants for the inner dot pointer
  const dotVariants = {
    default: {
      opacity: 1,
      scale: 1,
      backgroundColor: "#F45A37",
    },
    hover: {
      opacity: 1,
      scale: 1.8,
      backgroundColor: "#F45A37",
    },
    magnetic: {
      opacity: 1,
      scale: 0,
      backgroundColor: "#D94A2C",
    },
    spotlight: {
      opacity: 0,
      scale: 0,
      backgroundColor: "transparent",
    },
  };

  return (
    <>
      {/* Inner Dot: precise coordinates */}
      <motion.div
        aria-hidden="true"
        role="presentation"
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-50"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
        animate={cursorState}
        variants={dotVariants}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
      />
      {/* Outer Ring: trailing position */}
      <motion.div
        aria-hidden="true"
        role="presentation"
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-50 flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scaleX: springStretchX,
          scaleY: springStretchY,
          rotate: springRotate,
          willChange: "transform", // Performance: promote cursor outer ring to GPU layer to prevent reflows
        }}
        animate={cursorState}
        variants={ringVariants}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      />
    </>
  );
}
