"use client";

import { useEffect, useRef } from "react";
import { useLoader } from "@/context/LoaderContext";
import { useTheme } from "@/context/ThemeContext";

/**
 * Soft scroll-reactive dots — appear/drift gently as the user scrolls.
 * Clean, low-contrast, never noisy.
 */
export default function Particles() {
  const { isLoading } = useLoader();
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    if (isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    const particles: Particle[] = [];
    const particleCount = 42;

    class Particle {
      x = 0;
      y = 0;
      baseY = 0;
      size = 0;
      speedX = 0;
      drift = 0;
      opacity = 0;
      phase = 0;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.baseY = init
          ? Math.random() * (canvas.height + 400) - 200
          : canvas.height + Math.random() * 120;
        this.y = this.baseY;
        this.size = Math.random() * 1.4 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.08;
        this.drift = Math.random() * 0.15 + 0.05;
        this.opacity = Math.random() * 0.18 + 0.06;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(time: number, scroll: number) {
        if (!canvas) return;
        this.x += this.speedX + Math.sin(time * 0.0004 + this.phase) * 0.04;
        // Gentle parallax tied to scroll — smooth, not jittery
        this.y = this.baseY - scroll * this.drift - time * 0.012;

        if (this.y < -40 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset(false);
          this.baseY = canvas.height + Math.random() * 80;
          this.y = this.baseY - scroll * this.drift;
        }
      }

      draw(time: number) {
        if (!ctx) return;
        const pulse = 0.75 + Math.sin(time * 0.0012 + this.phase) * 0.25;
        const alpha =
          this.opacity *
          pulse *
          (themeRef.current === "light" ? 0.85 : 1);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle =
          themeRef.current === "light"
            ? `rgba(244, 90, 55, ${alpha})`
            : `rgba(244, 90, 55, ${alpha})`;
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", onScroll, { passive: true });

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = (time: number) => {
      // Smooth scroll interpolation for clean motion
      scrollY += (targetScrollY - scrollY) * 0.08;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(time, scrollY);
        p.draw(time);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}
