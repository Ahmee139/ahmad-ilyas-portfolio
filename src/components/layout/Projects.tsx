"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Heading from "@/components/ui/Heading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import SpotlightText from "@/components/ui/SpotlightText";

gsap.registerPlugin(ScrollTrigger);

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

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center bg-background-dark/95 border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      
      {/* 1. Large Hover-Zooming Image */}
      <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"} flex justify-center w-full`}>
        <div className="relative w-full max-w-[580px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_30px_rgba(255,255,255,0.02)] group select-none cursor-none">
          {/* Soft inner vignette border */}
          <div className="absolute inset-0 rounded-2xl border border-lime-accent/5 pointer-events-none z-20 group-hover:border-lime-accent/20 transition-colors duration-500" />
          <Image
            src={project.image}
            alt={`${project.name} Thumbnail`}
            fill
            sizes="(max-w-1024px) 100vw, 580px"
            className="object-cover transition-transform duration-[1200ms] ease-[0.16,1,0.3,1] group-hover:scale-105"
            style={{ willChange: "transform" }}
          />
        </div>
      </div>

      {/* 2. Glass details column with 3D Tilt rotation */}
      <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"} flex justify-center lg:justify-start w-full`}>
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
          className="w-full max-w-[520px] bg-white/2 border border-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 text-left transition-all duration-500 hover:border-lime-accent/20 hover:shadow-[0_0_40px_rgba(244,90,55,0.06)]"
        >
          <div className="space-y-5" style={{ transform: "translateZ(25px)" }}>
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
            <p className="text-sm md:text-base text-body-text leading-relaxed font-light tracking-wide select-none">
              {project.description}
            </p>

            {/* Tech Stack Pills */}
            <motion.div
              variants={pillContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {project.tech.map((techItem) => (
                <motion.span
                  key={techItem}
                  variants={pillVariants}
                  className="px-3 py-1.5 text-[10px] font-mono rounded-full border border-white/5 bg-white/2 text-muted-text select-none transition-colors duration-300 hover:text-lime-accent"
                >
                  {techItem}
                </motion.span>
              ))}
            </motion.div>

            {/* Buttons (Live Demo & Github) */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Magnetic>
                <Button
                  variant="lime-outline"
                  href={project.live}
                  icon={<FiExternalLink />}
                  className="px-6 py-3 text-xs"
                >
                  Live Demo
                </Button>
              </Magnetic>

              <Magnetic>
                <Button
                  variant="secondary"
                  href={project.github}
                  icon={<FiGithub />}
                  className="px-6 py-3 text-xs"
                >
                  GitHub
                </Button>
              </Magnetic>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0 || !containerRef.current) return;

      // Set initial positions for stacked cards
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { yPercent: 0, scale: 1, opacity: 1, zIndex: 10 });
        } else {
          gsap.set(card, { yPercent: 115, scale: 0.92, opacity: 0, zIndex: 10 + i * 10 });
        }
      });

      // Pin the container and animate cards sequentially as the user scrolls
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${cards.length * 100}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i > 0) {
          const prevCard = cards[i - 1];

          // Scale down and push back the previous card
          tl.to(
            prevCard,
            {
              scale: 0.9,
              opacity: 0.35,
              y: -25,
              duration: 1,
              ease: "power2.inOut",
            },
            `card-${i}`
          );

          // Slide in the new active card from underneath
          tl.to(
            card,
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power2.inOut",
            },
            `card-${i}`
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="projects" className="bg-background-dark border-t border-white/5 overflow-hidden">
      <div ref={containerRef} className="w-full min-h-screen flex flex-col justify-center py-12 md:py-16">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
          
          {/* Section Header */}
          <div className="space-y-3 text-left mb-8 md:mb-12">
            <Reveal variant="fade-up" delay={0.1}>
              <span className="font-mono text-xs md:text-sm tracking-[0.3em] font-semibold text-lime-accent uppercase">
                [03 / CREATIONS]
              </span>
            </Reveal>

            <Heading tag="h2" reveal={true} className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase text-silver-secondary">
              {"Selected {Projects}"}
            </Heading>
          </div>

          {/* Stacked Deck Stage Container */}
          <div ref={deckRef} className="relative w-full max-w-6xl mx-auto min-h-[560px] md:min-h-[580px] flex items-center justify-center">
            {projectsData.map((project, index) => (
              <div
                key={project.name}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ willChange: "transform, opacity" }}
              >
                <InteractiveProjectCard project={project} index={index} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
