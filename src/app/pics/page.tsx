"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";

// Personal photo gallery
const IMAGES = [
  { id: 1,  src: "/pics/whatsapp1.jpeg",  alt: "Photo 1"  },
  { id: 2,  src: "/pics/whatsapp2.jpeg",  alt: "Photo 2"  },
  { id: 3,  src: "/pics/whatsapp3.jpeg",  alt: "Photo 3"  },
  { id: 4,  src: "/pics/whatsapp4.jpeg",  alt: "Photo 4"  },
  { id: 5,  src: "/pics/whatsapp5.jpeg",  alt: "Photo 5"  },
  { id: 6,  src: "/pics/whatsapp6.jpeg",  alt: "Photo 6"  },
  { id: 7,  src: "/pics/whatsapp7.jpeg",  alt: "Photo 7"  },
  { id: 8,  src: "/pics/whatsapp8.jpeg",  alt: "Photo 8"  },
  { id: 9,  src: "/pics/whatsapp9.jpeg",  alt: "Photo 9"  },
  { id: 10, src: "/pics/whatsapp10.jpeg", alt: "Photo 10" },
  { id: 11, src: "/pics/whatsapp11.jpeg", alt: "Photo 11" },
  { id: 12, src: "/pics/whatsapp12.jpeg", alt: "Photo 12" },
  { id: 13, src: "/pics/whatsapp13.jpeg", alt: "Photo 13" },
  { id: 14, src: "/pics/whatsapp14.jpeg", alt: "Photo 14" },
  { id: 15, src: "/pics/whatsapp15.jpeg", alt: "Photo 15" },
  { id: 16, src: "/pics/whatsapp16.jpeg", alt: "Photo 16" },
  { id: 17, src: "/pics/whatsapp17.jpeg", alt: "Photo 17" },
  { id: 18, src: "/pics/whatsapp18.jpeg", alt: "Photo 18" },
  { id: 20, src: "/pics/whatsapp20.jpeg", alt: "Photo 20" },
  { id: 21, src: "/pics/whatsapp21.jpeg", alt: "Photo 21" },
  { id: 22, src: "/pics/whatsapp22.jpeg", alt: "Photo 22" },
  { id: 23, src: "/pics/whatsapp23.jpeg", alt: "Photo 23" },
  { id: 24, src: "/pics/whatsapp24.jpeg", alt: "Photo 24" },
  { id: 26, src: "/pics/whatsapp26.jpeg", alt: "Photo 26" },
  { id: 27, src: "/pics/whatsapp27.jpeg", alt: "Photo 27" },
  { id: 28, src: "/pics/whatsapp28.jpeg", alt: "Photo 28" },
];

/** Prevent default on a mouse/touch event */
const noop = (e: React.SyntheticEvent) => e.preventDefault();

export default function PicsPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // ── Download / scraper prevention ────────────────────────────────────────
  // Disable right-click context menu on the whole page while mounted
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  // Keyboard shortcut guard (PrintScreen sends no JS event, but Ctrl+S / Ctrl+U do)
  useEffect(() => {
    const blockKeys = (e: KeyboardEvent) => {
      const blocked =
        (e.ctrlKey || e.metaKey) &&
        ["s", "u", "p", "a"].includes(e.key.toLowerCase());
      if (blocked) e.preventDefault();
    };
    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const openLightbox = (id: number) => {
    setSelectedImage(id);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const selectedImg = IMAGES.find((img) => img.id === selectedImage);

  return (
    <main
      className="container max-w-9xl mx-auto px-2 py-20 pb-20 select-none"
      // Block drag-start at the top level
      onDragStart={noop}
    >
      {/* Header */}
      <div className="mb-12 text-center">
        <BlurFade delay={0.1}>
          <h1 className="text-4xl font-bold mb-2">Gallery</h1>
        </BlurFade>
        <BlurFade delay={0.2}>
          <p className="text-muted-foreground">
            Photos from around Chandigarh and beyond. Captured on a Pixel 6, CMF
            Phone 2 Pro or a Canon T7
          </p>
        </BlurFade>
      </div>

      {/* Pinterest-style Masonry Grid */}
      <div className="columns-2 md:columns-4 gap-2 md:gap-4">
        {IMAGES.map((image, index) => (
          <BlurFade key={image.id} delay={0.1 + index * 0.05}>
            <div
              className="relative mb-2 md:mb-4 cursor-pointer overflow-hidden group break-inside-avoid inline-block w-full"
              onClick={() => openLightbox(image.id)}
              // Block right-click on the card as well (belt-and-suspenders)
              onContextMenu={noop}
            >
              {/* The image itself — pointer-events disabled so the overlay
                  intercepts all mouse interaction (prevents "Save image as") */}
              <img
                src={image.src}
                alt={image.alt}
                draggable={false}
                onDragStart={noop}
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                style={{ WebkitUserDrag: "none" } as React.CSSProperties}
              />

              {/* Transparent interaction overlay — sits above the img so
                  right-clicking hits this div, not the img element */}
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg"
                onContextMenu={noop}
                onDragStart={noop}
              >
                <span className="text-white text-sm">View</span>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          // Block right-click inside lightbox too
          onContextMenu={noop}
          onDragStart={noop}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center select-none"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={noop}
          >
            {/* Invisible overlay on top of the lightbox image */}
            <div className="relative">
              <img
                src={selectedImg.src}
                alt={selectedImg.alt}
                draggable={false}
                onDragStart={noop}
                className="max-w-full max-h-[80vh] object-contain rounded-lg pointer-events-none"
                style={{ WebkitUserDrag: "none" } as React.CSSProperties}
              />
              {/* Full-size transparent blocker div over the image */}
              <div
                className="absolute inset-0 rounded-lg"
                onContextMenu={noop}
                onDragStart={noop}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
