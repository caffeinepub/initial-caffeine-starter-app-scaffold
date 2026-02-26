import React, { useEffect, useState } from 'react';

interface SacredRippleProps {
  trigger: number;
}

interface RippleEntry {
  id: number;
  ts: number;
}

export default function SacredRipple({ trigger }: SacredRippleProps) {
  const [ripples, setRipples] = useState<RippleEntry[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const entry: RippleEntry = { id: trigger, ts: Date.now() };
    setRipples((prev) => [...prev.slice(-3), entry]); // keep max 4 ripples
    const timer = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== entry.id));
    }, 800);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (ripples.length === 0) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      {ripples.map((r) => (
        <React.Fragment key={r.id}>
          {/* Ring 1 */}
          <div
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              border: '2px solid oklch(0.75 0.18 60 / 0.7)',
              animation: 'sacredRipple1 0.8s cubic-bezier(0.2, 0.6, 0.4, 1) forwards',
            }}
          />
          {/* Ring 2 */}
          <div
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              border: '1.5px solid oklch(0.65 0.22 40 / 0.5)',
              animation: 'sacredRipple2 0.8s cubic-bezier(0.2, 0.6, 0.4, 1) 0.1s forwards',
            }}
          />
          {/* Ring 3 - subtle outer */}
          <div
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              border: '1px solid oklch(0.85 0.15 55 / 0.3)',
              animation: 'sacredRipple3 0.8s cubic-bezier(0.2, 0.6, 0.4, 1) 0.2s forwards',
            }}
          />
        </React.Fragment>
      ))}
      <style>{`
        @keyframes sacredRipple1 {
          0%   { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes sacredRipple2 {
          0%   { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes sacredRipple3 {
          0%   { transform: scale(0.9); opacity: 0.4; }
          100% { transform: scale(3.0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
