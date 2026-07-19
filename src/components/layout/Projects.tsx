"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Heading from "@/components/ui/Heading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import SpotlightText from "@/components/ui/SpotlightText";

interface Project {
  name: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
}

const projectsData: Project[] = [
  {
    name: "Interactive Developer Portfolio",
    description: "A personal portfolio website featuring smooth scroll layers, typewriter animations, active metric counters, custom graphics and integrated social timelines.",
    tech: ["HTML5", "CSS3", "JavaScript", "AOS", "FontAwesome"],
    github: "https://github.com/Ahmee139/Web.git",
    live: "https://ahmee139.github.io/Web/",
    image: "/portfolio.png",
  },
  {
    name: "Bootstrap Agency Portfolio",
    description: "A premium responsive template engineered for agency services. Integrates Bootstrap 5 grid alignments, fluid slider carousels, customer review portals, and structured content layouts.",
    tech: ["HTML5", "CSS3", "Bootstrap 5", "JavaScript", "AOS"],
    github: "https://github.com/Ahmee139/Web-2-Boot.git",
    live: "https://ahmee139.github.io/Web-2-Boot/",
    image: "/agency.png",
  },
  {
    name: "Netflix Cinematic Clone",
    description: "A high-fidelity Netflix web application clone. Features trailer autoplay inside video frames, movie filter matrices, global search fields, TMDB API metadata feeds, and Firebase authentication.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "TMDB API", "Firebase"],
    github: "https://github.com/Ahmee139/netflix-clone",
    live: "https://netflix-clone-demo.vercel.app",
    image: "/netflix.png",
  },
  {
    name: "AeroPass Airplane Reservation",
    description: "A robust flight ticket booking engine. Supports dynamic seat grids selection, real-time schedule searches, PDF boarding passes, user accounts profiles, and Nodemailer email triggers.",
    tech: ["Node.js", "Express", "MongoDB", "React", "Tailwind CSS", "Nodemailer"],
    github: "https://github.com/Ahmee139/aeropass-booking",
    live: "https://aeropass-booking.vercel.app",
    image: "/airplane.png",
  },
];

// Interactive 3D Card wrapper utilizing local coordinate tracking
function InteractiveProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Local cursor values for 3D card tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Subtle 3D tilt transformations (limited to ±2.5° for premium paper float)
  const rotateX = useTransform(y, [-0.5, 0.5], [2.5, -2.5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-2.5, 2.5]);

  const springRotateX = useSpring(rotateX, { damping: 25, stiffness: 220 });
  const springRotateY = useSpring(rotateY, { damping: 25, stiffness: 220 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isEven = index % 2 === 0;

  // Stagger variants for tech stack pills
  const pillContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // Define unique scroll-reveal variants for each project card to guarantee visual variety
  const getRevealVariants = (type: "image" | "details", idx: number) => {
    if (idx === 0) {
      return type === "image" ? "fade-left" : "fade-right";
    }
    if (idx === 1) {
      return type === "image" ? "fade-right" : "fade-left";
    }
    if (idx === 2) {
      return type === "image" ? "scale" : "blur-reveal";
    }
    // Both columns of 4th card use simple fade-up so they fire reliably without holding ghost space
    return "fade-up";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      
      {/* 1. Large Hover-Zooming Image */}
      <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"} flex justify-center`}>
        <Reveal variant={getRevealVariants("image", index)} delay={0.2}>
          <div className="relative w-full max-w-[580px] aspect-[16/10] rounded-3xl overflow-hidden border border-white/5 shadow-[0_0_30px_rgba(255,255,255,0.02)] group select-none cursor-none">
            {/* Soft inner vignette border */}
            <div className="absolute inset-0 rounded-3xl border border-lime-accent/5 pointer-events-none z-20 group-hover:border-lime-accent/20 transition-colors duration-500" />
            <Image
              src={project.image}
              alt={`${project.name} Thumbnail`}
              fill
              sizes="(max-w-1024px) 100vw, 580px"
              className="object-cover transition-transform duration-[1200ms] ease-[0.16,1,0.3,1] group-hover:scale-105 filter grayscale contrast-[1.02]"
              style={{ willChange: "transform" }} // Performance optimization: promote image scaling to composite GPU thread
            />
          </div>
        </Reveal>
      </div>

      {/* 2. Glass details column with 3D Tilt rotation */}
      <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"} flex justify-center lg:justify-start w-full`}>
        <Reveal variant={getRevealVariants("details", index)} delay={0.3}>
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover="hover"
            className="w-full max-w-[520px] bg-white/2 border border-white/5 backdrop-blur-md rounded-3xl p-8 md:p-10 text-left transition-all duration-500 hover:border-lime-accent/20 hover:shadow-[0_0_40px_rgba(198,255,0,0.06)]"
          >
            <div className="space-y-6" style={{ transform: "translateZ(25px)" }}>
              {/* Project Title with sliding translation */}
              <SpotlightText>
                <motion.h3
                  variants={{ hover: { x: 8 } }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-silver-secondary select-none"
                >
                  {project.name}
                </motion.h3>
              </SpotlightText>

              {/* Project Description */}
              <p className="text-sm md:text-base text-silver-primary/60 leading-relaxed font-light tracking-wide select-none">
                {project.description}
              </p>

              {/* Tech Stack Pills - Staggered viewport entrance animation */}
              <motion.div
                variants={pillContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {project.tech.map((techItem) => (
                  <motion.span
                    key={techItem}
                    variants={pillVariants}
                    className="px-3 py-1.5 text-[10px] font-mono rounded-full border border-white/5 bg-white/2 text-silver-primary/70 select-none transition-colors duration-300 hover:text-lime-accent"
                  >
                    {techItem}
                  </motion.span>
                ))}
              </motion.div>

              {/* Buttons (Live Demo & Github) with Magnetic wrapper */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Magnetic>
                  <Button
                    variant="lime-outline"
                    href={project.live}
                    icon={<FiExternalLink />}
                    className="px-6 py-3.5 text-xs"
                  >
                    Live Demo
                  </Button>
                </Magnetic>

                <Magnetic>
                  <Button
                    variant="secondary"
                    href={project.github}
                    icon={<FiGithub />}
                    className="px-6 py-3.5 text-xs"
                  >
                    GitHub
                  </Button>
                </Magnetic>
              </div>

            </div>
          </motion.div>
        </Reveal>
      </div>

    </div>
  );
}

export default function Projects() {
  return (
    <SectionWrapper id="projects" className="bg-background-dark border-t border-white/5 py-24 md:py-36 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="space-y-4 text-left mb-16 md:mb-24">
          <Reveal variant="fade-up" delay={0.1}>
            <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-lime-accent uppercase">
              [03 / Creations]
            </span>
          </Reveal>

          <Heading tag="h2" reveal={true} className="text-3xl md:text-5xl font-display font-bold leading-tight text-silver-secondary">
            {"Selected {Projects}"}
          </Heading>
        </div>

        {/* Alternate zig-zag project list */}
        <div className="space-y-16 md:space-y-28">
          {projectsData.map((project, index) => (
            <InteractiveProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
}
