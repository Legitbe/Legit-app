"use client";

// ============================================================
// Legit — MeasureFeed
// Main feed container. Uses SWR for data fetching with
// 5-minute polling. Renders MeasureCards in a vertical scroll.
// ============================================================

import React from "react";
import { useMeasures } from "@/lib/hooks/useMeasures";
import { MeasureCard } from "./MeasureCard";

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-3 w-2/3" />
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-12 flex-1 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MeasureFeed() {
  const { measures, isLoading, isError } = useMeasures();

  return (
    <main className="flex-1 w-full max-w-lg mx-auto">
      <div className="flex flex-col w-full">

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-0">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="glass rounded-2xl p-6 text-center shadow-sm">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-sm text-gray-600">
              Impossible de charger les mesures.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Vérifiez votre connexion et réessayez.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && measures.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center shadow-sm">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="text-sm text-gray-600">
              Aucune mesure législative disponible.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Revenez bientôt pour découvrir les nouvelles lois.
            </p>
          </div>
        )}

        {/* Measure Cards */}
        {measures.map((measure, index) => (
          <MeasureCard key={measure.id} measure={measure} index={index} />
        ))}

        {/* Footer */}
        {measures.length > 0 && (
          <footer className="text-center py-6 space-y-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#b90051] to-blue-600 mx-auto rounded-full" />
            <p className="text-[11px] text-gray-400">
              Legit — La démocratie en 30 secondes
            </p>
            <p className="text-[10px] text-gray-400">
              Données issues de la Chambre des représentants de Belgique
            </p>
          </footer>
        )}
      </div>
    </main>
  );
}
