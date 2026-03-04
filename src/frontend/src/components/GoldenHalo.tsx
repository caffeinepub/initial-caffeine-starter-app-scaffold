import type React from "react";

interface GoldenHaloProps {
  children?: React.ReactNode;
  size?: number | "sm" | "md" | "lg";
  className?: string;
}

function resolveSize(size: number | "sm" | "md" | "lg" | undefined): number {
  if (size === undefined) return 120;
  if (typeof size === "number") return size;
  if (size === "sm") return 60;
  if (size === "md") return 90;
  if (size === "lg") return 130;
  return 120;
}

export default function GoldenHalo({
  children,
  size,
  className = "",
}: GoldenHaloProps) {
  const px = resolveSize(size);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: px, height: px }}
    >
      {/* Halo glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.18 80 / 0.25) 0%, oklch(0.75 0.15 60 / 0.1) 50%, transparent 70%)",
          animation: "haloGlow 4s ease-in-out infinite",
        }}
      />
      {children}
      <style>{`
        @keyframes haloGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
