import React, { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Navigation, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TEMPLES } from '../lib/staticData';

// Sacred portal link
const SACRED_PORTAL_URL =
  'https://www.effectivegatecpm.com/pvpu75e0k9?key=8dc5b104367e4855c6857460c362d548';

// Golden ripple animation component
function GoldenRippleAnimation({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border-2 border-gold/70"
          style={{
            width: '60px',
            height: '60px',
            animation: `sacredRippleOut 800ms ease-out ${i * 150}ms both`,
          }}
        />
      ))}
      {/* Om burst particles */}
      {['ॐ', '🌸', '✨', '🪔', '🌺'].map((symbol, i) => (
        <span
          key={`sym-${i}`}
          className="absolute text-lg"
          style={{
            animation: `omBurst 700ms ease-out ${i * 80}ms both`,
            transformOrigin: 'center',
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
}

export default function Mandir() {
  const [portalAnimating, setPortalAnimating] = useState(false);

  const handleOpenMaps = () => {
    window.open('https://www.google.com/maps/search/Hindu+temples+near+me', '_blank');
  };

  const handlePortalClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Trigger animation
    setPortalAnimating(true);
    // Animation completes in ~800ms; reset after
    setTimeout(() => setPortalAnimating(false), 900);
    // Allow the link to open naturally (don't prevent default)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes sacredRippleOut {
          0% { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(4.5); opacity: 0; }
        }
        @keyframes omBurst {
          0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
          60% { opacity: 1; }
          100% {
            transform: translate(
              calc(cos(var(--angle, 0deg)) * 60px),
              calc(sin(var(--angle, 0deg)) * 60px)
            ) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes portalPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255, 153, 0, 0); }
        }
        .portal-card-glow {
          animation: portalPulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/diya-icon.dim_128x128.png"
          alt=""
          className="absolute right-4 top-4 w-16 h-16 opacity-30"
        />
        <div className="bg-gradient-to-b from-saffron to-saffron/80 px-4 pt-6 pb-8 text-white">
          <h1 className="font-devanagari text-2xl font-bold">🛕 मंदिर खोजें</h1>
          <p className="text-sm font-body opacity-90 mt-1">Mandir Finder</p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-6">
        {/* GPS Section */}
        <div className="bg-white rounded-2xl border-2 border-saffron/20 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
              <Navigation className="h-5 w-5 text-saffron" />
            </div>
            <div className="flex-1">
              <h3 className="font-devanagari text-sm font-bold text-foreground">
                नजदीकी मंदिर खोजें
              </h3>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Find Hindu temples near your current location using Google Maps
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                📍 Enable location in Google Maps for accurate results
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenMaps}
            className="w-full mt-3 bg-saffron hover:bg-saffron-dark text-white font-body gap-2"
          >
            <MapPin className="h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>

        {/* ✨ Sacred Temple Portal Link Card */}
        <div className="relative">
          <a
            href={SACRED_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handlePortalClick}
            className="block relative overflow-hidden rounded-2xl portal-card-glow"
            style={{ textDecoration: 'none' }}
          >
            {/* Gradient background */}
            <div className="bg-gradient-to-br from-saffron via-gold/80 to-amber-600 p-5 text-white">
              {/* Decorative mandala bg */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'url(/assets/generated/mandala-bg-tile.dim_512x512.png)',
                  backgroundSize: '200px',
                  backgroundRepeat: 'repeat',
                }}
              />

              <div className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 border-2 border-white/30 shadow-lg">
                  🛕
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold bg-white/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
                      Sacred Portal
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  </div>
                  <h3 className="font-devanagari text-lg font-bold leading-tight">
                    पवित्र मंदिर द्वार
                  </h3>
                  <p className="text-sm font-body opacity-90 mt-0.5">
                    Visit Sacred Temple Portal
                  </p>
                  <p className="text-xs opacity-75 font-body mt-1 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Opens in new tab · Click to enter
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Bottom decorative strip */}
              <div className="relative mt-3 pt-3 border-t border-white/20 flex items-center justify-center gap-2 text-xs opacity-80">
                <span>🌸</span>
                <span className="font-devanagari">जय श्री राम · हर हर महादेव · जय माता दी</span>
                <span>🌸</span>
              </div>
            </div>
          </a>

          {/* Animation overlay */}
          <GoldenRippleAnimation active={portalAnimating} />
        </div>

        {/* Famous Temples */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🛕</span>
            <h2 className="font-devanagari text-lg font-bold text-foreground">प्रसिद्ध मंदिर</h2>
            <span className="text-xs text-muted-foreground font-body ml-auto">Famous Temples</span>
          </div>

          <div className="space-y-3">
            {TEMPLES.map((temple, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-gold/20 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron/20 to-gold/20 flex items-center justify-center text-2xl shrink-0">
                    {temple.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-devanagari text-sm font-bold text-foreground leading-tight">
                      {temple.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-saffron shrink-0" />
                      <p className="text-xs text-muted-foreground font-body truncate">
                        {temple.location}
                      </p>
                    </div>
                    <p className="text-xs text-foreground/70 font-body mt-1 leading-relaxed">
                      {temple.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(temple.liveDarshanUrl, '_blank')}
                    className="flex-1 gap-1.5 border-saffron/30 text-saffron hover:bg-saffron/10 font-body text-xs"
                  >
                    <span>📺</span>
                    Live Darshan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(temple.mapsUrl, '_blank')}
                    className="flex-1 gap-1.5 border-gold/40 text-foreground/70 hover:bg-gold/10 font-body text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Google Maps
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-saffron/5 rounded-2xl border border-saffron/20 p-3">
          <p className="text-xs text-foreground/70 font-body text-center">
            🙏 <span className="font-semibold">Tip:</span> For live darshan timings, visit the
            official temple websites. Most temples stream morning and evening aarti.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Sanatan Pro — Built with{' '}
            <span className="text-saffron">🙏</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'sanatan-pro'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
