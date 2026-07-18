"use client";

import { useLoader } from "@/context/LoaderContext";
import { motion } from "framer-motion";

export default function Noise() {
  const { isLoading } = useLoader();

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 0.025 }} // Fade in slightly after loader
      transition={{ duration: 1.5, delay: 0.8 }}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9990] bg-repeat bg-[size:180px_180px]"
      style={{
        // Inline noise SVG generator using fractal noise turbulence
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        animation: "noise-animation 0.3s steps(4) infinite",
      }}
    />
  );
}
