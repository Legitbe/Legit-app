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

export function SlideCarousel({ slides }: SlideCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);

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
            const imageUrl = slide.unsplash_image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop";
            return (
              <div key={slide.id} className="embla__slide relative flex-shrink-0 w-full min-w-0 h-full">
                
                {/* Each slide has its own image background */}
                <Image
                  src={imageUrl}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                  priority={index === 0}
                />
                
                {/* Dark overlay for text readability (stronger at bottom and edges) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 pointer-events-none" />

                {/* Text Layout (Pushed higher up to 2/3 of the card, with more side margin) */}
                <div className="relative z-10 px-8 pt-16 pb-[30%] h-full flex flex-col justify-end">
                  <GradientParser
                    html={slide.content_html}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 z-30 pointer-events-none">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-6 bg-gradient-to-r from-[#b90051] to-blue-600 shadow-sm"
                : "w-1.5 bg-white/50 backdrop-blur-sm"
            }`}
          />
        ))}
      </div>

      {/* Swipe Prev Hitbox */}
      {canScrollPrev && (
        <div 
          className="absolute left-0 top-0 bottom-16 w-1/4 z-20 cursor-pointer flex items-center pl-2"
          onClick={(e) => { e.stopPropagation(); emblaApi?.scrollPrev(); }}
          aria-label="Voir la précédente"
        >
          <div className="w-6 h-6 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Swipe Next Hitbox */}
      {slides.length > 1 && canScrollNext && (
        <div 
          className="absolute right-0 top-0 bottom-16 w-1/4 z-20 cursor-pointer flex items-center justify-end pr-2"
          onClick={(e) => { e.stopPropagation(); emblaApi?.scrollNext(); }}
          aria-label="Voir la suite"
        >
          <div className="w-6 h-6 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:bg-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
