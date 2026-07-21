"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background-dark py-12 flex flex-col items-center justify-center relative z-10 overflow-hidden">
      {/* Thin elegant top divider */}
      <div className="w-full max-w-7xl px-6 md:px-12 mb-8">
        <div className="w-full h-[1px] bg-white/5" />
      </div>

      {/* 
        Mount-based fade animation:
        Replaced viewport scroll reveals with static component mounts because the footer is the absolute last element.
        This prevents browser scroll limits from locking the footer in a hidden/opacity-0 state.
      */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-7xl px-6 md:px-12 flex items-center justify-center text-center select-none"
      >
        {/* Centered Larger Credit Text */}
        <p className="font-mono text-base md:text-lg tracking-[0.18em] text-silver-secondary uppercase text-center">
          {"Designed and Developed by "}
          <span className="text-silver-secondary font-bold transition-all duration-300 hover:text-lime-accent">
            M.Ahmad <span className="text-lime-accent font-extrabold">Ilyas</span>
          </span>
        </p>
      </motion.div>
    </footer>
  );
}
