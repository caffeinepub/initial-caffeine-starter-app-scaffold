import React, { useState, useEffect } from 'react';
import { Sun, Moon, CheckCircle, Circle, Calendar } from 'lucide-react';

function getBrahmaMuhurat(): { start: string; end: string } {
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(6, 0, 0, 0);
  const brahmaMuhuratStart = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const brahmaMuhuratEnd = new Date(sunrise.getTime() - 48 * 60 * 1000);

  const fmt = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return { start: fmt(brahmaMuhuratStart), end: fmt(brahmaMuhuratEnd) };
}

interface CountdownInfo {
  name: string;
  date: Date;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeCountdown(targetDate: Date, name: string): CountdownInfo {
  const now = new Date();
  // Target is start of the day
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { name, date: targetDate, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { name, date: targetDate, days, hours, minutes, seconds };
}

function getNextEkadashiDate(): { name: string; date: Date } {
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
    if (d.getTime() >= today.getTime()) {
      return { name: e.name, date: e.date };
    }
  }

  return { name: 'एकादशी', date: new Date(2027, 0, 15) };
}

function getNextShivratriDate(): { name: string; date: Date } {
  const shivratriDates = [
    { name: 'महाशिवरात्रि', date: new Date(2026, 1, 17) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 2, 18) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 3, 17) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 4, 16) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 5, 15) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 6, 14) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 7, 13) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 8, 11) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 9, 11) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 10, 9) },
    { name: 'मासिक शिवरात्रि', date: new Date(2026, 11, 9) },
    { name: 'महाशिवरात्रि', date: new Date(2027, 1, 6) },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const s of shivratriDates) {
    const d = new Date(s.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() >= today.getTime()) {
      return { name: s.name, date: s.date };
    }
  }

  return { name: 'शिवरात्रि', date: new Date(2027, 1, 6) };
}

function getNavratriProgress(): { current: number; total: number; name: string; active: boolean } {
  const navratriStart = new Date(2026, 2, 19);
  const navratriEnd = new Date(2026, 2, 28);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(navratriStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(navratriEnd);
  end.setHours(0, 0, 0, 0);

  if (today >= start && today <= end) {
    const daysPassed = Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return { current: daysPassed, total: 9, name: 'चैत्र नवरात्रि', active: true };
  }

  const sharadStart = new Date(2026, 9, 13);
  const sharadEnd = new Date(2026, 9, 22);
  sharadStart.setHours(0, 0, 0, 0);
  sharadEnd.setHours(0, 0, 0, 0);

  if (today >= sharadStart && today <= sharadEnd) {
    const daysPassed = Math.round((today.getTime() - sharadStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return { current: daysPassed, total: 9, name: 'शारदीय नवरात्रि', active: true };
  }

  return { current: 0, total: 9, name: 'नवरात्रि', active: false };
}

function getFastingKey(): string {
  const today = new Date();
  return `fasting_checkin_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function VratModeDashboard() {
  const [fastingChecked, setFastingChecked] = useState(false);
  const [ekadashiCountdown, setEkadashiCountdown] = useState<CountdownInfo | null>(null);
  const [shivratriCountdown, setShivratriCountdown] = useState<CountdownInfo | null>(null);

  const brahmaMuhurat = getBrahmaMuhurat();
  const navratri = getNavratriProgress();

  // Load fasting state from localStorage
  useEffect(() => {
    const key = getFastingKey();
    const stored = localStorage.getItem(key);
    setFastingChecked(stored === 'true');
  }, []);

  // Live countdown timer — updates every second
  useEffect(() => {
    const tick = () => {
      const ekadashi = getNextEkadashiDate();
      const shivratri = getNextShivratriDate();
      setEkadashiCountdown(computeCountdown(ekadashi.date, ekadashi.name));
      setShivratriCountdown(computeCountdown(shivratri.date, shivratri.name));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFastingToggle = () => {
    const key = getFastingKey();
    const newValue = !fastingChecked;
    setFastingChecked(newValue);
    localStorage.setItem(key, String(newValue));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Brahma Muhurat */}
      <div className="bg-gradient-to-r from-indigo-950 to-purple-950 rounded-xl p-4 border border-indigo-800">
        <div className="flex items-center gap-2 mb-2">
          <Moon className="w-5 h-5 text-indigo-300" />
          <h3 className="text-indigo-200 font-semibold text-sm">ब्रह्म मुहूर्त</h3>
        </div>
        <p className="text-white font-bold text-lg">
          {brahmaMuhurat.start} – {brahmaMuhurat.end}
        </p>
        <p className="text-indigo-300 text-xs mt-1">ध्यान और साधना का सर्वोत्तम समय</p>
      </div>

      {/* Daily Fasting Check-in */}
      <div className="bg-gradient-to-r from-amber-950 to-orange-950 rounded-xl p-4 border border-amber-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-amber-200 font-semibold text-sm">आज का उपवास</h3>
              <p className="text-amber-400 text-xs">
                {new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <button
            onClick={handleFastingToggle}
            aria-label={fastingChecked ? 'उपवास हटाएं' : 'उपवास पूर्ण करें'}
            className="flex items-center gap-2 transition-all active:scale-95"
          >
            {fastingChecked ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <Circle className="w-8 h-8 text-amber-600" />
            )}
          </button>
        </div>
        {fastingChecked ? (
          <p className="text-green-400 text-xs mt-2 font-medium">✓ आज का उपवास पूर्ण हुआ। जय माता दी! 🙏</p>
        ) : (
          <p className="text-amber-400 text-xs mt-2">उपवास पूर्ण होने पर चेक करें</p>
        )}
      </div>

      {/* Navratri Progress */}
      <div className="bg-gradient-to-r from-rose-950 to-pink-950 rounded-xl p-4 border border-rose-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌸</span>
          <h3 className="text-rose-200 font-semibold text-sm">{navratri.name}</h3>
          {navratri.active && (
            <span className="ml-auto bg-rose-700 text-rose-100 text-xs px-2 py-0.5 rounded-full">
              चल रहा है
            </span>
          )}
        </div>
        {navratri.active ? (
          <>
            <div className="flex justify-between text-xs text-rose-300 mb-1">
              <span>दिन {navratri.current}</span>
              <span>{navratri.total} दिन</span>
            </div>
            <div className="w-full bg-rose-900 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-400 to-pink-400 h-2 rounded-full transition-all"
                style={{ width: `${(navratri.current / navratri.total) * 100}%` }}
              />
            </div>
            <p className="text-rose-300 text-xs mt-2">
              {navratri.total - navratri.current} दिन शेष हैं
            </p>
          </>
        ) : (
          <p className="text-rose-300 text-sm">
            अगली नवरात्रि की प्रतीक्षा करें 🙏
          </p>
        )}
      </div>

      {/* Live Countdown Tiles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Next Ekadashi */}
        <div className="bg-gradient-to-b from-emerald-950 to-teal-950 rounded-xl p-3 border border-emerald-800">
          <div className="flex items-center gap-1 mb-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-xs font-medium">एकादशी</span>
          </div>
          {ekadashiCountdown && (
            <>
              {ekadashiCountdown.days > 0 ? (
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-white font-bold text-2xl leading-none">{ekadashiCountdown.days}</span>
                  <span className="text-emerald-400 text-xs mb-0.5">दिन</span>
                </div>
              ) : null}
              <div className="flex items-center gap-1 text-emerald-300 text-xs font-mono">
                <span>{pad(ekadashiCountdown.hours)}h</span>
                <span className="text-emerald-600">:</span>
                <span>{pad(ekadashiCountdown.minutes)}m</span>
                <span className="text-emerald-600">:</span>
                <span>{pad(ekadashiCountdown.seconds)}s</span>
              </div>
              <p className="text-emerald-300 text-xs mt-1.5 leading-tight">{ekadashiCountdown.name}</p>
              <p className="text-emerald-600 text-xs">{formatDate(ekadashiCountdown.date)}</p>
            </>
          )}
        </div>

        {/* Next Shivratri */}
        <div className="bg-gradient-to-b from-slate-900 to-gray-950 rounded-xl p-3 border border-slate-700">
          <div className="flex items-center gap-1 mb-2">
            <Moon className="w-4 h-4 text-slate-300" />
            <span className="text-slate-300 text-xs font-medium">शिवरात्रि</span>
          </div>
          {shivratriCountdown && (
            <>
              {shivratriCountdown.days > 0 ? (
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-white font-bold text-2xl leading-none">{shivratriCountdown.days}</span>
                  <span className="text-slate-400 text-xs mb-0.5">दिन</span>
                </div>
              ) : null}
              <div className="flex items-center gap-1 text-slate-300 text-xs font-mono">
                <span>{pad(shivratriCountdown.hours)}h</span>
                <span className="text-slate-600">:</span>
                <span>{pad(shivratriCountdown.minutes)}m</span>
                <span className="text-slate-600">:</span>
                <span>{pad(shivratriCountdown.seconds)}s</span>
              </div>
              <p className="text-slate-300 text-xs mt-1.5 leading-tight">{shivratriCountdown.name}</p>
              <p className="text-slate-600 text-xs">{formatDate(shivratriCountdown.date)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
