import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EkadashiInfo {
  name: string;
  date: Date;
  daysLeft: number;
}

function getNextEkadashiInfo(): EkadashiInfo {
  const ekadashiDates2026 = [
    { name: 'षट्तिला एकादशी', date: new Date(2026, 0, 26) },
    { name: 'जया एकादशी', date: new Date(2026, 1, 10) },
    { name: 'विजया एकादशी', date: new Date(2026, 1, 25) },
    { name: 'आमलकी एकादशी', date: new Date(2026, 2, 11) },
    { name: 'पापमोचनी एकादशी', date: new Date(2026, 2, 26) },
    { name: 'कामदा एकादशी', date: new Date(2026, 3, 10) },
    { name: 'वरुथिनी एकादशी', date: new Date(2026, 3, 25) },
    { name: 'मोहिनी एकादशी', date: new Date(2026, 4, 9) },
    { name: 'अपरा एकादशी', date: new Date(2026, 4, 24) },
    { name: 'निर्जला एकादशी', date: new Date(2026, 5, 8) },
    { name: 'योगिनी एकादशी', date: new Date(2026, 5, 23) },
    { name: 'देवशयनी एकादशी', date: new Date(2026, 6, 7) },
    { name: 'कामिका एकादशी', date: new Date(2026, 6, 22) },
    { name: 'श्रावण पुत्रदा एकादशी', date: new Date(2026, 7, 6) },
    { name: 'अजा एकादशी', date: new Date(2026, 7, 21) },
    { name: 'परिवर्तिनी एकादशी', date: new Date(2026, 8, 4) },
    { name: 'इंदिरा एकादशी', date: new Date(2026, 8, 19) },
    { name: 'पापांकुशा एकादशी', date: new Date(2026, 9, 4) },
    { name: 'रमा एकादशी', date: new Date(2026, 9, 19) },
    { name: 'देवउठनी एकादशी', date: new Date(2026, 10, 2) },
    { name: 'उत्पन्ना एकादशी', date: new Date(2026, 10, 17) },
    { name: 'मोक्षदा एकादशी', date: new Date(2026, 11, 2) },
    { name: 'सफला एकादशी', date: new Date(2026, 11, 17) },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const e of ekadashiDates2026) {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0) {
      return { name: e.name, date: e.date, daysLeft: diff };
    }
  }

  return { name: 'एकादशी', date: new Date(2027, 0, 15), daysLeft: 30 };
}

function getDismissKey(): string {
  const today = new Date();
  return `ekadashi_banner_dismissed_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
}

function getMessage(daysLeft: number, name: string): string {
  if (daysLeft === 0) return `🙏 आज ${name} है — उपवास और भजन का दिन`;
  if (daysLeft === 1) return `🌸 कल ${name} है — तैयारी करें`;
  if (daysLeft <= 3) return `⭐ ${daysLeft} दिन में ${name} — व्रत की तैयारी करें`;
  if (daysLeft <= 7) return `📅 ${daysLeft} दिन बाद ${name}`;
  return `🕉️ अगली एकादशी: ${name} — ${daysLeft} दिन बाद`;
}

export default function EkadashiReminderBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const key = getDismissKey();
    const isDismissed = sessionStorage.getItem(key) === 'true';
    setDismissed(isDismissed);
    setMounted(true);
  }, []);

  const handleDismiss = () => {
    const key = getDismissKey();
    sessionStorage.setItem(key, 'true');
    setDismissed(true);
  };

  if (!mounted || dismissed) return null;

  const ekadashi = getNextEkadashiInfo();

  // Only show banner if Ekadashi is within 7 days
  if (ekadashi.daysLeft > 7) return null;

  const message = getMessage(ekadashi.daysLeft, ekadashi.name);

  return (
    <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl px-4 py-3 mb-4 shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl shrink-0">🕉️</span>
          <p className="text-sm font-medium leading-snug">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
