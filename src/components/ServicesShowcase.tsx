import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Service } from "../types";

interface ServicesShowcaseProps {
  onSelectCategory?: (category: string) => void;
  onBookSpecialty?: (serviceName: string) => void;
}

interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
  tag: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "gelx",
    title: "Gel-X Sculpted Extensions",
    category: "Sculpting",
    image: "/images/nude_glaze_nails_1785790556348.jpg",
    caption: "Full-coverage gel tips tailored in signature almond, coffin, or sculpted stiletto forms.",
    tag: "Signature Specialty",
  },
  {
    id: "chrome",
    title: "Liquid Chrome & Foil Finish",
    category: "Finish",
    image: "/images/onyx_chrome_nails_1785790542145.jpg",
    caption: "Obsidian mirror glaze, 24k gold leaf foil accents, and magnetic velvet sheen.",
    tag: "High Lustre",
  },
  {
    id: "art",
    title: "Hand-Painted Nail Art",
    category: "Bespoke Art",
    image: "/images/gold_foil_french_1785790568862.jpg",
    caption: "Bespoke fine-line geometry, smokey quartz veins, and 3D textured accents.",
    tag: "Couture Design",
  },
  {
    id: "russian",
    title: "Russian Cuticle Perfection",
    category: "Care",
    image: "/images/milk_bar_nude_nails_1785790602182.jpg",
    caption: "Precision dry e-file cuticle care followed by restorative keratin conditioning.",
    tag: "Precision Detail",
  },
];

export const ServicesShowcase: React.FC<ServicesShowcaseProps> = ({
  onBookSpecialty,
}) => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 eyebrow mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Craft & Mastery</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl italic text-[#FAF6EF]">
              Specialty Disciplines
            </h2>
            <p className="mt-4 text-[#FAF6EF]/85 text-sm sm:text-base font-light leading-relaxed">
              Every appointment is executed with surgical hygiene, premium imported gels, and tailored arch geometry.
            </p>
          </div>
          <div className="text-right">
            <a
              href="#services-menu"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#E5C158] transition-colors duration-300 font-medium group"
            >
              <span>Explore Complete Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* 4-Column CSS Grid with Macro Photography & Minimal Hover Text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onBookSpecialty && onBookSpecialty(item.title)}
              className="group relative h-[420px] sm:h-[460px] rounded-sm overflow-hidden border border-[#D4AF37]/25 bg-[#121212] cursor-pointer transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)] flex flex-col justify-end p-6"
            >
              {/* Background Image Placeholder with Zoom Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Top Tag */}
              <div className="absolute top-5 left-5 z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium px-2.5 py-1 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] rounded-sm">
                  {item.tag}
                </span>
              </div>

              {/* Content Box (Minimal Text with Smooth Expand on Hover) */}
              <div className="relative z-10 transition-transform duration-300">
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium font-sans mb-1.5">
                  {item.category}
                </div>
                <h3 className="font-serif text-2xl italic text-[#FAF6EF] group-hover:text-[#E5C158] transition-colors duration-300">
                  {item.title}
                </h3>
                
                {/* Minimal text that subtly expands on hover */}
                <p className="mt-2 text-xs text-[#FAF6EF]/80 font-light leading-relaxed max-h-0 opacity-0 overflow-hidden group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300 ease-out">
                  {item.caption}
                </p>

                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] uppercase tracking-widest text-[#D4AF37] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <span>Reserve Treatment</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
