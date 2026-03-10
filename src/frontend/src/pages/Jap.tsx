import { useCallback, useEffect, useRef, useState } from "react";
import { Mantra } from "../backend";
import MalaRing from "../components/MalaRing";
import { useGetJapStats, useIncrementJap } from "../hooks/useQueries";

const MANTRA_OPTIONS: {
  value: Mantra;
  label: string;
  text: string;
  color: string;
}[] = [
  {
    value: Mantra.omNamahShivaya,
    label: "ॐ नमः शिवाय",
    text: "ॐ नमः शिवाय",
    color: "from-blue-600 to-purple-600",
  },
  {
    value: Mantra.hareKrishna,
    label: "हरे कृष्ण",
    text: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
    color: "from-yellow-500 to-orange-500",
  },
  {
    value: Mantra.gayatriMantra,
    label: "गायत्री मंत्र",
    text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं",
    color: "from-amber-500 to-yellow-400",
  },
  {
    value: Mantra.mahamrityunjayaMantra,
    label: "महामृत्युंजय",
    text: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
    color: "from-green-600 to-teal-500",
  },
  {
    value: Mantra.saiRam,
    label: "साईं राम",
    text: "ॐ साईं राम",
    color: "from-orange-500 to-amber-400",
  },
  {
    value: Mantra.sitaram,
    label: "सीताराम",
    text: "सीताराम सीताराम सीताराम",
    color: "from-pink-500 to-rose-500",
  },
  {
    value: Mantra.omMantra,
    label: "ॐ",
    text: "ॐ",
    color: "from-violet-600 to-indigo-600",
  },
  {
    value: Mantra.radhaNamJap,
    label: "राधे राधे",
    text: "राधे राधे राधे श्याम मिला दे",
    color: "from-pink-600 to-purple-500",
  },
  {
    value: Mantra.jaiShreeRamNamJap,
    label: "जय श्री राम",
    text: "जय श्री राम जय श्री राम",
    color: "from-orange-600 to-red-500",
  },
];

// localStorage keys
const LS_DAILY = "jap_daily_count";
const LS_DAILY_DATE = "jap_daily_date"; // stores YYYY-MM-DD string
const LS_LIFETIME = "jap_lifetime_count";
const LS_MALA = "jap_mala_count";

function getTodayDateIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
}

function loadLocalStats() {
  const storedDate = localStorage.getItem(LS_DAILY_DATE) ?? "";
  const today = getTodayDateIST();
  let daily = Number.parseInt(localStorage.getItem(LS_DAILY) ?? "0", 10);

  // If the stored date is not today, daily resets at midnight
  if (storedDate !== today) {
    daily = 0;
    localStorage.setItem(LS_DAILY, "0");
    localStorage.setItem(LS_DAILY_DATE, today);
  }

  const lifetime = Number.parseInt(
    localStorage.getItem(LS_LIFETIME) ?? "0",
    10,
  );
  const mala = Number.parseInt(localStorage.getItem(LS_MALA) ?? "0", 10);

  return { daily, lifetime, mala };
}

function saveLocalStats(daily: number, lifetime: number, mala: number) {
  localStorage.setItem(LS_DAILY, String(daily));
  localStorage.setItem(LS_DAILY_DATE, getTodayDateIST());
  localStorage.setItem(LS_LIFETIME, String(lifetime));
  localStorage.setItem(LS_MALA, String(mala));
}

export default function Jap() {
  const [count, setCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState<Mantra>(
    Mantra.omNamahShivaya,
  );
  const [dailyCount, setDailyCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);
  const [tapFlash, setTapFlash] = useState(false);

  const { data: japStats } = useGetJapStats();
  const incrementJap = useIncrementJap();

  // Buffer for debounced backend sync — accumulates taps to batch-save
  const pendingTapsRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount: load from localStorage first (instant), then sync from backend
  useEffect(() => {
    const local = loadLocalStats();
    setDailyCount(local.daily);
    setLifetimeCount(local.lifetime);
    setMalaCount(local.mala);
  }, []);

  // When backend data arrives, take the higher of local vs backend for lifetime
  // and use backend daily only if it is larger (backend is source of truth for sync)
  useEffect(() => {
    if (japStats) {
      const backendDaily = Number(japStats.daily);
      const backendLifetime = Number(japStats.lifetime);
      const backendMala = Number(japStats.mala);
      const backendStreak = Number(japStats.streak);

      const local = loadLocalStats();

      // Merge: take max so neither source loses counts
      const mergedDaily = Math.max(local.daily, backendDaily);
      const mergedLifetime = Math.max(local.lifetime, backendLifetime);
      const mergedMala = Math.max(local.mala, backendMala);

      setDailyCount(mergedDaily);
      setLifetimeCount(mergedLifetime);
      setMalaCount(mergedMala);
      setStreak(backendStreak);

      // Persist merged values locally
      saveLocalStats(mergedDaily, mergedLifetime, mergedMala);
    }
  }, [japStats]);

  // Schedule midnight reset check
  useEffect(() => {
    function scheduleMidnightReset() {
      const now = new Date();
      const nextMidnightIST = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      nextMidnightIST.setDate(nextMidnightIST.getDate() + 1);
      nextMidnightIST.setHours(0, 0, 0, 0);
      const msUntilMidnight =
        nextMidnightIST.getTime() -
        new Date(
          now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        ).getTime();

      const timer = setTimeout(() => {
        // Reset daily count at midnight
        setDailyCount(0);
        localStorage.setItem(LS_DAILY, "0");
        localStorage.setItem(LS_DAILY_DATE, getTodayDateIST());
        // Re-schedule for next midnight
        scheduleMidnightReset();
      }, msUntilMidnight);

      return timer;
    }

    const timer = scheduleMidnightReset();
    return () => clearTimeout(timer);
  }, []);

  const currentMantra =
    MANTRA_OPTIONS.find((m) => m.value === selectedMantra) ?? MANTRA_OPTIONS[0];

  // Flush pending taps to backend (debounced — fires 2s after last tap)
  const flushTaps = useCallback(() => {
    if (pendingTapsRef.current > 0) {
      const taps = pendingTapsRef.current;
      pendingTapsRef.current = 0;
      incrementJap.mutate(BigInt(taps));
    }
  }, [incrementJap]);

  const handleTap = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);

    // Update daily and lifetime counts — use functional updates to avoid stale closure
    setDailyCount((prevDaily) => {
      setLifetimeCount((prevLifetime) => {
        const newLifetime = prevLifetime + 1;
        // Persist both to localStorage with correct values
        const local = loadLocalStats();
        saveLocalStats(prevDaily + 1, newLifetime, local.mala);
        return newLifetime;
      });
      return prevDaily + 1;
    });

    setTapFlash(true);
    setTimeout(() => setTapFlash(false), 150);

    // Accumulate tap for debounced backend sync
    pendingTapsRef.current += 1;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(flushTaps, 2000);

    if (newCount === 108) {
      setMalaCount((prev) => {
        const next = prev + 1;
        const local = loadLocalStats();
        saveLocalStats(local.daily, local.lifetime, next);
        return next;
      });
      setCount(0);
      // Force flush immediately on mala completion
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      const taps = pendingTapsRef.current;
      pendingTapsRef.current = 0;
      incrementJap.mutate(BigInt(taps));
      // Vibrate twice (two short pulses) — no popup, no lotus
      if (navigator.vibrate) navigator.vibrate([150, 100, 150]);
    }
  }, [count, flushTaps, incrementJap]);

  // Flush on unmount so nothing is lost when user navigates away
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      flushTaps();
    };
  }, [flushTaps]);

  const handleReset = () => {
    // Only resets current mala progress (0–108), NOT daily or lifetime
    setCount(0);
  };

  const progress = (count / 108) * 100;

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background:
          "linear-gradient(180deg, #1a0533 0%, #2d0a4e 30%, #0f1a3d 70%, #0a0f2e 100%)",
      }}
    >
      {/* Header */}
      <div className="relative px-4 pt-6 pb-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-48 h-48 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #ff9933 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative">
          <div className="text-4xl mb-2">📿</div>
          <h1 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
            नाम जाप
          </h1>
          <p className="text-amber-300 text-sm">मंत्र जाप करें — मन को शांत करें</p>
        </div>
      </div>

      {/* Mantra Selector Cards */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {MANTRA_OPTIONS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setSelectedMantra(m.value)}
              data-ocid={`jap.mantra.${m.label.replace(/\s/g, "_")}.button`}
              className={`relative rounded-xl py-2 px-1 text-center transition-all duration-200 overflow-hidden ${
                selectedMantra === m.value
                  ? "ring-2 ring-amber-400 scale-105 shadow-lg shadow-amber-500/30"
                  : "opacity-70 hover:opacity-90"
              }`}
              style={{
                background:
                  selectedMantra === m.value
                    ? `linear-gradient(135deg, ${m.color.includes("blue") ? "#1e40af, #7c3aed" : m.color.includes("yellow") ? "#d97706, #ea580c" : m.color.includes("amber") ? "#b45309, #ca8a04" : m.color.includes("green") ? "#15803d, #0d9488" : m.color.includes("orange") ? "#c2410c, #d97706" : m.color.includes("pink") && m.color.includes("rose") ? "#be185d, #e11d48" : m.color.includes("violet") ? "#5b21b6, #3730a3" : m.color.includes("pink") && m.color.includes("purple") ? "#9d174d, #7e22ce" : "#c2410c, #b91c1c"})`
                    : "rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-white text-xs font-medium leading-tight">
                {m.label}
              </p>
            </button>
          ))}
        </div>
        {/* Current Mantra Display */}
        <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 text-center border border-amber-400/30">
          <p className="text-amber-200 text-xs mb-1 font-medium uppercase tracking-wider">
            वर्तमान मंत्र
          </p>
          <p className="text-white font-bold text-base leading-relaxed">
            {currentMantra.text}
          </p>
        </div>
      </div>

      {/* Mala Ring + Count + Progress */}
      <div className="flex flex-col items-center px-4 mb-6">
        <div
          className={`relative transition-transform duration-150 ${tapFlash ? "scale-105" : "scale-100"}`}
          style={{
            filter: tapFlash
              ? "drop-shadow(0 0 20px rgba(255,153,51,0.8))"
              : "none",
          }}
        >
          <MalaRing count={count} />
          {/* Count overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center mt-8">
              <p className="text-5xl font-bold text-white drop-shadow-lg">
                {count}
              </p>
              <p className="text-amber-300 text-sm font-semibold drop-shadow">
                / 108
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mt-5">
          <div className="flex justify-between text-xs font-semibold text-amber-200 mb-1.5">
            <span>माला प्रगति</span>
            <span className="text-amber-400">{Math.round(progress)}%</span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #ff9933, #ffd700, #ff6b35)",
                boxShadow:
                  progress > 0 ? "0 0 8px rgba(255,153,51,0.6)" : "none",
              }}
            />
          </div>
          <p className="text-center text-xs font-semibold text-amber-300 mt-1.5">
            {108 - count} जाप शेष
          </p>
        </div>
      </div>

      {/* TAP BUTTON */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={handleTap}
          data-ocid="jap.tap.button"
          className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-150 active:scale-90 hover:scale-105"
          style={{
            background:
              "linear-gradient(135deg, #ff9933 0%, #ffd700 50%, #ff6b35 100%)",
            boxShadow: tapFlash
              ? "0 0 40px rgba(255,153,51,0.9), 0 0 80px rgba(255,215,0,0.5), inset 0 0 20px rgba(255,255,255,0.3)"
              : "0 0 20px rgba(255,153,51,0.5), 0 8px 32px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
            border: "3px solid rgba(255,215,0,0.6)",
          }}
          aria-label="जाप करें"
        >
          {/* Inner glow ring */}
          <div className="absolute inset-2 rounded-full border border-white/20" />
          <span className="text-3xl mb-1">🙏</span>
          <p className="text-white font-bold text-sm drop-shadow">जाप</p>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "आज का जाप",
              value: dailyCount,
              emoji: "📅",
              color: "from-blue-900/60 to-blue-800/40",
              border: "border-blue-500/30",
              text: "text-blue-300",
              note: "रात 12 बजे reset",
            },
            {
              label: "माला पूर्ण",
              value: malaCount,
              emoji: "📿",
              color: "from-amber-900/60 to-amber-800/40",
              border: "border-amber-500/30",
              text: "text-amber-300",
              note: null,
            },
            {
              label: "स्ट्रीक",
              value: `${streak} दिन`,
              emoji: "🔥",
              color: "from-orange-900/60 to-red-900/40",
              border: "border-orange-500/30",
              text: "text-orange-300",
              note: null,
            },
            {
              label: "जीवन भर जाप",
              value: lifetimeCount,
              emoji: "⭐",
              color: "from-purple-900/60 to-violet-900/40",
              border: "border-purple-500/30",
              text: "text-purple-300",
              note: "कभी reset नहीं",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-4 text-center backdrop-blur`}
            >
              <p className="text-2xl mb-1">{stat.emoji}</p>
              <p className={`text-xl font-bold ${stat.text}`}>{stat.value}</p>
              <p className="text-xs font-medium text-white/80">{stat.label}</p>
              {stat.note && (
                <p className="text-xs text-white/50 mt-0.5">{stat.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reset current mala only — NOT daily or lifetime */}
      <div className="px-4 mb-8">
        <button
          type="button"
          onClick={handleReset}
          data-ocid="jap.reset_mala.button"
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "rgba(255,153,51,0.15)",
            color: "#ffd700",
            border: "1px solid rgba(255,153,51,0.3)",
          }}
        >
          🔄 माला रीसेट (0–108 काउंटर)
        </button>
        <p className="text-center text-xs text-amber-300/60 mt-2">
          आज का जाप और जीवन भर जाप reset नहीं होगा
        </p>
      </div>
    </div>
  );
}
