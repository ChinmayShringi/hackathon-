import React from "react";

interface PreviewPillProps {
  className?: string;
}

export default function PreviewPill({ className = "" }: PreviewPillProps) {
  return (
    <div className={`absolute -rotate-6 top-1 -right-10 z-50 ${className}`}>
      <div 
        className="group relative px-4 py-1 rounded-full text-white text-sm font-bold shadow-[4px_4px_8px_rgba(0,0,0,0.5)] bg-gradient-to-br from-purple-400 to-purple-700 cursor-default"
        style={{
          transform: 'rotateX(-15deg) rotateY(-10deg) rotateZ(-6deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-white opacity-40 pointer-events-none"></span>
        
        {/* Glitch effect layers */}
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-cyan-300 opacity-0 group-hover:opacity-80 group-hover:animate-glitch-hover-01 select-none">
          PREVIEW
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-pink-300 opacity-0 group-hover:opacity-80 group-hover:animate-glitch-hover-01-reverse select-none">
          PREVIEW
        </span>
        
        {/* Main text */}
        <span className="relative select-none">PREVIEW</span>
      </div>
    </div>
  );
} 