"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";
import Magnetic from "@/components/ui/Magnetic";
import { gsap } from "@/utils/gsap-setup";

/* ─── Constants ─── */
const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

const SCROLL_THRESHOLD = 60;
const HIDE_THRESHOLD = 8; // min delta before show/hide triggers

/* ─── Logo ─── */
function Logo() {
  return (
    <a
      href="#hero"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group relative flex items-baseline gap-[0.2em] font-display select-none cursor-pointer transition-transform duration-500 ease-[0.16,1,0.3,1] hover:scale-[1.03]"
      aria-label="Scroll to top"
    >
      {/* Shimmer overlay on hover — a linear gradient mask sweeps across */}
      <span
        className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(242,242,242,0.25) 45%, rgba(198,255,0,0.15) 55%, transparent 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          animation: "shimmer 1.2s ease-in-out forwards",
        }}
        aria-hidden="true"
      />

      {/* "My" — small, medium weight */}
      <span className="text-[13px] md:text-[15px] font-medium text-silver-primary tracking-wide transition-colors duration-500">
        My
      </span>

      {/* "Portfolio" — largest, bold, primary focus */}
      <span className="text-[17px] md:text-[19px] font-bold text-silver-secondary tracking-[0.02em] transition-colors duration-500">
        Portfolio
      </span>

      {/* Tiny lime accent dot after the name */}
      <span
        className="inline-block w-[4px] h-[4px] rounded-full bg-lime-accent ml-[2px] mb-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:shadow-[0_0_6px_rgba(198,255,0,0.5)]"
        aria-hidden="true"
      />
    </a>
  );
}

/* ─── Nav Link ─── */
function NavLink({
  item,
  isActive,
  isHovered,
  onHover,
  onClick,
  showUnderline,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  isHovered: boolean;
  onHover: () => void;
  onClick: () => void;
  showUnderline: boolean;
}) {
  return (
    <a
      href={item.href}
      onMouseEnter={onHover}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="group relative py-2 cursor-pointer"
    >
      <motion.span
        className="block text-[12px] md:text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-[450ms]"
        style={{
          color: (isActive || isHovered) ? "#F2F2F2" : "rgba(255,255,255,0.65)",
        }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {item.label}
      </motion.span>

      {/* Shared Sliding Underline Indicator using layoutId */}
      {showUnderline && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-lime-accent rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{
            boxShadow: "0 0 8px rgba(198,255,0,0.4)",
          }}
        />
      )}
    </a>
  );
}

/* ─── Vertical Nav Link ─── */
function NavLinkVertical({
  item,
  isActive,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <a
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="group relative py-1.5 cursor-pointer text-center"
    >
      <motion.span
        className="block text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors duration-300"
        style={{
          color: isActive ? "#C6FF00" : "rgba(255,255,255,0.6)",
        }}
        whileHover={{ scale: 1.08, color: "#F2F2F2" }}
      >
        {item.label}
      </motion.span>
    </a>
  );
}

/* ─── Mobile Menu ─── */
function MobileMenu({
  isOpen,
  onClose,
  activeSection,
}: {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] as const } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -15, filter: "blur(4px)" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[998] flex flex-col items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Blurred dark backdrop - clicking outside closes the menu */}
          <motion.div
            className="absolute inset-0 bg-background-dark/95 backdrop-blur-2xl cursor-pointer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 cursor-pointer z-10"
            onClick={onClose}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Close navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" />
              <line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          </motion.button>

          {/* Navigation links */}
          <nav className="relative z-10 flex flex-col items-center gap-10">
            {NAV_ITEMS.map((item, index) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="relative cursor-pointer"
                >
                  <span
                    className="text-3xl md:text-4xl font-display font-bold tracking-tight transition-colors duration-300"
                    style={{
                      color: activeSection === item.href.slice(1) ? "#F2F2F2" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {item.label}
                  </span>
                  {activeSection === item.href.slice(1) && (
                    <motion.span
                      className="absolute -bottom-2 left-1/2 w-8 h-[2px] bg-lime-accent rounded-full"
                      layoutId="mobile-active"
                      style={{ x: "-50%" }}
                    />
                  )}
                </a>
              </motion.div>
            ))}

            {/* Resume button in mobile menu */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                duration: 0.6,
                delay: NAV_ITEMS.length * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              <a
                href="/resume/Ahmad_Ilyas_Resume"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Ahmad Ilyas Resume"
                className="inline-block px-8 py-3.5 text-sm font-medium tracking-[0.08em] uppercase rounded-full border border-white/15 text-silver-secondary hover:bg-lime-accent hover:text-background-dark hover:border-lime-accent transition-all duration-[450ms] cursor-pointer"
              >
                Resume
              </a>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Navbar ─── */
export default function Navbar() {
  const { isLoading } = useLoader();
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Layout morphing states
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  // References for GSAP transitions (wrapper and nav are separated to avoid Framer Motion transform overrides)
  const navWrapperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const collapsedIconRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);

  // Detect responsive screen parameters and handle resizing
  useEffect(() => {
    if (typeof window === "undefined") return;

    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    setIsDesktop(window.innerWidth >= 1024);

    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ── Scroll triggers for morphing animations ── */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;

    // Scrolled state (compact heights)
    setIsScrolled(latest > SCROLL_THRESHOLD);

    // Desktop Docking trigger (220px)
    if (isDesktop) {
      setIsDocked(latest > 220);
    } else {
      setIsDocked(false);
    }

    // Mobile floating button trigger (180px)
    if (!isDesktop) {
      setIsMobileScrolled(latest > 180);
    } else {
      setIsMobileScrolled(false);
    }

    // Hide/show based on direction (only if NOT docked and NOT mobile-scrolled)
    if (!isDocked && !isMobileScrolled && Math.abs(delta) > HIDE_THRESHOLD) {
      setIsHidden(delta > 0 && latest > 120);
    } else {
      setIsHidden(false);
    }

    lastScrollY.current = latest;
  });

  /* ── GSAP Morphing Timeline controller ── */
  useEffect(() => {
    const wrapper = navWrapperRef.current;
    const nav = navRef.current;
    if (!wrapper || !nav || windowSize.w === 0) return;

    if (isDesktop) {
      // DESKTOP MORPHING SEQUENCE
      if (isDocked) {
        // Morph to right-centered vertical dock
        const targetHeight = isCollapsed ? 72 : 440;
        const targetBorderRadius = isCollapsed ? "36px" : "32px";

        // Center calculation coordinates
        const originalTop = isScrolled ? 8 : 16;
        const deltaY = windowSize.h / 2 - originalTop - targetHeight / 2;

        // Calculate translation delta to position perfectly on the right (32px padding)
        const deltaX = (windowSize.w - 32 - 36) - (windowSize.w / 2);

        // Animate wrapper position and size
        gsap.to(wrapper, {
          x: deltaX,
          y: deltaY,
          width: 72,
          height: targetHeight,
          duration: 0.9,
          ease: "power4.inOut",
        });

        // Animate inner nav border radius
        gsap.to(nav, {
          borderRadius: targetBorderRadius,
          duration: 0.9,
          ease: "power4.inOut",
        });

        // Toggle layout transparencies & pointer availability
        gsap.to(horizontalRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
        
        if (isCollapsed) {
          gsap.to(verticalRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
          gsap.to(collapsedIconRef.current, { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.4, delay: 0.1 });
        } else {
          gsap.to(verticalRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4, delay: 0.1 });
          gsap.to(collapsedIconRef.current, { opacity: 0, scale: 0.8, pointerEvents: "none", duration: 0.3 });
        }
      } else {
        // Morph back to standard horizontal header bar
        gsap.to(wrapper, {
          x: 0,
          y: 0,
          width: "78%",
          height: isScrolled ? 56 : 64,
          duration: 0.9,
          ease: "power4.inOut",
        });

        gsap.to(nav, {
          borderRadius: "9999px",
          duration: 0.9,
          ease: "power4.inOut",
        });

        gsap.to(horizontalRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.4, delay: 0.1 });
        gsap.to(verticalRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
        gsap.to(collapsedIconRef.current, { opacity: 0, scale: 0.8, pointerEvents: "none", duration: 0.3 });
      }
    } else {
      // MOBILE MORPHING SEQUENCE
      if (isMobileScrolled) {
        // Morph to top-right floating sticky circle button
        const deltaX = (windowSize.w - 24 - 28) - (windowSize.w / 2);

        gsap.to(wrapper, {
          x: deltaX,
          y: 0,
          width: 56,
          height: 56,
          duration: 0.9,
          ease: "power4.inOut",
        });

        gsap.to(nav, {
          borderRadius: "28px",
          duration: 0.9,
          ease: "power4.inOut",
        });
      } else {
        // Morph back to full horizontal mobile menu bar
        gsap.to(wrapper, {
          x: 0,
          y: 0,
          width: "90%",
          height: isScrolled ? 56 : 64,
          duration: 0.9,
          ease: "power4.inOut",
        });

        gsap.to(nav, {
          borderRadius: "9999px",
          duration: 0.9,
          ease: "power4.inOut",
        });
      }
    }
  }, [isDesktop, isDocked, isMobileScrolled, isCollapsed, isScrolled, windowSize]);

  /* ── Active section detection via IntersectionObserver ── */
  const handleSectionIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.slice(1));
    const observer = new IntersectionObserver(handleSectionIntersect, {
      rootMargin: "-40% 0px -55% 0px",
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [handleSectionIntersect]);

  /* ── Smooth scroll handler ── */
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ── Entrance stagger variants ── */
  const containerVariants = {
    hidden: { opacity: 0, y: -20, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[999] flex justify-center pointer-events-none"
        style={{ paddingTop: isScrolled ? 8 : 16 }}
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={containerVariants}
      >
        {/* Outer Wrapper Container controlled exclusively by GSAP translations */}
        <div
          ref={navWrapperRef}
          className="pointer-events-auto w-[90%] lg:w-[78%] max-w-[1280px]"
          style={{
            height: isScrolled ? "56px" : "64px",
          }}
        >
          {/* Inner Nav Panel animated by Framer Motion strictly for scroll hide/show */}
          <motion.nav
            ref={navRef}
            className="w-full h-full relative overflow-hidden flex items-center justify-between rounded-full bg-background-dark/58 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
            animate={{
              y: isHidden ? -100 : 0,
              backgroundColor: isScrolled ? "rgba(8,8,8,0.75)" : "rgba(8,8,8,0.58)",
              backdropFilter: isScrolled ? "blur(24px)" : "blur(18px)",
            }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* ────────────────── DESKTOP CONTENT ────────────────── */}
            {isDesktop && (
              <div className="w-full h-full relative">
                {/* A. Horizontal Layout Layer */}
                <div
                  ref={horizontalRef}
                  className="absolute inset-0 flex items-center justify-between w-full h-full px-8"
                >
                  {/* Logo */}
                  <motion.div variants={childVariants}>
                    <Logo />
                  </motion.div>

                  {/* Nav Links */}
                  <motion.div className="flex items-center gap-10" variants={childVariants}>
                    {NAV_ITEMS.map((item) => (
                      <NavLink
                        key={item.label}
                        item={item}
                        isActive={activeSection === item.href.slice(1)}
                        isHovered={hoveredItem === item.href}
                        onHover={() => setHoveredItem(item.href)}
                        onClick={() => scrollToSection(item.href)}
                        showUnderline={
                          hoveredItem !== null
                            ? hoveredItem === item.href
                            : activeSection === item.href.slice(1)
                        }
                      />
                    ))}
                  </motion.div>

                  {/* Resume Button */}
                  <motion.div variants={childVariants}>
                    <Magnetic strength={0.2}>
                      <a
                        href="/resume/Ahmad_Ilyas_Resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open Ahmad Ilyas Resume"
                        className="inline-block px-7 py-2.5 text-[11px] font-medium tracking-[0.08em] uppercase rounded-full border border-white/15 text-silver-secondary cursor-pointer select-none transition-all duration-[450ms] ease-[0.16,1,0.3,1] hover:bg-lime-accent hover:text-background-dark hover:border-lime-accent hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(198,255,0,0.15)]"
                      >
                        Resume
                      </a>
                    </Magnetic>
                  </motion.div>
                </div>

                {/* B. Vertical Layout Layer */}
                <div
                  ref={verticalRef}
                  className="absolute inset-0 flex flex-col items-center justify-between w-full h-full py-8 opacity-0 pointer-events-none z-10"
                >
                  <div className="flex flex-col items-center gap-7 w-full">
                    {/* Vertical Menu Links */}
                    {NAV_ITEMS.map((item) => (
                      <NavLinkVertical
                        key={item.label}
                        item={item}
                        isActive={activeSection === item.href.slice(1)}
                        onClick={() => scrollToSection(item.href)}
                      />
                    ))}

                    {/* Vertical Resume Link */}
                    <a
                      href="/resume/Ahmad_Ilyas_Resume"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Ahmad Ilyas Resume"
                      className="text-[11px] font-semibold tracking-[0.08em] uppercase text-silver-primary/80 hover:text-lime-accent transition-colors duration-300"
                    >
                      Resume
                    </a>
                  </div>

                  {/* Collapse Button */}
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="w-8 h-8 rounded-full border border-white/10 hover:border-lime-accent/30 hover:bg-lime-accent/5 flex items-center justify-center text-silver-secondary hover:text-lime-accent transition-all cursor-pointer"
                    aria-label="Collapse Navigation"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                </div>

                {/* C. Collapsed Menu Grid Icon Layer */}
                <div
                  ref={collapsedIconRef}
                  className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 pointer-events-none z-20"
                >
                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:border-lime-accent/40 flex items-center justify-center text-silver-secondary hover:text-lime-accent transition-all cursor-pointer"
                    aria-label="Expand Navigation"
                  >
                    {/* Luxury 4-dot Grid indicator */}
                    <div className="grid grid-cols-2 gap-[4px] w-[14px] h-[14px]">
                      <span className="w-[5px] h-[5px] rounded-full bg-lime-accent" />
                      <span className="w-[5px] h-[5px] rounded-full bg-silver-primary" />
                      <span className="w-[5px] h-[5px] rounded-full bg-silver-primary" />
                      <span className="w-[5px] h-[5px] rounded-full bg-lime-accent" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ────────────────── MOBILE CONTENT ────────────────── */}
            {!isDesktop && (
              <div
                ref={mobileBarRef}
                className="relative w-full h-full flex items-center justify-between px-5 py-3"
              >
                {/* Mobile Logo Layer */}
                <motion.div
                  className="flex items-center"
                  animate={{ opacity: isMobileScrolled ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: isMobileScrolled ? "none" : "auto" }}
                >
                  <Logo />
                </motion.div>

                {/* Mobile Hamburger Button Layer */}
                <motion.div
                  className="flex items-center justify-center"
                  animate={{
                    position: isMobileScrolled ? "absolute" : "relative",
                    left: isMobileScrolled ? "50%" : "auto",
                    top: isMobileScrolled ? "50%" : "auto",
                    x: isMobileScrolled ? "-50%" : "0%",
                    y: isMobileScrolled ? "-50%" : "0%",
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 cursor-pointer"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                  >
                    <div className="flex flex-col items-center justify-center gap-[5px] w-[16px]">
                      <motion.span
                        className="block w-full h-[1.5px] bg-silver-secondary rounded-full origin-center"
                        animate={mobileOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <motion.span
                        className="block w-full h-[1.5px] bg-silver-secondary rounded-full origin-center"
                        animate={mobileOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </button>
                </motion.div>
              </div>
            )}
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile Full-screen Menu Overlay */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeSection={activeSection}
      />
    </>
  );
}
