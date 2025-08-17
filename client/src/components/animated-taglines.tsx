import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const taglines = [
  "one-click viral hits",
  "delula is the solula",
  "*click* *click* BOOM!",
  "no prompts? no problem.",
  "the best of ai just a tap away",
  "fast, fun, & free starter credits"
];

export default function AnimatedTaglines() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false
    },
    [Autoplay({ delay: 9000, stopOnInteraction: false })]
  );

  return (
    <div className="font-accent text-2xl md:text-3xl text-white text-center h-12 overflow-hidden cursor-default" ref={emblaRef}>
      <div className="flex">
        {taglines.map((tagline, index) => (
          <div 
            key={index} 
            className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
          >
            <p className="text-xl sm:text-4xl font-semibold tracking-tight drop-shadow-sm select-none">
              {tagline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}