"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import TextCycler from "@/components/ui/TextCycler";
import About from "@/components/layout/About";
import Projects from "@/components/layout/Projects";
import Contact from "@/components/layout/Contact";
import Footer from "@/components/layout/Footer";
import { useLoader } from "@/context/LoaderContext";
import SpotlightText from "@/components/ui/SpotlightText";

// Dynamically load the high-performance WebGL particle waves canvas
const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-lime-accent/15 border-t-lime-accent rounded-full animate-spin" />
          <span className="font-mono text-[9px] text-silver-primary/30 uppercase tracking-widest">
            Loading WebGL...
          </span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useLoader();

  const roles = [
    "Next.js Developer",
    "React Developer",
    "Creative Frontend Engineer",
  ];

  // 1. Mouse coordinates for 3D Text Tilt Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize values from -0.5 to 0.5
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Map mouse coordinates to 3D rotations & translations for Left Side text
  // Capped at 2.2 degrees and 5px translation to maintain an upscale, expensive-feeling subtle depth
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [2.2, -2.2]); // Vertical moves rotate X axis
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2.2, 2.2]); // Horizontal moves rotate Y axis
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-5, 5]);

  // Springs for liquid-smooth mouse responsiveness
  const springRotateX = useSpring(rotateX, { damping: 25, stiffness: 150 });
  const springRotateY = useSpring(rotateY, { damping: 25, stiffness: 150 });
  const springTranslateX = useSpring(translateX, { damping: 25, stiffness: 150 });
  const springTranslateY = useSpring(translateY, { damping: 25, stiffness: 150 });

  // 2. Scroll-Driven Transformations (scrollYProgress)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleContent = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const scaleBackground = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacityText = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  // Springs for smooth scroll dynamics (eliminates scrolling ticks/stutter)
  const springScaleContent = useSpring(scaleContent, { damping: 30, stiffness: 180 });
  const springScaleBackground = useSpring(scaleBackground, { damping: 30, stiffness: 180 });
  const springOpacityText = useSpring(opacityText, { damping: 25, stiffness: 140 });

  // 3. Staggered Post-Loader Entrance Sequence Variants
  const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }, // easeOutExpo
    },
  };

  const lineVariants = {
    hidden: { y: "105%" },
    visible: {
      y: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const canvasVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="relative w-full bg-background-dark">
      {/* 1. Hero Section Container (150vh parent enables scroll animation space) */}
      <div id="hero" ref={containerRef} className="relative w-full h-[150vh] bg-background-dark">
        {/* Sticky Viewport (keeps Hero locked during scroll transforms) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Animated Wrapper: Handles slow global zoom on scroll */}
          <motion.div
            style={{ scale: springScaleContent }}
            className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-16 md:pt-36 lg:pt-40 flex items-center h-full relative z-10"
          >
            {/* Post-Loader Stagger Entrance Sequence Container */}
            <motion.div
              initial="hidden"
              animate={isLoading ? "hidden" : "visible"}
              variants={parentVariants}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full"
            >
              
              {/* Left Side: Typographic Column with 3D Mouse Parallax & Scroll Fade */}
              <motion.div
                style={{
                  x: springTranslateX,
                  y: springTranslateY,
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  opacity: springOpacityText,
                  transformStyle: "preserve-3d",
                }}
                className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8 text-left perspective-[1000px] pointer-events-auto"
              >
                <div className="space-y-3" style={{ transform: "translateZ(30px)" }}>
                  {/* Introduction Tag */}
                  <motion.div variants={itemVariants}>
                    <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-lime-accent uppercase">
                      {"Hello I'm"}
                    </span>
                  </motion.div>

                  {/* Heading Reveal (Name appears line-by-line using mask animations with the clean geometric font) */}
                  <SpotlightText>
                    <div className="flex flex-col font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-silver-secondary select-none">
                      <div className="overflow-hidden py-1 -my-1">
                        <motion.span className="inline-block" variants={lineVariants}>
                          M. Ahmad
                        </motion.span>
                      </div>
                      <div className="overflow-hidden py-1 -my-1">
                        <motion.span className="inline-block" variants={lineVariants}>
                          Ilyas
                        </motion.span>
                      </div>
                    </div>
                  </SpotlightText>
                </div>

                {/* Automatic Text Cycler */}
                <motion.div variants={itemVariants} style={{ transform: "translateZ(20px)" }} className="w-full">
                  <TextCycler
                    items={roles}
                    className="text-xl md:text-3xl lg:text-4xl font-display font-semibold text-silver-primary tracking-tight leading-normal"
                  />
                </motion.div>

                {/* Premium 3-Line Description */}
                <motion.div variants={itemVariants} style={{ transform: "translateZ(10px)" }} className="max-w-xl pt-2">
                  <p className="text-sm md:text-base text-silver-primary/60 leading-relaxed font-light tracking-wide">
                    Crafting modern, high-performance web applications using Next.js and React.
                    Engineering interactive user interfaces, clean component structures, and
                    immersive digital architectures with meticulous detail.
                  </p>
                </motion.div>
              </motion.div>

              {/* Right Side: WebGL Particle Waves with Scroll Scale */}
              <motion.div
                variants={canvasVariants}
                style={{ scale: springScaleBackground }}
                className="lg:col-span-5 w-full h-[50vh] lg:h-[70vh] flex items-center justify-center relative"
              >
                <HeroCanvas scrollProgress={scrollYProgress} />
              </motion.div>
              
            </motion.div>
          </motion.div>
          
        </div>
      </div>

      {/* 2. About Me Section */}
      <About />

      {/* 3. Selected Projects Section */}
      <Projects />

      {/* 4. Contact Section */}
      <Contact />

      {/* 5. Footer Section */}
      <Footer />
    </div>
  );
}
