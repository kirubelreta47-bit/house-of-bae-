import React from "react";
import { Instagram, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="py-16 bg-[#0e0b0a] border-t border-[#c7a252]/25 text-center relative">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Brand */}
        <div className="font-serif-display text-3xl sm:text-4xl italic text-[#f7f1e6]">
          house <b className="not-italic text-[#c7a252]">of</b> bae
        </div>

        {/* Foot Links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs uppercase tracking-widest text-[#f7f1e6]/70">
          <button onClick={() => scrollTo("services")} className="hover:text-[#e8cd8a] transition-colors">
            Services
          </button>
          <button onClick={() => scrollTo("gallery")} className="hover:text-[#e8cd8a] transition-colors">
            Gallery
          </button>
          <button onClick={() => scrollTo("booking")} className="hover:text-[#e8cd8a] transition-colors">
            Booking
          </button>
          <a
            href="https://www.instagram.com/house_of_bae1/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#e8cd8a] transition-colors flex items-center gap-1"
          >
            <Instagram className="w-3.5 h-3.5 text-[#c7a252]" />
            Instagram
          </a>
          <a href="tel:+251926795498" className="hover:text-[#e8cd8a] transition-colors flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#c7a252]" />
            0926 795 498
          </a>
        </div>

        {/* Address and Copyright */}
        <div className="text-[11.5px] text-[#f7f1e6]/40 tracking-wider space-y-1 font-light border-t border-[#c7a252]/10 pt-6">
          <p>Soliyana Building, 2nd Floor, No. 109 · Lideta, Addis Ababa, Ethiopia</p>
          <p>© {new Date().getFullYear()} House of Bae Nail Atelier. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
