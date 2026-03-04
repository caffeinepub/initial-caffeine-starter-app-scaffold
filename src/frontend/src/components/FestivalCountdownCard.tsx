import { Share2 } from "lucide-react";
import React from "react";

interface Festival {
  name: string;
  date: string;
  description: string;
  daysLeft?: number;
}

interface FestivalCountdownCardProps {
  festival: Festival;
}

export default function FestivalCountdownCard({
  festival,
}: FestivalCountdownCardProps) {
  const festivalDate = new Date(festival.date);
  const today = new Date();
  const diffTime = festivalDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleShare = async () => {
    const text = `🎉 ${festival.name} आ रहा है! ${daysLeft > 0 ? `${daysLeft} दिन बाकी` : "आज है!"}\n${festival.description}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)",
        border: "2px solid #FFD700",
        boxShadow: "0 4px 20px rgba(255,215,0,0.25)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎊</span>
            <span className="font-devanagari text-white font-bold text-sm">
              {festival.name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <Share2 size={14} color="white" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="font-poppins text-xs mb-3" style={{ color: "#A0522D" }}>
          {festival.description}
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 rounded-xl p-3 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,107,0,0.1), rgba(255,215,0,0.15))",
              border: "1px solid #FFD700",
            }}
          >
            <div
              className="font-poppins text-2xl font-bold"
              style={{ color: "#C0392B" }}
            >
              {daysLeft > 0 ? daysLeft : daysLeft === 0 ? "🎉" : "✓"}
            </div>
            <div
              className="font-devanagari text-xs"
              style={{ color: "#8B5E3C" }}
            >
              {daysLeft > 0 ? "दिन बाकी" : daysLeft === 0 ? "आज!" : "बीत गया"}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-poppins text-xs" style={{ color: "#A0522D" }}>
              📅{" "}
              {festivalDate.toLocaleDateString("hi-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
