import React, { useState, useEffect } from 'react';
import { X, Star, Bell, BookOpen, Zap } from 'lucide-react';

const DISMISS_KEY = 'premium_banner_dismissed';

const benefits = [
  { icon: <Star className="w-4 h-4" />, text: 'विज्ञापन-मुक्त अनुभव' },
  { icon: <Bell className="w-4 h-4" />, text: 'एकादशी व त्योहार रिमाइंडर' },
  { icon: <BookOpen className="w-4 h-4" />, text: 'सभी कथाएँ व आरती अनलॉक' },
  { icon: <Zap className="w-4 h-4" />, text: 'AI गुरु अनलिमिटेड चैट' },
];

export default function PremiumBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    setDismissed(isDismissed);
    setMounted(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  if (!mounted || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-br from-amber-900 to-orange-900 border border-amber-700 rounded-xl p-4 mb-4 shadow-lg overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-2 right-8 text-6xl">🕉️</div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors text-amber-300"
        aria-label="बंद करें"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pr-6">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <h3 className="text-amber-200 font-bold text-base">प्रीमियम सदस्यता</h3>
        <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          ₹99/माह
        </span>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-amber-200">
            <span className="text-amber-400 shrink-0">{benefit.icon}</span>
            <span className="text-xs leading-tight">{benefit.text}</span>
          </div>
        ))}
      </div>

      {/* Upgrade button */}
      <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md text-sm">
        अभी अपग्रेड करें — ₹99/माह
      </button>
    </div>
  );
}
