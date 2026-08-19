import React from "react";

interface FinalCTASectionProps {
  onOpenBookingModal: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onOpenBookingModal }) => {
  return (
    <section className="py-16 sm:py-24 lg:py-36 bg-[#0A0A09] border-t border-[#F3EBDD]/10 text-center relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,_rgba(199,164,90,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">
        
        <div className="inline-flex items-center gap-2">
          <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
          <span className="editorial-label text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-[#C7A45A]">
            Bespoke Reservations
          </span>
          <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#F3EBDD] leading-tight">
          Your next signature set <span className="text-[#C7A45A] italic">awaits.</span>
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-[#A9A399] font-light max-w-lg mx-auto leading-relaxed">
          Reserve your appointment at House of Bae Atelier. Each session is private, unhurried, and crafted around your natural nail architecture.
        </p>

        <div className="pt-2 sm:pt-4">
          <button
            onClick={onOpenBookingModal}
            className="bg-[#C7A45A] text-[#0A0A09] px-8 sm:px-10 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D9B86C] hover:shadow-[0_4px_25px_rgba(199,164,90,0.35)] transition-all duration-300 active:scale-95"
          >
            Book An Appointment
          </button>
        </div>

      </div>
    </section>
  );
};
