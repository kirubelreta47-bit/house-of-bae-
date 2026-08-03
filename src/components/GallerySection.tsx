import React, { useState } from "react";
import { GalleryItem } from "../types";
import { Sparkles, Eye, X, ExternalLink } from "lucide-react";

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filterCategories = ["all", "Chrome & Metallic", "Nudes & Sheer", "Nail Art"];

  const filteredItems =
    selectedFilter === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.category === selectedFilter);

  return (
    <section id="gallery" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="eyebrow">Shade & Finish Card</div>
          <h2 className="font-serif-display text-4xl sm:text-5xl italic mt-3 text-[#f7f1e6]">
            Atelier Gallery
          </h2>
          <p className="mt-4 text-[#f7f1e6]/65 text-sm sm:text-base font-light leading-relaxed">
            A preview of our signature nail palettes, chrome finishes, and gold foil artistry created at House of Bae.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition-all border ${
                selectedFilter === cat
                  ? "border-[#c7a252] text-[#e8cd8a] bg-[#c7a252]/10 font-medium"
                  : "border-transparent text-[#f7f1e6]/60 hover:text-[#f7f1e6]"
              }`}
            >
              {cat === "all" ? "All Finishes" : cat}
            </button>
          ))}
        </div>

        {/* Swatch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-[#c7a252]/30 bg-[#171211] p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#c7a252] hover:shadow-[0_12px_30px_rgba(199,162,82,0.15)]"
              style={{
                background: item.imageUrl ? `url(${item.imageUrl}) center/cover` : item.gradient,
              }}
            >
              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b0a] via-transparent to-[#0e0b0a]/30 opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Number eyebrow */}
              <div className="relative z-10 flex justify-between items-center">
                <span className="eyebrow text-[10px] text-[#e8cd8a] bg-[#0e0b0a]/60 backdrop-blur-md px-2.5 py-1 rounded">
                  0{index + 1} · {item.finishType}
                </span>
                <span className="p-1.5 rounded-full bg-[#0e0b0a]/60 text-[#c7a252] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Title and details */}
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-widest text-[#c7a252] font-mono">
                  {item.category}
                </div>
                <h4 className="font-serif-display text-2xl italic text-[#f7f1e6] mt-1 group-hover:text-[#e8cd8a] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#f7f1e6]/70 font-light mt-1.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center text-xs text-[#f7f1e6]/45 max-w-xl mx-auto leading-relaxed border-t border-[#c7a252]/20 pt-6">
          <p className="flex items-center justify-center gap-2 mb-2">
            <span>Follow our daily work on Instagram</span>
            <a
              href="https://www.instagram.com/house_of_bae1/"
              target="_blank"
              rel="noreferrer"
              className="text-[#e8cd8a] hover:underline flex items-center gap-1"
            >
              @house_of_bae1 <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          Need inspiration? Bring any photo to your appointment or show your nail artist during consultation.
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-[#0e0b0a]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171211] border border-[#c7a252] max-w-lg w-full rounded-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 text-[#f7f1e6]/60 hover:text-[#e8cd8a]"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="w-full h-64 rounded-sm mb-6 flex items-end p-6 relative overflow-hidden"
              style={{
                background: activeItem.imageUrl
                  ? `url(${activeItem.imageUrl}) center/cover`
                  : activeItem.gradient,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b0a] to-transparent opacity-80" />
              <div className="relative z-10">
                <span className="eyebrow text-xs text-[#e8cd8a]">{activeItem.category}</span>
                <h3 className="font-serif-display text-3xl italic text-[#f7f1e6]">{activeItem.title}</h3>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#f7f1e6]/80 font-light">
              <div className="flex justify-between border-b border-[#c7a252]/20 pb-2">
                <span className="text-[#c7a252]">Finish Type</span>
                <span className="font-serif-display italic text-[#e8cd8a]">{activeItem.finishType}</span>
              </div>
              <p className="leading-relaxed">{activeItem.description}</p>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 border border-[#f7f1e6]/30 text-xs uppercase tracking-wider text-[#f7f1e6]"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setActiveItem(null);
                    const el = document.getElementById("booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2 bg-[#c7a252] text-[#0e0b0a] text-xs uppercase tracking-wider font-medium"
                >
                  Book This Look
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
