import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Partner logos with their corresponding links
const partnerLogos = [
  {
    id: 1,
    name: "Aethir",
    logo: "/partners/partner_aethir.png",
    url: "https://aethir.com",
  },
  {
    id: 2,
    name: "Wire Network",
    logo: "/partners/partner_wirenetwork.png",
    url: "https://wire.network",
  },
  {
    id: 3,
    name: "Render Network",
    logo: "/partners/partner_render.png",
    url: "https://rendernetwork.com",
  },
  {
    id: 4,
    name: "AWS Startups",
    logo: "/partners/partner_aws.png",
    url: "https://aws.amazon.com/startups",
  },
  {
    id: 5,
    name: "Spheron",
    logo: "/partners/partner_spheron.png",
    url: "https://www.spheron.network",
  },
];

export default function ServicePartnersSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  const autoplay = Autoplay({
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  useEffect(() => {
    if (!api) return;

    const update = () => {
      const indexes = api
        .slidesInView() // only fully visible ones
        .filter((index) => index >= 0 && index < partnerLogos.length);
      setVisibleIndexes(indexes);
    };

    api.on("select", update);
    api.on("scroll", update);
    update(); // initial call
  }, [api]);

  return (
    <section className="w-full px-0 sm:px-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-2 px-4">
          <h2 className="text-base font-thin text-white">
            Proud partners with leading Web2 & Web3 service providers
          </h2>
        </div>

        {/* Top separator */}
        <div className="h-[0.5px] w-full rounded bg-gradient-to-r from-transparent via-white to-transparent mb-8" />

        {/* Carousel */}
        <div className="w-full">
          <Carousel
            setApi={setApi}
            plugins={[autoplay]}
            opts={{
              align: "start", // START alignment to fix partial items
              loop: true,
              slidesToScroll: 1,
            }}
          >
            <CarouselContent className="-ml-4">
              {partnerLogos.map((partner, index) => (
                <CarouselItem
                  key={partner.id}
                  className="pl-4 min-w-0 basis-1/2 sm:basis-1/5"
                >
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block h-16 flex items-center justify-center transition-opacity duration-300 ${
                      visibleIndexes.includes(index)
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-full max-h-12 w-auto object-contain px-2"
                    />
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Bottom separator */}
        <div className="h-[0.5px] w-full rounded bg-gradient-to-r from-transparent via-white to-transparent mt-8" />
      </div>
    </section>
  );
}
