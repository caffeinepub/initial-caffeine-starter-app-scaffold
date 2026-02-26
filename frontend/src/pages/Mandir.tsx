import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TEMPLES } from '../lib/staticData';

export default function Mandir() {
  const handleOpenMaps = () => {
    window.open('https://www.google.com/maps/search/Hindu+temples+near+me', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
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
            🙏 <span className="font-semibold">Tip:</span> For live darshan timings, visit the official temple websites.
            Most temples stream morning and evening aarti.
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
