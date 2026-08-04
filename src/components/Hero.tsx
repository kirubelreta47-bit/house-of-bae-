import React from "react";
import { Sparkles, MapPin, Clock, Star, ShieldCheck } from "lucide-react";

interface HeroProps {
  onOpenBookingModal: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBookingModal, onExploreServices }) => {
  return (
    <section className="min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center text-center relative px-6 pt-32 pb-20 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#c7a252]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Location Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c7a252]/30 bg-[#171211]/80 backdrop-blur-md mb-6 animate-fade-in">
        <MapPin className="w-3.5 h-3.5 text-[#c7a252]" />
        <span className="eyebrow text-[10px] sm:text-[11px] text-[#e8cd8a]">
          Nail Studio · Lideta, Addis Ababa
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-serif-display text-5xl sm:text-7xl md:text-9xl tracking-tight leading-none italic font-medium max-w-5xl gold-gradient-text drop-shadow-lg">
        House of Bae
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#f7f1e6]/75 font-light">
        Hand-finished manicures, sculpted Gel-X extensions and gold-kissed nail art — crafted for women who notice every detail.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <button
          onClick={onOpenBookingModal}
          className="w-full sm:w-auto bg-[#c7a252] text-[#0e0b0a] px-8 py-4 text-xs tracking-widest uppercase font-medium rounded-sm hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(199,162,82,0.3)] transition-all duration-300 border border-[#c7a252]"
        >
          Reserve Your Appointment
        </button>
        <button
          onClick={onExploreServices}
          className="w-full sm:w-auto border border-[#f7f1e6]/30 text-[#f7f1e6] hover:border-[#c7a252] hover:text-[#e8cd8a] px-8 py-4 text-xs tracking-widest uppercase rounded-sm transition-all duration-300"
        >
          View Service Menu
        </button>
      </div>

      {/* Studio Feature Badges */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto pt-8 border-t border-[#c7a252]/20 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#171211] border border-[#c7a252]/30 rounded-sm text-[#c7a252]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#e8cd8a]">Soliyana Building</div>
            <div className="text-[11px] text-[#f7f1e6]/50">2nd Floor, No. 109</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#171211] border border-[#c7a252]/30 rounded-sm text-[#c7a252]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#e8cd8a]">Mon – Sat</div>
            <div className="text-[11px] text-[#f7f1e6]/50">9:00 AM – 7:00 PM</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#171211] border border-[#c7a252]/30 rounded-sm text-[#c7a252]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#e8cd8a]">100% Sanitized</div>
            <div className="text-[11px] text-[#f7f1e6]/50">Medical Grade Autoclave</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#171211] border border-[#c7a252]/30 rounded-sm text-[#c7a252]">
            <Star className="w-4 h-4 fill-[#c7a252]" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#e8cd8a]">4.9★ Top Studio</div>
            <div className="text-[11px] text-[#f7f1e6]/50">Lideta's Premier Studio</div>
          </div>
        </div>
      </div>
    </section>
  );
};
