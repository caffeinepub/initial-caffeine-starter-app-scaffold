import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getPanchangData,
  formatTimeIST,
  formatDateReadable,
  getTithi,
  getNakshatra,
  getVara,
  getYoga,
  getKarana,
  getPaksha,
} from '../lib/panchangEngine';

export default function Panchang() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const panchang = getPanchangData(selectedDate);

  const goToPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const goToNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const goToToday = () => setSelectedDate(new Date());

  // Use individual string-returning functions for typed panchang fields
  const tithi = getTithi(selectedDate);
  const nakshatra = getNakshatra(selectedDate);
  const vara = getVara(selectedDate);
  const yoga = getYoga(selectedDate);
  const karana = getKarana(selectedDate);
  const paksha = getPaksha(selectedDate);

  const panchangFields = [
    { label: 'तिथि', value: tithi, emoji: '🌙' },
    { label: 'नक्षत्र', value: nakshatra, emoji: '⭐' },
    { label: 'वार', value: vara, emoji: '📅' },
    { label: 'योग', value: yoga, emoji: '🕉️' },
    { label: 'करण', value: karana, emoji: '🌿' },
    { label: 'पक्ष', value: paksha, emoji: '☀️' },
  ];

  const fmtPeriodTime = (val: unknown): string => {
    if (val instanceof Date) return formatTimeIST(val);
    if (typeof val === 'number') return formatTimeIST(new Date(val));
    return String(val ?? '—');
  };

  const panchangAny = panchang as any;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)' }}>

      {/* Hero Banner */}
      <section className="relative overflow-hidden" style={{ minHeight: '140px' }}>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 50%, #FFD700 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-10 animate-sacred-spin"
          style={{
            backgroundImage: 'url(/assets/generated/mandala-bg.dim_512x512.png)',
            backgroundSize: '300px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="relative z-10 px-5 py-6 text-center">
          <div className="text-3xl mb-2">📅</div>
          <h1
            className="font-devanagari text-white text-2xl font-bold"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            पंचांग
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Hindu Calendar & Panchang
          </p>
        </div>
      </section>

      {/* Date Navigation */}
      <div className="px-4 py-4">
        <div
          className="flex items-center justify-between rounded-2xl p-3"
          style={{
            background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 15px rgba(255,215,0,0.2)',
          }}
        >
          <button
            onClick={goToPrevDay}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #FFD700)', color: 'white' }}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center flex-1">
            <div className="font-devanagari font-bold text-base" style={{ color: '#8B3A00' }}>
              {formatDateReadable(selectedDate)}
            </div>
            <button
              onClick={goToToday}
              className="text-xs mt-0.5 px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,107,0,0.1)',
                color: '#FF6B00',
                border: '1px solid rgba(255,107,0,0.3)',
              }}
            >
              आज
            </button>
          </div>

          <button
            onClick={goToNextDay}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #FFD700)', color: 'white' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Panchang Fields */}
      <section className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full" style={{ background: '#FF6B00' }} />
          <h2 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
            पंचांग विवरण
          </h2>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {panchangFields.map((field) => (
            <div
              key={field.label}
              className="rounded-xl p-3"
              style={{
                background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
                border: '1.5px solid #FFD700',
                boxShadow: '0 2px 8px rgba(255,215,0,0.15)',
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{field.emoji}</span>
                <span className="font-devanagari text-xs font-semibold" style={{ color: '#FF6B00' }}>
                  {field.label}
                </span>
              </div>
              <div className="font-devanagari text-sm font-bold" style={{ color: '#5D2E0C' }}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sunrise / Sunset */}
      <section className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full" style={{ background: '#FFD700' }} />
          <h2 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
            सूर्योदय / सूर्यास्त
          </h2>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
              border: '1.5px solid #FFD700',
            }}
          >
            <div className="text-2xl mb-1">🌅</div>
            <div className="font-devanagari text-xs font-semibold mb-1" style={{ color: '#FF6B00' }}>
              सूर्योदय
            </div>
            <div className="font-poppins text-sm font-bold" style={{ color: '#C0392B' }}>
              {fmtPeriodTime(panchangAny.sunrise)}
            </div>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
              border: '1.5px solid #FFD700',
            }}
          >
            <div className="text-2xl mb-1">🌇</div>
            <div className="font-devanagari text-xs font-semibold mb-1" style={{ color: '#FF6B00' }}>
              सूर्यास्त
            </div>
            <div className="font-poppins text-sm font-bold" style={{ color: '#C0392B' }}>
              {fmtPeriodTime(panchangAny.sunset)}
            </div>
          </div>
        </div>
      </section>

      {/* Muhurat */}
      {panchangAny.auspiciousPeriods && panchangAny.auspiciousPeriods.length > 0 && (
        <section className="px-4 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 rounded-full" style={{ background: '#C0392B' }} />
            <h2 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
              शुभ मुहूर्त
            </h2>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
          </div>

          <div className="space-y-2">
            {panchangAny.auspiciousPeriods.map((period: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{
                  background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
                  border: '1.5px solid #FFD700',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span className="font-devanagari text-sm font-semibold" style={{ color: '#8B3A00' }}>
                    {period.name}
                  </span>
                </div>
                <span className="text-xs" style={{ color: '#C0392B' }}>
                  {fmtPeriodTime(period.start)} – {fmtPeriodTime(period.end)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="px-4 py-6 text-center" style={{ borderTop: '1px solid #FFD700' }}>
        <p className="text-xs" style={{ color: '#A0522D' }}>
          🙏 ॐ नमः शिवाय 🙏
        </p>
        <p className="text-xs mt-2" style={{ color: '#C0A060' }}>
          Built with{' '}
          <span style={{ color: '#FF6B00' }}>❤️</span>
          {' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FF6B00', textDecoration: 'underline' }}
          >
            caffeine.ai
          </a>
          {' '}© {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
