import React, { useState } from "react";
import { GalleryItem } from "../types";
import { X, ArrowRight } from "lucide-react";

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

const editorialLookbook = [
  {
    id: "look-1",
    title: "Glazed Silk Manicure",
    category: "Minimalist Nude",
    image: "/images/nude_glaze_nails_1785790556348.jpg",
    description: "Sheer iridescent pearl glaze over tailored almond shape.",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[16/11]",
  },
  {
    id: "look-2",
    title: "Liquid Onyx Chrome",
    category: "Mirror Finish",
    image: "/images/onyx_chrome_nails_1785790542145.jpg",
    description: "Deep noir base coated with ultra-reflective silver chrome.",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: "look-3",
    title: "24k Gold Leaf French",
    category: "Artisanal Metallic",
    image: "/images/gold_foil_french_1785790568862.jpg",
    description: "Hand-laid gold flakes along a sculpted micro-French tip.",
    span: "col-span-12 md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    id: "look-4",
    title: "Obsidian Marble Vein",
    category: "Hand-Painted",
    image: "/images/black_gold_marble_1785790591177.jpg",
    description: "Multi-layered smoky marble with subtle metallic gold mica.",
    span: "col-span-12 md:col-span-7",
    aspect: "aspect-[16/11]",
  },
  {
    id: "look-5",
    title: "Milk Bath Neutral Almond",
    category: "European Care",
    image: "/images/milk_bar_nude_nails_1785790602182.jpg",
    description: "Clean Russian e-file cuticle care with semi-translucent nude rubber base.",
    span: "col-span-12 md:col-span-6",
    aspect: "aspect-[4/3]",
  },
  {
    id: "look-6",
    title: "Champagne Shimmer Silk",
    category: "High Luster",
    image: "/images/champagne_silk_nails_1785790580027.jpg",
    description: "Subtle reflective cat-eye velvet shimmer over sheer blush.",
    span: "col-span-12 md:col-span-6",
    aspect: "aspect-[4/3]",
  },
];

export const GallerySection: React.FC<GallerySectionProps> = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof editorialLookbook[0] | null>(null);

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-[#0A0A09] border-t border-[#F3EBDD]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Compact */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-3 text-left">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
              <span className="editorial-label text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-[#C7A45A]">
                Curated Lookbook
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#F3EBDD] leading-tight">
              Every set tells a <span className="text-[#C7A45A] italic">story.</span>
            </h2>
            <p className="text-xs text-[#A9A399] font-light">
              Recent bespoke commissions crafted at our Lideta studio.
            </p>
          </div>

          <div>
            <a
              href="https://www.instagram.com/house_of_bae1/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#C7A45A] hover:text-[#D9B86C] transition-colors border-b border-[#C7A45A]/40 hover:border-[#D9B86C] pb-0.5 font-light"
            >
              <span>View Instagram Portfolio</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Compact Minimalist 3-Column Gallery (Fits in 1 Scroll) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {editorialLookbook.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer text-left"
            >
              <div className="relative aspect-[16/11] overflow-hidden bg-[#11110F] border border-[#C7A45A]/15 group-hover:border-[#C7A45A]/50 transition-colors duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Compact Caption */}
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <h3 className="font-serif text-xs sm:text-sm text-[#F3EBDD] group-hover:text-[#C7A45A] transition-colors duration-300 font-normal truncate">
                  {item.title}
                </h3>
                <span className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-[#C7A45A]/80 font-light flex-shrink-0">
                  ✦ {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* High-Res Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-[#0A0A09]/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-[#11110F] border border-[#C7A45A]/30 max-w-3xl w-full p-6 sm:p-8 relative animate-fade-in text-left space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-[#A9A399] hover:text-[#C7A45A] p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/11] overflow-hidden bg-[#0A0A09] border border-[#C7A45A]/20">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-2 flex items-baseline justify-between gap-4">
              <div>
                <div className="editorial-label text-[10px] tracking-[0.25em] text-[#C7A45A]">
                  {selectedPhoto.category}
                </div>
                <h3 className="font-serif text-2xl text-[#F3EBDD] font-normal mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A9A399] font-light mt-1 max-w-lg">
                  {selectedPhoto.description}
                </p>
              </div>
              
              <a
                href="#booking"
                onClick={() => setSelectedPhoto(null)}
                className="bg-[#C7A45A] text-[#0A0A09] px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#D9B86C] transition-colors"
              >
                Request Look
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
