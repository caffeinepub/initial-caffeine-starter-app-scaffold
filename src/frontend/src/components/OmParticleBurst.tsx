import type React from "react";
import { useEffect, useState } from "react";

const PARTICLES = [
  { angle: 0, distance: 40 },
  { angle: 120, distance: 35 },
  { angle: 240, distance: 38 },
];

export default function OmParticleBurst() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      {PARTICLES.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <div
            key={`particle-${p.angle}`}
            className="absolute text-primary font-bold"
            style={
              {
                fontSize: 12,
                animation: `omBurst 0.7s ease-out ${i * 80}ms forwards`,
                opacity: 0,
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
              } as React.CSSProperties
            }
          >
            ॐ
          </div>
        );
      })}
      <style>{`
        @keyframes omBurst {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0.9; }
          60% { opacity: 0.7; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
