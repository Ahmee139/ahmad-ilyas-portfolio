"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  strength?: number; // Pull intensity (0 to 1)
  className?: string;
}

export default function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Framer Motion motion values for position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring configuration for elastic magnetic effect
  const springConfig = { damping: 15, stiffness: 150, mass: 0.2 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    // Find the center coordinates of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate the distance from center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Set the motion values scaled by strength
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    // Return to original position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {/* Clone the child and attach custom cursor attribute so the CustomCursor knows it is magnetic */}
      {React.cloneElement(children as React.ReactElement<{ "data-cursor-magnetic"?: string }>, {
        "data-cursor-magnetic": "true",
      })}
    </motion.div>
  );
}
