"use client";

// ============================================================
// Legit — SlideCarousel (Embla Carousel)
// Horizontal swipe carousel for 3 legislative slides:
// Problème → Solution → Impact
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { MeasureSlide } from "@/types/database";
import { GradientParser } from "./GradientParser";

interface SlideCarouselProps {
  slides: MeasureSlide[];
}

// Fallback images highly unlikely to 404
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1541888049187-b956042f9b88?w=800&h=1200&fit=crop", // Abstract dark
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&h=1200&fit=crop" // Rain/City dark
];

export function SlideCarousel({ slides }: SlideCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollNext(emblaApi.canScrollNext());
    setCanScrollPrev(emblaApi.canScrollPrev());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="relative h-full flex flex-col justify-end">
      {/* Carousel */}
      <div className="embla overflow-hidden relative h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide, index) => {
            const isFailed = failedImages[slide.id];
            // Pick a deterministic fallback based on index
            const fallbackSrc = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
            const originalUrl = slide.unsplash_image_url || fallbackSrc;
            const imageUrl = isFailed ? fallbackSrc : originalUrl;

            return (
              <div key={slide.id} className="embla__slide relative flex-shrink-0 w-full min-w-0 h-full bg-gray-900">
                
                {/* Each slide has its own image background */}
                <Image
                  src={imageUrl}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                  priority={index === 0}
                  onError={() => {
                    if (!isFailed) {
                      setFailedImages(prev => ({...prev, [slide.id]: true}));
                    }
                  }}
                />
                
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 pointer-events-none" />

                {/* Text Layout */}
                <div className="relative z-10 px-8 pt-16 pb-[35%] h-full flex flex-col justify-end">
                  <GradientParser html={slide.content_html} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots (Clickable for better UX) */}
      <div className="absolute bottom-28 left-0 right-0 flex items-center justify-center gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); scrollTo(index); }}
            aria-label={`Aller au slide ${index + 1}`}
            className="p-2 cursor-pointer touch-manipulation"
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-gradient-to-r from-[#b90051] to-blue-600 shadow-sm"
                  : "w-2 bg-white/50 backdrop-blur-sm transform-gpu"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Swipe Prev Hitbox */}
      {canScrollPrev && (
        <div 
          className="absolute left-0 top-0 bottom-16 w-1/4 z-20 cursor-pointer flex items-center pl-4 touch-manipulation"
          onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
          aria-label="Voir la précédente"
        >
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 transform-gpu rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Swipe Next Hitbox */}
      {slides.length > 1 && canScrollNext && (
        <div 
          className="absolute right-0 top-0 bottom-16 w-1/4 z-20 cursor-pointer flex items-center justify-end pr-4 touch-manipulation"
          onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
          aria-label="Voir la suite"
        >
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 transform-gpu rounded-full shadow-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
