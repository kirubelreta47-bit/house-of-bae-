import React, { useState } from "react";
import { Sparkles, Calendar, Search, ShieldCheck, Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  onOpenBookingModal: () => void;
  onOpenLookupModal: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBookingModal,
  onOpenLookupModal,
  onOpenAdminModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0e0b0a]/95 via-[#0e0b0a]/80 to-transparent backdrop-blur-md border-b border-[#c7a252]/15 transition-all py-4">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="font-serif-display text-xl sm:text-2xl tracking-wide italic text-[#f7f1e6] flex items-center gap-2 group">
          <span>house</span> <b className="not-italic text-[#c7a252]">of</b> <span>bae</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#c7a252] group-hover:scale-125 transition-transform" />
        </a>

        {/* Desktop Navlinks */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-light text-[#f7f1e6]/80">
          <button onClick={() => scrollTo("services")} className="hover:text-[#e8cd8a] transition-colors">
            Services
          </button>
          <button onClick={() => scrollTo("gallery")} className="hover:text-[#e8cd8a] transition-colors">
            Gallery
          </button>
          <button onClick={() => scrollTo("booking")} className="hover:text-[#e8cd8a] transition-colors">
            Booking
          </button>
          <button onClick={() => scrollTo("location")} className="hover:text-[#e8cd8a] transition-colors">
            Location
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenLookupModal}
            className="text-xs text-[#f7f1e6]/70 hover:text-[#e8cd8a] flex items-center gap-1.5 px-3 py-2 border border-[#c7a252]/20 hover:border-[#c7a252]/50 rounded transition-colors"
            title="Lookup existing appointment"
          >
            <Search className="w-3.5 h-3.5 text-[#c7a252]" />
            <span>My Appointment</span>
          </button>

          <button
            onClick={onOpenBookingModal}
            className="border border-[#c7a252] text-[#e8cd8a] hover:bg-[#c7a252] hover:text-[#0e0b0a] px-5 py-2 text-xs uppercase tracking-widest font-medium rounded transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(199,162,82,0.3)]"
          >
            Book Now
          </button>

          <button
            onClick={onOpenAdminModal}
            className="text-[#f7f1e6]/40 hover:text-[#c7a252] p-2 rounded transition-colors"
            title="Studio Admin Access"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenBookingModal}
            className="border border-[#c7a252] text-[#e8cd8a] px-3 py-1.5 text-[11px] uppercase tracking-wider rounded font-medium"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#f7f1e6] focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#c7a252]" /> : <Menu className="w-6 h-6 text-[#c7a252]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#171211] border-b border-[#c7a252]/20 px-6 py-6 mt-2 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => scrollTo("services")}
            className="text-left py-2 text-sm uppercase tracking-widest text-[#f7f1e6] border-b border-[#c7a252]/10"
          >
            Services & Pricing
          </button>
          <button
            onClick={() => scrollTo("gallery")}
            className="text-left py-2 text-sm uppercase tracking-widest text-[#f7f1e6] border-b border-[#c7a252]/10"
          >
            Polish & Swatch Gallery
          </button>
          <button
            onClick={() => scrollTo("booking")}
            className="text-left py-2 text-sm uppercase tracking-widest text-[#f7f1e6] border-b border-[#c7a252]/10"
          >
            Reserve Slot
          </button>
          <button
            onClick={() => scrollTo("location")}
            className="text-left py-2 text-sm uppercase tracking-widest text-[#f7f1e6] border-b border-[#c7a252]/10"
          >
            Studio Location & Hours
          </button>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookupModal();
              }}
              className="w-full py-2.5 text-xs text-center border border-[#c7a252]/30 rounded text-[#e8cd8a] flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Lookup Appointment
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full py-2 text-xs text-center text-[#f7f1e6]/50 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Staff Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
