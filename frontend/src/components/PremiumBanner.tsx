import { useState } from 'react';
import { X, Crown, Zap, Star, Shield, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PremiumBanner() {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('premiumBannerDismissed') === 'true';
  });

  const handleDismiss = () => {
    sessionStorage.setItem('premiumBannerDismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  const benefits = [
    { icon: Zap, text: 'Ad-free experience' },
    { icon: Music, text: 'Exclusive Aartis & Bhajans' },
    { icon: Star, text: 'Leaderboard Gold Badge' },
    { icon: Shield, text: 'Early access to new features' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gold/20 to-saffron/10 rounded-2xl border-2 border-gold/40 p-4 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-12 translate-x-12" />
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5 text-gold-dark" />
          <h3 className="font-devanagari text-base font-bold text-foreground">Sanatan Pro Premium</h3>
          <span className="text-xs bg-gold text-foreground px-2 py-0.5 rounded-full font-body font-semibold">
            UPGRADE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-saffron shrink-0" />
              <span className="text-xs font-body text-foreground/80">{text}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-saffron to-gold text-white font-body font-semibold hover:opacity-90 border-0 shadow-gold"
          size="sm"
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium — ₹99/month
        </Button>
      </div>
    </div>
  );
}
