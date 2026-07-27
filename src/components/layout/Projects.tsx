"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Magnetic from "@/components/ui/Magnetic";
import { FiGithub } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import SpotlightText from "@/components/ui/SpotlightText";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  name: string;
  description: string;
  tech: string[];
  number: string;
}

const WHATSAPP_URL =
  "https://wa.me/923327288157?text=Hi%20Ahmad%2C%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you.";
const GITHUB_URL = "https://github.com/Ahmee139";

const projectsData: Project[] = [
  {
    number: "01",
    name: "Netflix Cinematic Clone",
    description:
      "A high-fidelity Netflix web application clone. Features trailer autoplay inside video frames, movie filter matrices, global search fields, TMDB API metadata feeds, and Firebase authentication.",
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "TMDB API", "Firebase"],
  },
  {
    number: "02",
    name: "AeroPass Airplane Reservation",
    description:
      "A robust flight ticket booking engine. Supports dynamic seat grids selection, real-time schedule searches, PDF boarding passes, user accounts profiles, and Nodemailer email triggers.",
    tech: ["Node.js", "Express", "MongoDB", "React", "Tailwind CSS", "Nodemailer"],
  },
  {
    number: "03",
    name: "Interactive Developer Portfolio",
    description:
      "A personal portfolio website featuring smooth scroll layers, typewriter animations, active metric counters, custom graphics and integrated social timelines.",
    tech: ["HTML5", "CSS3", "JavaScript", "AOS", "FontAwesome"],
  },
  {
    number: "04",
    name: "Bootstrap Agency Portfolio",
    description:
      "A premium responsive template engineered for agency services. Integrates Bootstrap 5 grid alignments, fluid slider carousels, customer review portals, and structured content layouts.",
    tech: ["HTML5", "CSS3", "Bootstrap 5", "JavaScript", "AOS"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group/card relative flex w-full flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-border-subtle bg-surface-elevated p-6 sm:p-8 md:p-10 lg:p-12 shadow-[var(--theme-shadow-card)] transition-[border-color,box-shadow] duration-500 hover:border-lime-accent/25 hover:shadow-[0_24px_60px_rgba(244,90,55,0.1)]">
      {/* Soft corner glows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 -top-8 h-36 w-36 rounded-full bg-[#F45A37]/0 blur-2xl transition-all duration-700 group-hover/card:bg-[#F45A37]/16"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#FF8A65]/0 blur-2xl transition-all duration-700 delay-75 group-hover/card:bg-[#FF8A65]/12"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-[#F45A37]/0 blur-2xl transition-all duration-700 delay-100 group-hover/card:bg-[#F45A37]/10"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-[#FFB089]/0 blur-2xl transition-all duration-700 delay-150 group-hover/card:bg-[#FFB089]/14"
      />

      {/* Corner check marks (L-brackets) */}
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-[#F45A37]/0 transition-all duration-500 group-hover/card:border-[#F45A37]/80 group-hover/card:h-5 group-hover/card:w-5" />
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-[#F45A37]/0 transition-all duration-500 delay-75 group-hover/card:border-[#F45A37]/80 group-hover/card:h-5 group-hover/card:w-5" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#F45A37]/0 transition-all duration-500 delay-100 group-hover/card:border-[#F45A37]/80 group-hover/card:h-5 group-hover/card:w-5" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#F45A37]/0 transition-all duration-500 delay-150 group-hover/card:border-[#F45A37]/80 group-hover/card:h-5 group-hover/card:w-5" />

      {/* Horizontal line sweep — slow top → bottom */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-[inherit]"
      >
        <span className="absolute left-0 right-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F45A37]/85 to-transparent opacity-0 group-hover/card:animate-[card-line-sweep_2.4s_cubic-bezier(0.22,1,0.36,1)_forwards]" />
      </span>

      <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs sm:text-sm tracking-[0.22em] text-lime-accent uppercase">
            {project.number}
          </span>
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] text-muted-text uppercase">
            Project
          </span>
        </div>

        <SpotlightText>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight text-silver-secondary leading-snug select-none">
            {project.name}
          </h3>
        </SpotlightText>

        <p className="text-sm sm:text-base md:text-lg text-body-text leading-relaxed font-light tracking-wide select-none max-w-3xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {project.tech.map((techItem) => (
            <span
              key={techItem}
              className="px-3 py-1.5 text-[10px] sm:text-xs font-mono rounded-full border border-border-subtle bg-surface text-muted-text select-none transition-colors duration-300 group-hover/card:border-lime-accent/25"
            >
              {techItem}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4 pt-7 md:pt-9">
        <Magnetic>
          <Button
            variant="primary-invert"
            href={WHATSAPP_URL}
            icon={<FaWhatsapp />}
            className="px-6 py-3 text-xs sm:text-sm"
          >
            Contact Me
          </Button>
        </Magnetic>

        <Magnetic>
          <Button
            variant="lime-outline"
            href={GITHUB_URL}
            icon={<FiGithub />}
            className="px-6 py-3 text-xs sm:text-sm"
          >
            GitHub
          </Button>
        </Magnetic>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const pin = pinRef.current;
      if (cards.length === 0 || !pin) return;

      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: i === 0 ? 0 : 108,
          rotateX: i === 0 ? 0 : 14,
          scale: i === 0 ? 1 : 0.97,
          autoAlpha: i === 0 ? 1 : 0,
          zIndex: i === 0 ? 20 : 10 + i,
          transformOrigin: "50% 100%",
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          // Tighter scroll distance = less empty space after projects
          end: () => `+=${Math.max(cards.length - 1, 1) * window.innerHeight * 0.55}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          pinSpacing: true,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const prev = cards[i - 1];

        tl.to(
          prev,
          {
            yPercent: -12,
            rotateX: -8,
            scale: 0.95,
            autoAlpha: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          `card-${i}`
        );

        tl.to(
          card,
          {
            yPercent: 0,
            rotateX: 0,
            scale: 1,
            autoAlpha: 1,
            zIndex: 30 + i,
            duration: 1,
            ease: "power2.inOut",
          },
          `card-${i}`
        );
      });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 200);
    const t2 = window.setTimeout(refresh, 700);
    window.addEventListener("resize", refresh);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full border-t border-border-subtle bg-transparent text-silver-secondary"
    >
      <div
        ref={pinRef}
        className="relative flex h-svh w-full flex-col overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* Tight top — title sits near top of viewport */}
        <div className="shrink-0 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-14 sm:pt-16 pb-2">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] font-semibold text-lime-accent uppercase block mb-1.5">
            [03 / CREATIONS]
          </span>
          <Heading
            tag="h2"
            reveal={false}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tighter uppercase text-silver-secondary"
          >
            {"Selected {Projects}"}
          </Heading>
        </div>

        {/* More space under title; wider card stage */}
        <div className="relative flex min-h-0 flex-1 items-start justify-center px-5 sm:px-8 md:px-12 pt-8 sm:pt-10 md:pt-12 pb-6 md:pb-8">
          <div
            className="relative w-full max-w-3xl lg:max-w-4xl mx-auto h-[min(620px,calc(100svh-10rem))]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {projectsData.map((project, index) => (
              <div
                key={project.name}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="absolute inset-0 flex items-start justify-center"
                style={{
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="w-full max-h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <ProjectCard project={project} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
