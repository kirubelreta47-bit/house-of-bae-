import React from "react";

export const AmbientBackground: React.FC = () => {
  // Generate subtle random particles
  const particles = Array.from({ length: 20 }, () => {
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 12; // 12s to 24s
    const delay = Math.random() * -20;
    const size = 1 + Math.random() * 2;
    const twinkleDuration = 3 + Math.random() * 4;
    return { left, duration, delay, size, twinkleDuration };
  });

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#0a0a0a]">
      {/* Background static radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(circle,_rgba(212,175,55,0.08)_0%,_transparent_70%)] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(circle,_rgba(212,175,55,0.05)_0%,_transparent_70%)] rounded-full blur-[140px] translate-x-1/4 translate-y-1/4" />

      {/* Floating Gold Dust Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#D4AF37] shadow-[0_0_6px_1.5px_rgba(212,175,55,0.5)] animate-float motion-reduce:animate-none"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            bottom: "-10%",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <div
            className="w-full h-full bg-[#FAF6EF] rounded-full animate-twinkle motion-reduce:animate-none"
            style={{
              animationDuration: `${p.twinkleDuration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        </div>
      ))}

      {/* Fine luxury grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
    </div>
  );
};
