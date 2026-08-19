import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Soliana+Commercial+Center+%7C+Lideta+%7C+%E1%88%B6%E1%88%8A%E1%8B%AB%E1%8A%93+%E1%8B%A8%E1%8A%95%E1%8C%8D%E1%8B%B5+%E1%88%9B%E1%8B%95%E1%8A%A8%E1%88%8D+%7C+%E1%88%8D%E1%8B%B0%E1%89%B3/@9.0151076,38.7352382,17z/data=!3m1!4b1!4m6!3m5!1s0x164b85df461a3f2d:0x6637f10e1ad21e01!8m2!3d9.0151023!4d38.7378131!16s%2Fg%2F11g9qgqq2z?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D";

// Real Official App SVG Icons
const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.29 6.29 0 0 0 1.87-4.47v-7a8.16 8.16 0 0 0 4.74 1.48V6.69z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.77 14.07c-.24.67-1.38 1.28-1.92 1.36-.51.08-1.18.11-3.4-1.02-2.85-1.45-4.68-4.36-4.82-4.55-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.35.26-.28.58-.35.77-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.33.02.53-.1.19-.15.31-.3.49-.15.18-.32.39-.46.53-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.52.23.6.36.07.13.07.76-.17 1.43z"/>
  </svg>
);

const GoogleMapsIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
  </svg>
);

const PhoneIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export const LocationSection: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setName("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMsg(data.error || "Failed to send message.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="location" className="py-16 sm:py-24 lg:py-32 bg-[#0A0A09] border-t border-[#F3EBDD]/10 relative">
      <div id="contact" className="absolute -top-20" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Understated Studio Information */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            <div className="space-y-1 sm:space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
                <span className="editorial-label text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-[#C7A45A]">
                  Visit & Contact Us
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#F3EBDD] leading-tight">
                House of <span className="text-[#C7A45A] italic">Bae</span> Atelier
              </h2>
            </div>

            {/* Address & Hours List */}
            <div className="space-y-4 sm:space-y-6 pt-1 text-xs sm:text-sm text-[#A9A399] font-light">
              
              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] font-medium">
                  Studio Location
                </div>
                <p className="text-[#F3EBDD] font-normal leading-relaxed">
                  Soliana Commercial Center (ሶሊያና የንግድ ማዕከል)<br />
                  2nd Floor, Room No. 109<br />
                  Lideta, Addis Ababa, Ethiopia
                </p>
                <div className="pt-2">
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#11110F] border border-[#C7A45A]/40 text-[#C7A45A] hover:bg-[#C7A45A] hover:text-[#0A0A09] transition-all duration-300 text-xs tracking-wider uppercase font-medium group"
                  >
                    <GoogleMapsIcon className="w-4 h-4 text-[#C7A45A] group-hover:text-[#0A0A09] transition-colors" />
                    <span>Open in Google Maps</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 ml-1" />
                  </a>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#F3EBDD]/10">
                <div className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] font-medium">
                  Hours of Artistry
                </div>
                <p className="text-[#F3EBDD]">
                  Monday — Saturday · 9:00 AM — 7:00 PM<br />
                  <span className="text-[#A9A399]">Sunday · Private session by appointment</span>
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F3EBDD]/10">
                <div className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] font-medium">
                  Connect & Inquiries
                </div>
                <div className="flex items-center gap-4 sm:gap-5 pt-1 text-[#A9A399]">
                  <a
                    href="tel:+251926795498"
                    aria-label="Call 0926 795 498"
                    title="Call 0926 795 498"
                    className="hover:text-[#C7A45A] hover:scale-125 transition-all duration-300"
                  >
                    <PhoneIcon className="w-5 h-5 text-[#C7A45A]" />
                  </a>
                  <a
                    href="https://wa.me/251926795498?text=Hello%20House%20of%20Bae%20✦%20I%20have%20an%20inquiry"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp Concierge"
                    title="WhatsApp"
                    className="hover:text-[#25D366] hover:scale-125 transition-all duration-300"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </a>
                  <a
                    href="https://www.instagram.com/house_of_bae1/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram @house_of_bae1"
                    title="Instagram"
                    className="hover:text-[#E1306C] hover:scale-125 transition-all duration-300"
                  >
                    <InstagramIcon className="w-5 h-5 text-[#E1306C]" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@house_of_bae"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok @house_of_bae"
                    title="TikTok"
                    className="hover:text-[#F3EBDD] hover:scale-125 transition-all duration-300"
                  >
                    <TikTokIcon className="w-5 h-5 text-[#F3EBDD]" />
                  </a>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Google Maps Location"
                    title="Google Maps"
                    className="hover:text-[#C7A45A] hover:scale-125 transition-all duration-300"
                  >
                    <GoogleMapsIcon className="w-5 h-5 text-[#C7A45A]" />
                  </a>
                </div>
              </div>

              {/* Understated Credentials */}
              <div className="pt-3 border-t border-[#F3EBDD]/10 flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[#A9A399]/80 font-light">
                <span className="text-[#C7A45A]">✦ 4.9 ★ Top Studio</span>
                <span>·</span>
                <span className="text-[#C7A45A]">✦ 100% Autoclave Sanitized</span>
              </div>

            </div>

          </div>

          {/* Right Column: Clean Editorial Direct Note / Inquiry */}
          <div className="lg:col-span-6 bg-[#11110F] border border-[#C7A45A]/25 p-5 sm:p-8 lg:p-10 text-left shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
            <div className="space-y-1 mb-6">
              <div className="text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] font-medium">
                Studio Concierge
              </div>
              <h3 className="font-serif text-2xl text-[#F3EBDD] font-normal">
                Send a Direct Message
              </h3>
              <p className="text-xs text-[#A9A399] font-light">
                Questions regarding bridal bookings, custom nail art consultation, or private appointments.
              </p>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-8 h-8 text-[#C7A45A] mx-auto" />
                <h4 className="font-serif text-xl text-[#F3EBDD]">Inquiry Received</h4>
                <p className="text-xs text-[#A9A399] font-light max-w-xs mx-auto">
                  Our concierge will contact your phone number shortly to assist you.
                </p>
                <button
                  onClick={() => setSentSuccess(false)}
                  className="text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquiry} className="space-y-4">
                {errorMsg && (
                  <div className="text-xs text-red-300 py-1">{errorMsg}</div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bethlehem Haile"
                    className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-4 py-3 text-xs focus:outline-none focus:border-[#C7A45A] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09XX XXX XXX"
                    className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-4 py-3 text-xs focus:outline-none focus:border-[#C7A45A] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                    Message or Consultation Request
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your desired design, event date, or custom request..."
                    className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-4 py-3 text-xs focus:outline-none focus:border-[#C7A45A] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C7A45A] text-[#0A0A09] py-3.5 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D9B86C] transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
