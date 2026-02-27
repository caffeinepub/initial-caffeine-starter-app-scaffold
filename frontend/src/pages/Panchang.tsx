import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, Clock, Star, AlertTriangle } from 'lucide-react';
import EkadashiReminderBanner from '../components/EkadashiReminderBanner';
import {
  getPanchangData,
  formatTimeIST,
  formatDateReadable,
  getHinduMonth,
  getAyana,
  getPaksha,
  getVikramSamvat,
} from '../lib/panchangEngine';

export default function Panchang() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const panchang = getPanchangData(selectedDate);

  // Derive string values from the panchang object using helper functions
  const hinduMonth = getHinduMonth(selectedDate);
  const ayana = getAyana(selectedDate);
  const paksha = getPaksha(selectedDate);
  const vikramSamvat = getVikramSamvat(selectedDate);

  // Extract string names from panchang object fields
  const tithiName = typeof panchang.tithi === 'string' ? panchang.tithi : (panchang.tithi as any).name ?? String(panchang.tithi);
  const nakshatraName = typeof panchang.nakshatra === 'string' ? panchang.nakshatra : (panchang.nakshatra as any).name ?? String(panchang.nakshatra);
  const yogaName = typeof panchang.yoga === 'string' ? panchang.yoga : (panchang.yoga as any).name ?? String(panchang.yoga);
  const karanaName = typeof panchang.karana === 'string' ? panchang.karana : (panchang.karana as any).name ?? String(panchang.karana);
  const varaName = typeof panchang.vara === 'string' ? panchang.vara : (panchang.vara as any).name ?? String(panchang.vara);

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

  const goToToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
  };

  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  // Build auspicious muhurats from panchang data
  const auspiciousMuhurats: { name: string; start: Date; end: Date }[] = [];
  if (panchang.brahmaMuhurat) {
    const bm = panchang.brahmaMuhurat as any;
    if (bm.start instanceof Date && bm.end instanceof Date) {
      auspiciousMuhurats.push({ name: 'ब्रह्म मुहूर्त', start: bm.start, end: bm.end });
    }
  }
  if (panchang.abhijitMuhurat) {
    const am = panchang.abhijitMuhurat as any;
    if (am.start instanceof Date && am.end instanceof Date) {
      auspiciousMuhurats.push({ name: 'अभिजित मुहूर्त', start: am.start, end: am.end });
    }
  }

  // Build inauspicious periods from panchang data
  const inauspiciousPeriods: { name: string; start: Date; end: Date }[] = [];
  if (panchang.rahuKaal) {
    const rk = panchang.rahuKaal as any;
    if (rk.start instanceof Date && rk.end instanceof Date) {
      inauspiciousPeriods.push({ name: 'राहु काल', start: rk.start, end: rk.end });
    }
  }
  if (panchang.gulikaKaal) {
    const gk = panchang.gulikaKaal as any;
    if (gk.start instanceof Date && gk.end instanceof Date) {
      inauspiciousPeriods.push({ name: 'गुलिका काल', start: gk.start, end: gk.end });
    }
  }
  if (panchang.yamagandaKaal) {
    const yk = panchang.yamagandaKaal as any;
    if (yk.start instanceof Date && yk.end instanceof Date) {
      inauspiciousPeriods.push({ name: 'यमगण्ड काल', start: yk.start, end: yk.end });
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-maroon to-maroon-light px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-white mb-1">पंचांग</h1>
        <p className="text-amber-200 text-sm">हिंदू पंचांग एवं मुहूर्त</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Ekadashi Banner */}
        <EkadashiReminderBanner />

        {/* Date Navigation */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevDay}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <p className="font-bold text-foreground text-base">
                {formatDateReadable(selectedDate)}
              </p>
              <p className="text-muted-foreground text-xs">
                {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {!isToday() && (
                <button
                  onClick={goToToday}
                  className="text-amber-500 text-xs mt-1 underline"
                >
                  आज पर जाएं
                </button>
              )}
            </div>
            <button
              onClick={goToNextDay}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Vikram Samvat & Hindu Month */}
        <div className="bg-gradient-to-r from-amber-900 to-orange-900 rounded-xl p-4 border border-amber-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-amber-400 text-xs font-medium uppercase tracking-wide">विक्रम संवत</p>
              <p className="text-white font-bold text-xl">{vikramSamvat}</p>
            </div>
            <div>
              <p className="text-amber-400 text-xs font-medium uppercase tracking-wide">हिंदू माह</p>
              <p className="text-white font-bold text-base">{hinduMonth}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center mt-3 pt-3 border-t border-amber-700/50">
            <div>
              <p className="text-amber-400 text-xs font-medium uppercase tracking-wide">पक्ष</p>
              <p className="text-white font-semibold text-sm">{paksha}</p>
            </div>
            <div>
              <p className="text-amber-400 text-xs font-medium uppercase tracking-wide">अयन</p>
              <p className="text-white font-semibold text-sm">{ayana}</p>
            </div>
          </div>
        </div>

        {/* Pancha Anga */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <h2 className="text-foreground font-bold text-base mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            पंचांग के पाँच अंग
          </h2>
          <div className="space-y-0">
            {[
              { label: 'तिथि', value: tithiName },
              { label: 'नक्षत्र', value: nakshatraName },
              { label: 'योग', value: yogaName },
              { label: 'करण', value: karanaName },
              { label: 'वार', value: varaName },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-muted-foreground text-sm w-20">{label}</span>
                <span className="text-foreground font-semibold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sunrise / Sunset */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-amber-900 to-orange-900 rounded-xl p-4 border border-amber-700 text-center">
            <Sun className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <p className="text-amber-300 text-xs font-medium uppercase tracking-wide">सूर्योदय</p>
            <p className="text-white font-bold text-lg">{formatTimeIST(panchang.sunrise)}</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-4 border border-indigo-700 text-center">
            <Moon className="w-6 h-6 text-indigo-300 mx-auto mb-1" />
            <p className="text-indigo-300 text-xs font-medium uppercase tracking-wide">सूर्यास्त</p>
            <p className="text-white font-bold text-lg">{formatTimeIST(panchang.sunset)}</p>
          </div>
        </div>

        {/* Auspicious Muhurats */}
        {auspiciousMuhurats.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <h2 className="text-foreground font-bold text-base mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" />
              शुभ मुहूर्त
            </h2>
            <div className="space-y-0">
              {auspiciousMuhurats.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="text-foreground text-sm font-medium">{m.name}</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                    {formatTimeIST(m.start)} – {formatTimeIST(m.end)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inauspicious Periods */}
        {inauspiciousPeriods.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <h2 className="text-foreground font-bold text-base mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              अशुभ काल
            </h2>
            <div className="space-y-0">
              {inauspiciousPeriods.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="text-foreground text-sm font-medium">{p.name}</span>
                  <span className="text-red-500 dark:text-red-400 text-sm font-semibold">
                    {formatTimeIST(p.start)} – {formatTimeIST(p.end)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
