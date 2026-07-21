"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import SpotlightText from "@/components/ui/SpotlightText";

interface HeadingProps {
  children: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  reveal?: boolean;
}

export default function Heading({
  children,
  tag = "h2",
  className,
  reveal = true,
}: HeadingProps) {
  const Tag = tag;

  const baseStyles = {
    h1: "text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tighter uppercase leading-[0.95]",
    h2: "text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tighter uppercase leading-tight",
    h3: "text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tighter uppercase leading-tight",
    h4: "text-2xl md:text-3xl lg:text-4xl font-black font-display tracking-tighter uppercase leading-tight",
    h5: "text-xl md:text-2xl lg:text-3xl font-black font-display tracking-tighter uppercase",
    h6: "text-lg md:text-xl lg:text-2xl font-black font-display tracking-tighter uppercase",
  };

  // If reveal is disabled, parse and render normal elements
  if (!reveal) {
    const parts = children.split(/(\{.*?\})/g);
    return (
      <SpotlightText>
        <Tag className={cn(baseStyles[tag], className)}>
          {parts.map((part, index) => {
            if (part.startsWith("{") && part.endsWith("}")) {
              return (
                <span key={index} className="text-lime-accent">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return part;
          })}
        </Tag>
      </SpotlightText>
    );
  }

  // Parse text to find chunks, maintaining whether they are highlighted
  const parts = children.split(/(\{.*?\})/g);
  
  // Flatten into list of word objects
  const wordsList: { text: string; isHighlighted: boolean }[] = [];
  parts.forEach((part) => {
    if (part.startsWith("{") && part.endsWith("}")) {
      const cleanText = part.slice(1, -1);
      const words = cleanText.split(" ").filter(Boolean);
      words.forEach((w) => {
        wordsList.push({ text: w, isHighlighted: true });
      });
    } else {
      const words = part.split(" ");
      words.forEach((w, idx) => {
        // Keep spaces around words, but filter out empty items unless they are intended spacing
        if (w === "" && idx > 0 && idx < words.length - 1) return;
        wordsList.push({ text: w, isHighlighted: false });
      });
    }
  });

  // Container motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  // Word motion variants
  const wordVariants = {
    hidden: { y: "110%" },
    visible: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  return (
    <SpotlightText>
      <Tag className={cn(baseStyles[tag], "overflow-hidden", className)}>
        <motion.span
          className={cn(
            "inline-flex flex-wrap",
            className?.includes("text-center") && "justify-center text-center w-full"
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
        >
          {wordsList.map((wordObj, idx) => {
            if (wordObj.text === "") {
              return <span key={idx} className="mr-[0.25em]" />;
            }
            return (
              <span
                key={idx}
                className="relative inline-block overflow-hidden mr-[0.25em] py-[0.1em] -my-[0.1em]"
              >
                <motion.span
                  className={cn(
                    "inline-block origin-left",
                    wordObj.isHighlighted ? "text-lime-accent font-extrabold" : "text-silver-secondary"
                  )}
                  variants={wordVariants}
                >
                  {wordObj.text}
                </motion.span>
              </span>
            );
          })}
        </motion.span>
      </Tag>
    </SpotlightText>
  );
}
