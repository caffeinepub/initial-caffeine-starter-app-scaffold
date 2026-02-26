import { useState, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetJapStats, useGetJapLeaderboard, useIncrementJap } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, VolumeX, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const MANTRAS = [
  { id: 'om-namah-shivaya', label: 'ॐ नमः शिवाय', english: 'Om Namah Shivaya' },
  { id: 'hare-krishna', label: 'हरे कृष्ण', english: 'Hare Krishna' },
  { id: 'jai-shri-ram', label: 'जय श्री राम', english: 'Jai Shri Ram' },
  { id: 'radhe-radhe', label: 'राधे राधे', english: 'Radhe Radhe' },
];

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export default function Jap() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [count, setCount] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0]);
  const [musicOn, setMusicOn] = useState(false);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [localLifetime, setLocalLifetime] = useState(() => {
    const stored = localStorage.getItem('japLocalStats');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.lifetime || 0;
    }
    return 0;
  });
  const [localDaily, setLocalDaily] = useState(() => {
    const stored = localStorage.getItem('japLocalStats');
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = new Date().toDateString();
      return parsed.date === today ? (parsed.daily || 0) : 0;
    }
    return 0;
  });

  const { data: japStats, isLoading: statsLoading } = useGetJapStats();
  const { data: leaderboard, isLoading: leaderboardLoading } = useGetJapLeaderboard();
  const incrementJap = useIncrementJap();

  const triggerPetals = useCallback(() => {
    const newPetals: Petal[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setPetals(newPetals);
    setShowCelebration(true);
    setTimeout(() => {
      setPetals([]);
      setShowCelebration(false);
    }, 4000);
  }, []);

  const handleChant = useCallback(async () => {
    const newCount = count + 1;

    if (newCount >= 108) {
      setCount(0);
      triggerPetals();
      toast.success('🙏 108 जप पूर्ण! Jai Shri Ram!', { duration: 3000 });

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }

      if (isAuthenticated) {
        try {
          await incrementJap.mutateAsync(BigInt(108));
        } catch {
          // silently fail
        }
      } else {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('japLocalStats');
        const parsed = stored ? JSON.parse(stored) : { lifetime: 0, daily: 0, date: today };
        const newLifetime = (parsed.lifetime || 0) + 108;
        const newDaily = parsed.date === today ? (parsed.daily || 0) + 108 : 108;
        const updated = { lifetime: newLifetime, daily: newDaily, date: today };
        localStorage.setItem('japLocalStats', JSON.stringify(updated));
        setLocalLifetime(newLifetime);
        setLocalDaily(newDaily);
      }
    } else {
      setCount(newCount);
    }
  }, [count, isAuthenticated, incrementJap, triggerPetals]);

  const displayDaily = isAuthenticated
    ? (japStats ? Number(japStats.daily) : 0)
    : localDaily;
  const displayWeekly = isAuthenticated
    ? (japStats ? Number(japStats.weekly) : 0)
    : 0;
  const displayLifetime = isAuthenticated
    ? (japStats ? Number(japStats.lifetime) : 0)
    : localLifetime;

  const progress = (count / 108) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Falling Petals */}
      {petals.map(petal => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          🌸
        </div>
      ))}

      {/* Header */}
      <div className="bg-gradient-to-b from-saffron to-saffron/80 px-4 pt-6 pb-8 text-white text-center relative">
        <img
          src="/assets/generated/mala-bg.dim_800x800.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative z-10">
          <h1 className="font-devanagari text-2xl font-bold">📿 जप काउंटर</h1>
          <p className="text-sm font-body opacity-90 mt-1">Jap Counter — Mala Beads</p>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-6">
        {/* Mantra Selector */}
        <div className="bg-white rounded-2xl border-2 border-saffron/20 p-3 shadow-sm">
          <p className="text-xs text-muted-foreground font-body mb-2 text-center">Select Mantra / मंत्र चुनें</p>
          <div className="grid grid-cols-2 gap-2">
            {MANTRAS.map(mantra => (
              <button
                key={mantra.id}
                onClick={() => setSelectedMantra(mantra)}
                className={`py-2 px-3 rounded-xl text-xs font-body font-medium transition-all ${
                  selectedMantra.id === mantra.id
                    ? 'bg-saffron text-white shadow-saffron'
                    : 'bg-saffron/10 text-saffron border border-saffron/20'
                }`}
              >
                <span className="font-devanagari block text-sm">{mantra.label}</span>
                <span className="opacity-70 text-[10px]">{mantra.english}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Counter Display */}
        <div className="bg-white rounded-2xl border-2 border-gold/30 p-6 text-center shadow-gold">
          {/* Circular Progress */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke="oklch(0.95 0.04 75)"
                strokeWidth="12"
              />
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke="oklch(0.72 0.19 50)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-saffron font-body">{count}</span>
              <span className="text-xs text-muted-foreground font-body">/ 108</span>
            </div>
          </div>

          {/* Selected Mantra Display */}
          <p className={`font-devanagari text-xl font-bold text-saffron mb-1 ${showCelebration ? 'animate-bounce' : ''}`}>
            {selectedMantra.label}
          </p>
          <p className="text-xs text-muted-foreground font-body">{selectedMantra.english}</p>
        </div>

        {/* CHANT Button */}
        <button
          onClick={handleChant}
          className="w-full py-6 rounded-2xl bg-gradient-to-b from-saffron to-saffron-dark text-white font-devanagari text-3xl font-bold shadow-saffron active:scale-95 transition-transform mala-pulse"
        >
          🙏 जप करें
          <span className="block text-sm font-body font-normal opacity-90 mt-1">CHANT</span>
        </button>

        {/* Music Toggle */}
        <div className="flex items-center justify-between bg-white rounded-2xl border-2 border-border p-4">
          <div className="flex items-center gap-2">
            {musicOn ? (
              <Music className="h-5 w-5 text-saffron" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-semibold font-body text-foreground">Background Music</p>
              <p className="text-xs text-muted-foreground font-body">
                {musicOn ? 'Mantra music playing' : 'Music off'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMusicOn(!musicOn);
              toast.info(musicOn ? 'Music off' : '🎵 Music feature coming soon!');
            }}
            className={`w-12 h-6 rounded-full transition-all ${
              musicOn ? 'bg-saffron' : 'bg-muted'
            } relative`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${
              musicOn ? 'left-6' : 'left-0.5'
            }`} />
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border-2 border-gold/20 p-4">
          <h3 className="font-devanagari text-sm font-bold text-saffron mb-3">📊 जप आँकड़े (Stats)</h3>
          {statsLoading && isAuthenticated ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-saffron/5 rounded-xl p-3">
                <p className="text-2xl font-bold text-saffron font-body">{displayDaily}</p>
                <p className="text-xs text-muted-foreground font-body">Today</p>
              </div>
              <div className="text-center bg-saffron/5 rounded-xl p-3">
                <p className="text-2xl font-bold text-saffron font-body">{displayWeekly}</p>
                <p className="text-xs text-muted-foreground font-body">This Week</p>
              </div>
              <div className="text-center bg-saffron/5 rounded-xl p-3">
                <p className="text-2xl font-bold text-saffron font-body">{displayLifetime}</p>
                <p className="text-xs text-muted-foreground font-body">Lifetime</p>
              </div>
            </div>
          )}
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground font-body text-center mt-2">
              Login to sync stats across devices
            </p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl border-2 border-gold/20 p-4">
          <h3 className="font-devanagari text-sm font-bold text-saffron mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Top Bhakts — लीडरबोर्ड
          </h3>
          {leaderboardLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 rounded-xl" />)}
            </div>
          ) : (leaderboard && leaderboard.length > 0) ? (
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🏅'}
                    </span>
                    <span className="text-sm font-body text-foreground">Bhakt #{idx + 1}</span>
                  </div>
                  <span className="text-sm font-bold text-saffron font-body">
                    {Number(entry.lifetime).toLocaleString()} jap
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground font-body">
                🙏 Be the first on the leaderboard!
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Login and complete your first mala
              </p>
            </div>
          )}
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
