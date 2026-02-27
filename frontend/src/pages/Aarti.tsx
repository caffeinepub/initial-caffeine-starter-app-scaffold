import React from 'react';
import { Link } from '@tanstack/react-router';
import { AARTIS } from '../lib/staticData';

export default function Aarti() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-maroon to-maroon-light px-4 pt-6 pb-10">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/diya-glow.dim_256x256.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center">
          <p className="text-amber-300 text-sm font-medium tracking-widest uppercase mb-1">
            🪔 दिव्य आरती
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">आरती संग्रह</h1>
          <p className="text-amber-200 text-sm">Aarti Collection</p>
          <p className="text-amber-300/80 text-xs mt-2">
            गणेश, शिव, विष्णु, दुर्गा, हनुमान और लक्ष्मी की पावन आरतियाँ
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-5">
        {/* Decorative divider */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
          <span className="text-amber-600 text-sm">🕉️</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
        </div>

        {/* Aarti Grid */}
        <div className="grid grid-cols-2 gap-4">
          {AARTIS.map((aarti) => (
            <Link
              key={aarti.id}
              to="/aarti/$id"
              params={{ id: aarti.id }}
              className="group relative overflow-hidden rounded-2xl border border-amber-800/20 bg-card shadow-sm hover:shadow-md hover:border-amber-600/40 transition-all duration-200 active:scale-95"
            >
              {/* Card gradient background */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle at 30% 30%, oklch(0.82 0.18 80), transparent 70%)`,
                }}
              />

              <div className="relative p-4 flex flex-col items-center gap-3">
                {/* Emoji in glowing circle */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 28))',
                    border: '2px solid oklch(0.82 0.18 80 / 0.3)',
                    boxShadow: '0 0 12px oklch(0.82 0.18 80 / 0.2)',
                  }}
                >
                  {aarti.emoji}
                </div>

                {/* Aarti name */}
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {aarti.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    पूर्ण आरती
                  </p>
                </div>

                {/* Read button */}
                <div
                  className="w-full text-center py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                  style={{
                    background: 'oklch(0.82 0.18 80 / 0.12)',
                    color: 'oklch(0.65 0.18 60)',
                    border: '1px solid oklch(0.82 0.18 80 / 0.2)',
                  }}
                >
                  🪔 आरती पढ़ें
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info card */}
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'linear-gradient(135deg, oklch(0.35 0.14 20 / 0.6), oklch(0.42 0.15 28 / 0.6))',
            border: '1px solid oklch(0.82 0.18 80 / 0.2)',
          }}
        >
          <p className="text-amber-300 text-xs leading-relaxed">
            🙏 प्रतिदिन आरती करने से मन शुद्ध होता है और ईश्वर की कृपा प्राप्त होती है।
          </p>
          <p className="text-amber-500/70 text-xs mt-1">
            Daily aarti purifies the mind and invites divine blessings.
          </p>
        </div>
      </div>
    </div>
  );
}
