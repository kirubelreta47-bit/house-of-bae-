import React from "react";

export const MarqueeTicker: React.FC = () => {
  const items = [
    "Classic Manicure",
    "Spa Pedicure",
    "Gel-X Extensions",
    "Mirror Chrome",
    "24k Gold Leaf Foil",
    "Hand-Painted Art",
    "Russian Dry Cuticle Care",
    "Cat-Eye Velvet Gels",
    "Nail Health Repair",
  ];

  return (
    <div className="border-y border-[#c7a252]/25 bg-[#171211]/60 backdrop-blur-sm py-4 overflow-hidden whitespace-nowrap relative select-none">
      <div className="animate-marquee">
        {[...items, ...items, ...items].map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="font-serif-display italic text-sm sm:text-base text-[#e8cd8a] tracking-wide">
              {item}
            </span>
            <span className="text-[#8a6a4f] text-xs font-normal">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
