import React, { useState } from "react";
import { Service } from "../types";
import { Calendar, Clock, Plus, Sparkles } from "lucide-react";

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceToBook: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceToBook,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Specialties" },
    { id: "manicure", label: "Manicures" },
    { id: "extensions", label: "Gel-X & Extensions" },
    { id: "art", label: "Art & Chrome" },
    { id: "pedicure", label: "Pedicures" },
    { id: "treatment", label: "Care & Repair" },
  ];

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 border-t border-[#c7a252]/25 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="eyebrow">The Studio Menu</div>
          <h2 className="font-serif-display text-4xl sm:text-5xl italic mt-3 text-[#f7f1e6]">
            Services & Pricing
          </h2>
          <p className="mt-4 text-[#f7f1e6]/65 text-sm sm:text-base font-light leading-relaxed">
            Every shape, length, and finish tailored specifically to your hands. Prices are listed in ETB.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full transition-all duration-200 border ${
                activeCategory === cat.id
                  ? "border-[#c7a252] bg-[#c7a252] text-[#0e0b0a] font-medium"
                  : "border-[#c7a252]/20 text-[#f7f1e6]/70 hover:border-[#c7a252]/50 hover:text-[#e8cd8a]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Service Rows */}
        <div className="divide-y divide-[#c7a252]/20 border-y border-[#c7a252]/20">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-[48px_1fr_auto] items-center gap-4 sm:gap-6 group hover:bg-[#171211]/50 px-3 sm:px-4 rounded transition-colors"
            >
              {/* SVG Icon */}
              <div className="text-[#c7a252] flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg width="28" height="34" viewBox="0 0 26 34" fill="none">
                  <path
                    d={service.shapeSvg}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Title & Description */}
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-serif-display text-xl sm:text-2xl font-normal italic text-[#f7f1e6] group-hover:text-[#e8cd8a] transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-[11px] text-[#8a6a4f] border border-[#8a6a4f]/30 px-2 py-0.5 rounded flex items-center gap-1 font-sans not-italic">
                    <Clock className="w-3 h-3" /> {service.durationMinutes}m
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#f7f1e6]/55 font-light mt-1.5 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Book Button */}
              <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                <div className="font-serif-display text-lg sm:text-xl text-[#e8cd8a] whitespace-nowrap">
                  {service.price.toLocaleString()} ETB
                </div>
                <button
                  onClick={() => onSelectServiceToBook(service)}
                  className="border border-[#c7a252]/40 hover:border-[#c7a252] text-[#e8cd8a] hover:bg-[#c7a252] hover:text-[#0e0b0a] px-3.5 py-2 text-[11px] uppercase tracking-wider rounded font-medium transition-all flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve</span>
                </button>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};
