import React from "react";

const PETALS = [
  { top: "10%", left: "5%", delay: "0s", duration: "18s", size: 24 },
  { top: "20%", left: "85%", delay: "3s", duration: "22s", size: 20 },
  { top: "60%", left: "10%", delay: "6s", duration: "20s", size: 28 },
  { top: "75%", left: "80%", delay: "1.5s", duration: "25s", size: 22 },
  { top: "40%", left: "90%", delay: "9s", duration: "19s", size: 18 },
  { top: "85%", left: "40%", delay: "4.5s", duration: "23s", size: 26 },
];

export default function FloatingLotus() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PETALS.map((petal) => (
        <img
          key={`lotus-petal-${petal.top}-${petal.left}`}
          src="/assets/generated/lotus-petal.dim_80x80.png"
          alt=""
          className="absolute opacity-20"
          style={{
            top: petal.top,
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animation: `floatPetal ${petal.duration} ${petal.delay} ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatPetal {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(8deg); }
          66% { transform: translateY(6px) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}
