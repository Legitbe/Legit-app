"use client";

// ============================================================
// Legit — Header Component
// Minimal, elegant app header with brand identity
// ============================================================

import React from "react";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-top">
      <div className="glass-strong">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm">
              <Image 
                src="/images/logo-color.png" 
                alt="Legit Logo" 
                fill 
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
                Legit
              </h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase leading-none mt-0.5">
                Chambre • Belgique
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 border border-black/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] text-gray-600 font-medium">
                En direct
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
