import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPanchang, useGetFestivals } from '../hooks/useQueries';
import { getHinduDate, getTodaysTithi, getTodaysNakshatra } from '../lib/staticData';
import { MapPin, Sun, Bell } from 'lucide-react';

function getRahuKaal(dayOfWeek: number): string {
  const rahuKaalTimes: Record<number, string> = {
    0: '4:30 PM – 6:00 PM', // Sunday
    1: '7:30 AM – 9:00 AM', // Monday
    2: '3:00 PM – 4:30 PM', // Tuesday
    3: '12:00 PM – 1:30 PM', // Wednesday
    4: '1:30 PM – 3:00 PM', // Thursday
    5: '10:30 AM – 12:00 PM', // Friday
    6: '9:00 AM – 10:30 AM', // Saturday
  };
  return rahuKaalTimes[dayOfWeek] || '12:00 PM – 1:30 PM';
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const festDate = new Date(dateStr);
  festDate.setHours(0, 0, 0, 0);
  return Math.ceil((festDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function Panchang() {
  const [ekadashiReminder, setEkadashiReminder] = useState(() => {
    return localStorage.getItem('ekadashiReminder') === 'true';
  });

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const { data: panchangData, isLoading } = useGetPanchang(BigInt(dayOfYear));
  const { data: festivals } = useGetFestivals();

  const hinduDate = getHinduDate();
  const todaysTithi = getTodaysTithi();
  const todaysNakshatra = getTodaysNakshatra();
  const rahuKaal = getRahuKaal(today.getDay());

  // Use backend data if available, otherwise use static fallback
  const tithi = panchangData?.tithi || todaysTithi;
  const nakshatra = todaysNakshatra;
  const muhurat = panchangData?.muhurat || '11:48 AM – 12:36 PM';

  const upcomingFestivals = festivals
    ? festivals
        .map(f => ({ ...f, daysUntil: getDaysUntil(f.date) }))
        .filter(f => f.daysUntil >= 0)
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-saffron to-saffron/80 px-4 pt-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-devanagari text-2xl font-bold">🗓️ पंचांग</h1>
          <div className="flex items-center gap-1 text-xs font-body opacity-80">
            <MapPin className="h-3 w-3" />
            <span>India</span>
          </div>
        </div>
        <p className="text-sm font-body opacity-90">{hinduDate}</p>
      </div>

      <div className="px-4 -mt-4 space-y-3 pb-6">
        {/* Main Panchang Card */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border-2 border-gold/20 p-4 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-gold/20 p-4 shadow-gold space-y-3">
            {/* Tithi */}
            <div className="flex items-center justify-between py-2 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌙</span>
                <div>
                  <p className="text-xs text-muted-foreground font-body">Tithi</p>
                  <p className="font-devanagari text-sm font-bold text-foreground">{tithi}</p>
                </div>
              </div>
            </div>

            {/* Nakshatra */}
            <div className="flex items-center justify-between py-2 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs text-muted-foreground font-body">Nakshatra</p>
                  <p className="font-devanagari text-sm font-bold text-foreground">{nakshatra}</p>
                </div>
              </div>
            </div>

            {/* Rahu Kaal */}
            <div className="flex items-center justify-between py-2 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-xs text-muted-foreground font-body">Rahu Kaal</p>
                  <p className="text-sm font-bold text-red-600 font-body">{rahuKaal}</p>
                </div>
              </div>
            </div>

            {/* Abhijit Muhurat */}
            <div className="flex items-center justify-between py-2 border-b border-gold/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <div>
                  <p className="text-xs text-muted-foreground font-body">Abhijit Muhurat</p>
                  <p className="text-sm font-bold text-green-700 font-body">{muhurat}</p>
                </div>
              </div>
            </div>

            {/* Sunrise / Sunset */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-2 flex-1">
                <Sun className="h-5 w-5 text-saffron" />
                <div>
                  <p className="text-xs text-muted-foreground font-body">Sunrise</p>
                  <p className="text-sm font-bold text-foreground font-body">6:15 AM</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gold/30" />
              <div className="flex items-center gap-2 flex-1">
                <Sun className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground font-body">Sunset</p>
                  <p className="text-sm font-bold text-foreground font-body">6:45 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ekadashi Reminder Toggle */}
        <div className="bg-white rounded-2xl border-2 border-gold/20 p-4 flex items-center justify-between">
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
          <div className="bg-white rounded-2xl border-2 border-gold/20 p-4">
            <h3 className="font-devanagari text-sm font-bold text-saffron mb-3">🎉 आगामी त्योहार</h3>
            <div className="space-y-2">
              {upcomingFestivals.map((festival, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gold/10 last:border-0">
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
