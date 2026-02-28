import { useState, useEffect, useCallback } from 'react';
import MalaRing from '../components/MalaRing';
import LotusBloomOverlay from '../components/LotusBloomOverlay';
import { useGetJapStats, useIncrementJap, useResetJapStats } from '../hooks/useQueries';
import { Mantra } from '../backend';

const MANTRA_OPTIONS: { value: Mantra; label: string; text: string }[] = [
  { value: Mantra.omNamahShivaya, label: 'ॐ नमः शिवाय', text: 'ॐ नमः शिवाय' },
  { value: Mantra.hareKrishna, label: 'हरे कृष्ण', text: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे' },
  { value: Mantra.gayatriMantra, label: 'गायत्री मंत्र', text: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं' },
  { value: Mantra.mahamrityunjayaMantra, label: 'महामृत्युंजय', text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्' },
  { value: Mantra.saiRam, label: 'साईं राम', text: 'ॐ साईं राम' },
  { value: Mantra.sitaram, label: 'सीताराम', text: 'सीताराम सीताराम सीताराम' },
  { value: Mantra.omMantra, label: 'ॐ', text: 'ॐ' },
  { value: Mantra.radhaNamJap, label: 'राधे राधे', text: 'राधे राधे राधे श्याम मिला दे' },
  { value: Mantra.jaiShreeRamNamJap, label: 'जय श्री राम', text: 'जय श्री राम जय श्री राम' },
];

export default function Jap() {
  const [count, setCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [lotusTrigger, setLotusTrigger] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState<Mantra>(Mantra.omNamahShivaya);
  const [dailyCount, setDailyCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);

  const { data: japStats } = useGetJapStats();
  const incrementJap = useIncrementJap();
  const resetJap = useResetJapStats();

  useEffect(() => {
    if (japStats) {
      setDailyCount(Number(japStats.daily));
      setStreak(Number(japStats.streak));
      setLifetimeCount(Number(japStats.lifetime));
      setMalaCount(Number(japStats.mala));
    }
  }, [japStats]);

  const handleTap = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);
    setDailyCount((prev) => prev + 1);
    setLifetimeCount((prev) => prev + 1);

    if (newCount === 108) {
      setLotusTrigger((prev) => prev + 1);
      setMalaCount((prev) => prev + 1);
      setCount(0);
      incrementJap.mutate(BigInt(108));
    }
  }, [count, incrementJap]);

  const handleReset = () => {
    setCount(0);
  };

  const handleFullReset = () => {
    resetJap.mutate();
    setCount(0);
    setDailyCount(0);
    setMalaCount(0);
    setLifetimeCount(0);
    setStreak(0);
  };

  const progress = (count / 108) * 100;
  const currentMantra = MANTRA_OPTIONS.find((m) => m.value === selectedMantra);

  return (
    <div className="animate-slide-up min-h-screen bg-background">
      <LotusBloomOverlay trigger={lotusTrigger} />

      {/* Header */}
      <div className="bg-gradient-to-b from-saffron-800 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">📿 जाप</h1>
        <p className="text-amber-200 text-sm">मंत्र जाप करें — मन को शांत करें</p>
      </div>

      {/* Mantra Selector */}
      <div className="px-4 mb-4">
        <select
          value={selectedMantra}
          onChange={(e) => setSelectedMantra(e.target.value as Mantra)}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
        >
          {MANTRA_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        {currentMantra && (
          <p className="text-center text-gold-400 text-sm mt-2 font-medium animate-fade-in">
            {currentMantra.text}
          </p>
        )}
      </div>

      {/* Mala Ring + Count + Progress — unified section */}
      <div className="flex flex-col items-center px-4 mb-6">
        {/* Mala Ring */}
        <div className="relative animate-breathe">
          <MalaRing count={count} />
          {/* Count overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center mt-8">
              <p className="text-4xl font-bold text-white drop-shadow-lg">{count}</p>
              <p className="text-amber-300 text-xs">/ 108</p>
            </div>
          </div>
        </div>

        {/* Progress Bar — directly below ring */}
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>माला प्रगति</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-saffron-500 to-gold-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-1">
            {108 - count} जाप शेष
          </p>
        </div>
      </div>

      {/* Tap Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleTap}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-saffron-600 to-gold-500 text-white text-2xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-all duration-150 hover:shadow-xl border-4 border-gold-400/50 flex flex-col items-center justify-center"
          aria-label="जाप करें"
        >
          <span>🙏</span>
          <p className="text-xs mt-1 font-normal">जाप</p>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'आज का जाप', value: dailyCount, emoji: '📅' },
            { label: 'माला पूर्ण', value: malaCount, emoji: '📿' },
            { label: 'स्ट्रीक', value: `${streak} दिन`, emoji: '🔥' },
            { label: 'कुल जाप', value: lifetimeCount, emoji: '⭐' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-2xl p-4 text-center hover:border-gold-500/50 transition-all duration-200 hover:scale-105"
            >
              <p className="text-2xl mb-1">{stat.emoji}</p>
              <p className="text-xl font-bold text-gold-400">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-8 flex gap-3">
        <button
          onClick={handleReset}
          className="flex-1 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-all duration-200 hover:scale-105"
        >
          🔄 रीसेट (माला)
        </button>
        <button
          onClick={handleFullReset}
          disabled={resetJap.isPending}
          className="flex-1 py-3 rounded-xl bg-destructive/20 hover:bg-destructive/30 text-destructive text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
        >
          {resetJap.isPending ? '...' : '🗑️ सब रीसेट'}
        </button>
      </div>
    </div>
  );
}
