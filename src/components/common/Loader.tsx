"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";

export default function Loader() {
  const { isLoading, progress, setProgress, finishLoading } = useLoader();
  const [isDelayedExit, setIsDelayedExit] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    // Simulate cinematic loading sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDelayedExit(true);
            setTimeout(() => {
              finishLoading();
            }, 800); // Timing matches framer motion exit transition duration
          }, 400); // Small pause at 100% for impact
          return 100;
        }
        // Increment progress randomly for a realistic look
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading, finishLoading, setProgress]);

  const logoText = "PORTFOLIO";

  return (
    <AnimatePresence>
      {!isDelayedExit && (
        <motion.div
          className="fixed inset-0 w-full h-full bg-background-dark z-[9999] flex flex-col items-center justify-center select-none"
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }, // Premium easeInOutQuart
          }}
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
                    ease: [0.16, 1, 0.3, 1], // easeOutExpo
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
