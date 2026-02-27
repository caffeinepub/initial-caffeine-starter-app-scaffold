import React, { useState, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import MalaRing from '../components/MalaRing';
import LotusBloomOverlay from '../components/LotusBloomOverlay';
import GoldenHalo from '../components/GoldenHalo';

const MANTRAS = [
  { id: 'omNamahShivaya', name: 'ॐ नमः शिवाय', deity: 'शिव', emoji: '🔱' },
  { id: 'hareKrishna', name: 'हरे कृष्ण', deity: 'कृष्ण', emoji: '🦚' },
  { id: 'gayatriMantra', name: 'गायत्री मंत्र', deity: 'सूर्य', emoji: '☀️' },
  { id: 'mahamrityunjayaMantra', name: 'महामृत्युंजय', deity: 'शिव', emoji: '🔱' },
  { id: 'saiRam', name: 'साईं राम', deity: 'साईं बाबा', emoji: '🙏' },
  { id: 'sitaram', name: 'सीताराम', deity: 'राम', emoji: '🏹' },
  { id: 'omMantra', name: 'ॐ', deity: 'ब्रह्म', emoji: '🕉️' },
  { id: 'radhaNamJap', name: 'राधे राधे', deity: 'राधा', emoji: '🌸' },
  { id: 'jaiShreeRamNamJap', name: 'जय श्री राम', deity: 'राम', emoji: '🏹' },
];

const STORAGE_KEY = 'jap_counter_data';

interface JapData {
  count: number;
  malaCount: number;
  dailyCount: number;
  lifetimeCount: number;
  streak: number;
  lastDate: string;
  selectedMantra: string;
}

function loadJapData(): JapData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    count: 0,
    malaCount: 0,
    dailyCount: 0,
    lifetimeCount: 0,
    streak: 0,
    lastDate: '',
    selectedMantra: 'omNamahShivaya',
  };
}

function saveJapData(data: JapData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function Jap() {
  const [japData, setJapData] = useState<JapData>(() => {
    const data = loadJapData();
    const today = new Date().toDateString();
    if (data.lastDate !== today) {
      return { ...data, dailyCount: 0, count: 0, lastDate: today };
    }
    return data;
  });

  const [lotusTrigger, setLotusTrigger] = useState(0);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedMantra = MANTRAS.find((m) => m.id === japData.selectedMantra) || MANTRAS[0];
  const beadsInMala = 108;
  const currentBeadProgress = japData.count % beadsInMala;
  const progressPercent = (currentBeadProgress / beadsInMala) * 100;

  const handleJap = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setRippleTrigger((k) => k + 1);

    setJapData((prev) => {
      const newCount = prev.count + 1;
      const newDaily = prev.dailyCount + 1;
      const newLifetime = prev.lifetimeCount + 1;
      const newMala = Math.floor(newCount / beadsInMala);
      const completedMala = newCount % beadsInMala === 0 && newCount > 0;

      if (completedMala) {
        setTimeout(() => setLotusTrigger((k) => k + 1), 100);
      }

      const updated = {
        ...prev,
        count: newCount,
        dailyCount: newDaily,
        lifetimeCount: newLifetime,
        malaCount: newMala,
        lastDate: new Date().toDateString(),
      };
      saveJapData(updated);
      return updated;
    });

    setTimeout(() => setIsAnimating(false), 150);
  }, [isAnimating]);

  const handleReset = () => {
    const updated = { ...japData, count: 0, dailyCount: 0, malaCount: 0 };
    setJapData(updated);
    saveJapData(updated);
  };

  const handleMantraChange = (mantraId: string) => {
    const updated = { ...japData, selectedMantra: mantraId };
    setJapData(updated);
    saveJapData(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <LotusBloomOverlay trigger={lotusTrigger} />

      {/* Header */}
      <div
        className="px-4 pt-6 pb-4"
        style={{ background: 'linear-gradient(135deg, #0d0f1a 0%, #1a0a05 40%, #0d0f1a 100%)' }}
      >
        <h1
          className="text-2xl font-bold font-devanagari"
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          📿 जप काउंटर
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">मंत्र जप करें और आत्मा को शुद्ध करें</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'आज', value: japData.dailyCount, emoji: '📅' },
            { label: 'माला', value: japData.malaCount, emoji: '📿' },
            { label: 'जीवनकाल', value: japData.lifetimeCount, emoji: '⭐' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border p-3 text-center"
              style={{
                background: 'linear-gradient(135deg, oklch(16% 0.025 240), oklch(19% 0.03 250))',
                borderColor: 'rgba(249,115,22,0.2)',
              }}
            >
              <p className="text-lg mb-0.5">{stat.emoji}</p>
              <p
                className="text-xl font-bold"
                style={{ color: '#fcd34d' }}
              >
                {stat.value.toLocaleString('hi-IN')}
              </p>
              <p className="text-xs text-muted-foreground font-devanagari">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mantra Selector */}
        <div
          className="rounded-xl border p-3"
          style={{
            background: 'linear-gradient(135deg, oklch(16% 0.025 240), oklch(19% 0.03 250))',
            borderColor: 'rgba(249,115,22,0.2)',
          }}
        >
          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">मंत्र चुनें</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {MANTRAS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMantraChange(m.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  japData.selectedMantra === m.id
                    ? 'text-white'
                    : 'text-muted-foreground border border-border/50 hover:border-saffron-500/40'
                }`}
                style={
                  japData.selectedMantra === m.id
                    ? { background: 'linear-gradient(135deg, #f97316, #f59e0b)', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }
                    : {}
                }
              >
                <span>{m.emoji}</span>
                <span className="font-devanagari">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mala Ring & Tap Area */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <GoldenHalo size="md">
              <MalaRing count={currentBeadProgress} />
            </GoldenHalo>
          </div>

          {/* Current Count */}
          <div className="text-center">
            <p
              className="text-5xl font-bold tabular-nums"
              style={{
                background: 'linear-gradient(135deg, #fef3c7, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {currentBeadProgress}
            </p>
            <p className="text-sm text-muted-foreground font-devanagari mt-1">
              {selectedMantra.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {beadsInMala - currentBeadProgress} और जप बाकी
            </p>
          </div>

          {/* Tap Button */}
          <div className="relative">
            <button
              onClick={handleJap}
              className="relative w-28 h-28 rounded-full flex items-center justify-center text-4xl transition-transform duration-150 active:scale-95 select-none"
              style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(245,158,11,0.15))',
                border: '3px solid rgba(249,115,22,0.5)',
                boxShadow: '0 0 30px rgba(249,115,22,0.3), inset 0 0 20px rgba(249,115,22,0.1)',
              }}
            >
              🙏
            </button>
          </div>

          <p className="text-xs text-muted-foreground">टैप करें जप के लिए</p>
        </div>

        {/* Progress Bar */}
        <div
          className="rounded-xl border p-4"
          style={{
            background: 'linear-gradient(135deg, oklch(16% 0.025 240), oklch(19% 0.03 250))',
            borderColor: 'rgba(249,115,22,0.2)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-devanagari">माला प्रगति</span>
            <span className="text-xs font-semibold" style={{ color: '#f97316' }}>
              {currentBeadProgress}/{beadsInMala}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #f97316, #f59e0b)',
                boxShadow: '0 0 8px rgba(249,115,22,0.5)',
              }}
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <RotateCcw size={14} />
          <span>रीसेट करें</span>
        </button>
      </div>
    </div>
  );
}
