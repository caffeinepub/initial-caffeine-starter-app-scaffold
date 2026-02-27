import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Play, ChevronRight } from 'lucide-react';
import EkadashiReminderBanner from '../components/EkadashiReminderBanner';
import PremiumBanner from '../components/PremiumBanner';
import DailyDharmaQuote from '../components/DailyDharmaQuote';
import { getTithi, getNakshatra, getVara } from '../lib/panchangEngine';

const TODAY_SHLOKA = {
  sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
  meaning: 'जब-जब धर्म की हानि होती है और अधर्म बढ़ता है, तब-तब मैं स्वयं को प्रकट करता हूँ।',
  source: 'भगवद्गीता ४.७',
};

const AARTI_PREVIEW = [
  { emoji: '🐘', name: 'गणेश' },
  { emoji: '🔱', name: 'शिव' },
  { emoji: '🪷', name: 'विष्णु' },
  { emoji: '🌺', name: 'दुर्गा' },
  { emoji: '🙏', name: 'हनुमान' },
  { emoji: '✨', name: 'लक्ष्मी' },
];

export default function Home() {
  const navigate = useNavigate();
  const today = new Date();
  const tithi = getTithi(today);
  const nakshatra = getNakshatra(today);
  const vara = getVara(today);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-maroon to-maroon-light px-4 pt-6 pb-10">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/lotus-hero.dim_1200x400.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center">
          <p className="text-amber-300 text-sm font-medium tracking-widest uppercase mb-1">
            🕉️ जय श्री राम
          </p>
          <h1 className="text-3xl font-bold text-white mb-1">
            हरि ॐ
          </h1>
          <p className="text-amber-200 text-sm">
            {today.toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-5">
        {/* Ekadashi Reminder Banner */}
        <EkadashiReminderBanner />

        {/* Panchang Strip */}
        <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
          <p className="text-xs text-muted-foreground text-center mb-2 font-medium tracking-wide uppercase">
            आज का पंचांग
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">तिथि</p>
              <p className="text-sm font-semibold text-foreground">{tithi}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">नक्षत्र</p>
              <p className="text-sm font-semibold text-foreground">{nakshatra}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">वार</p>
              <p className="text-sm font-semibold text-foreground">{vara}</p>
            </div>
          </div>
        </div>

        {/* Premium Banner */}
        <PremiumBanner />

        {/* Today's Shloka */}
        <div className="bg-gradient-to-br from-maroon to-maroon-light border border-amber-800/30 rounded-xl p-4 shadow-sm">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wide mb-2">
            आज का श्लोक
          </p>
          <p className="text-amber-100 text-sm font-medium leading-relaxed mb-2 italic">
            {TODAY_SHLOKA.sanskrit}
          </p>
          <p className="text-amber-300 text-xs leading-relaxed mb-1">
            {TODAY_SHLOKA.meaning}
          </p>
          <p className="text-amber-500 text-xs text-right">— {TODAY_SHLOKA.source}</p>
        </div>

        {/* Dharma Quote */}
        <DailyDharmaQuote />

        {/* Aarti Section Teaser */}
        <button
          onClick={() => navigate({ to: '/aarti' })}
          className="w-full text-left"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-4 shadow-md"
            style={{
              background: 'linear-gradient(135deg, oklch(0.35 0.14 20), oklch(0.45 0.16 28))',
              border: '1px solid oklch(0.82 0.18 80 / 0.25)',
            }}
          >
            {/* Decorative diya glow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
              <img
                src="/assets/generated/diya-glow.dim_200x200.png"
                alt=""
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-amber-400 text-xs font-medium uppercase tracking-wide mb-0.5">
                    🪔 आरती संग्रह
                  </p>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    दिव्य आरतियाँ
                  </h3>
                  <p className="text-amber-300 text-xs mt-0.5">
                    Aarti Collection
                  </p>
                </div>
                <ChevronRight className="text-amber-400 w-5 h-5 shrink-0" />
              </div>

              {/* Deity emoji row */}
              <div className="flex items-center gap-2 mb-3">
                {AARTI_PREVIEW.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                      style={{
                        background: 'oklch(0.82 0.18 80 / 0.12)',
                        border: '1px solid oklch(0.82 0.18 80 / 0.25)',
                      }}
                    >
                      {item.emoji}
                    </div>
                    <span className="text-amber-400/70" style={{ fontSize: '0.5rem' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-amber-300/80 text-xs">
                गणेश, शिव, विष्णु, दुर्गा, हनुमान और लक्ष्मी की पूर्ण आरतियाँ
              </p>

              <div className="flex items-center gap-1 mt-2 text-amber-300 text-xs font-medium">
                <span>🪔</span>
                <span>सभी आरतियाँ देखें</span>
              </div>
            </div>
          </div>
        </button>

        {/* Kathayen CTA */}
        <Link to="/kathayen">
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-800 to-orange-800 rounded-xl p-4 shadow-md">
            <div className="absolute right-0 top-0 bottom-0 w-24 opacity-20">
              <img
                src="/assets/generated/kathayen-banner.dim_1200x400.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative">
              <p className="text-amber-200 text-xs font-medium uppercase tracking-wide mb-1">
                📖 कथाएँ
              </p>
              <h3 className="text-white font-bold text-lg mb-1">पवित्र कथाएँ पढ़ें</h3>
              <p className="text-amber-300 text-xs">
                रामायण, महाभारत, व्रत कथाएँ और कृष्ण लीला
              </p>
              <div className="flex items-center gap-1 mt-2 text-amber-300 text-xs font-medium">
                <Play className="w-3 h-3" />
                <span>अभी पढ़ें</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
