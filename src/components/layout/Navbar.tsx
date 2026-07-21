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
      <span className="text-[13px] md:text-[15px] font-bold text-[#060606]/85 tracking-wide transition-colors duration-500">
        My
      </span>

      <span className="text-[17px] md:text-[19px] font-black text-[#060606] tracking-[0.02em] transition-colors duration-500">
        Portfolio
      </span>

      <span
        className="inline-block w-[4px] h-[4px] rounded-full bg-white ml-[2px] mb-[2px] opacity-90 group-hover:opacity-100 transition-opacity duration-500"
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
        className="block text-[12px] md:text-[13px] font-display font-bold tracking-[0.12em] uppercase transition-colors duration-300"
        style={{
          color: (isActive || isHovered) ? "#FFFFFF" : "#060606",
        }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {item.label}
      </motion.span>

      {/* Shared Sliding Underline Indicator using layoutId */}
      {showUnderline && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-white rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{
            boxShadow: "0 0 8px rgba(255,255,255,0.7)",
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
        className="block text-[12px] md:text-[13px] font-display font-bold tracking-[0.12em] uppercase transition-colors duration-300"
        style={{
          color: isActive ? "#FFFFFF" : "#060606",
        }}
        whileHover={{ scale: 1.08, color: "#FFFFFF" }}
      >
        {item.label}
      </motion.span>
    </a>
  );
}

/* ─── Hamburger Toggle Button ─── */
function HamburgerToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#060606]/10 border border-[#060606]/20 cursor-pointer transition-colors duration-300 hover:bg-[#060606]/20"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="flex flex-col items-center justify-center gap-[5px] w-[16px]">
        <motion.span
          className="block w-full h-[1.5px] bg-[#060606] rounded-full origin-center"
          animate={isOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="block w-full h-[1.5px] bg-[#060606] rounded-full origin-center"
          animate={isOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </button>
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

  // References for GSAP transitions
  const navWrapperRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Desktop Content Layer Refs
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const collapsedIconRef = useRef<HTMLDivElement>(null);
  
  // Mobile Content Layer Refs
  const mobileNormalRef = useRef<HTMLDivElement>(null);
  const mobileFloatingIconRef = useRef<HTMLDivElement>(null);
  const mobileFloatingMenuRef = useRef<HTMLDivElement>(null);

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

    // Auto-close open mobile menu on scroll change
    if (mobileOpen) {
      setMobileOpen(false);
    }

    // Scrolled state (compact heights)
    setIsScrolled(latest > SCROLL_THRESHOLD);

    // Desktop Docking trigger (dock at 220px, restore at 120px)
    if (isDesktop) {
      if (latest > 220) {
        if (!isDocked) {
          setIsDocked(true);
          setIsCollapsed(true); // Collapses to 4-dot menu button by default when scrolling down!
        }
      } else if (latest < 120) {
        setIsDocked(false);
        setIsCollapsed(false);
      }
    } else {
      setIsDocked(false);
    }

    // Mobile floating button trigger (float at 180px, restore at 120px)
    if (!isDesktop) {
      if (latest > 180) {
        setIsMobileScrolled(true);
      } else if (latest < 120) {
        setIsMobileScrolled(false);
      }
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

    // Common positioning variables
    const originalTop = isScrolled ? 8 : 16;

    if (isDesktop) {
      // DESKTOP MORPHING SEQUENCE: Morphs to right-center collapsed menu button on scroll
      if (isDocked) {
        const targetWidth = isCollapsed ? 64 : 108;
        const targetHeight = isCollapsed ? 64 : 400;
        const targetBorderRadius = isCollapsed ? "32px" : "28px";

        // Vertical Center Position
        const deltaY = windowSize.h / 2 - originalTop - targetHeight / 2;

        // Calculate translation delta to position perfectly on the right (32px padding)
        const deltaX = (windowSize.w - 32 - targetWidth / 2) - (windowSize.w / 2);

        // Animate wrapper position and size
        gsap.to(wrapper, {
          x: deltaX,
          y: deltaY,
          width: targetWidth,
          height: targetHeight,
          duration: 0.8,
          ease: "power4.inOut",
        });

        // Animate inner nav border radius
        gsap.to(nav, {
          borderRadius: targetBorderRadius,
          duration: 0.8,
          ease: "power4.inOut",
        });

        // Toggle layout transparencies cleanly
        gsap.to(horizontalRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
        
        if (isCollapsed) {
          gsap.to(verticalRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
          gsap.to(collapsedIconRef.current, { autoAlpha: 1, scale: 1, pointerEvents: "auto", duration: 0.3, delay: 0.15 });
        } else {
          gsap.to(verticalRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.35, delay: 0.2 });
          gsap.to(collapsedIconRef.current, { autoAlpha: 0, scale: 0.8, pointerEvents: "none", duration: 0.15 });
        }
      } else {
        // Morph back to standard horizontal header bar at top
        gsap.to(wrapper, {
          x: 0,
          y: 0,
          width: "78%",
          height: isScrolled ? 56 : 64,
          duration: 0.8,
          ease: "power4.inOut",
        });

        gsap.to(nav, {
          borderRadius: "9999px",
          duration: 0.8,
          ease: "power4.inOut",
        });

        gsap.to(horizontalRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.35, delay: 0.2 });
        gsap.to(verticalRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
        gsap.to(collapsedIconRef.current, { autoAlpha: 0, scale: 0.8, pointerEvents: "none", duration: 0.15 });
      }
    } else {
      // MOBILE MORPHING SEQUENCE
      if (isMobileScrolled) {
        if (mobileOpen) {
          // Expanded floating menu on mobile (right side, vertically centered)
          const deltaX = (windowSize.w - 24 - 36) - (windowSize.w / 2);
          const deltaY = windowSize.h / 2 - originalTop - 160; // height 320 / 2 = 160

          gsap.to(wrapper, {
            x: deltaX,
            y: deltaY,
            width: 72,
            height: 320,
            duration: 0.8,
            ease: "power4.inOut",
          });

          gsap.to(nav, {
            borderRadius: "32px",
            duration: 0.8,
            ease: "power4.inOut",
          });

          // Opacity Toggles using autoAlpha for instant visibility removal
          gsap.to(mobileNormalRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
          gsap.to(mobileFloatingIconRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
          gsap.to(mobileFloatingMenuRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.35, delay: 0.2 });
        } else {
          // Floating sticky circle button on mobile (right side, vertically centered) - matching desktop style
          const deltaX = (windowSize.w - 24 - 36) - (windowSize.w / 2);
          const deltaY = windowSize.h / 2 - originalTop - 36; // height 72 / 2 = 36

          gsap.to(wrapper, {
            x: deltaX,
            y: deltaY,
            width: 72,
            height: 72,
            duration: 0.8,
            ease: "power4.inOut",
          });

          gsap.to(nav, {
            borderRadius: "36px",
            duration: 0.8,
            ease: "power4.inOut",
          });

          // Opacity Toggles
          gsap.to(mobileNormalRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
          gsap.to(mobileFloatingIconRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.35, delay: 0.2 });
          gsap.to(mobileFloatingMenuRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
        }
      } else {
        // Morph back to full horizontal mobile menu bar at top
        const targetHeight = mobileOpen ? 320 : (isScrolled ? 56 : 64);
        const targetBorderRadius = mobileOpen ? "24px" : "9999px";

        gsap.to(wrapper, {
          x: 0,
          y: 0,
          width: "90%",
          height: targetHeight,
          duration: 0.8,
          ease: "power4.inOut",
        });

        gsap.to(nav, {
          borderRadius: targetBorderRadius,
          duration: 0.8,
          ease: "power4.inOut",
        });

        // Opacity Toggles
        gsap.to(mobileNormalRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.35, delay: 0.25 });
        gsap.to(mobileFloatingIconRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
        gsap.to(mobileFloatingMenuRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.15 });
      }
    }
  }, [isDesktop, isDocked, isMobileScrolled, isCollapsed, mobileOpen, isScrolled, windowSize]);

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

  // Stagger parameters for mobile menu reveal
  const mobileListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
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
        {/* Inner Nav Panel - Solid/Translucent Orange Background */}
        <motion.nav
          ref={navRef}
          className="w-full h-full relative overflow-hidden flex items-center justify-between rounded-full bg-lime-accent shadow-none transition-shadow duration-300 hover:shadow-lg hover:shadow-lime-accent/20"
          animate={{
            y: isHidden ? -100 : 0,
            backgroundColor: (isDocked && isCollapsed) ? "rgba(0,0,0,0)" : "#F45A37",
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ────────────────── DESKTOP CONTENT ────────────────── */}
          {isDesktop && (
            <div className="w-full h-full relative">
              {/* A. Horizontal Layout Layer - hidden when docked */}
              <div
                ref={horizontalRef}
                style={{ display: isDocked ? "none" : "flex" }}
                className="absolute inset-0 flex items-center justify-between w-full h-full px-8 overflow-hidden"
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
                      className="inline-block px-7 py-2.5 text-[12px] md:text-[13px] font-display font-bold tracking-[0.12em] uppercase rounded-full border border-[#060606]/30 text-[#060606] cursor-pointer select-none transition-all duration-[450ms] ease-[0.16,1,0.3,1] hover:bg-[#060606] hover:text-[#F45A37] hover:border-[#060606] hover:scale-[1.04]"
                    >
                      Resume
                    </a>
                  </Magnetic>
                </motion.div>
              </div>

              {/* B. Vertical Layout Layer - shown only when docked & expanded */}
              <div
                ref={verticalRef}
                style={{ display: isDocked && !isCollapsed ? "flex" : "none" }}
                className="absolute inset-0 flex flex-col items-center justify-between w-full h-full py-8 z-10"
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
                    className="text-[12px] md:text-[13px] font-display font-bold tracking-[0.12em] uppercase text-[#060606]/80 hover:text-white transition-colors duration-300"
                  >
                    Resume
                  </a>
                </div>

                {/* Collapse Button */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="w-8 h-8 rounded-full bg-[#060606]/10 hover:bg-[#060606] border border-[#060606]/20 flex items-center justify-center text-[#060606] hover:text-[#F45A37] transition-all cursor-pointer"
                  aria-label="Collapse Navigation"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
              </div>

              {/* C. Collapsed Menu Grid Icon Layer - shown only when docked & collapsed */}
              <div
                ref={collapsedIconRef}
                style={{ display: isDocked && isCollapsed ? "flex" : "none" }}
                className="absolute inset-0 flex items-center justify-center w-full h-full z-20"
              >
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="w-12 h-12 rounded-full bg-[#060606] border border-white/10 hover:border-[#F45A37] hover:scale-105 flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(244,90,55,0.3)]"
                  aria-label="Expand Navigation"
                >
                  {/* Luxury 4-dot Grid indicator */}
                  <div className="grid grid-cols-2 gap-[4px] w-[14px] h-[14px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-white" />
                    <span className="w-[5px] h-[5px] rounded-full bg-[#F45A37]" />
                    <span className="w-[5px] h-[5px] rounded-full bg-[#F45A37]" />
                    <span className="w-[5px] h-[5px] rounded-full bg-white" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ────────────────── MOBILE CONTENT ────────────────── */}
          {!isDesktop && (
            <div className="w-full h-full relative">
              {/* Layer 1: Mobile Standard Top Bar / Expanded Top Menu */}
              <div
                ref={mobileNormalRef}
                className="absolute inset-0 flex flex-col justify-between w-full h-full py-3 px-5 z-10"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between w-full h-10">
                  <Logo />
                  <HamburgerToggle
                    isOpen={mobileOpen}
                    onClick={() => setMobileOpen(!mobileOpen)}
                  />
                </div>

                {/* Vertical Links List (renders when mobile menu is open at the top) */}
                <AnimatePresence>
                  {mobileOpen && (
                    <motion.nav
                      className="flex flex-col items-center justify-center gap-6 w-full flex-grow pt-4 pb-2"
                      variants={mobileListVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {NAV_ITEMS.map((item) => (
                        <motion.div key={item.label} variants={mobileItemVariants}>
                          <NavLinkVertical
                            item={item}
                            isActive={activeSection === item.href.slice(1)}
                            onClick={() => {
                              setMobileOpen(false);
                              scrollToSection(item.href);
                            }}
                          />
                        </motion.div>
                      ))}
                      
                      <motion.div variants={mobileItemVariants}>
                        <a
                          href="/resume/Ahmad_Ilyas_Resume"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open Ahmad Ilyas Resume"
                          className="text-[12px] md:text-[13px] font-display font-bold tracking-[0.12em] uppercase text-[#060606]/80 hover:text-white transition-colors duration-300"
                        >
                          Resume
                        </a>
                      </motion.div>
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>

              {/* Layer 2: Mobile Floating Circle Toggle Button - showing luxury 4-dot Grid indicator */}
              <div
                ref={mobileFloatingIconRef}
                className="absolute inset-0 flex items-center justify-center w-full h-full opacity-0 pointer-events-none z-20"
              >
                <button
                  onClick={() => setMobileOpen(true)}
                  className="w-12 h-12 rounded-full bg-[#060606] border border-[#060606] flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
                  aria-label="Open Mobile Menu"
                >
                  {/* Luxury 4-dot Grid indicator */}
                  <div className="grid grid-cols-2 gap-[4px] w-[14px] h-[14px]">
                    <span className="w-[5px] h-[5px] rounded-full bg-white" />
                    <span className="w-[5px] h-[5px] rounded-full bg-[#F45A37]" />
                    <span className="w-[5px] h-[5px] rounded-full bg-[#F45A37]" />
                    <span className="w-[5px] h-[5px] rounded-full bg-white" />
                  </div>
                </button>
              </div>

              {/* Layer 3: Mobile Floating Expanded Vertical Menu */}
              <div
                ref={mobileFloatingMenuRef}
                className="absolute inset-0 flex flex-col items-center justify-between w-full h-full py-6 opacity-0 pointer-events-none z-30"
              >
                {/* Stacked menu links */}
                <AnimatePresence>
                  {mobileOpen && (
                    <motion.nav
                      className="flex flex-col items-center gap-6 w-full pt-2"
                      variants={mobileListVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {NAV_ITEMS.map((item) => (
                        <motion.div key={item.label} variants={mobileItemVariants}>
                          <NavLinkVertical
                            item={item}
                            isActive={activeSection === item.href.slice(1)}
                            onClick={() => {
                              setMobileOpen(false);
                              scrollToSection(item.href);
                            }}
                          />
                        </motion.div>
                      ))}

                      <motion.div variants={mobileItemVariants}>
                        <a
                          href="/resume/Ahmad_Ilyas_Resume"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open Ahmad Ilyas Resume"
                          className="text-[12px] md:text-[13px] font-display font-bold tracking-[0.12em] uppercase text-[#060606]/80 hover:text-white transition-colors duration-300"
                        >
                          Resume
                        </a>
                      </motion.div>
                    </motion.nav>
                  )}
                </AnimatePresence>

                {/* Center Toggle Button serving as close button at bottom */}
                <HamburgerToggle
                  isOpen={mobileOpen}
                  onClick={() => setMobileOpen(!mobileOpen)}
                />
              </div>
            </div>
          )}
        </motion.nav>
      </div>
    </motion.header>
  );
}
