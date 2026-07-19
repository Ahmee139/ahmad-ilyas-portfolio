"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Heading from "@/components/ui/Heading";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [hoveredSkillIndex, setHoveredSkillIndex] = useState<number | null>(null);

  // Mouse tracking for portrait parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      
      // Calculate cursor position relative to the image center
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Normalized coordinates from -0.5 to 0.5
      const x = (e.clientX - centerX) / window.innerWidth;
      const y = (e.clientY - centerY) / window.innerHeight;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Map coordinate values to translations for a very subtle, premium parallax float (reduced from 25 to 12)
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);

  const springX = useSpring(translateX, { damping: 30, stiffness: 120 });
  const springY = useSpring(translateY, { damping: 30, stiffness: 120 });

  const skills = [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind",
    "Node.js",
    "Firebase",
    "GSAP",
    "Framer Motion",
    "Three.js",
    "MongoDB",
    "Express",
  ];

  return (
    <SectionWrapper id="about" className="bg-background-dark border-t border-white/5 py-24 md:py-36">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        
        {/* Left Column: Interactive Portrait */}
        <div className="lg:col-span-5 flex justify-center relative">
          <Reveal variant="scale" delay={0.2}>
            {/* Parallax Container */}
            <motion.div
              ref={imageRef}
              style={{
                x: springX,
                y: springY,
              }}
              // Slowed down floating loop (from 6s to 8s) and reduced bounds (from 12 to 8) to feel more premium
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="portrait-container relative w-[300px] h-[400px] md:w-[380px] md:h-[500px] rounded-3xl overflow-hidden cursor-none"
            >
              {/* Very soft border glow */}
              <div className="absolute inset-0 rounded-3xl border border-lime-accent/10 shadow-[0_0_40px_rgba(198,255,0,0.05)] pointer-events-none z-20" />
              
              {/* Portrait Image — transparent background PNG.
                  grayscale(1) applies cinematic B&W, hover restores 20% color via CSS class. */}
              <Image
                src="/portrait.png"
                alt="M. Ahmad Ilyas Portrait"
                fill
                priority
                sizes="(max-width: 768px) 300px, 380px"
                className="portrait-img object-cover object-top select-none"
              />
              
              {/* Dark vignette glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80 pointer-events-none z-10" />
            </motion.div>
          </Reveal>
        </div>

        {/* Right Column: Bio Summary & Staggered Skills */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="space-y-4">
            <Reveal variant="fade-up" delay={0.1}>
              <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-lime-accent uppercase">
                [02 / Identity]
              </span>
            </Reveal>

            <Heading tag="h2" reveal={true} className="text-3xl md:text-5xl font-display font-bold leading-tight text-silver-secondary">
              {"About {Me}"}
            </Heading>
          </div>

          {/* Professional Narrative */}
          <div className="space-y-6 text-silver-primary/70 text-sm md:text-base leading-relaxed font-light tracking-wide max-w-xl">
            <Reveal variant="fade-up" delay={0.3}>
              <p>
                I am a creative software engineer dedicated to crafting high-fidelity user 
                interfaces and performant WebGL interactions. I specialize in bridging the gap 
                between visual arts and complex frontend architectures, engineering spaces that 
                react fluidly to human interaction.
              </p>
            </Reveal>
            <Reveal variant="fade-up" delay={0.4}>
              <p>
                My methodology balances luxurious minimalist design with technical rigor, utilizing 
                state-of-the-art WebGL pipelines, component-driven layouts, and hardware-accelerated 
                animations to build memorable experiences.
              </p>
            </Reveal>
          </div>

          {/* Skills Grid */}
          <div className="space-y-4 pt-4">
            <Reveal variant="fade-up" delay={0.5}>
              <h4 className="font-mono text-xs tracking-wider uppercase text-silver-primary/40 select-none">
                Core Stack & Technologies
              </h4>
            </Reveal>

            {/* Staggered skill badges */}
            <div 
              className="flex flex-wrap gap-2.5 max-w-xl"
              onMouseLeave={() => setHoveredSkillIndex(null)}
            >
              {skills.map((skill, index) => (
                <Reveal key={skill} variant="fade-up" delay={0.55 + index * 0.04}>
                  <div
                    onMouseEnter={() => setHoveredSkillIndex(index)}
                    // Added relative position, overflow-visible, and cursor-pointer to support layout underlines
                    className="relative px-5 py-2.5 text-xs font-mono rounded-full border border-white/5 bg-white/2 text-silver-primary transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:bg-lime-accent/3 hover:text-lime-accent hover:border-lime-accent/40 hover:shadow-[0_0_15px_rgba(198,255,0,0.15)] select-none cursor-pointer"
                  >
                    <span className="relative z-10">{skill}</span>

                    {/* Shared lime green indicator bar that slides/morphs to other items on hover */}
                    {hoveredSkillIndex === index && (
                      <motion.div
                        layoutId="skills-underline"
                        className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-lime-accent rounded-full shadow-[0_0_8px_rgba(198,255,0,0.5)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
