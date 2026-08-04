import React from "react";

export const AmbientBackground: React.FC = () => {
  // Generate ~25 random particles
  const particles = Array.from({ length: 25 }, (_, i) => {
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10; // 9s to 19s
    const delay = Math.random() * -20; // randomize start point in the loop
    const size = 1 + Math.random() * 2; // 1px to 3px
    const twinkleDuration = 3 + Math.random() * 4; // 3s to 7s
    return { left, duration, delay, size, twinkleDuration };
  });

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-gradient-to-br from-[#0c0805] via-[#1a1108] to-[#241606]">
      {/* Background static radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[rgba(201,161,90,0.15)] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[rgba(201,161,90,0.12)] rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />

      {/* Breathing glow (Top Center) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[rgba(201,161,90,0.15)] rounded-full blur-[120px] animate-breathe motion-reduce:animate-none" />

      {/* Floating Sparkles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#e9cd97] shadow-[0_0_6px_2px_rgba(233,205,151,0.6)] animate-float motion-reduce:animate-none"
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
            className="w-full h-full bg-white rounded-full animate-twinkle motion-reduce:animate-none"
            style={{
              animationDuration: `${p.twinkleDuration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        </div>
      ))}

      {/* Fine grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(#c7a252 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
    </div>
  );
};
