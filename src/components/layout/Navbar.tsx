"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";
import Magnetic from "@/components/ui/Magnetic";

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
          {/* Blurred dark backdrop */}
          <motion.div
            className="absolute inset-0 bg-background-dark/95 backdrop-blur-2xl"
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
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  /* ── Scroll direction tracking ── */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;

    // Scrolled state (compact mode)
    setIsScrolled(latest > SCROLL_THRESHOLD);

    // Hide/show based on direction (with threshold to avoid jitter)
    if (Math.abs(delta) > HIDE_THRESHOLD) {
      setIsHidden(delta > 0 && latest > 120);
    }

    lastScrollY.current = latest;
  });

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
        <motion.nav
          className="pointer-events-auto flex items-center justify-between rounded-full px-5 md:px-8 w-[90%] lg:w-[78%] max-w-[1280px]"
          animate={{
            y: isHidden ? -100 : 0,
            height: isScrolled ? 56 : 64,
            backgroundColor: isScrolled ? "rgba(8,8,8,0.75)" : "rgba(8,8,8,0.58)",
            backdropFilter: isScrolled ? "blur(24px)" : "blur(18px)",
            boxShadow: isScrolled
              ? "0 4px 30px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.05)"
              : "0 2px 20px rgba(0,0,0,0.15)",
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
          {/* Logo */}
          <motion.div variants={childVariants}>
            <Logo />
          </motion.div>

          {/* Desktop Navigation Links */}
          <motion.div
            className="hidden lg:flex items-center gap-10"
            variants={childVariants}
            onMouseLeave={() => setHoveredItem(null)}
          >
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

          {/* Desktop Resume Button */}
          <motion.div className="hidden lg:block" variants={childVariants}>
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

          {/* Mobile Hamburger Button */}
          <motion.div className="lg:hidden" variants={childVariants}>
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
        </motion.nav>
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
