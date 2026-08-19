import React, { useState } from "react";
import { Service } from "../types";
import { ArrowRight } from "lucide-react";

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceToBook: (service: Service) => void;
}

interface EditorialServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  highlights: string[];
}

const editorialServices: EditorialServiceItem[] = [
  {
    id: "manicure",
    name: "Russian Dry Manicure",
    category: "Signature Care",
    description: "Flawless cuticle pocket refinement using precision European diamond e-file bits, followed by strengthening rubber base and ultra-close color application.",
    duration: "60 mins",
    price: 1200,
    image: "/images/milk_bar_nude_nails_1785790602182.jpg",
    highlights: ["European diamond e-file", "Clean cuticle pocket", "Strengthening rubber base"],
  },
  {
    id: "gel-x",
    name: "Gel-X Extensions",
    category: "Sculpted Architecture",
    description: "Full-cover soft gel tips engineered for zero natural nail damage. Available in custom lengths and shapes from chic almond to tapered ballerina.",
    duration: "90 mins",
    price: 2400,
    image: "/images/nude_glaze_nails_1785790556348.jpg",
    highlights: ["Zero natural nail damage", "Custom apex architecture", "4+ weeks durability"],
  },
  {
    id: "nail-art",
    name: "Signature Nail Art",
    category: "Artisanal Finish",
    description: "Handcrafted liquid mirror chrome, gold leaf French lines, Japanese nuance ombre, and minimalist bespoke designs tailored to your outfit or event.",
    duration: "45 mins",
    price: 1800,
    image: "/images/onyx_chrome_nails_1785790542145.jpg",
    highlights: ["Liquid mirror chrome", "24k gold leaf French", "Minimalist micro-accents"],
  },
  {
    id: "sculpted",
    name: "Sculpted Builder Gel",
    category: "Custom Apex",
    description: "Architectural builder gel structured over custom forms for natural enhancement, structural reinforcement, and natural length growth.",
    duration: "100 mins",
    price: 2800,
    image: "/images/gold_foil_french_1785790568862.jpg",
    highlights: ["Custom nail form sculpting", "Hard-wearing apex balance", "Refillable every 3-4 weeks"],
  },
  {
    id: "nail-care",
    name: "IBX Restorative Care",
    category: "Therapy & Health",
    description: "Intensive inside-the-nail keratin bonding treatment designed to heal peeling, brittle, or post-extension weakened nails.",
    duration: "40 mins",
    price: 900,
    image: "/images/champagne_silk_nails_1785790580027.jpg",
    highlights: ["Deep keratin fusion", "Heals cracked plates", "Includes warm botanical hydration"],
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceToBook,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeService = editorialServices[activeIndex];

  const handleBookCurrent = (item: EditorialServiceItem) => {
    const matchedService = services.find((s) =>
      s.name.toLowerCase().includes(item.name.toLowerCase().split(" ")[0])
    ) || {
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      duration: item.duration,
      description: item.description,
      popular: true,
    };
    onSelectServiceToBook(matchedService);
  };

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32 bg-[#0A0A09] border-t border-[#F3EBDD]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-xl mb-12 sm:mb-16 lg:mb-20 space-y-1 sm:space-y-2 text-left">
          <div className="inline-flex items-center gap-2">
            <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
            <span className="editorial-label text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-[#C7A45A]">
              Our Services
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#F3EBDD] leading-tight">
            Crafted for <span className="text-[#C7A45A] italic">you.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A9A399] font-light pt-1 sm:pt-2">
            Each service includes a tailored anatomical consultation, dry Russian precision care, and medical-grade autoclave hygiene.
          </p>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left: Interactive Editorial Service Directory */}
          <div className="lg:col-span-7 divide-y divide-[#F3EBDD]/10">
            {editorialServices.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className={`py-4 sm:py-6 lg:py-7 transition-all duration-300 cursor-pointer text-left group ${
                    isSelected ? "opacity-100 pl-3 border-l-2 border-[#C7A45A]" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-[#C7A45A] font-light">
                        {item.category} · {item.duration}
                      </div>
                      <h3 className={`font-serif text-xl sm:text-2xl md:text-3xl transition-colors duration-300 font-normal ${
                        isSelected ? "text-[#C7A45A]" : "text-[#F3EBDD] group-hover:text-[#C7A45A]"
                      }`}>
                        {item.name}
                      </h3>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-serif text-base sm:text-lg lg:text-xl text-[#C7A45A]">
                        {item.price.toLocaleString()}
                      </span>
                      <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#A9A399] ml-1 font-light">
                        ETB
                      </span>
                    </div>
                  </div>

                  {/* Expanded description on active */}
                  {isSelected && (
                    <div className="mt-3 pt-2 text-xs sm:text-sm text-[#A9A399] font-light leading-relaxed space-y-3 sm:space-y-4 animate-fade-in">
                      <p>{item.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
                        {item.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#C7A45A] bg-[#11110F] px-2 sm:px-2.5 py-1 border border-[#C7A45A]/25"
                          >
                            ✦ {h}
                          </span>
                        ))}
                      </div>

                      <div className="pt-1 sm:pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookCurrent(item);
                          }}
                          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C7A45A] hover:text-[#D9B86C] font-medium transition-colors duration-300 group/btn"
                        >
                          <span>Reserve This Service</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Editorial Preview Photograph */}
          <div className="lg:col-span-5 hidden lg:block sticky top-32">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#11110F] border border-[#C7A45A]/25 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
              <img
                src={activeService.image}
                alt={activeService.name}
                className="w-full h-full object-cover grayscale-[10%] transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/70 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#0A0A09]/95 backdrop-blur-md border border-[#C7A45A]/30 text-left">
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] font-medium">
                  {activeService.category}
                </div>
                <div className="font-serif text-xl text-[#F3EBDD] mt-0.5">
                  {activeService.name}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#A9A399] font-light">
                  <span className="text-[#C7A45A]">Starting at {activeService.price.toLocaleString()} ETB</span>
                  <button
                    onClick={() => handleBookCurrent(activeService)}
                    className="text-[#F3EBDD] hover:text-[#C7A45A] tracking-wider uppercase text-[10px] font-medium underline underline-offset-4"
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
