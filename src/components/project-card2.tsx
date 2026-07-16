"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { useRef, useCallback } from "react";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  /* ── Mouse tracking via direct DOM writes (no re-renders = silky smooth) ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = outerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Spotlight follows cursor
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(
          320px circle at ${x}% ${y}%,
          rgba(200, 210, 255, 0.09) 0%,
          transparent 70%
        )`;
      }
      // Shimmer tilts toward cursor
      if (shimmerRef.current) {
        const tiltX = (x - 50) * 0.4;
        const tiltY = (y - 50) * 0.4;
        shimmerRef.current.style.transform = `rotate(${tiltX * 0.3}deg) translate(${tiltX * 0.6}px, ${tiltY * 0.6}px)`;
      }
      // Border gradient follows cursor
      if (borderRef.current) {
        borderRef.current.style.background = `radial-gradient(
          ellipse at ${x}% ${y}%,
          rgba(180, 190, 255, 0.35) 0%,
          rgba(160, 170, 210, 0.12) 40%,
          rgba(120, 130, 160, 0.06) 70%
        )`;
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "1";
    if (borderRef.current) borderRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    if (shimmerRef.current) {
      shimmerRef.current.style.opacity = "0";
      shimmerRef.current.style.transform = "rotate(0deg) translate(0px, 0px)";
    }
    if (borderRef.current) {
      borderRef.current.style.opacity = "0";
    }
  }, []);

  return (
    <div
      ref={outerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col h-full group"
      style={{ borderRadius: "14px" }}
    >
      {/* ── Gradient border layer (idle: muted, hover: cool glow) ── */}
      <div
        className="absolute inset-0 rounded-[14px]"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(148,163,184,0.20) 0%, rgba(148,163,184,0.07) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
      {/* Hover border glow — drawn on top, fades in */}
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-[14px]"
        style={{
          padding: "1px",
          opacity: 0,
          transition: "opacity 0.5s ease",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(180,190,255,0.35), rgba(120,130,160,0.06))",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />

      {/* ── Glass inner pane ── */}
      <div
        className="relative flex flex-col overflow-hidden rounded-[13px] h-full"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          backgroundColor: "rgba(var(--card-rgb, 255,255,255), 0.55)",
        }}
      >
        {/* Spotlight */}
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[13px]"
          style={{
            opacity: 0,
            transition: "opacity 0.4s ease",
            zIndex: 1,
          }}
        />

        {/* Shimmer light ray */}
        <div
          ref={shimmerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-30%] rounded-[13px]"
          style={{
            opacity: 0,
            transition: "opacity 0.5s ease, transform 0.25s ease",
            zIndex: 1,
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.06) 48%, rgba(255,255,255,0.11) 52%, transparent 70%)",
          }}
        />

        {/* ── Media ── */}
        <Link
          href={href || "#"}
          className="relative block cursor-pointer overflow-hidden z-10"
        >
          {video && (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="pointer-events-none mx-auto h-40 w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
          {image && (
            <Image
              src={image}
              alt={title}
              width={500}
              height={300}
              className="h-40 w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
        </Link>

        {/* ── Content ── */}
        <div className="relative flex flex-col flex-1 px-3 pt-3 pb-3 gap-2 z-10">
          {/* Header */}
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold tracking-tight leading-snug text-foreground">
              {title}
            </h3>
            <time className="text-xs font-medium text-muted-foreground/60">
              {dates}
            </time>
            <div className="hidden font-sans text-xs underline print:visible">
              {link
                ?.replace("https://", "")
                .replace("www.", "")
                .replace("/", "")}
            </div>
          </div>

          {/* Description */}
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert leading-relaxed">
            {description}
          </Markdown>

          <div className="flex-1" />

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-1.5 py-0 text-[10px] font-medium rounded-full
                    border-border/50 bg-muted/40
                    text-muted-foreground
                    hover:bg-muted/70
                    transition-colors duration-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Links */}
          {links && links.length > 0 && (
            <div className="flex flex-row flex-wrap items-center gap-1.5 mt-1">
              {links.map((l, idx) => (
                <Link href={l.href} key={idx} target="_blank">
                  <Badge
                    variant="outline"
                    className="flex gap-1.5 px-2 py-1 text-[10px] font-semibold rounded-full cursor-pointer
                      border-border/50 bg-muted/40
                      text-muted-foreground
                      hover:bg-muted hover:text-foreground hover:border-border
                      transition-all duration-200"
                  >
                    {l.icon}
                    {l.type}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
