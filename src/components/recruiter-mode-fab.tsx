"use client";

import { useRecruiterMode, getFlagEmoji } from "@/lib/recruiter-mode-context";
import { Info, Building2, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function RecruiterModeFab() {
  const {
    isRecruiterMode,
    toggleRecruiterMode,
    isDetecting,
    isCorporateNetwork,
    corporateOrgName,
    visitorCity,
    visitorRegion,
    visitorPostal,
    visitorCountry,
    visitorCountryCode,
  } = useRecruiterMode();

  const [collapsed, setCollapsed] = useState(true); // start collapsed — expands on hover only
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardDismissed, setCardDismissed] = useState(false);

  // Just mark mounted — no auto-collapse timer needed
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = isRecruiterMode;

  // ── Welcome message (full sentence shown in the card) ───────────────────
  let welcomeMsg = "";
  if (isActive && !isDetecting) {
    if (isCorporateNetwork && corporateOrgName) {
      const orgFirst = corporateOrgName.split(" ")[0];
      // Deepest for corporate: org name + city + country
      const locationStr = [visitorCity, visitorCountry].filter(Boolean).join(", ");
      welcomeMsg = locationStr
        ? `Looks like you're visiting from ${orgFirst}'s network in ${locationStr}.`
        : `Looks like you're visiting from ${orgFirst}'s network.`;
    } else if (visitorCity || visitorCountry) {
      // Deepest for personal: city, region POSTALCODE
      const cityPart = visitorCity ?? "";
      const regionPart = visitorRegion && visitorRegion !== visitorCity ? visitorRegion : "";
      const postalPart = visitorPostal ? visitorPostal : "";
      // e.g. "Karnal, Haryana 132001"
      const localStr = [cityPart, regionPart].filter(Boolean).join(", ");
      const fullLocal = [localStr, postalPart].filter(Boolean).join(" ");
      const location = fullLocal || visitorCountry || "";
      welcomeMsg = `It looks like you're visiting from ${location}. Thanks for taking the time to check out my work.`;
    }
  }

  // Show card ~400ms after detection finishes, auto-dismiss after 7s
  useEffect(() => {
    if (isActive && !isDetecting && welcomeMsg && !cardDismissed) {
      const showT = setTimeout(() => setShowCard(true), 400);
      const hideT = setTimeout(() => setShowCard(false), 7400);
      return () => {
        clearTimeout(showT);
        clearTimeout(hideT);
      };
    }
    if (!isActive) {
      setShowCard(false);
      setCardDismissed(false);
    }
  }, [isActive, isDetecting, welcomeMsg, cardDismissed]);

  if (!mounted) return null;

  const showLabel = hovered; // only expand on hover, never auto-expands

  // ── Icon ─────────────────────────────────────────────────────────────────
  let FabIcon: React.ElementType = Info;
  if (isActive) {
    if (isDetecting) FabIcon = Loader2;
    else if (isCorporateNetwork) FabIcon = Building2;
    else FabIcon = MapPin;
  }

  // ── Short pill label (card carries the full message) ────────────────────
  let fabLabel = "Enable Recruiter Mode";
  if (isActive) {
    if (isDetecting) {
      fabLabel = "Detecting…";
    } else if (isCorporateNetwork && corporateOrgName) {
      // "Google, Frankfurt" — first org word + city if available
      const orgFirst = corporateOrgName.split(" ")[0];
      fabLabel = visitorCity ? `${orgFirst}, ${visitorCity}` : orgFirst;
    } else if (visitorCity) {
      const flag = getFlagEmoji(visitorCountryCode);
      // "Karnal, Haryana 🇮🇳" — deepest readable fit for a pill
      const label = visitorRegion && visitorRegion !== visitorCity
        ? `${visitorCity}, ${visitorRegion}`
        : visitorCity;
      fabLabel = `${label}${flag ? ` ${flag}` : ""}`;
    } else if (visitorCountry) {
      const flag = getFlagEmoji(visitorCountryCode);
      fabLabel = `${visitorCountry}${flag ? ` ${flag}` : ""}`;
    } else {
      fabLabel = "Active";
    }
  }

  return (
    <div
      className="fixed right-5 top-5 z-40 flex flex-col items-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Main pill button ─────────────────────────────────────────────── */}
      <motion.button
        id="recruiter-mode-fab"
        layout
        aria-label={isActive ? "Exit Recruiter Mode" : "Enable Recruiter Mode"}
        onClick={toggleRecruiterMode}
        transition={{ type: "spring", stiffness: 500, damping: 38 }}
        className="relative flex items-center gap-0 h-10 cursor-pointer select-none focus-visible:outline-none"
        style={{ borderRadius: 999 }}
        whileTap={{ scale: 0.94 }}
      >
        {/* Background */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
          className="absolute inset-0 rounded-full border backdrop-blur-md"
          style={{
            borderColor: isActive
              ? "rgba(16, 185, 129, 0.45)"
              : "rgba(128,128,128,0.2)",
            background: isActive
              ? "rgba(16, 185, 129, 0.08)"
              : "var(--background-alpha, rgba(255,255,255,0.88))",
            boxShadow: isActive
              ? "0 0 0 1px rgba(16,185,129,0.15), 0 4px 20px rgba(16,185,129,0.12)"
              : "0 2px 12px rgba(0,0,0,0.08)",
          }}
        />

        {/* Content row */}
        <div className="relative flex items-center gap-0 px-[10px]">
          <motion.div
            animate={{
              color: isActive ? "rgb(16, 185, 129)" : "rgb(100, 116, 139)",
            }}
            transition={{ duration: 0.25 }}
          >
            <FabIcon
              className={`size-[17px] flex-shrink-0${
                isDetecting && isActive ? " animate-spin" : ""
              }`}
            />
          </motion.div>

          <AnimatePresence mode="popLayout">
            {showLabel && (
              <motion.span
                key={fabLabel}
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 7 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="overflow-hidden whitespace-nowrap text-[12.5px] font-semibold"
                style={{
                  display: "inline-block",
                  color: isActive ? "rgb(16, 185, 129)" : "rgb(100, 116, 139)",
                  letterSpacing: "0.02em",
                  paddingRight: 4,
                }}
              >
                {fabLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* ── Welcome message card ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showCard && welcomeMsg && (
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, x: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative mt-2.5 w-56 rounded-xl border border-border/60 bg-background/95 backdrop-blur-md shadow-lg overflow-hidden"
          >
            {/* Thin emerald top bar */}
            <div
              aria-hidden
              className="absolute top-0 inset-x-0 h-[2px]"
              style={{
                background: isCorporateNetwork
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, #6366f1, #8b5cf6)",
              }}
            />

            <div className="px-3.5 pt-4 pb-3">
              <p className="text-[12.5px] leading-relaxed text-foreground/75">
                {welcomeMsg}
              </p>
            </div>

            {/* Dismiss */}
            <button
              aria-label="Dismiss"
              onClick={() => {
                setShowCard(false);
                setCardDismissed(true);
              }}
              className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="size-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
