"use client";

import { useRecruiterMode } from "@/lib/recruiter-mode-context";
import { X, Briefcase } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function RecruiterBanner() {
  const { isRecruiterMode, disableRecruiterMode } = useRecruiterMode();

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isRecruiterMode) {
      timeoutRef.current = setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isRecruiterMode]);

  if (!mounted || !isRecruiterMode) return null;

  return (
    <div
      role="banner"
      aria-label="Recruiter Mode active"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease",
      }}
      className="fixed top-3 inset-x-0 z-50 mx-auto max-w-2xl px-4"
    >
      <div className="relative overflow-hidden rounded-xl border border-emerald-500/25 bg-background/92 backdrop-blur-md shadow-md">
        {/* Shimmer top border */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-[2px] rounded-t-xl"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #10b981 30%, #34d399 50%, #10b981 70%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "recruiter-shimmer 2.8s linear infinite",
          }}
        />

        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/12 border border-emerald-500/20">
            <Briefcase className="size-3 text-emerald-500" />
          </div>

          <p className="flex-1 text-sm text-foreground/80 leading-none">
            <span className="text-emerald-500 font-semibold">Recruiter Mode</span>
            <span className="text-muted-foreground text-xs ml-2">
              — Focused professional view
            </span>
          </p>

          <button
            id="recruiter-mode-dismiss"
            onClick={disableRecruiterMode}
            aria-label="Exit Recruiter Mode"
            className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
