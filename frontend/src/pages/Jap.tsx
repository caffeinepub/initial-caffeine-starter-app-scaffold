import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetJapStats, useIncrementJap } from '../hooks/useQueries';
import { Mantra } from '../backend';
import MalaRing from '../components/MalaRing';
import SacredRipple from '../components/SacredRipple';
import LotusBloomOverlay from '../components/LotusBloomOverlay';
import OmParticleBurst from '../components/OmParticleBurst';

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

function getStorageKey(mantra: Mantra) {
  return `${STORAGE_KEY_PREFIX}${mantra}`;
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

  // Session count: counts taps in the current session
  const [sessionCount, setSessionCount] = useState(0);
  // Local lifetime: the displayed lifetime count (backend value + unsynced session taps)
  const [localLifetime, setLocalLifetime] = useState(0);
  // Whether we've initialized localLifetime from backend
  const [lifetimeInitialized, setLifetimeInitialized] = useState(false);

  // Ripple trigger counter (increments on each tap)
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  // Lotus bloom trigger counter (increments on each 108 completion)
  const [bloomTrigger, setBloomTrigger] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedCount, setLastSyncedCount] = useState(0);

  const particleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: japStats, isLoading: statsLoading } = useGetJapStats();
  const incrementJap = useIncrementJap();

  // Initialize localLifetime from backend when japStats loads
  useEffect(() => {
    if (japStats && !lifetimeInitialized) {
      const backendLifetime = Number(japStats.lifetime);
      setLocalLifetime(backendLifetime);
      setLifetimeInitialized(true);
    }
  }, [japStats, lifetimeInitialized]);

  // When japStats refreshes after a sync, update localLifetime to reflect the new backend value
  useEffect(() => {
    if (japStats && lifetimeInitialized && !isSyncing) {
      const backendLifetime = Number(japStats.lifetime);
      const unsyncedTaps = sessionCount - lastSyncedCount;
      setLocalLifetime(backendLifetime + Math.max(0, unsyncedTaps));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [japStats]);

  // For guest users: load session count from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const saved = localStorage.getItem(getStorageKey(selectedMantra));
        const savedCount = saved ? parseInt(saved, 10) : 0;
        setSessionCount(savedCount);
        setLocalLifetime(savedCount);
        setLifetimeInitialized(true);
      } catch {
        setSessionCount(0);
        setLocalLifetime(0);
        setLifetimeInitialized(true);
      }
    }
  }, [selectedMantra, isAuthenticated]);

  // Save mantra selection
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MANTRA_KEY, selectedMantra);
    } catch { /* ignore */ }
  }, [selectedMantra]);

  // Save guest count to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(getStorageKey(selectedMantra), sessionCount.toString());
      } catch { /* ignore */ }
    }
  }, [sessionCount, selectedMantra, isAuthenticated]);

  // Auto-sync for authenticated users (debounced)
  const scheduleSync = useCallback(
    (count: number) => {
      if (!isAuthenticated) return;
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(async () => {
        const toSync = count - lastSyncedCount;
        if (toSync <= 0) return;
        setIsSyncing(true);
        try {
          await incrementJap.mutateAsync(toSync);
          setLastSyncedCount(count);
        } catch (e) {
          console.error('Sync failed:', e);
        } finally {
          setIsSyncing(false);
        }
      }, 3000);
    },
    [isAuthenticated, lastSyncedCount, incrementJap]
  );

  const handleTap = useCallback(() => {
    const newSession = sessionCount + 1;
    setSessionCount(newSession);
    setLocalLifetime((prev) => prev + 1);

    // Ripple — increment trigger
    setRippleTrigger((t) => t + 1);

    // Particles on multiples of 27
    if (newSession % 27 === 0) {
      setShowParticles(true);
      if (particleTimeoutRef.current) clearTimeout(particleTimeoutRef.current);
      particleTimeoutRef.current = setTimeout(() => setShowParticles(false), 800);
    }

    // Lotus bloom on 108 — increment trigger
    if (newSession % 108 === 0) {
      setBloomTrigger((t) => t + 1);
    }

    scheduleSync(newSession);
  }, [sessionCount, scheduleSync]);

  const handleReset = useCallback(async () => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    // Sync any remaining before reset
    const toSync = sessionCount - lastSyncedCount;
    if (isAuthenticated && toSync > 0) {
      try {
        await incrementJap.mutateAsync(toSync);
      } catch (e) {
        console.error('Final sync failed:', e);
      }
    }

    setSessionCount(0);
    setLastSyncedCount(0);
    if (!isAuthenticated) {
      try {
        localStorage.setItem(getStorageKey(selectedMantra), '0');
      } catch { /* ignore */ }
      setLocalLifetime(0);
    }
  }, [sessionCount, lastSyncedCount, isAuthenticated, selectedMantra, incrementJap]);

  const handleMantraChange = useCallback(
    async (mantra: Mantra) => {
      if (mantra === selectedMantra) return;

      // Sync current session before switching
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      const toSync = sessionCount - lastSyncedCount;
      if (isAuthenticated && toSync > 0) {
        try {
          await incrementJap.mutateAsync(toSync);
        } catch (e) {
          console.error('Sync on mantra change failed:', e);
        }
      }

      setSelectedMantra(mantra);
      setSessionCount(0);
      setLastSyncedCount(0);
      setLifetimeInitialized(false);
    },
    [selectedMantra, sessionCount, lastSyncedCount, isAuthenticated, incrementJap]
  );

  const currentMantra = MANTRAS.find((m) => m.key === selectedMantra) || MANTRAS[0];
  // beadsInRound: 0–107 for MalaRing count prop
  const beadsInRound = sessionCount % 108;
  const malas = Math.floor(sessionCount / 108);

  const dailyCount = japStats ? Number(japStats.daily) : 0;
  const weeklyCount = japStats ? Number(japStats.weekly) : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentMantra.color} text-white`}>
      {/* Lotus Bloom Overlay — trigger-based */}
      <LotusBloomOverlay trigger={bloomTrigger} />

      {/* Header */}
      <div className="pt-6 pb-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-amber-300">नाम जप</h1>
        <p className="text-sm text-amber-200/70 mt-1">Nam Jap Counter</p>
      </div>

      {/* Mantra Selector */}
      <div className="px-4 mb-6">
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
      <div className="text-center px-4 mb-6">
        <p className="text-3xl font-bold text-amber-300 leading-relaxed">{currentMantra.label}</p>
      </div>

      {/* Mala Ring + Tap Button */}
      <div className="flex flex-col items-center px-4 mb-6">
        <div className="relative">
          {/* MalaRing uses count prop (0–108) */}
          <MalaRing count={beadsInRound} />

          {/* Tap Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* SacredRipple uses trigger prop */}
              <SacredRipple trigger={rippleTrigger} />
              {showParticles && <OmParticleBurst />}
              <button
                onClick={handleTap}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-transform touch-manipulation"
                aria-label="Tap to count jap"
              >
                <span className="text-4xl font-bold text-white">
                  {beadsInRound === 0 && sessionCount > 0 ? 108 : beadsInRound}
                </span>
                <span className="text-xs text-white/80 mt-0.5">जप</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mala count */}
        {malas > 0 && (
          <div className="mt-3 bg-white/10 rounded-full px-4 py-1.5 text-sm text-amber-200">
            🙏 {malas} माला पूर्ण
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {/* Session */}
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-amber-300">{sessionCount}</p>
            <p className="text-xs text-white/60 mt-0.5">आज का जप</p>
          </div>

          {/* Lifetime */}
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            {statsLoading && isAuthenticated ? (
              <div className="flex items-center justify-center h-8">
                <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <p className="text-2xl font-bold text-amber-300">{localLifetime.toLocaleString('hi-IN')}</p>
            )}
            <p className="text-xs text-white/60 mt-0.5">जीवन जप</p>
          </div>

          {/* Weekly (authenticated only) */}
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            {isAuthenticated ? (
              <>
                <p className="text-2xl font-bold text-amber-300">{weeklyCount.toLocaleString('hi-IN')}</p>
                <p className="text-xs text-white/60 mt-0.5">साप्ताहिक</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-amber-300/40">—</p>
                <p className="text-xs text-white/40 mt-0.5">लॉगिन करें</p>
              </>
            )}
          </div>
        </div>

        {/* Sync indicator */}
        {isAuthenticated && (
          <div className="mt-2 text-center">
            {isSyncing ? (
              <span className="text-xs text-amber-300/70 flex items-center justify-center gap-1">
                <span className="w-3 h-3 border border-amber-300 border-t-transparent rounded-full animate-spin inline-block" />
                सिंक हो रहा है...
              </span>
            ) : (
              <span className="text-xs text-white/30">☁ स्वतः सहेजा जाता है</span>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <p className="text-center text-xs text-white/40 mt-2">
            जीवन जप सहेजने के लिए लॉगिन करें
          </p>
        )}
      </div>

      {/* Daily stats for authenticated */}
      {isAuthenticated && (
        <div className="px-4 mb-4">
          <div className="bg-white/5 rounded-2xl p-3 flex justify-between items-center">
            <div className="text-center">
              <p className="text-lg font-bold text-amber-200">{dailyCount.toLocaleString('hi-IN')}</p>
              <p className="text-xs text-white/50">दैनिक</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-lg font-bold text-amber-200">{weeklyCount.toLocaleString('hi-IN')}</p>
              <p className="text-xs text-white/50">साप्ताहिक</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-lg font-bold text-amber-200">{localLifetime.toLocaleString('hi-IN')}</p>
              <p className="text-xs text-white/50">जीवन काल</p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="px-4 pb-24 flex justify-center">
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 text-sm transition-colors"
        >
          सत्र रीसेट करें
        </button>
      </div>
    </div>
  );
}
