"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface ButtonProps {
  variant?: "primary" | "secondary" | "glass" | "lime-outline" | "primary-invert";
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
    "group/btn relative inline-flex items-center justify-center overflow-hidden px-8 py-4",
    "font-body text-sm font-medium tracking-wider uppercase rounded-full transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-lime-accent/50 focus:ring-offset-2 focus:ring-offset-background-dark",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  // Variant styles and hover slide background colors
  // group-hover/card = trigger when parent project card is hovered
  const variantStyles = {
    primary: "bg-lime-accent text-on-accent border border-lime-accent",
    "primary-invert":
      "bg-lime-accent text-on-accent border border-lime-accent group-hover/btn:border-[#1A1714] group-hover/card:border-[#1A1714]",
    secondary: "bg-transparent text-silver-secondary border border-border-strong hover:border-lime-accent",
    glass: "bg-surface text-silver-secondary border border-border-subtle backdrop-blur-md hover:border-border-strong",
    "lime-outline":
      "bg-transparent text-silver-secondary border border-lime-accent/50 group-hover/btn:border-lime-accent group-hover/card:border-lime-accent",
  };

  // Background slides
  const slideBgColor = {
    primary: "bg-lime-dark",
    "primary-invert": "bg-white",
    secondary: "bg-lime-accent",
    glass: "bg-lime-accent",
    "lime-outline": "bg-lime-accent",
  };

  const textHoverColor = {
    primary: "text-on-accent",
    "primary-invert":
      "text-on-accent group-hover/btn:text-[#1A1714] group-hover/card:text-[#1A1714]",
    secondary: "text-silver-secondary group-hover/btn:text-on-accent",
    glass: "text-silver-secondary group-hover/btn:text-on-accent",
    "lime-outline":
      "text-silver-secondary group-hover/btn:text-on-accent group-hover/card:text-on-accent",
  };

  const content = (
    <>
      {/* Sliding background fill overlay */}
      <span
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500 ease-[0.76,0,0.24,1] origin-bottom scale-y-0 group-hover/btn:scale-y-100 group-hover/card:scale-y-100",
          slideBgColor[variant]
        )}
      />

      {/* Button text & icon with sliding ticker animation */}
      <span className={cn("relative z-10 flex items-center gap-2 overflow-hidden h-[1.5em] select-none", textHoverColor[variant])}>
        <span className="flex items-center gap-2 transition-transform duration-500 ease-[0.76,0,0.24,1] group-hover/btn:-translate-y-[150%] group-hover/card:-translate-y-[150%]">
          {icon && iconPosition === "left" && <span className="text-base">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === "right" && <span className="text-base">{icon}</span>}
        </span>
        <span className="absolute flex items-center gap-2 transition-transform duration-500 ease-[0.76,0,0.24,1] translate-y-[150%] group-hover/btn:translate-y-0 group-hover/card:translate-y-0">
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
