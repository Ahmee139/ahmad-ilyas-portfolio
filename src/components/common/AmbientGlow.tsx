"use client";

import { motion } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";

export default function AmbientGlow() {
  const { isLoading } = useLoader();

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 2.0, delay: 0.6 }}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden"
    >
      {/* Top Left Drift Gradient Blob */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-lime-accent/4 blur-[140px] pointer-events-none"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom Right Drift Gradient Blob */}
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-lime-dark/3 blur-[160px] pointer-events-none"
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 40, -60, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
