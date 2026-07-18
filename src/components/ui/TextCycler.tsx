"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface TextCyclerProps {
  items: string[];
  interval?: number;
  className?: string;
}

export default function TextCycler({
  items,
  interval = 3000,
  className,
}: TextCyclerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <div className="relative overflow-hidden h-[1.4em] flex items-center select-none w-full">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={cn("inline-block", className)} // Promote to inline-block to guarantee cross-browser transform animation compatibility
          initial={{ y: "80%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-80%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }} // easeOutExpo
          style={{ willChange: "transform, opacity" }} // Performance: promote text rotation to GPU thread
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
