import React, { useState } from "react";
import { GalleryItem } from "../types";
import { Eye, X, ExternalLink, Sparkles } from "lucide-react";

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
    <section id="gallery" className="py-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#c7a252]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 eyebrow mb-4">
              <Sparkles className="w-4 h-4 text-[#c7a252]" />
              Shade & Finish Card
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl italic text-[#f7f1e6]">
              Studio Gallery
            </h2>
            <p className="mt-4 text-[#f7f1e6]/65 text-sm sm:text-base font-light leading-relaxed">
              A curated lookbook of our signature palettes, hyper-gloss finishes, and intricate foil artistry created exclusively at House of Bae.
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-5 py-2 text-[10px] uppercase tracking-widest rounded-full transition-all duration-300 border backdrop-blur-sm ${
                  selectedFilter === cat
                    ? "border-[#c7a252] text-[#0e0b0a] bg-[#c7a252] shadow-[0_0_20px_rgba(199,162,82,0.3)] font-medium"
                    : "border-[#c7a252]/20 text-[#f7f1e6]/60 hover:text-[#e8cd8a] hover:border-[#c7a252]/50 bg-[#171211]/50"
                }`}
              >
                {cat === "all" ? "All Lookbook" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid / Masonry-like Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item, index) => {
            // Give varied heights for masonry effect
            const heights = ["h-[400px]", "h-[500px]", "h-[350px]", "h-[450px]", "h-[550px]", "h-[380px]"];
            const heightClass = heights[index % heights.length];

            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`group relative rounded w-full overflow-hidden border border-[#c7a252]/20 bg-[#171211] flex flex-col justify-end cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-[#c7a252]/80 hover:shadow-[0_20px_40px_rgba(199,162,82,0.15)] break-inside-avoid ${heightClass}`}
                style={{
                  background: item.imageUrl ? `url(${item.imageUrl}) center/cover no-repeat` : item.gradient,
                }}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b0a] via-[#0e0b0a]/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                
                {/* Number Badge */}
                <div className="absolute top-5 left-5 z-10 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <span className="eyebrow text-[9px] text-[#0e0b0a] bg-[#c7a252] px-3 py-1.5 rounded uppercase tracking-widest shadow-lg">
                    Look 0{index + 1}
                  </span>
                </div>

                <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-[#0e0b0a]/80 backdrop-blur-md flex items-center justify-center text-[#c7a252] border border-[#c7a252]/30 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 transform origin-center">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-[1px] w-8 bg-[#c7a252]/50 group-hover:w-12 transition-all duration-500" />
                    <span className="text-[10px] uppercase tracking-widest text-[#e8cd8a] font-mono">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-serif-display text-3xl italic text-[#f7f1e6] group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#f7f1e6]/60 font-light mt-3 leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 delay-75 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>


      </div>

      {/* Glassmorphic Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
          <div 
            className="absolute inset-0 bg-[#0e0b0a]/95 backdrop-blur-xl"
            onClick={() => setActiveItem(null)}
          />
          
          <div className="bg-[#171211] border border-[#c7a252]/30 w-full max-w-5xl rounded overflow-hidden relative z-10 flex flex-col md:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.5)] transform scale-95 animate-[zoomIn_0.3s_ease-out_forwards_0.1s] opacity-0">
            
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-[#0e0b0a]/80 backdrop-blur-md flex items-center justify-center text-[#f7f1e6]/60 hover:text-[#e8cd8a] hover:bg-[#c7a252]/20 transition-all border border-[#f7f1e6]/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div 
              className="w-full md:w-3/5 h-64 md:h-[600px] relative"
              style={{
                background: activeItem.imageUrl
                  ? `url(${activeItem.imageUrl}) center/cover no-repeat`
                  : activeItem.gradient,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0b0a]/20 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/5 p-8 sm:p-12 flex flex-col justify-center relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#c7a252]/5 to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10">
                <span className="eyebrow text-[10px] text-[#e8cd8a] bg-[#c7a252]/10 border border-[#c7a252]/20 px-3 py-1.5 rounded">
                  {activeItem.category}
                </span>
                
                <h3 className="font-serif-display text-4xl sm:text-5xl italic text-[#f7f1e6] mt-6 mb-4">
                  {activeItem.title}
                </h3>
                
                <div className="h-[1px] w-full bg-[#c7a252]/20 my-6" />

                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#f7f1e6]/40 mb-1 font-mono">Finish Type</div>
                    <div className="font-serif-display text-xl text-[#e8cd8a]">{activeItem.finishType}</div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#f7f1e6]/40 mb-2 font-mono">Artistry Details</div>
                    <p className="text-[#f7f1e6]/70 font-light leading-relaxed text-sm">
                      {activeItem.description}
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setActiveItem(null);
                      const el = document.getElementById("booking");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 px-6 py-4 bg-[#c7a252] text-[#0e0b0a] text-xs uppercase tracking-widest font-medium hover:bg-[#e8cd8a] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(199,162,82,0.2)]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Book This Look
                  </button>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="flex-1 px-6 py-4 border border-[#c7a252]/30 text-[#f7f1e6] text-xs uppercase tracking-widest hover:border-[#c7a252] transition-colors"
                  >
                    Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

