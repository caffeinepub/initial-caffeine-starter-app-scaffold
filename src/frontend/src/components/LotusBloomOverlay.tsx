import React, { useEffect, useState } from "react";

const PETAL_KEYS = ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"] as const;

interface LotusBloomOverlayProps {
  trigger: number;
}

export default function LotusBloomOverlay({ trigger }: LotusBloomOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    setAnimating(true);
    const hideTimer = setTimeout(() => {
      setAnimating(false);
      setTimeout(() => setVisible(false), 400);
    }, 2800);
    return () => clearTimeout(hideTimer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        opacity: animating ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.85 0.18 60 / 0.25) 0%, oklch(0.65 0.22 40 / 0.1) 40%, transparent 70%)",
          animation: animating ? "bloomBg 2.8s ease-in-out" : "none",
        }}
      />

      {/* Petal burst particles */}
      {PETAL_KEYS.map((key, i) => (
        <div
          key={key}
          className="absolute text-2xl"
          style={{
            animation: animating
              ? `petalBurst${i % 4} 2.5s ease-out forwards`
              : "none",
            animationDelay: `${i * 0.08}s`,
          }}
        >
          🌸
        </div>
      ))}

      {/* Main lotus image */}
      <div
        className="relative flex flex-col items-center gap-4"
        style={{
          animation: animating
            ? "lotusEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : "none",
        }}
      >
        <img
          src="/assets/generated/lotus-bloom.dim_400x400.png"
          alt="Lotus Bloom"
          className="w-52 h-52 object-contain"
          style={{
            filter: "drop-shadow(0 0 40px oklch(0.85 0.18 60 / 0.8))",
            animation: animating
              ? "lotusRotate 3s ease-in-out infinite"
              : "none",
          }}
        />
        <div
          className="text-center px-6 py-3 rounded-2xl"
          style={{
            background: "oklch(0.15 0.05 30 / 0.85)",
            border: "1px solid oklch(0.75 0.18 60 / 0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p
            className="font-heading text-2xl font-bold"
            style={{
              color: "oklch(0.85 0.18 60)",
              textShadow: "0 0 20px oklch(0.85 0.18 60 / 0.8)",
              animation: animating
                ? "textPulse 1s ease-in-out infinite"
                : "none",
            }}
          >
            🕉️ 108 पूर्ण! 🕉️
          </p>
          <p className="text-lg mt-1" style={{ color: "oklch(0.75 0.15 50)" }}>
            एक माला पूर्ण हुई 🙏
          </p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.65 0.12 45)" }}>
            हरि ॐ तत् सत्
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bloomBg {
          0%   { opacity: 0; transform: scale(0.8); }
          30%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: scale(1.2); }
        }
        @keyframes lotusEntrance {
          0%   { opacity: 0; transform: scale(0.3) rotate(-20deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes lotusRotate {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          50%       { transform: rotate(3deg) scale(1.04); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 1; text-shadow: 0 0 30px oklch(0.85 0.18 60); }
        }
        @keyframes petalBurst0 {
          0%   { opacity: 1; transform: translate(0,0) scale(0.5); }
          100% { opacity: 0; transform: translate(-120px,-140px) scale(1.2) rotate(180deg); }
        }
        @keyframes petalBurst1 {
          0%   { opacity: 1; transform: translate(0,0) scale(0.5); }
          100% { opacity: 0; transform: translate(130px,-130px) scale(1.2) rotate(-180deg); }
        }
        @keyframes petalBurst2 {
          0%   { opacity: 1; transform: translate(0,0) scale(0.5); }
          100% { opacity: 0; transform: translate(-140px,120px) scale(1.2) rotate(120deg); }
        }
        @keyframes petalBurst3 {
          0%   { opacity: 1; transform: translate(0,0) scale(0.5); }
          100% { opacity: 0; transform: translate(140px,120px) scale(1.2) rotate(-120deg); }
        }
      `}</style>
    </div>
  );
}
