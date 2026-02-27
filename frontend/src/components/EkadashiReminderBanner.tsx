import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ekadashiDates2026 = [
  new Date('2026-01-10'),
  new Date('2026-01-26'),
  new Date('2026-02-09'),
  new Date('2026-02-24'),
  new Date('2026-03-11'),
  new Date('2026-03-25'),
  new Date('2026-04-09'),
  new Date('2026-04-24'),
  new Date('2026-05-09'),
  new Date('2026-05-23'),
  new Date('2026-06-07'),
  new Date('2026-06-22'),
  new Date('2026-07-07'),
  new Date('2026-07-21'),
  new Date('2026-08-05'),
  new Date('2026-08-20'),
  new Date('2026-09-04'),
  new Date('2026-09-18'),
  new Date('2026-10-03'),
  new Date('2026-10-18'),
  new Date('2026-11-02'),
  new Date('2026-11-16'),
  new Date('2026-12-01'),
  new Date('2026-12-16'),
  new Date('2026-12-31'),
];

function getNextEkadashi(): { date: Date; daysLeft: number } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const d of ekadashiDates2026) {
    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (diff >= 0 && diff <= 7) return { date: d, daysLeft: diff };
  }
  return null;
}

function getMessage(daysLeft: number): string {
  if (daysLeft === 0) return '🙏 आज एकादशी है! व्रत रखें और भगवान विष्णु की पूजा करें।';
  if (daysLeft === 1) return '⭐ कल एकादशी है! व्रत की तैयारी करें।';
  if (daysLeft <= 3) return `✨ ${daysLeft} दिन बाद एकादशी है। व्रत का संकल्प लें।`;
  return `📅 ${daysLeft} दिन बाद एकादशी है।`;
}

export default function EkadashiReminderBanner() {
  const [dismissed, setDismissed] = useState(false);
  const next = getNextEkadashi();

  useEffect(() => {
    const key = `ekadashi-dismissed-${new Date().toDateString()}`;
    if (sessionStorage.getItem(key)) setDismissed(true);
  }, []);

  if (!next || dismissed) return null;

  const handleDismiss = () => {
    const key = `ekadashi-dismissed-${new Date().toDateString()}`;
    sessionStorage.setItem(key, '1');
    setDismissed(true);
  };

  return (
    <div
      className="mx-4 mt-2 rounded-xl border p-3 flex items-center gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))',
        borderColor: 'rgba(245,158,11,0.35)',
        boxShadow: '0 4px 16px rgba(245,158,11,0.1)',
      }}
    >
      <span className="text-xl flex-shrink-0">🌸</span>
      <p className="flex-1 text-sm font-medium font-devanagari" style={{ color: '#fef3c7' }}>
        {getMessage(next.daysLeft)}
      </p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
