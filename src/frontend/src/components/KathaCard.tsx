import { useNavigate } from "@tanstack/react-router";
import React from "react";
import type { KathaCategory } from "../backend";

interface KathaData {
  id: number | bigint;
  title: string;
  category:
    | KathaCategory
    | string
    | { puranik?: null; vrat?: null; krishna?: null };
  deity: string;
  hindiText: string;
  englishText?: string;
  tags?: string[];
}

interface KathaCardProps {
  katha: KathaData;
}

function getCategoryLabel(category: KathaData["category"]): string {
  if (typeof category === "string") {
    if (category === "puranik") return "पौराणिक";
    if (category === "vrat") return "व्रत कथा";
    if (category === "krishna") return "कृष्ण लीला";
    return category;
  }
  if (typeof category === "object" && category !== null) {
    if ("puranik" in category) return "पौराणिक";
    if ("vrat" in category) return "व्रत कथा";
    if ("krishna" in category) return "कृष्ण लीला";
  }
  return "कथा";
}

function getDeityEmoji(deity: string): string {
  const d = deity.toLowerCase();
  if (d.includes("krishna") || d.includes("कृष्ण")) return "🦚";
  if (d.includes("ram") || d.includes("राम")) return "🏹";
  if (d.includes("shiv") || d.includes("शिव")) return "🔱";
  if (d.includes("durga") || d.includes("दुर्गा")) return "🌺";
  if (d.includes("ganesh") || d.includes("गणेश")) return "🐘";
  if (d.includes("hanuman") || d.includes("हनुमान")) return "🙏";
  if (d.includes("lakshmi") || d.includes("लक्ष्मी")) return "🪷";
  if (d.includes("saraswati") || d.includes("सरस्वती")) return "🎵";
  return "🕉️";
}

export default function KathaCard({ katha }: KathaCardProps) {
  const navigate = useNavigate();
  const categoryLabel = getCategoryLabel(katha.category);
  const deityEmoji = getDeityEmoji(katha.deity);

  return (
    <button
      type="button"
      onClick={() =>
        navigate({ to: "/katha/$id", params: { id: String(katha.id) } })
      }
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 active:scale-95 relative overflow-hidden hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: "linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)",
        border: "2px solid #FFD700",
        boxShadow: "0 4px 15px rgba(255,215,0,0.2)",
      }}
    >
      {/* Decorative corner */}
      <div
        className="absolute top-0 right-0 w-10 h-10 opacity-20"
        style={{
          background: "linear-gradient(225deg, #C0392B, transparent)",
          borderRadius: "0 0 0 100%",
        }}
      />

      <div className="flex items-start gap-3">
        {/* Deity Emoji */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #FFF3D4, #FFE0A0)",
            border: "2px solid #FFD700",
          }}
        >
          {deityEmoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-devanagari font-bold text-base leading-tight mb-1"
            style={{ color: "#8B3A00" }}
          >
            {katha.title}
          </h3>
          <p
            className="font-devanagari text-xs leading-relaxed line-clamp-2 mb-2"
            style={{ color: "#A0522D" }}
          >
            {katha.hindiText.substring(0, 90)}...
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(255,107,0,0.12)",
                color: "#FF6B00",
                border: "1px solid rgba(255,107,0,0.3)",
              }}
            >
              {categoryLabel}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(192,57,43,0.1)",
                color: "#C0392B",
                border: "1px solid rgba(192,57,43,0.25)",
              }}
            >
              {katha.deity}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white"
          style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}
        >
          ›
        </div>
      </div>
    </button>
  );
}
