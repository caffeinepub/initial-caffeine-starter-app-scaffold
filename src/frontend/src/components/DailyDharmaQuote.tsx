import React from "react";
import { useGetDharmaQuote } from "../hooks/useQueries";

const fallbackQuote = {
  hindiText: "कर्म करो, फल की चिंता मत करो।",
  englishText: "Do your duty without attachment to results.",
  author: "भगवद्गीता — Bhagavad Gita",
};

export default function DailyDharmaQuote() {
  const { data: quote, isLoading } = useGetDharmaQuote();

  const displayQuote = quote || fallbackQuote;

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #FFF8E7 0%, #FFF3D4 100%)",
        border: "2px solid #FFD700",
        boxShadow: "0 4px 20px rgba(255,215,0,0.25)",
      }}
    >
      {/* Decorative corner elements */}
      <div
        className="absolute top-2 left-2 text-lg opacity-40"
        style={{ color: "#FFD700" }}
      >
        ✦
      </div>
      <div
        className="absolute top-2 right-2 text-lg opacity-40"
        style={{ color: "#FFD700" }}
      >
        ✦
      </div>
      <div
        className="absolute bottom-2 left-2 text-lg opacity-40"
        style={{ color: "#FFD700" }}
      >
        ✦
      </div>
      <div
        className="absolute bottom-2 right-2 text-lg opacity-40"
        style={{ color: "#FFD700" }}
      >
        ✦
      </div>

      {/* Lotus watermark */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url(/assets/generated/lotus-bloom.dim_400x400.png)",
          backgroundSize: "200px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Quote icon */}
      <div className="flex justify-center mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{
            background: "linear-gradient(135deg, #FF6B00, #FFD700)",
            color: "white",
          }}
        >
          ❝
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-5 rounded" style={{ background: "#FFE0A0" }} />
          <div
            className="h-4 rounded w-3/4 mx-auto"
            style={{ background: "#FFE0A0" }}
          />
        </div>
      ) : (
        <div className="relative z-10 text-center">
          {/* Hindi Quote */}
          <p
            className="font-devanagari text-lg font-bold leading-relaxed mb-2"
            style={{ color: "#C0392B" }}
          >
            {displayQuote.hindiText}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, #FFD700)",
              }}
            />
            <span style={{ color: "#FFD700" }}>🌸</span>
            <div
              className="flex-1 h-px"
              style={{
                background: "linear-gradient(90deg, #FFD700, transparent)",
              }}
            />
          </div>

          {/* English Translation */}
          <p
            className="font-poppins text-sm italic mb-3"
            style={{ color: "#8B5E3C" }}
          >
            "{displayQuote.englishText}"
          </p>

          {/* Author */}
          <p
            className="font-devanagari text-xs font-semibold"
            style={{ color: "#FF6B00" }}
          >
            — {displayQuote.author}
          </p>
        </div>
      )}
    </div>
  );
}
