import React from "react";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Soliana+Commercial+Center+%7C+Lideta+%7C+%E1%88%B6%E1%88%8A%E1%8B%AB%E1%8A%93+%E1%8B%A8%E1%8A%95%E1%8C%8D%E1%8B%B5+%E1%88%9B%E1%8B%95%E1%8A%A8%E1%88%8D+%7C+%E1%88%8D%E1%8B%B0%E1%89%B3/@9.0151076,38.7352382,17z/data=!3m1!4b1!4m6!3m5!1s0x164b85df461a3f2d:0x6637f10e1ad21e01!8m2!3d9.0151023!4d38.7378131!16s%2Fg%2F11g9qgqq2z?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D";

// Official Real App Vector SVG Logos
const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.29 6.29 0 0 0 1.87-4.47v-7a8.16 8.16 0 0 0 4.74 1.48V6.69z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.77 14.07c-.24.67-1.38 1.28-1.92 1.36-.51.08-1.18.11-3.4-1.02-2.85-1.45-4.68-4.36-4.82-4.55-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.35.26-.28.58-.35.77-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.33.02.53-.1.19-.15.31-.3.49-.15.18-.32.39-.46.53-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.52.23.6.36.07.13.07.76-.17 1.43z"/>
  </svg>
);

const GoogleMapsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
  </svg>
);

const PhoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const clickCountRef = React.useRef(0);
  const clickTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFooterLogoTripleClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      window.location.href = "/admin";
      return;
    }
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 600);
  };

  return (
    <footer id="location" className="py-14 sm:py-20 bg-[#0A0A09] border-t border-[#F3EBDD]/10 text-center relative overflow-hidden">
      <div id="contact" className="absolute -top-16" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Brand Emblem & Wordmark */}
        <div
          onClick={handleFooterLogoTripleClick}
          className="flex flex-col items-center gap-3 cursor-pointer select-none"
          title="Triple-click for Admin Portal"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-[#C7A45A]/40 p-0.5 bg-[#0A0A09]">
            <img
              src="/house_of_bae_logo.png"
              alt="House of Bae Atelier Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-[0.08em] text-[#F3EBDD] uppercase font-normal">
              House of <span className="text-[#C7A45A]">Bae</span>
            </h3>
            <p className="editorial-label text-[9px] sm:text-[10px] tracking-[0.3em] text-[#C7A45A]/80 font-light">
              Atelier · Lideta, Addis Ababa
            </p>
          </div>
        </div>

        {/* Minimal Studio Location & Hours */}
        <div className="max-w-md mx-auto space-y-2 text-xs sm:text-sm text-[#A9A399] font-light leading-relaxed">
          <p className="text-[#F3EBDD] font-normal">
            Soliana Commercial Center (ሶሊያና የንግድ ማዕከል)<br />
            2nd Floor, Room No. 109 · Lideta, Addis Ababa
          </p>
          <p className="text-[#A9A399]/80 text-[11px] sm:text-xs">
            Monday — Saturday · 9:00 AM — 7:00 PM <span className="text-[#C7A45A]/40">·</span> Sunday by appointment
          </p>
        </div>

        {/* Clean Floating App Icons Only (No boxes, no names) */}
        <div className="flex justify-center items-center gap-6 sm:gap-8 pt-2 text-[#A9A399]">
          
          {/* Google Maps */}
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Google Maps Location"
            title="Google Maps Location"
            className="text-[#A9A399] hover:text-[#C7A45A] hover:scale-125 transition-all duration-300 p-1.5"
          >
            <GoogleMapsIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>

          {/* Direct Phone Call */}
          <a
            href="tel:+251926795498"
            aria-label="Call 0926 795 498"
            title="Call 0926 795 498"
            className="text-[#A9A399] hover:text-[#C7A45A] hover:scale-125 transition-all duration-300 p-1.5"
          >
            <PhoneIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/251926795498?text=Hello%20House%20of%20Bae%20✦"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp Concierge"
            title="WhatsApp"
            className="text-[#A9A399] hover:text-[#25D366] hover:scale-125 transition-all duration-300 p-1.5"
          >
            <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/house_of_bae1/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram @house_of_bae1"
            title="Instagram"
            className="text-[#A9A399] hover:text-[#E1306C] hover:scale-125 transition-all duration-300 p-1.5"
          >
            <InstagramIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>

          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@house_of_bae"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok @house_of_bae"
            title="TikTok"
            className="text-[#A9A399] hover:text-[#F3EBDD] hover:scale-125 transition-all duration-300 p-1.5"
          >
            <TikTokIcon className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>

        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#F3EBDD]/10 text-[10px] sm:text-[11px] text-[#A9A399]/60 font-light tracking-wider">
          <p>© {new Date().getFullYear()} House of Bae Atelier. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
