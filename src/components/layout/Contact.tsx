"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Heading from "@/components/ui/Heading";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";
import { FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  // Coordinates for the slow drifting background radial glow
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  // Smooth springs for drift coordinates to prevent any movement ticks
  const springGlowX = useSpring(glowX, { damping: 50, stiffness: 20 });
  const springGlowY = useSpring(glowY, { damping: 50, stiffness: 20 });

  // Map coordinate springs to radial background template
  const backgroundGlow = useMotionTemplate`radial-gradient(circle at ${springGlowX}% ${springGlowY}%, rgba(198, 255, 0, 0.025) 0%, transparent 65%)`;

  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.008; // Very slow drift angle increment
      // Orbiting drift path (radius of 15% offset around the center 50%)
      const x = 50 + Math.cos(angle) * 15;
      const y = 50 + Math.sin(angle) * 15;
      glowX.set(x);
      glowY.set(y);
    }, 40);

    return () => clearInterval(interval);
  }, [glowX, glowY]);

  const contactData = {
    email: "mailto:ahmadinfo139@gmail.com?subject=Let's%20Work%20Together",
    whatsapp: "https://wa.me/923327288157?text=Hi%20Ahmad%2C%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you.",
  };

  return (
    <SectionWrapper
      id="contact"
      className="bg-background-dark border-t border-white/5 py-32 md:py-48 flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle slowly drifting radial background glow */}
      <motion.div
        aria-hidden="true"
        style={{ background: backgroundGlow }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="w-full max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10 md:space-y-12">
        
        {/* Decorative Tag */}
        <Reveal variant="fade-up" delay={0.1}>
          <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-lime-accent uppercase">
            [04 / Connection]
          </span>
        </Reveal>

        {/* Large Heading */}
        <Heading
          tag="h2"
          reveal={true}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tighter text-silver-secondary leading-none select-none max-w-2xl mx-auto"
        >
          {"Let's {Build} Something Amazing"}
        </Heading>

        {/* Short One-Line Description */}
        <Reveal variant="fade-up" delay={0.3}>
          <p className="text-sm md:text-base text-silver-primary/50 font-light tracking-wide max-w-md mx-auto leading-relaxed select-none">
            {"Have a project in mind or want to collaborate? Get in touch and let's create a luxurious digital ecosystem together."}
          </p>
        </Reveal>

        {/* Two Premium Buttons Only (Email and WhatsApp) */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
          
          {/* Button 1: Email Me */}
          <Magnetic>
            <a
              href={contactData.email}
              aria-label="Send Email to Ahmad Ilyas"
              className="relative group block overflow-hidden rounded-full p-[1.5px] cursor-none select-none transition-all duration-500 hover:shadow-[0_0_30px_rgba(198,255,0,0.18)]"
            >
              {/* Conic sweep border container (rotates slowly, accelerates on hover) */}
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#D9D9D9_0%,#D9D9D9_70%,#C6FF00_80%,#D9D9D9_90%,#D9D9D9_100%)] animate-[spin_5s_linear_infinite] group-hover:animate-[spin_2.5s_linear_infinite] opacity-50 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Inner content layer: fills with lime green on hover */}
              <div className="relative z-10 px-8 py-4 bg-background-dark rounded-full transition-colors duration-500 group-hover:bg-lime-accent flex items-center gap-3 font-mono text-xs md:text-sm tracking-widest uppercase text-silver-primary group-hover:text-background-dark">
                <FiMail className="text-base transition-transform duration-300 group-hover:scale-110" />
                <span>Email Me</span>
              </div>
            </a>
          </Magnetic>

          {/* Button 2: WhatsApp */}
          <Magnetic>
            <a
              href={contactData.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Ahmad Ilyas on WhatsApp"
              className="relative group block overflow-hidden rounded-full p-[1.5px] cursor-none select-none transition-all duration-500 hover:shadow-[0_0_30px_rgba(198,255,0,0.18)]"
            >
              {/* Conic sweep border container */}
              <div className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,#D9D9D9_0%,#D9D9D9_70%,#C6FF00_80%,#D9D9D9_90%,#D9D9D9_100%)] animate-[spin_5s_linear_infinite] group-hover:animate-[spin_2.5s_linear_infinite] opacity-50 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Inner content layer */}
              <div className="relative z-10 px-8 py-4 bg-background-dark rounded-full transition-colors duration-500 group-hover:bg-lime-accent flex items-center gap-3 font-mono text-xs md:text-sm tracking-widest uppercase text-silver-primary group-hover:text-background-dark">
                <FaWhatsapp className="text-base transition-transform duration-300 group-hover:scale-110" />
                <span>WhatsApp</span>
              </div>
            </a>
          </Magnetic>

        </div>

        {/* Direct Contact Details for Show Purpose in clean HUD style */}
        <Reveal variant="fade-up" delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-12 pt-8 text-xs md:text-sm font-mono tracking-widest text-silver-primary/40 select-none">
            <a
              href={contactData.email}
              aria-label="Send Email to Ahmad Ilyas"
              className="hover:text-lime-accent transition-colors duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>EMAIL:</span>
              <span className="text-silver-secondary hover:underline underline-offset-4 decoration-lime-accent/50 transition-all font-light lowercase">
                ahmadinfo139@gmail.com
              </span>
            </a>
            
            <a
              href={contactData.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Ahmad Ilyas on WhatsApp"
              className="hover:text-lime-accent transition-colors duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>WHATSAPP:</span>
              <span className="text-silver-secondary hover:underline underline-offset-4 decoration-lime-accent/50 transition-all font-light">
                +92 332 7288157
              </span>
            </a>
          </div>
        </Reveal>

      </div>
    </SectionWrapper>
  );
}
