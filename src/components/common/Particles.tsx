"use client";

import { useEffect, useRef } from "react";
import { useLoader } from "@/context/LoaderContext";

export default function Particles() {
  const { isLoading } = useLoader();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isLoading) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: Particle[] = [];
    const particleCount = 28; // Keep it subtle and low count to avoid clutter

    class Particle {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedX: number = 0;
      speedY: number = 0;
      opacity: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        // If initializing, spawn anywhere, otherwise spawn at bottom
        this.y = init ? Math.random() * canvas.height : canvas.height + 10;
        this.size = Math.random() * 1.2 + 0.6; // Subtle tiny particles
        this.speedX = (Math.random() - 0.5) * 0.12; // Slow drift left/right
        this.speedY = -(Math.random() * 0.2 + 0.05); // Slow drift upward
        this.opacity = Math.random() * 0.35 + 0.1; // Low opacity
      }

      update() {
        if (!canvas) return;
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle if it drifts off the bounds
        if (
          this.y < -10 ||
          this.x < -10 ||
          this.x > canvas.width + 10
        ) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Draw in orange accent shade with opacity mapping
        ctx.fillStyle = `rgba(244, 90, 55, ${this.opacity})`;
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Instantiate particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
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
