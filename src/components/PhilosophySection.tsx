import React, { useState } from "react";
import { ArrowRight, X } from "lucide-react";

export const PhilosophySection: React.FC = () => {
  const [storyOpen, setStoryOpen] = useState(false);

  return (
    <section id="philosophy" className="py-16 sm:py-24 lg:py-32 bg-[#0A0A09] border-t border-[#F3EBDD]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left: Large Atelier Interior Photography */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative h-56 sm:h-72 lg:aspect-[16/11] lg:h-auto overflow-hidden bg-[#11110F] border border-[#C7A45A]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img
                src="/images/atelier_interior.jpg"
                alt="House of Bae Atelier Interior Sanctuary"
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 hover:scale-[1.02] transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09]/50 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#A9A399]/70 font-light">
              <span>Soliyana Building · 2nd Floor, Lideta</span>
              <span className="text-[#C7A45A]">Private Suites</span>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-4 sm:space-y-6 lg:space-y-8 text-left">
            
            <div className="space-y-1 sm:space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="w-3.5 h-[1px] bg-[#C7A45A]" />
                <span className="editorial-label text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-[#C7A45A]">
                  Our Philosophy
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#F3EBDD] leading-tight">
                Beauty in the <span className="text-[#C7A45A] italic">details.</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-[#A9A399] font-light border-l border-[#C7A45A]/30 pl-4 sm:pl-5">
              <p>
                House of Bae was founded on a singular conviction: nail care is an intimate art of precision, health, and personal elegance. Located in Lideta, Addis Ababa, our atelier offers a calm sanctuary where clients experience unhurried artistry.
              </p>
              <p>
                From meticulous cuticle preparation to sculpted Gel-X architecture and hand-painted bespoke designs, every set is tailored to your aesthetic. We prioritize hospital-grade autoclave sterilization, clean premium formulations, and enduring quality.
              </p>
            </div>

            {/* Subtle Our Story Link in Gold */}
            <div className="pt-1 sm:pt-2">
              <button
                onClick={() => setStoryOpen(true)}
                className="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C7A45A] hover:text-[#D9B86C] transition-colors duration-300 border-b border-[#C7A45A]/40 hover:border-[#D9B86C] pb-1 font-light"
              >
                <span>Our Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Subtle Our Story Modal */}
      {storyOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A09]/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#11110F] border border-[#F3EBDD]/15 max-w-xl w-full p-8 sm:p-10 relative animate-fade-in text-left space-y-6">
            <button
              onClick={() => setStoryOpen(false)}
              className="absolute top-6 right-6 text-[#A9A399] hover:text-[#F3EBDD] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="editorial-label text-[10px] tracking-[0.3em] text-[#C7A45A]">
              The Atelier Story
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EBDD] font-normal">
              A commitment to quiet elegance.
            </h3>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#A9A399] font-light">
              <p>
                We envisioned a space removed from the rushed pace of traditional salons. House of Bae is crafted for women who value high aesthetic standards, gentle non-damaging techniques, and meticulous attention to detail.
              </p>
              <p>
                Every specialist at House of Bae is trained in European e-file dry manicuring, precision apex sculpting, and archival Japanese and Korean gel systems. Our goal is simple: an effortless luxury experience where your natural nail health is always preserved.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F3EBDD]/10 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#A9A399]">
              <span>House of Bae Atelier</span>
              <button
                onClick={() => setStoryOpen(false)}
                className="text-[#F3EBDD] hover:text-[#C7A45A]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
