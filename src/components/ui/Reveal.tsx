"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

type RevealVariant =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur-reveal"
  | "mask-reveal";

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  duration?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

export default function Reveal({
  children,
  variant = "fade-up",
  duration = 1.0,
  delay = 0,
  className,
  once = true,
}: RevealProps) {
  // Map variant name to Framer Motion parameters
  const getVariants = () => {
    switch (variant) {
      case "fade-up":
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
      case "fade-left":
        return {
          hidden: { opacity: 0, x: 45 },
          visible: { opacity: 1, x: 0 },
        };
      case "fade-right":
        return {
          hidden: { opacity: 0, x: -45 },
          visible: { opacity: 1, x: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.94 },
          visible: { opacity: 1, scale: 1 },
        };
      case "blur-reveal":
        return {
          hidden: { opacity: 0, filter: "blur(12px)", y: 15 },
          visible: { opacity: 1, filter: "blur(0px)", y: 0 },
        };
      case "mask-reveal":
        return {
          hidden: { y: "105%" },
          visible: { y: 0 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const transitionProps = {
    duration,
    delay,
    ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
  };

  if (variant === "mask-reveal") {
    return (
      <div className={cn("relative overflow-hidden w-fit", className)}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once, margin: "-5%" }}
          variants={getVariants()}
          transition={transitionProps}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-5%" }}
      variants={getVariants()}
      transition={transitionProps}
    >
      {children}
    </motion.div>
  );
}
