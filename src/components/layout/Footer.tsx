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
        className="w-full max-w-7xl px-6 md:px-12 flex flex-col items-center justify-center text-center space-y-4 select-none"
      >
        {/* Developed Highlight with subtle letter spacing hover expansion */}
        <p className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-silver-primary/40 uppercase">
          {"Developed by "}
          <span className="text-silver-secondary font-semibold transition-all duration-700 ease-[0.16,1,0.3,1] hover:text-lime-accent hover:tracking-[0.35em] cursor-default">
            Ahmad Ilyas
          </span>
        </p>

        {/* Small Copyright */}
        <p className="font-mono text-[9px] md:text-[10px] tracking-wider text-silver-primary/25 uppercase">
          &copy; {currentYear} M. Ahmad Ilyas. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
