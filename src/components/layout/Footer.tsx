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
        className="w-full max-w-7xl px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6 sm:gap-4 select-none"
      >
        {/* Left Side: Developed By */}
        <p className="font-mono text-xs md:text-sm tracking-[0.15em] text-silver-primary/40 uppercase">
          {"Designed & Engineered by "}
          <span className="text-silver-secondary font-semibold transition-all duration-700 ease-[0.16,1,0.3,1] hover:text-lime-accent">
            Ahmad <span className="text-lime-accent">Ilyas</span>
          </span>
        </p>

        {/* Center: Pulsing Status Dot to prevent blank space */}
        <div className="hidden sm:flex items-center gap-2.5 text-[10px] md:text-xs tracking-[0.25em] font-mono text-silver-primary/30 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-accent animate-pulse shadow-[0_0_8px_rgba(198,255,0,0.6)]" />
          <span>Available for work</span>
        </div>

        {/* Right Side: Copyright */}
        <p className="font-mono text-[10px] md:text-xs tracking-wider text-silver-primary/25 uppercase sm:text-right">
          &copy; {currentYear} M. Ahmad Ilyas. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
