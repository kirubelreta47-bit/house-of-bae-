import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Triple-click / triple-tap counter for secret mobile & desktop admin access
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTripleClick = (e: React.MouseEvent) => {
    clickCountRef.current += 1;

    if (clickCountRef.current >= 3) {
      e.preventDefault();
      e.stopPropagation();
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      
      if (onOpenAdminModal) {
        onOpenAdminModal();
      } else {
        window.location.href = "/admin";
      }
      return;
    }

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 600);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#F3EBDD]/10 py-4 shadow-sm"
          : "bg-transparent border-b border-transparent py-6 sm:py-7"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Refined Wordmark with Logo (Triple-click / tap opens /admin) */}
        <div className="flex items-center">
          <a
            href="#"
            onClick={handleLogoTripleClick}
            className="group flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 select-none cursor-pointer"
            title="Triple-click/tap for Admin Portal"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#C7A45A]/40 p-0.5 flex-shrink-0 bg-[#0A0A09] shadow-[0_0_12px_rgba(199,164,90,0.15)] group-hover:border-[#C7A45A] transition-colors">
              <img
                src="/house_of_bae_logo.png"
                alt="House of Bae Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-lg sm:text-2xl tracking-[0.08em] font-normal text-[#F3EBDD] leading-none uppercase">
                House of <span className="text-[#C7A45A]">Bae</span>
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] text-[#C7A45A]/80 uppercase font-light mt-0.5 sm:mt-1 pl-0.5">
                Atelier · Lideta
              </span>
            </div>
          </a>
        </div>

        {/* Center: Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 text-[12px] tracking-[0.18em] uppercase text-[#A9A399] font-normal">
          <button
            onClick={() => scrollTo("services")}
            className="hover:text-[#C7A45A] transition-colors duration-300 relative py-1 hover:tracking-[0.2em] transition-all"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo("philosophy")}
            className="hover:text-[#C7A45A] transition-colors duration-300 relative py-1 hover:tracking-[0.2em] transition-all"
          >
            Philosophy
          </button>
          <button
            onClick={() => scrollTo("gallery")}
            className="hover:text-[#C7A45A] transition-colors duration-300 relative py-1 hover:tracking-[0.2em] transition-all"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollTo("location")}
            className="hover:text-[#C7A45A] transition-colors duration-300 relative py-1 hover:tracking-[0.2em] transition-all"
          >
            Location
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Subtle My Appointment link */}
          <button
            onClick={onOpenLookupModal}
            className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#A9A399] hover:text-[#C7A45A] transition-colors duration-300 group"
          >
            <Search className="w-3.5 h-3.5 text-[#C7A45A] group-hover:scale-110 transition-transform" />
            <span>My Appointment</span>
          </button>

          {/* Primary Book Now CTA in Champagne Gold */}
          <button
            onClick={onOpenBookingModal}
            className="bg-[#C7A45A] text-[#0A0A09] px-5 sm:px-6 py-2.5 sm:py-2.5 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold rounded-none hover:bg-[#D9B86C] hover:shadow-[0_2px_15px_rgba(199,164,90,0.25)] transition-all duration-300 active:scale-95"
          >
            Book Now
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#C7A45A] p-1 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Minimalist Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[70px] bg-[#0A0A09] border-b border-[#F3EBDD]/10 px-8 py-8 flex flex-col gap-6 animate-fade-in shadow-2xl">
          <div
            onClick={handleLogoTripleClick}
            className="flex items-center gap-3 pb-3 border-b border-[#F3EBDD]/10 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C7A45A]/40 p-0.5 bg-[#0A0A09]">
              <img
                src="/house_of_bae_logo.png"
                alt="House of Bae Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.08em] text-[#F3EBDD] uppercase">
                House of <span className="text-[#C7A45A]">Bae</span>
              </span>
              <span className="text-[8px] tracking-[0.3em] text-[#C7A45A]/80 uppercase">
                Atelier · Lideta (Triple-tap for Admin)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-xs tracking-[0.22em] uppercase text-[#A9A399]">
            <button
              onClick={() => scrollTo("services")}
              className="text-left py-2 hover:text-[#F3EBDD] border-b border-[#F3EBDD]/5"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo("philosophy")}
              className="text-left py-2 hover:text-[#F3EBDD] border-b border-[#F3EBDD]/5"
            >
              Philosophy
            </button>
            <button
              onClick={() => scrollTo("gallery")}
              className="text-left py-2 hover:text-[#F3EBDD] border-b border-[#F3EBDD]/5"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollTo("location")}
              className="text-left py-2 hover:text-[#F3EBDD] border-b border-[#F3EBDD]/5"
            >
              Location
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookupModal();
              }}
              className="text-left py-2 hover:text-[#C7A45A] border-b border-[#F3EBDD]/5 flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-[#C7A45A]" />
              <span>Lookup My Appointment</span>
            </button>

            {/* Direct Admin Access Link in Mobile Menu for Owner */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdminModal) onOpenAdminModal();
                else window.location.href = "/admin";
              }}
              className="text-left py-2 text-[#C7A45A] font-semibold border-b border-[#C7A45A]/20 flex items-center gap-2"
            >
              <span>Studio Owner Portal (/admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
