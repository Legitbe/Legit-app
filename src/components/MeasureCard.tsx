"use client";

// ============================================================
// Legit — MeasureCard
// Full-width legislative measure card with:
// - Unsplash background image + dark overlay
// - Tag badge
// - Embla Carousel (3 slides)
// - Vote summary bar
// - Likert scale (anonymous vote)
// Glassmorphism with transform-gpu for iOS Safari stability.
// ============================================================

import React from "react";
import Image from "next/image";
import { MeasureWithSlides } from "@/types/database";
import { TAG_CONFIG } from "@/lib/constants";
import { SlideCarousel } from "./SlideCarousel";
import { MeasureInteraction } from "./MeasureInteraction";

let isSharing = false;

export async function handleShare(title: string, url: string) {
  if (isSharing) return;
  isSharing = true;
  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text: `Découvrez cette mesure : ${title}`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
    }
  } catch (e: any) {
    // Ignore AbortError which fires normally when user dismisses the share sheet
    if (e?.name !== "AbortError") {
      console.error("Erreur de partage:", e);
    }
  } finally {
    isSharing = false;
  }
}

interface MeasureCardProps {
  measure: MeasureWithSlides;
  index: number;
}

export function MeasureCard({ measure, index }: MeasureCardProps) {
  const tagConfig = TAG_CONFIG[measure.tag_id] ?? TAG_CONFIG.general;
  const primaryImage =
    measure.measure_slides[0]?.unsplash_image_url ??
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop";

  return (
    <article
      className="card-enter flex flex-col gap-3"
      style={{ animationDelay: `${index * 100}ms` }}
      id={`measure-${measure.id}`}
    >
      {/* --- MEDIA BLOCK (Story-Style) --- */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-sm border border-gray-200/50">
        
        {/* Content Section — Carousel overlay (now contains the images as well) */}
        <div className="absolute inset-0 z-0">
          <SlideCarousel slides={measure.measure_slides} />
        </div>

        {/* Header Elements (Tag & Logo) */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold ${tagConfig.bgClass} ${tagConfig.textClass} border border-white/20 shadow-sm backdrop-blur-sm`}
            style={{ transform: "translate3d(0,0,0)" }}
          >
            <span>{tagConfig.emoji}</span>
            <span>{tagConfig.label}</span>
          </span>
          
          <div className="relative w-8 h-8 drop-shadow-md">
            <Image 
              src="/images/logo-white.png" 
              alt="Legit" 
              fill 
              className="object-contain opacity-90"
              sizes="32px"
            />
          </div>
        </div>

        {/* Share Button (Bottom Right) */}
        <button
          onClick={() => handleShare(measure.title || "Mesure Législative", window.location.href)}
          className="absolute bottom-3 right-4 z-30 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors shadow-sm border border-white/20 active:scale-95"
          aria-label="Partager"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] translate-y-[-1px]">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
        </button>

      </div>

      {/* --- INTERACTION BLOCK (Discreet) --- */}
      <MeasureInteraction measureId={measure.id} summary={measure.vote_summary} />

      <div className="h-4" /> {/* Reduced Spacing between cards */}
    </article>
  );
}
