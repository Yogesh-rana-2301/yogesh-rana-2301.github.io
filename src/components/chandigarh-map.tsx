"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import Image from "next/image";
import BlurFade from "./magicui/blur-fade";

interface ChandigarhMapProps {
  delay?: number;
}

const locations = {
  "Rock Garden": {
    name: "Rock Garden",
    description: "Sculpture garden created by Nek Chand",
    coordinates: [30.7525, 76.81] as [number, number],
    type: "nature",
  },
  "Sukhna Lake": {
    name: "Sukhna Lake",
    description: "Man-made reservoir at the foothills of Himalayas",
    coordinates: [30.742, 76.8188] as [number, number],
    type: "nature",
  },
  "Rose Garden": {
    name: "Zakir Hussain Rose Garden",
    description: "Largest rose garden in Asia",
    coordinates: [30.7395, 76.7684] as [number, number],
    type: "nature",
  },
  "Sector 17": {
    name: "Sector 17 Plaza",
    description: "Main shopping and commercial center",
    coordinates: [30.7411, 76.7835] as [number, number],
    type: "urban",
  },
  "Elante Mall": {
    name: "Elante Mall",
    description: "Popular shopping mall",
    coordinates: [30.7071, 76.8025] as [number, number],
    type: "urban",
  },
  ISBT: {
    name: "ISBT 43",
    description: "Interstate Bus Terminal Sector 43",
    coordinates: [30.713, 76.7916] as [number, number],
    type: "urban",
  },
  "Panjab University": {
    name: "Panjab University",
    description: "Premier university campus",
    coordinates: [30.7609, 76.7683] as [number, number],
    type: "urban",
  },
};

const NATURE_ICON_URL =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
const URBAN_ICON_URL =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";
const SHADOW_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png";

export const ChandigarhMap = ({ delay = 0 }: ChandigarhMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // ── Core fix ─────────────────────────────────────────────────────────────
    // React Strict Mode mounts → unmounts → remounts every component in dev.
    // Leaflet stamps `_leaflet_id` on the DOM node but never clears it when
    // map.remove() is called, so on remount it throws "already initialized".
    // Solution: clear _leaflet_id at the START of init (not just at cleanup),
    // so Leaflet always sees a fresh container. We also explicitly destroy any
    // lingering map instance before creating a new one.
    if ((el as any)._leaflet_id != null) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      (el as any)._leaflet_id = null;
    }
    // ─────────────────────────────────────────────────────────────────────────

    // Patch Leaflet default icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Create the map imperatively — no react-leaflet MapContainer, so we
    // control the full lifecycle without any internal state races.
    const map = L.map(el, {
      center: [30.7333, 76.7794],
      zoom: 12,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const makeIcon = (iconUrl: string) =>
      new L.Icon({
        iconUrl,
        shadowUrl: SHADOW_URL,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

    const natureIcon = makeIcon(NATURE_ICON_URL);
    const urbanIcon = makeIcon(URBAN_ICON_URL);

    Object.values(locations).forEach((loc) => {
      L.marker(loc.coordinates, {
        icon: loc.type === "nature" ? natureIcon : urbanIcon,
      })
        .bindPopup(`<b>${loc.name}</b><br>${loc.description}`)
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      // Also clear _leaflet_id so the next mount (Strict Mode remount or HMR)
      // always starts with a clean container.
      if (el) (el as any)._leaflet_id = null;
      mapRef.current = null;
    };
  }, []); // empty deps — run once per real mount

  return (
    <BlurFade delay={delay}>
      <div className="flex justify-center">
        <div className="bg-card border rounded-lg p-6 w-full max-w-4xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full h-96 max-w-4xl rounded-lg overflow-hidden border">
              {/* Plain div — Leaflet mounts into this imperatively */}
              <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Image
                  src={NATURE_ICON_URL}
                  alt="Nature"
                  width={16}
                  height={16}
                  className="w-4 h-auto"
                  unoptimized
                />
                <span>Nature</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src={URBAN_ICON_URL}
                  alt="Urban"
                  width={16}
                  height={16}
                  className="w-4 h-auto"
                  unoptimized
                />
                <span>Urban</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlurFade>
  );
};

export default ChandigarhMap;
