"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  className,
  containerClassName,
  animate = true,
}: SectionWrapperProps) {
  const animationProps = animate
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-15%" },
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }, // Premium easeOutExpo
      }
    : {};

  return (
    <motion.section
      id={id}
      className={cn(
        "relative w-full py-32 md:py-48 lg:py-64 overflow-hidden bg-background-dark text-silver-secondary",
        className
      )}
      {...animationProps}
    >
      <div className={cn("max-w-7xl mx-auto px-6 md:px-12 w-full", containerClassName)}>
        {children}
      </div>
    </motion.section>
  );
}
