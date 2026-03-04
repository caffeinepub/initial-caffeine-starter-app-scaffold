import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function Loader({ size = "md", text }: LoaderProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <img
          src="/assets/generated/mandala-bg.dim_512x512.png"
          alt="Loading..."
          className={`${sizes[size]} animate-mandala-spin opacity-70`}
          style={{ filter: "sepia(1) saturate(3) hue-rotate(10deg)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gold-500 text-lg">🕉️</span>
        </div>
      </div>
      {text && (
        <p className="text-saffron-600 font-heading text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
