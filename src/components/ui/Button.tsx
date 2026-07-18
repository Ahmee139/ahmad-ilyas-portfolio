"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface ButtonProps {
  variant?: "primary" | "secondary" | "glass" | "lime-outline";
  href?: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  variant = "primary",
  href,
  className,
  children,
  icon,
  iconPosition = "right",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  // Base classes with luxury tracking and sizing
  const baseClasses = cn(
    "group relative inline-flex items-center justify-center overflow-hidden px-8 py-4",
    "font-body text-sm font-medium tracking-wider uppercase rounded-full transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-lime-accent/50 focus:ring-offset-2 focus:ring-offset-background-dark",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  // Variant styles and hover slide background colors
  const variantStyles = {
    primary: "bg-lime-accent text-background-dark border border-lime-accent",
    secondary: "bg-transparent text-silver-primary border border-silver-primary/30 hover:border-silver-secondary",
    glass: "bg-white/5 text-silver-secondary border border-white/10 backdrop-blur-md hover:border-white/20",
    "lime-outline": "bg-transparent text-lime-accent border border-lime-accent/40 hover:border-lime-accent",
  };

  // Background slides
  const slideBgColor = {
    primary: "bg-lime-dark",
    secondary: "bg-silver-secondary",
    glass: "bg-white/10",
    "lime-outline": "bg-lime-accent",
  };

  const textHoverColor = {
    primary: "text-background-dark",
    secondary: "text-background-dark",
    glass: "text-silver-secondary",
    "lime-outline": "text-background-dark",
  };

  const content = (
    <>
      {/* Sliding background fill overlay */}
      <span
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500 ease-[0.76,0,0.24,1] origin-bottom scale-y-0 group-hover:scale-y-100",
          slideBgColor[variant]
        )}
      />

      {/* Button text & icon with sliding ticker animation */}
      <span className={cn("relative z-10 flex items-center gap-2 overflow-hidden h-[1.5em] select-none", textHoverColor[variant])}>
        <span className="flex items-center gap-2 transition-transform duration-500 ease-[0.76,0,0.24,1] group-hover:-translate-y-[150%]">
          {icon && iconPosition === "left" && <span className="text-base">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === "right" && <span className="text-base">{icon}</span>}
        </span>
        <span className="absolute flex items-center gap-2 transition-transform duration-500 ease-[0.76,0,0.24,1] translate-y-[150%] group-hover:translate-y-0">
          {icon && iconPosition === "left" && <span className="text-base">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === "right" && <span className="text-base">{icon}</span>}
        </span>
      </span>
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a
          href={href}
          className={cn(baseClasses, variantStyles[variant])}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cn(baseClasses, variantStyles[variant])}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cn(baseClasses, variantStyles[variant])}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
