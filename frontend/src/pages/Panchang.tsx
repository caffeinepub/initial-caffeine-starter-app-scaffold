import { useState, useMemo } from 'react';
import { Switch } from '@/components/ui/switch';
import { Bell, Sun, Moon, ChevronLeft, ChevronRight, MapPin, Star, Calendar } from 'lucide-react';
import { useGetFestivals } from '../hooks/useQueries';
import { getPanchangData, formatTimeIST, formatDateReadable } from '../lib/panchangEngine';

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const festDate = new Date(dateStr);
  festDate.setHours(0, 0, 0, 0);
  return Math.ceil((festDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function InfoRow({
  icon,
  label,
  value,
  valueClass = '',
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gold/20 last:border-0">
      <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-body">{label}</p>
        <p className={`text-sm font-bold font-devanagari truncate ${valueClass || 'text-foreground'}`}>
          {value}
        </p>
        {subValue && <p className="text-xs text-muted-foreground font-body">{subValue}</p>}
      </div>
    </div>
  );
}

function TimeRangeRow({
  icon,
  label,
  start,
  end,
  valueClass = '',
}: {
  icon: React.ReactNode;
  label: string;
  start: Date;
  end: Date;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gold/20 last:border-0">
      <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-body">{label}</p>
        <p className={`text-sm font-bold font-body ${valueClass || 'text-foreground'}`}>
          {formatTimeIST(start)} – {formatTimeIST(end)}
        </p>
      </div>
    </div>
  );
}

export default function Panchang() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [ekadashiReminder, setEkadashiReminder] = useState(() => {
    return localStorage.getItem('ekadashiReminder') === 'true';
  });

  const { data: festivals } = useGetFestivals();

  // Compute all panchang data for the selected date
  const panchang = useMemo(() => getPanchangData(selectedDate), [selectedDate]);

  const upcomingFestivals = festivals
    ? festivals
        .map(f => ({ ...f, daysUntil: getDaysUntil(f.date) }))
        .filter(f => f.daysUntil >= 0)
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 3)
    : [];

  const isToday = (() => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  })();

  function prevDay() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  }

  function nextDay() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  }

  function goToToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-saffron to-saffron/80 px-4 pt-6 pb-10 text-white">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-devanagari text-2xl font-bold">🗓️ पंचांग</h1>
          <div className="flex items-center gap-1 text-xs font-body opacity-80">
            <MapPin className="h-3 w-3" />
            <span>मध्य भारत</span>
          </div>
        </div>
        <p className="text-sm font-body opacity-90 mb-1">
          विक्रम संवत {panchang.vikramSamvat} • {panchang.hinduMonth.name} • {panchang.ayana.name}
        </p>
        <p className="text-xs font-body opacity-75">
          {panchang.hinduMonth.nameEn} • {panchang.ayana.nameEn}
        </p>
      </div>

      <div className="px-4 -mt-6 space-y-3 pb-24">
        {/* Date Navigation */}
        <div className="bg-white rounded-2xl border-2 border-gold/20 shadow-gold p-3 flex items-center justify-between">
          <button
            onClick={prevDay}
            className="w-9 h-9 rounded-full bg-saffron/10 hover:bg-saffron/20 flex items-center justify-center transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5 text-saffron" />
          </button>

          <div className="text-center flex-1 px-2">
            <p className="text-sm font-bold text-foreground font-body leading-tight">
              {formatDateReadable(selectedDate)}
            </p>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-xs text-saffron underline font-body mt-0.5"
              >
                Go to Today
              </button>
            )}
            {isToday && (
              <p className="text-xs text-saffron font-body mt-0.5">Today</p>
            )}
          </div>

          <button
            onClick={nextDay}
            className="w-9 h-9 rounded-full bg-saffron/10 hover:bg-saffron/20 flex items-center justify-center transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5 text-saffron" />
          </button>
        </div>

        {/* Samvat / Month / Ayana Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-gold/30 p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground font-body">संवत</p>
              <p className="text-sm font-bold text-saffron font-devanagari">{panchang.vikramSamvat}</p>
            </div>
            <div className="border-x border-gold/30">
              <p className="text-xs text-muted-foreground font-body">माह</p>
              <p className="text-sm font-bold text-saffron font-devanagari">{panchang.hinduMonth.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body">अयन</p>
              <p className="text-sm font-bold text-saffron font-devanagari">{panchang.ayana.name}</p>
            </div>
          </div>
        </div>

        {/* Main Panchang Card */}
        <div className="bg-white dark:bg-card rounded-2xl border-2 border-gold/20 p-4 shadow-gold">
          <h3 className="font-devanagari text-sm font-bold text-saffron mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            पंचांग विवरण
          </h3>

          <InfoRow
            icon={<Moon className="h-4 w-4 text-saffron" />}
            label="तिथि (Tithi)"
            value={`${panchang.tithi.name} (${panchang.tithi.number})`}
            subValue={`${panchang.tithi.paksha} • ${panchang.tithi.nameEn}`}
          />

          <InfoRow
            icon={<Star className="h-4 w-4 text-saffron" />}
            label="नक्षत्र (Nakshatra)"
            value={panchang.nakshatra.name}
            subValue={`${panchang.nakshatra.nameEn} (${panchang.nakshatra.number}/27)`}
          />

          <InfoRow
            icon={<span className="text-sm">🔯</span>}
            label="योग (Yoga)"
            value={panchang.yoga.name}
            subValue={`${panchang.yoga.nameEn} (${panchang.yoga.number}/27)`}
          />

          <InfoRow
            icon={<span className="text-sm">⚡</span>}
            label="करण (Karana)"
            value={panchang.karana.name}
            subValue={panchang.karana.nameEn}
          />

          <InfoRow
            icon={<span className="text-sm">📅</span>}
            label="वार (Vara)"
            value={panchang.vara.name}
            subValue={panchang.vara.nameEn}
          />

          <InfoRow
            icon={<span className="text-sm">🌓</span>}
            label="पक्ष (Paksha)"
            value={panchang.tithi.paksha}
            subValue={panchang.tithi.number <= 15 ? 'Shukla Paksha (Waxing Moon)' : 'Krishna Paksha (Waning Moon)'}
          />
        </div>

        {/* Sunrise / Sunset */}
        <div className="bg-white dark:bg-card rounded-2xl border-2 border-gold/20 p-4 shadow-gold">
          <h3 className="font-devanagari text-sm font-bold text-saffron mb-2 flex items-center gap-2">
            <Sun className="h-4 w-4" />
            सूर्योदय / सूर्यास्त
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Sun className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">सूर्योदय</p>
                <p className="text-sm font-bold text-foreground font-body">{formatTimeIST(panchang.sunrise)}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gold/30" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Sun className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body">सूर्यास्त</p>
                <p className="text-sm font-bold text-foreground font-body">{formatTimeIST(panchang.sunset)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auspicious Timings */}
        <div className="bg-white dark:bg-card rounded-2xl border-2 border-gold/20 p-4 shadow-gold">
          <h3 className="font-devanagari text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
            <span>✨</span>
            शुभ मुहूर्त
          </h3>

          <TimeRangeRow
            icon={<span className="text-sm">🌅</span>}
            label="ब्रह्म मुहूर्त (Brahma Muhurat)"
            start={panchang.brahmaMuhurat.start}
            end={panchang.brahmaMuhurat.end}
            valueClass="text-green-700"
          />

          <TimeRangeRow
            icon={<span className="text-sm">☀️</span>}
            label="अभिजित मुहूर्त (Abhijit Muhurat)"
            start={panchang.abhijitMuhurat.start}
            end={panchang.abhijitMuhurat.end}
            valueClass="text-green-700"
          />
        </div>

        {/* Inauspicious Timings */}
        <div className="bg-white dark:bg-card rounded-2xl border-2 border-red-100 p-4">
          <h3 className="font-devanagari text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
            <span>⚠️</span>
            अशुभ काल
          </h3>

          <TimeRangeRow
            icon={<span className="text-sm">🐍</span>}
            label="राहु काल (Rahu Kaal)"
            start={panchang.rahuKaal.start}
            end={panchang.rahuKaal.end}
            valueClass="text-red-600"
          />

          <TimeRangeRow
            icon={<span className="text-sm">🌑</span>}
            label="गुलिक काल (Gulika Kaal)"
            start={panchang.gulikaKaal.start}
            end={panchang.gulikaKaal.end}
            valueClass="text-red-600"
          />

          <TimeRangeRow
            icon={<span className="text-sm">⚡</span>}
            label="यमगण्ड काल (Yamaganda Kaal)"
            start={panchang.yamagandaKaal.start}
            end={panchang.yamagandaKaal.end}
            valueClass="text-red-600"
          />
        </div>

        {/* Ekadashi Reminder Toggle */}
        <div className="bg-white dark:bg-card rounded-2xl border-2 border-gold/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-saffron" />
            <div>
              <p className="text-sm font-semibold font-body text-foreground">Ekadashi Reminder</p>
              <p className="text-xs text-muted-foreground font-body">Get notified before Ekadashi</p>
            </div>
          </div>
          <Switch
            checked={ekadashiReminder}
            onCheckedChange={(checked) => {
              setEkadashiReminder(checked);
              localStorage.setItem('ekadashiReminder', String(checked));
            }}
          />
        </div>

        {/* Festival Countdown */}
        {upcomingFestivals.length > 0 && (
          <div className="bg-white dark:bg-card rounded-2xl border-2 border-gold/20 p-4">
            <h3 className="font-devanagari text-sm font-bold text-saffron mb-3">🎉 आगामी त्योहार</h3>
            <div className="space-y-2">
              {upcomingFestivals.map((festival, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-gold/10 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold font-body text-foreground">{festival.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{festival.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-saffron font-body">
                      {festival.daysUntil === 0 ? 'Today!' : `${festival.daysUntil}d`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accuracy Note */}
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-body text-center">
            📍 गणना स्थान: मध्य भारत (23°N, 80°E) • IST (UTC+5:30)
          </p>
          <p className="text-xs text-amber-600/70 dark:text-amber-500/70 font-body text-center mt-0.5">
            Calculations based on Jean Meeus astronomical algorithms
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
