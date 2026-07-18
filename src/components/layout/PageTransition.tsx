"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { isLoading } = useLoader();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // Disable first mount flag after cinematic loader finishes
    if (!isLoading) {
      const timeout = setTimeout(() => {
        setIsFirstMount(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="relative w-full">
        {/* Page Content Fade & Translate */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>

        {/* Swipe cover transition wipe - skips initial load to avoid loader interference */}
        {!isFirstMount && !isLoading && (
          <motion.div
            className="fixed inset-0 w-full h-full bg-lime-accent z-[9980] origin-bottom pointer-events-none"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            exit={{ scaleY: [0, 1, 1, 0] }}
            transition={{
              duration: 1.0,
              times: [0, 0.4, 0.6, 1.0],
              ease: [0.76, 0, 0.24, 1], // easeInOutQuart
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
