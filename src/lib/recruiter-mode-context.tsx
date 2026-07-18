"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ─── IP Detection helpers ───────────────────────────────────────────────────

const CONSUMER_ISPS = [
  "jio",
  "airtel",
  "bsnl",
  "comcast",
  "att ",
  "at&t",
  "verizon",
  "vodafone",
  "spectrum",
  "cox",
  "t-mobile",
  "idea",
  "vi ",
  "hathway",
  "act fibernet",
  "you broadband",
  "excitel",
  "tatasky",
];

const CORP_KEYWORDS = [
  "technologies",
  "technology",
  "solutions",
  "consulting",
  "corp",
  "corporation",
  "ltd",
  "llc",
  "inc",
  "systems",
  "services",
  "software",
  "networks",
  "communications",
  "enterprises",
  "global",
  "digital",
  "group",
  "university",
  "college",
  "institute",
  "research",
  "labs",
  "cloud",
  "hosting",
  "datacenter",
  "data center",
];

/** Converts a 2-letter country code to its flag emoji. "IN" → "🇮🇳" */
export function getFlagEmoji(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const points = countryCode
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...points);
}

interface IpApiResponse {
  org?: string;
  city?: string;
  region?: string;
  postal?: string;
  country_name?: string;
  country_code?: string;
  timezone?: string;
}

interface NetworkResult {
  isCorporate: boolean;
  orgName: string | null;
  city: string | null;
  region: string | null;   // state / province e.g. "Haryana"
  postal: string | null;   // ZIP / postal code e.g. "132001"
  country: string | null;
  countryCode: string | null;
  isp: string | null;
}

async function detectNetwork(): Promise<NetworkResult> {
  const empty: NetworkResult = {
    isCorporate: false,
    orgName: null,
    city: null,
    region: null,
    postal: null,
    country: null,
    countryCode: null,
    isp: null,
  };

  // ── Dev debug override ──────────────────────────────────────────────────
  // To fake a corporate network, paste this in your browser console:
  //   localStorage.setItem('rm-debug', JSON.stringify({ isCorporate: true, orgName: 'Google LLC', city: 'Mountain View', country: 'United States', countryCode: 'US', isp: null }))
  // To fake a personal network with location:
  //   localStorage.setItem('rm-debug', JSON.stringify({ isCorporate: false, orgName: null, city: 'Bengaluru', country: 'India', countryCode: 'IN', isp: 'Jio' }))
  // To clear the override:
  //   localStorage.removeItem('rm-debug')
  try {
    const debugStr = localStorage.getItem("rm-debug");
    if (debugStr) return JSON.parse(debugStr) as NetworkResult;
  } catch { /* ignore parse errors, continue with real detection */ }
  // ── End debug override ─────────────────────────────────────────────────

  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return empty;

    const data: IpApiResponse = await res.json();
    const orgRaw = data.org ?? "";
    const orgLower = orgRaw.toLowerCase();
    const cleanOrg = orgRaw.replace(/^AS\d+\s+/i, "").trim();

    const city = data.city ?? null;
    const region = data.region ?? null;
    const postal = data.postal ?? null;
    const country = data.country_name ?? null;
    const countryCode = data.country_code ?? null;

    // Check if this is a consumer ISP
    const isConsumer = CONSUMER_ISPS.some((isp) => orgLower.includes(isp));

    if (isConsumer) {
      return {
        isCorporate: false,
        orgName: null,
        city,
        region,
        postal,
        country,
        countryCode,
        isp: cleanOrg || null,
      };
    }

    // Check corporate keywords
    const isCorporate =
      orgLower.length > 0 &&
      CORP_KEYWORDS.some((kw) => orgLower.includes(kw));

    return {
      isCorporate,
      orgName: isCorporate ? cleanOrg : null,
      city,
      region,
      postal,
      country,
      countryCode,
      isp: !isCorporate && cleanOrg ? cleanOrg : null,
    };
  } catch {
    return empty;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

interface RecruiterModeContextValue {
  isRecruiterMode: boolean;
  isCorporateNetwork: boolean;
  corporateOrgName: string | null;
  visitorCity: string | null;
  visitorRegion: string | null;     // state / province
  visitorPostal: string | null;     // ZIP / postal code
  visitorCountry: string | null;
  visitorCountryCode: string | null;
  visitorIsp: string | null;
  isDetecting: boolean;
  toggleRecruiterMode: () => void;
  disableRecruiterMode: () => void;
}

const RecruiterModeContext = createContext<RecruiterModeContextValue>({
  isRecruiterMode: false,
  isCorporateNetwork: false,
  corporateOrgName: null,
  visitorCity: null,
  visitorRegion: null,
  visitorPostal: null,
  visitorCountry: null,
  visitorCountryCode: null,
  visitorIsp: null,
  isDetecting: false,
  toggleRecruiterMode: () => {},
  disableRecruiterMode: () => {},
});

export function RecruiterModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [isCorporateNetwork, setIsCorporateNetwork] = useState(false);
  const [corporateOrgName, setCorporateOrgName] = useState<string | null>(null);
  const [visitorCity, setVisitorCity] = useState<string | null>(null);
  const [visitorRegion, setVisitorRegion] = useState<string | null>(null);
  const [visitorPostal, setVisitorPostal] = useState<string | null>(null);
  const [visitorCountry, setVisitorCountry] = useState<string | null>(null);
  const [visitorCountryCode, setVisitorCountryCode] = useState<string | null>(null);
  const [visitorIsp, setVisitorIsp] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionDone, setDetectionDone] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recruiter-mode");
    if (saved === "true") setIsRecruiterMode(true);
  }, []);

  // When recruiter mode turns ON, run IP detection (only once per session)
  useEffect(() => {
    if (isRecruiterMode && !detectionDone) {
      setIsDetecting(true);
      detectNetwork().then((result) => {
        setIsCorporateNetwork(result.isCorporate);
        setCorporateOrgName(result.orgName);
        setVisitorCity(result.city);
        setVisitorRegion(result.region);
        setVisitorPostal(result.postal);
        setVisitorCountry(result.country);
        setVisitorCountryCode(result.countryCode);
        setVisitorIsp(result.isp);
        setIsDetecting(false);
        setDetectionDone(true);
      });
    }
  }, [isRecruiterMode, detectionDone]);

  const toggleRecruiterMode = useCallback(() => {
    setIsRecruiterMode((prev) => {
      const next = !prev;
      if (!next) setDetectionDone(false); // reset so debug override works next enable
      localStorage.setItem("recruiter-mode", String(next));
      return next;
    });
  }, []);

  const disableRecruiterMode = useCallback(() => {
    setIsRecruiterMode(false);
    setDetectionDone(false); // reset so debug override works next enable
    localStorage.setItem("recruiter-mode", "false");
  }, []);

  return (
    <RecruiterModeContext.Provider
      value={{
        isRecruiterMode,
        isCorporateNetwork,
        corporateOrgName,
        visitorCity,
        visitorRegion,
        visitorPostal,
        visitorCountry,
        visitorCountryCode,
        visitorIsp,
        isDetecting,
        toggleRecruiterMode,
        disableRecruiterMode,
      }}
    >
      {children}
    </RecruiterModeContext.Provider>
  );
}

export function useRecruiterMode() {
  return useContext(RecruiterModeContext);
}
