"use client";

import { motion } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";
import { useTheme } from "@/context/ThemeContext";

export default function AmbientGlow() {
  const { isLoading } = useLoader();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] overflow-hidden"
    >
      {/* Soft top-left wash — very subtle on light */}
      <motion.div
        className={`absolute -top-[25%] -left-[12%] w-[55vw] h-[55vw] rounded-full blur-[160px] pointer-events-none ${
          isLight ? "bg-[#F45A37]/07" : "bg-lime-accent/4"
        }`}
        animate={{
          x: [0, 40, -25, 0],
          y: [0, -30, 25, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Soft bottom-right wash */}
      <motion.div
        className={`absolute -bottom-[22%] -right-[12%] w-[60vw] h-[60vw] rounded-full blur-[170px] pointer-events-none ${
          isLight ? "bg-[#F45A37]/05" : "bg-lime-dark/3"
        }`}
        animate={{
          x: [0, -35, 30, 0],
          y: [0, 25, -35, 0],
          scale: [1, 0.95, 1.06, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
