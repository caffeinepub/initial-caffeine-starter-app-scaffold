import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetJapStats, useIncrementJap, useResetJapStats } from '../hooks/useQueries';
import { Mantra } from '../backend';
import MalaRing from '../components/MalaRing';
import SacredRipple from '../components/SacredRipple';
import LotusBloomOverlay from '../components/LotusBloomOverlay';
import OmParticleBurst from '../components/OmParticleBurst';
import { RotateCcw, Flame, CloudUpload } from 'lucide-react';

const MANTRAS: { key: Mantra; label: string; short: string; color: string }[] = [
  { key: Mantra.omNamahShivaya, label: 'ॐ नमः शिवाय', short: 'शिव', color: 'from-blue-900 to-indigo-900' },
  { key: Mantra.hareKrishna, label: 'हरे कृष्ण हरे राम', short: 'कृष्ण', color: 'from-yellow-800 to-amber-900' },
  { key: Mantra.gayatriMantra, label: 'गायत्री मंत्र', short: 'गायत्री', color: 'from-orange-800 to-red-900' },
  { key: Mantra.mahamrityunjayaMantra, label: 'महामृत्युंजय मंत्र', short: 'मृत्युंजय', color: 'from-green-900 to-teal-900' },
  { key: Mantra.saiRam, label: 'ॐ साईं राम', short: 'साईं', color: 'from-orange-900 to-yellow-900' },
  { key: Mantra.sitaram, label: 'सीताराम सीताराम', short: 'सीताराम', color: 'from-pink-900 to-rose-900' },
  { key: Mantra.omMantra, label: 'ॐ', short: 'ॐ', color: 'from-purple-900 to-violet-900' },
  { key: Mantra.radhaNamJap, label: 'राधे राधे', short: 'राधे', color: 'from-pink-800 to-fuchsia-900' },
  { key: Mantra.jaiShreeRamNamJap, label: 'जय श्री राम', short: 'राम', color: 'from-amber-800 to-orange-900' },
];

const STORAGE_KEY_PREFIX = 'jap_count_';
const STORAGE_MANTRA_KEY = 'jap_selected_mantra';
const MALA_SIZE = 108;

function getStorageKey(mantra: Mantra) {
  return `${STORAGE_KEY_PREFIX}${mantra}`;
}

// ── Circular Progress Bar ──────────────────────────────────────────────────
interface CircularProgressProps {
  value: number; // 0–108
  size?: number;
}

function CircularProgress({ value, size = 160 }: CircularProgressProps) {
  const progress = Math.min(value, MALA_SIZE);
  const pct = progress / MALA_SIZE;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background track */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={10}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#japGradient)"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.25s ease-out' }}
          />
          <defs>
            <linearGradient id="japGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-amber-300 tabular-nums leading-none">
            {progress}
          </span>
          <span className="text-xs text-amber-200/60 mt-0.5">/ {MALA_SIZE}</span>
        </div>
      </div>
      {/* Linear label below */}
      <div className="w-full max-w-[160px]">
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct * 100}%`,
              background: 'linear-gradient(90deg, #FF9933, #FFD700)',
              transition: 'width 0.25s ease-out',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-amber-200/50 mt-1">
          <span>0</span>
          <span className="text-amber-300/80 font-medium">{Math.round(pct * 100)}%</span>
          <span>{MALA_SIZE}</span>
        </div>
      </div>
    </div>
  );
}

export default function Jap() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [selectedMantra, setSelectedMantra] = useState<Mantra>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MANTRA_KEY);
      return (saved as Mantra) || Mantra.omNamahShivaya;
    } catch {
      return Mantra.omNamahShivaya;
    }
  });

  // ── Core counter state ──────────────────────────────────────────────────
  // sessionCountRef: source of truth for the current session count (no stale closure)
  const sessionCountRef = useRef(0);
  // pendingRef: taps not yet synced to backend
  const pendingRef = useRef(0);
  // lastSyncedRef: total taps synced so far
  const lastSyncedRef = useRef(0);

  // React state for rendering (updated synchronously on tap)
  const [sessionCount, setSessionCount] = useState(0);
  // Today's total (backend daily + unsynced session taps)
  const [todayCount, setTodayCount] = useState(0);
  // Whether backend data has been loaded once
  const initializedRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  // ── Visual effect states ────────────────────────────────────────────────
  const [isPulsing, setIsPulsing] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [bloomTrigger, setBloomTrigger] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const particleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncingRef = useRef(false);

  const { data: japStats, isLoading: statsLoading } = useGetJapStats();
  const incrementJap = useIncrementJap();
  const resetJapStats = useResetJapStats();

  // ── Initialize from backend (only once, never overwrite active session) ──
  useEffect(() => {
    if (japStats && !initializedRef.current && isAuthenticated) {
      const backendDaily = Number(japStats.daily);
      initializedRef.current = true;
      setInitialized(true);
      setTodayCount(backendDaily);
      // Don't touch sessionCount — it starts at 0 for this session
    }
  }, [japStats, isAuthenticated]);

  // ── Guest: load from localStorage ──────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const saved = localStorage.getItem(getStorageKey(selectedMantra));
        const savedCount = saved ? parseInt(saved, 10) : 0;
        sessionCountRef.current = savedCount;
        pendingRef.current = 0;
        lastSyncedRef.current = savedCount;
        setSessionCount(savedCount);
        setTodayCount(savedCount);
        initializedRef.current = true;
        setInitialized(true);
      } catch {
        setSessionCount(0);
        setTodayCount(0);
        initializedRef.current = true;
        setInitialized(true);
      }
    }
  }, [selectedMantra, isAuthenticated]);

  // ── Save mantra selection ───────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MANTRA_KEY, selectedMantra);
    } catch { /* ignore */ }
  }, [selectedMantra]);

  // ── Save guest count to localStorage ───────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(getStorageKey(selectedMantra), sessionCount.toString());
      } catch { /* ignore */ }
    }
  }, [sessionCount, selectedMantra, isAuthenticated]);

  // ── Debounced backend sync ──────────────────────────────────────────────
  // Uses refs so it never has stale closure issues
  const doSync = useCallback(async () => {
    if (!isAuthenticated || isSyncingRef.current) return;
    const toSync = pendingRef.current;
    if (toSync <= 0) return;

    isSyncingRef.current = true;
    setIsSyncing(true);
    pendingRef.current = 0; // optimistically clear pending

    try {
      await incrementJap.mutateAsync(toSync);
      lastSyncedRef.current += toSync;
    } catch (e) {
      // On failure, restore pending count so next sync retries
      pendingRef.current += toSync;
      console.error('Sync failed:', e);
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [isAuthenticated, incrementJap]);

  const scheduleSync = useCallback(() => {
    if (!isAuthenticated) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(doSync, 1500);
  }, [isAuthenticated, doSync]);

  // ── Tap handler ─────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    // Increment ref immediately (no stale closure)
    sessionCountRef.current += 1;
    pendingRef.current += 1;
    const newSession = sessionCountRef.current;

    // Update React state synchronously for instant render
    setSessionCount(newSession);
    setTodayCount((prev) => prev + 1);

    // Pulse animation
    setIsPulsing(true);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setIsPulsing(false), 300);

    // Ripple
    setRippleTrigger((t) => t + 1);

    // Particles on multiples of 27
    if (newSession % 27 === 0) {
      setShowParticles(true);
      if (particleTimeoutRef.current) clearTimeout(particleTimeoutRef.current);
      particleTimeoutRef.current = setTimeout(() => setShowParticles(false), 800);
    }

    // Lotus bloom on 108
    if (newSession % MALA_SIZE === 0) {
      setBloomTrigger((t) => t + 1);
    }

    // Schedule debounced backend sync
    scheduleSync();
  }, [scheduleSync]);

  // ── Reset handler ───────────────────────────────────────────────────────
  const handleReset = useCallback(async () => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    // Flush any pending taps before reset
    const toSync = pendingRef.current;
    if (isAuthenticated && toSync > 0) {
      pendingRef.current = 0;
      try {
        await incrementJap.mutateAsync(toSync);
      } catch (e) {
        console.error('Final sync failed:', e);
      }
    }

    setIsResetting(true);
    try {
      if (isAuthenticated) {
        await resetJapStats.mutateAsync();
      }
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      setIsResetting(false);
    }

    // Reset all counters
    sessionCountRef.current = 0;
    pendingRef.current = 0;
    lastSyncedRef.current = 0;
    initializedRef.current = false;
    setSessionCount(0);
    setTodayCount(0);
    setInitialized(false);

    if (!isAuthenticated) {
      try {
        localStorage.setItem(getStorageKey(selectedMantra), '0');
      } catch { /* ignore */ }
    }
  }, [isAuthenticated, selectedMantra, incrementJap, resetJapStats]);

  // ── Mantra change handler ───────────────────────────────────────────────
  const handleMantraChange = useCallback(
    async (mantra: Mantra) => {
      if (mantra === selectedMantra) return;

      // Flush pending taps before switching
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      const toSync = pendingRef.current;
      if (isAuthenticated && toSync > 0) {
        pendingRef.current = 0;
        try {
          await incrementJap.mutateAsync(toSync);
        } catch (e) {
          console.error('Sync on mantra change failed:', e);
        }
      }

      setSelectedMantra(mantra);
      sessionCountRef.current = 0;
      pendingRef.current = 0;
      lastSyncedRef.current = 0;
      initializedRef.current = false;
      setSessionCount(0);
      setTodayCount(0);
      setInitialized(false);
    },
    [selectedMantra, isAuthenticated, incrementJap]
  );

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (particleTimeoutRef.current) clearTimeout(particleTimeoutRef.current);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      // Final sync on unmount
      if (isAuthenticated && pendingRef.current > 0) {
        incrementJap.mutateAsync(pendingRef.current).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const currentMantra = MANTRAS.find((m) => m.key === selectedMantra) || MANTRAS[0];
  const beadsInRound = sessionCount % MALA_SIZE;
  const malas = Math.floor(sessionCount / MALA_SIZE);
  const progressValue = beadsInRound === 0 && sessionCount > 0 ? MALA_SIZE : beadsInRound;

  const streakCount = japStats ? Number(japStats.streak) : 0;

  const isLoadingInitial = isAuthenticated && statsLoading && !initialized;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentMantra.color} text-white`}>
      {/* Lotus Bloom Overlay */}
      <LotusBloomOverlay trigger={bloomTrigger} />

      {/* Header */}
      <div className="pt-6 pb-2 px-4 text-center relative">
        <h1 className="text-2xl font-bold text-amber-300">नाम जप</h1>
        <p className="text-sm text-amber-200/70 mt-1">Nam Jap Counter</p>
        {streakCount > 0 && (
          <div className="absolute right-4 top-6 flex items-center gap-1 bg-orange-500/30 border border-orange-400/50 rounded-full px-3 py-1">
            <Flame className="w-4 h-4 text-orange-300 animate-pulse" />
            <span className="text-sm font-bold text-orange-200">{streakCount}</span>
            <span className="text-xs text-orange-300/80">दिन</span>
          </div>
        )}
      </div>

      {/* Mantra Selector */}
      <div className="px-4 mb-4 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {MANTRAS.map((m) => (
            <button
              key={m.key}
              onClick={() => handleMantraChange(m.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedMantra === m.key
                  ? 'bg-amber-400 text-amber-900 shadow-lg scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {m.short}
            </button>
          ))}
        </div>
      </div>

      {/* Mantra Display */}
      <div className="text-center px-4 mb-3">
        <p className="text-3xl font-bold text-amber-300 leading-relaxed">{currentMantra.label}</p>
      </div>

      {/* Today's Count — prominent display */}
      <div className="px-4 mb-3 text-center">
        <div className={`inline-block transition-transform duration-150 ${isPulsing ? 'scale-110' : 'scale-100'}`}>
          <p className="text-xs text-amber-200/60 uppercase tracking-widest mb-1">आज का जप</p>
          <p className="text-6xl font-bold text-amber-300 tabular-nums drop-shadow-lg">
            {isLoadingInitial ? (
              <span className="text-4xl opacity-50">...</span>
            ) : (
              todayCount.toLocaleString('hi-IN')
            )}
          </p>
        </div>
      </div>

      {/* Mala Ring + Tap Button */}
      <div className="flex flex-col items-center px-4 mb-3">
        <div className="relative mala-ring-breathe">
          <MalaRing count={beadsInRound} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <SacredRipple trigger={rippleTrigger} />
              {showParticles && <OmParticleBurst />}
              <button
                onClick={handleTap}
                className={`w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-transform touch-manipulation tap-glow ${isPulsing ? 'tap-glow-active' : ''}`}
                aria-label="Tap to count jap"
              >
                <span className="text-4xl font-bold text-white tabular-nums">
                  {progressValue}
                </span>
                <span className="text-xs text-white/80 mt-0.5">जप</span>
              </button>
            </div>
          </div>
        </div>

        {malas > 0 && (
          <div className="mt-3 bg-white/10 rounded-full px-4 py-1.5 text-sm text-amber-200 animate-bounce-subtle">
            🙏 {malas} माला पूर्ण
          </div>
        )}
      </div>

      {/* ── Mala Progress Bar ── */}
      <div className="px-4 mb-3">
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-amber-200/70 uppercase tracking-wide font-medium">माला प्रगति</p>
            <span className="text-xs text-amber-300/80 font-semibold">
              {progressValue} / {MALA_SIZE}
            </span>
          </div>

          {/* Linear progress bar */}
          <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-2">
            <div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: `${(progressValue / MALA_SIZE) * 100}%`,
                background: 'linear-gradient(90deg, #FF9933 0%, #FFD700 50%, #FF6B00 100%)',
                transition: 'width 0.2s ease-out',
                minWidth: progressValue > 0 ? '8px' : '0px',
              }}
            >
              {/* Shimmer effect */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>
          </div>

          {/* Bead markers at 27, 54, 81, 108 */}
          <div className="flex justify-between px-0.5">
            {[27, 54, 81, 108].map((mark) => (
              <div key={mark} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    progressValue >= mark ? 'bg-amber-400' : 'bg-white/20'
                  }`}
                />
                <span className="text-[9px] text-amber-200/40">{mark}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Count + Reset */}
      <div className="px-4 mb-3">
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-200/60 uppercase tracking-wide mb-1">नाम जप (सत्र)</p>
              <p className="text-3xl font-bold text-amber-300 tabular-nums">
                {sessionCount.toLocaleString('hi-IN')}
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={isResetting || sessionCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              रीसेट
            </button>
          </div>
        </div>
      </div>

      {/* Sync indicator */}
      {isAuthenticated && (
        <div className="px-4 mb-4 text-center">
          {isSyncing ? (
            <span className="text-xs text-amber-300/70 flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 border border-amber-300 border-t-transparent rounded-full animate-spin inline-block" />
              सिंक हो रहा है...
            </span>
          ) : (
            <span className="text-xs text-white/30 flex items-center justify-center gap-1">
              <CloudUpload className="w-3 h-3" />
              स्वतः सहेजा जाता है
            </span>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <p className="text-center text-xs text-white/40 px-4 mb-4">
          जीवन जप सहेजने के लिए लॉगिन करें
        </p>
      )}

      {/* Bottom padding for nav */}
      <div className="pb-24" />
    </div>
  );
}
