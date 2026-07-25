"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import BlurFade from "./magicui/blur-fade";

interface ChandigarhMapProps {
  delay?: number;
}

// Location data for Chandigarh
const locations = {
  "Rock Garden": {
    name: "Rock Garden",
    description: "Sculpture garden created by Nek Chand",
    coordinates: [30.7525, 76.81],
    type: "nature",
  },
  "Sukhna Lake": {
    name: "Sukhna Lake",
    description: "Man-made reservoir at the foothills of Himalayas",
    coordinates: [30.742, 76.8188],
    type: "nature",
  },
  "Rose Garden": {
    name: "Zakir Hussain Rose Garden",
    description: "Largest rose garden in Asia",
    coordinates: [30.7395, 76.7684],
    type: "nature",
  },
  "Sector 17": {
    name: "Sector 17 Plaza",
    description: "Main shopping and commercial center",
    coordinates: [30.7411, 76.7835],
    type: "urban",
  },
  "Elante Mall": {
    name: "Elante Mall",
    description: "Popular shopping mall",
    coordinates: [30.7071, 76.8025],
    type: "urban",
  },
  ISBT: {
    name: "ISBT 43",
    description: "Interstate Bus Terminal Sector 43",
    coordinates: [30.713, 76.7916],
    type: "urban",
  },
  "Panjab University": {
    name: "Panjab University",
    description: "Premier university campus",
    coordinates: [30.7609, 76.7683],
    type: "urban",
  },
};

export const ChandigarhMap = ({ delay = 0 }: ChandigarhMapProps) => {
  // Ref to the Leaflet map instance
  const mapRef = useRef<L.Map | null>(null);

  // Fix Leaflet default icon paths (must run client-side)
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Critical fix: React Strict Mode mounts → unmounts → remounts every component
  // in development. Leaflet sets `_leaflet_id` on the DOM node but map.remove()
  // does NOT clear it, so on remount Leaflet throws "already initialized".
  // We grab the container from the map ref and null out _leaflet_id ourselves.
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          const container = mapRef.current.getContainer();
          mapRef.current.remove();
          if (container) (container as any)._leaflet_id = null;
        } catch {
          // Map may already have been removed by react-leaflet's own cleanup
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Create icons lazily inside the component (never at module level)
  // so they are only instantiated in the browser, never during SSR.
  const natureIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    []
  );

  const urbanIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    []
  );

  return (
    <BlurFade delay={delay}>
      <div className="flex justify-center">
        <div className="bg-card border rounded-lg p-6 w-full max-w-4xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full h-96 max-w-4xl rounded-lg overflow-hidden border">
              <MapContainer
                ref={mapRef}
                center={[30.7333, 76.7794]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {Object.entries(locations).map(([key, location]) => (
                  <Marker
                    key={key}
                    position={location.coordinates as [number, number]}
                    icon={location.type === "nature" ? natureIcon : urbanIcon}
                  >
                    <Popup>
                      <span className="font-semibold">{location.name}</span>
                      <br />
                      {location.description}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Image
                  src={natureIcon.options.iconUrl as string}
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
                  src={urbanIcon.options.iconUrl as string}
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
