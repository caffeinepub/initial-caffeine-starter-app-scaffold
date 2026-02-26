import { useState } from 'react';
import { useGetFestivals } from '../hooks/useQueries';
import { AARTIS, getTodaysShloka, getGreeting, getTodaysTithi } from '../lib/staticData';
import AartiCard from '../components/AartiCard';
import ShlokaCard from '../components/ShlokaCard';
import DailyDharmaQuote from '../components/DailyDharmaQuote';
import FestivalCountdownCard from '../components/FestivalCountdownCard';
import VratModeToggle from '../components/VratModeToggle';
import VratModeDashboard from '../components/VratModeDashboard';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Home() {
  const { identity } = useInternetIdentity();
  const { data: festivals } = useGetFestivals();
  const todaysShloka = getTodaysShloka();
  const greeting = getGreeting();
  const tithi = getTodaysTithi();

  const [vratMode, setVratMode] = useState(() => {
    return localStorage.getItem('vratMode') === 'true';
  });

  const handleVratToggle = (val: boolean) => {
    setVratMode(val);
    localStorage.setItem('vratMode', val.toString());
  };

  // Check for upcoming festival (within 7 days)
  const upcomingFestival = festivals?.find(f => {
    const days = Math.ceil((new Date(f.date).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/lotus-hero.dim_1200x400.png"
          alt="Lotus"
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-saffron/60 to-saffron/80 flex flex-col items-center justify-center text-white px-4">
          <div className="flex items-center gap-2 mb-1">
            <img src="/assets/generated/om-logo.dim_256x256.png" alt="Om" className="w-8 h-8 opacity-90" />
            <h1 className="font-devanagari text-2xl font-bold tracking-wide">Sanatan Pro</h1>
          </div>
          <p className="font-devanagari text-lg font-semibold">
            🙏 Jai Shri Ram — {greeting}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-body">
              आज की तिथि: {tithi}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Festival Alert Banner */}
        {upcomingFestival && (
          <div className="bg-gradient-to-r from-saffron to-gold rounded-xl p-3 text-white flex items-center gap-3 shadow-saffron">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-devanagari font-bold text-sm">{upcomingFestival.name} आ रहा है!</p>
              <p className="text-xs font-body opacity-90">{upcomingFestival.description}</p>
            </div>
          </div>
        )}

        {/* Festival Countdown */}
        <FestivalCountdownCard />

        {/* Daily Aarti Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🔔</span>
            <h2 className="font-devanagari text-lg font-bold text-foreground">दैनिक आरती</h2>
            <span className="text-xs text-muted-foreground font-body ml-auto">Daily Aarti</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {AARTIS.map(aarti => (
              <AartiCard
                key={aarti.id}
                id={aarti.id}
                name={aarti.name}
                emoji={aarti.emoji}
                color={aarti.color}
              />
            ))}
          </div>
        </section>

        {/* Daily Shloka Card */}
        <ShlokaCard shloka={todaysShloka} />

        {/* Daily Dharma Quote */}
        <DailyDharmaQuote />

        {/* Vrat Mode Toggle */}
        <VratModeToggle enabled={vratMode} onToggle={handleVratToggle} />

        {/* Vrat Mode Dashboard */}
        {vratMode && <VratModeDashboard />}

        {/* Footer */}
        <div className="text-center py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Sanatan Pro. Built with{' '}
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
