import React from "react";

interface HeroProps {
  onOpenBookingModal: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBookingModal, onExploreServices }) => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-24 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A09]">
      
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(199,164,90,0.12)_0%,_rgba(10,10,9,0)_70%)]" />

      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {/* Left Column (Main content & Mobile flow) */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
          
          {/* Location Tag with subtle gold line */}
          <div className="inline-flex items-center gap-2">
            <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
            <span className="editorial-label text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-[#C7A45A] font-medium">
              Lideta · Addis Ababa
            </span>
          </div>

          {/* Responsive Editorial Headline */}
          <div className="space-y-1 sm:space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-normal text-[#F3EBDD] leading-[1.08] tracking-tight">
              House of <span className="text-[#C7A45A] italic">Bae</span>
            </h1>
            <p className="font-serif italic text-lg sm:text-2xl md:text-3xl lg:text-4xl text-[#C7A45A]/90 font-light">
              Beauty in the details.
            </p>
          </div>

          {/* Supporting Text */}
          <p className="max-w-md text-xs sm:text-sm md:text-base leading-relaxed text-[#A9A399] font-light">
            Bespoke manicures, Gel-X extensions and signature nail art — crafted for women who appreciate every detail.
          </p>

          {/* Enhanced Mobile Photography (Calibrated height & framed elegantly before buttons on mobile screens) */}
          <div className="w-full lg:hidden pt-1 pb-1">
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-[#11110F] border border-[#C7A45A]/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <img
                src="/images/hero_editorial_nails.jpg"
                alt="House of Bae bespoke manicure editorial"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/50 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#A9A399]/70 font-light">
              <span className="text-[#C7A45A]">✦ Signature Care</span>
              <span>Lideta Atelier</span>
            </div>
          </div>

          {/* Action CTAs (Directly below photo on mobile, left column on desktop) */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenBookingModal}
              className="bg-[#C7A45A] text-[#0A0A09] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D9B86C] hover:shadow-[0_4px_20px_rgba(199,164,90,0.3)] transition-all duration-300 text-center active:scale-95"
            >
              Book An Appointment
            </button>
            <button
              onClick={onExploreServices}
              className="border border-[#C7A45A]/40 text-[#F3EBDD] hover:border-[#C7A45A] hover:text-[#C7A45A] px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 text-center active:scale-95"
            >
              Explore Services
            </button>
          </div>

        </div>

        {/* Desktop-only Right Column: Hero Fashion Photography */}
        <div className="hidden lg:flex lg:col-span-6 relative items-center justify-end animate-fade-in">
          <div className="relative w-full max-w-lg lg:max-w-none">
            {/* Elegant Image Frame with subtle gold border */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#11110F] border border-[#C7A45A]/30 shadow-[0_15px_45px_rgba(0,0,0,0.6)] group">
              <img
                src="/images/hero_editorial_nails.jpg"
                alt="House of Bae bespoke manicure editorial"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-700 ease-out"
              />
              {/* Subtle Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Subtle Minimal Caption */}
            <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#A9A399]/70 font-light">
              <span className="text-[#C7A45A]">✦ Signature Care</span>
              <span>Lideta Atelier</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
