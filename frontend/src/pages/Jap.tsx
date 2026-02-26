import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetJapStats, useIncrementJap } from '../hooks/useQueries';
import MalaRing from '../components/MalaRing';
import LotusBloomOverlay from '../components/LotusBloomOverlay';
import SacredRipple from '../components/SacredRipple';

const MALA_SIZE = 108;

interface MantraOption {
  key: string;
  label: string;
  subLabel: string;
  emoji: string;
}

const MANTRA_OPTIONS: MantraOption[] = [
  { key: 'omNamahShivaya', label: 'ॐ नमः शिवाय', subLabel: 'Om Namah Shivaya', emoji: '🔱' },
  { key: 'hareKrishna', label: 'हरे कृष्ण हरे राम', subLabel: 'Hare Krishna Hare Ram', emoji: '🦚' },
  { key: 'radhaNamJap', label: 'राधे राधे', subLabel: 'Radha Nam Jap', emoji: '🌸' },
  { key: 'jaiShreeRamNamJap', label: 'जय श्री राम', subLabel: 'Jai Shree Ram', emoji: '🏹' },
  { key: 'gayatriMantra', label: 'ॐ भूर्भुवः स्वः', subLabel: 'Gayatri Mantra', emoji: '☀️' },
  { key: 'mahamrityunjayaMantra', label: 'ॐ त्र्यम्बकं यजामहे', subLabel: 'Mahamrityunjaya', emoji: '🌙' },
  { key: 'saiRam', label: 'ॐ साईं राम', subLabel: 'Sai Ram', emoji: '✨' },
  { key: 'sitaram', label: 'सीताराम सीताराम', subLabel: 'Sita Ram', emoji: '🪷' },
  { key: 'omMantra', label: 'ॐ', subLabel: 'Om Mantra', emoji: '🕉️' },
];

function getLocalStorageKey(mantraKey: string) {
  return `jap_count_${mantraKey}`;
}

function loadLocalCount(mantraKey: string): number {
  try {
    const val = localStorage.getItem(getLocalStorageKey(mantraKey));
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function saveLocalCount(mantraKey: string, count: number) {
  try {
    localStorage.setItem(getLocalStorageKey(mantraKey), String(count));
  } catch {
    // ignore
  }
}

export default function Jap() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: japStats } = useGetJapStats();
  const incrementJapMutation = useIncrementJap();

  // Selected mantra
  const [selectedMantra, setSelectedMantra] = useState<string>(() => {
    try {
      return localStorage.getItem('jap_selected_mantra') || 'omNamahShivaya';
    } catch {
      return 'omNamahShivaya';
    }
  });
  const [showMantraSelector, setShowMantraSelector] = useState(false);

  // Local optimistic state
  const [sessionCount, setSessionCount] = useState<number>(() => loadLocalCount(selectedMantra));
  const [localLifetime, setLocalLifetime] = useState<number>(0);

  // Trigger counter for LotusBloomOverlay (increments on each mala completion)
  const [bloomTrigger, setBloomTrigger] = useState(0);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [completingMala, setCompletingMala] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Pending increments to batch-sync to backend
  const pendingRef = useRef(0);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSessionRef = useRef(sessionCount);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Initialize lifetime from backend stats (authenticated users)
  useEffect(() => {
    if (japStats && isAuthenticated) {
      setLocalLifetime(Number(japStats.lifetime));
    }
  }, [japStats, isAuthenticated]);

  // For guest users, compute lifetime from all mantra localStorage counts
  useEffect(() => {
    if (!isAuthenticated) {
      const total = MANTRA_OPTIONS.reduce((sum, m) => sum + loadLocalCount(m.key), 0);
      setLocalLifetime(total);
    }
  }, [isAuthenticated, sessionCount]);

  // When mantra changes, load its persisted count
  const handleMantraChange = useCallback((key: string) => {
    // Save current count before switching
    saveLocalCount(selectedMantra, sessionCount);
    setSelectedMantra(key);
    try {
      localStorage.setItem('jap_selected_mantra', key);
    } catch { /* ignore */ }
    const saved = loadLocalCount(key);
    setSessionCount(saved);
    prevSessionRef.current = saved;
    setShowMantraSelector(false);
  }, [selectedMantra, sessionCount]);

  // Derived values
  const beadsInRound = sessionCount % MALA_SIZE;
  const progressPercent = (beadsInRound / MALA_SIZE) * 100;
  const sessionMalaCount = Math.floor(sessionCount / MALA_SIZE);

  // Detect mala completion
  useEffect(() => {
    if (sessionCount > 0 && sessionCount > prevSessionRef.current) {
      const prevMalas = Math.floor(prevSessionRef.current / MALA_SIZE);
      const currMalas = Math.floor(sessionCount / MALA_SIZE);
      if (currMalas > prevMalas) {
        setCompletingMala(true);
        setTimeout(() => {
          setCompletingMala(false);
          setBloomTrigger((t) => t + 1);
        }, 300);
      }
    }
    prevSessionRef.current = sessionCount;
  }, [sessionCount]);

  // Async backend sync (debounced, non-blocking)
  const scheduleSyncToBackend = useCallback(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      if (pendingRef.current > 0 && isAuthenticated) {
        const toSync = pendingRef.current;
        pendingRef.current = 0;
        incrementJapMutation.mutate(BigInt(toSync), {
          onError: (err) => {
            console.error('Jap sync error:', err);
          },
        });
      }
    }, 1500);
  }, [isAuthenticated, incrementJapMutation]);

  const handleJap = useCallback(() => {
    const newCount = sessionCount + 1;

    // Immediate optimistic update
    setSessionCount(newCount);
    setRippleTrigger((t) => t + 1);

    // Persist to localStorage immediately
    saveLocalCount(selectedMantra, newCount);

    // Queue backend sync for authenticated users
    pendingRef.current += 1;
    scheduleSyncToBackend();
  }, [sessionCount, selectedMantra, scheduleSyncToBackend]);

  const handleReset = () => {
    setSessionCount(0);
    saveLocalCount(selectedMantra, 0);
    prevSessionRef.current = 0;
  };

  const progressWidth = completingMala ? 100 : progressPercent;
  const currentMantra = MANTRA_OPTIONS.find((m) => m.key === selectedMantra) || MANTRA_OPTIONS[0];

  return (
    <div className="min-h-screen bg-background pb-24 overflow-hidden">
      {/* LotusBloomOverlay uses trigger-based API */}
      <LotusBloomOverlay trigger={bloomTrigger} />

      {/* Header */}
      <div
        className="bg-primary/10 border-b border-primary/20 px-4 py-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        <h1 className="text-2xl font-bold text-primary text-center">नाम जप</h1>
        <p className="text-center text-muted-foreground text-sm mt-1">{currentMantra.label}</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-5">

        {/* Mantra Selector Button */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease-out 0.1s, transform 0.5s ease-out 0.1s',
          }}
        >
          <button
            onClick={() => setShowMantraSelector((v) => !v)}
            className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentMantra.emoji}</span>
              <div className="text-left">
                <div className="font-semibold text-foreground text-sm">{currentMantra.label}</div>
                <div className="text-xs text-muted-foreground">{currentMantra.subLabel}</div>
              </div>
            </div>
            <span
              className="text-muted-foreground text-lg transition-transform duration-300"
              style={{ transform: showMantraSelector ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              ▾
            </span>
          </button>

          {/* Mantra Dropdown */}
          {showMantraSelector && (
            <div className="mt-1 bg-card border border-border rounded-xl overflow-hidden shadow-lg z-10 relative">
              {MANTRA_OPTIONS.map((m, i) => (
                <button
                  key={m.key}
                  onClick={() => handleMantraChange(m.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 transition-colors ${
                    m.key === selectedMantra ? 'bg-primary/10' : ''
                  } ${i < MANTRA_OPTIONS.length - 1 ? 'border-b border-border/50' : ''}`}
                  style={{
                    opacity: 1,
                    animation: `slideDown 0.2s ease-out ${i * 0.04}s both`,
                  }}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <div>
                    <div className="font-medium text-foreground text-sm">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.subLabel}</div>
                  </div>
                  {m.key === selectedMantra && (
                    <span className="ml-auto text-primary text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mala Ring */}
        <div
          className="flex justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s',
          }}
        >
          <MalaRing count={beadsInRound} />
        </div>

        {/* Progress Bar */}
        <div
          className="space-y-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease-out 0.35s, transform 0.5s ease-out 0.35s',
          }}
        >
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>माला प्रगति</span>
            <span>{beadsInRound} / {MALA_SIZE}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{
                width: `${progressWidth}%`,
                transition: completingMala
                  ? 'width 0.3s ease-out'
                  : 'width 0.15s ease-out',
              }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="grid grid-cols-3 gap-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease-out 0.45s, transform 0.5s ease-out 0.45s',
          }}
        >
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-primary tabular-nums">{sessionCount}</div>
            <div className="text-xs text-muted-foreground mt-1">इस सत्र में</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-accent tabular-nums">{sessionMalaCount}</div>
            <div className="text-xs text-muted-foreground mt-1">माला</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-foreground tabular-nums">{localLifetime}</div>
            <div className="text-xs text-muted-foreground mt-1">जीवनकाल</div>
          </div>
        </div>

        {/* JAP Button */}
        <div
          className="flex justify-center py-4 relative"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.7)',
            transition: 'opacity 0.6s ease-out 0.55s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.55s',
          }}
        >
          {/* Ripple container */}
          <div className="relative">
            <SacredRipple trigger={rippleTrigger} />
            <button
              onPointerDown={() => setIsPressed(true)}
              onPointerUp={() => {
                setIsPressed(false);
                handleJap();
              }}
              onPointerLeave={() => setIsPressed(false)}
              className="relative w-40 h-40 rounded-full select-none touch-none flex flex-col items-center justify-center gap-1"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, oklch(0.85 0.18 60), oklch(0.65 0.22 40))',
                boxShadow: isPressed
                  ? '0 2px 8px oklch(0.5 0.2 40 / 0.4), inset 0 2px 6px oklch(0.3 0.1 40 / 0.3)'
                  : '0 8px 32px oklch(0.5 0.2 40 / 0.6), 0 2px 8px oklch(0.4 0.15 40 / 0.3), 0 0 0 4px oklch(0.75 0.18 60 / 0.3)',
                transform: isPressed ? 'scale(0.93)' : 'scale(1)',
                transition: 'transform 0.1s ease-out, box-shadow 0.15s ease-out',
              }}
            >
              <span
                className="text-4xl select-none pointer-events-none"
                style={{
                  animation: isPressed ? 'none' : 'omPulse 2.5s ease-in-out infinite',
                }}
              >
                {currentMantra.emoji}
              </span>
              <span
                className="text-xs font-bold select-none pointer-events-none"
                style={{ color: 'oklch(0.25 0.08 30)' }}
              >
                जप करें
              </span>
            </button>
          </div>
        </div>

        {/* Mantra text display */}
        <div
          className="text-center"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.5s ease-out 0.65s',
          }}
        >
          <p
            className="text-lg font-semibold text-primary"
            style={{ animation: 'textGlow 3s ease-in-out infinite' }}
          >
            {currentMantra.label}
          </p>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted"
          >
            सत्र रीसेट करें
          </button>
        </div>

        {/* Login prompt */}
        {!isAuthenticated && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              💾 जप गिनती स्वचालित रूप से सहेजी जा रही है (स्थानीय)
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              क्लाउड में सहेजने के लिए लॉगिन करें
            </p>
          </div>
        )}

        {/* Daily stats from backend */}
        {isAuthenticated && japStats && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">☁️ क्लाउड प्रगति</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-primary tabular-nums">
                  {Number(japStats.daily)}
                </div>
                <div className="text-xs text-muted-foreground">आज</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent tabular-nums">
                  {Number(japStats.weekly)}
                </div>
                <div className="text-xs text-muted-foreground">इस सप्ताह</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary tabular-nums">{localLifetime}</div>
                <div className="text-xs text-muted-foreground">जीवनकाल</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes omPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes textGlow {
          0%, 100% { opacity: 0.85; text-shadow: 0 0 8px oklch(0.65 0.22 40 / 0.3); }
          50% { opacity: 1; text-shadow: 0 0 16px oklch(0.65 0.22 40 / 0.6); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
