import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import DailyDharmaQuote from "../components/DailyDharmaQuote";
import FloatingLotus from "../components/FloatingLotus";
import { getNakshatra, getTithi, getVara } from "../lib/panchangEngine";
import { SHLOKAS } from "../lib/staticData";

const categories = [
  {
    path: "/jap" as const,
    label: "जाप",
    emoji: "📿",
    desc: "मंत्र जाप करें",
    gradient: "linear-gradient(135deg, #c2410c 0%, #ff9933 100%)",
    glow: "rgba(255,153,51,0.4)",
  },
  {
    path: "/aarti" as const,
    label: "आरती",
    emoji: "🪔",
    desc: "आरती पाठ करें",
    gradient: "linear-gradient(135deg, #b45309 0%, #fbbf24 100%)",
    glow: "rgba(251,191,36,0.4)",
  },
  {
    path: "/mantras" as const,
    label: "मंत्र",
    emoji: "🕉️",
    desc: "पवित्र मंत्र",
    gradient: "linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%)",
    glow: "rgba(139,92,246,0.4)",
  },
  {
    path: "/bhajans" as const,
    label: "भजन",
    emoji: "🎵",
    desc: "भक्ति भजन",
    gradient: "linear-gradient(135deg, #9d174d 0%, #ec4899 100%)",
    glow: "rgba(236,72,153,0.4)",
  },
  {
    path: "/chalisa" as const,
    label: "चालीसा",
    emoji: "📜",
    desc: "हनुमान चालीसा",
    gradient: "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)",
    glow: "rgba(239,68,68,0.4)",
  },
  {
    path: "/kathayen" as const,
    label: "कथाएं",
    emoji: "📖",
    desc: "पौराणिक कथाएं",
    gradient: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
    glow: "rgba(16,185,129,0.4)",
  },
  {
    path: "/panchang" as const,
    label: "पंचांग",
    emoji: "📅",
    desc: "आज का पंचांग",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    glow: "rgba(59,130,246,0.4)",
  },
  {
    path: "/mandir" as const,
    label: "मंदिर",
    emoji: "🛕",
    desc: "मंदिर दर्शन",
    gradient: "linear-gradient(135deg, #064e3b 0%, #14b8a6 100%)",
    glow: "rgba(20,184,166,0.4)",
  },
  {
    path: "/community" as const,
    label: "समाज",
    emoji: "🤝",
    desc: "भक्त समुदाय",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)",
    glow: "rgba(99,102,241,0.4)",
  },
  {
    path: "/ai-guru" as const,
    label: "AI गुरु",
    emoji: "🔮",
    desc: "आध्यात्मिक मार्गदर्शन",
    gradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",
    glow: "rgba(124,58,237,0.4)",
  },
];

export default function Home() {
  const [vratMode, setVratMode] = useState(false);
  const today = new Date();
  const tithi = getTithi(today);
  const nakshatra = getNakshatra(today);
  const vara = getVara(today);
  const shloka = SHLOKAS[0];

  useEffect(() => {
    const stored = localStorage.getItem("vratMode");
    setVratMode(stored === "true");
  }, []);

  return (
    <div
      className="animate-fade-in-up relative min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #0f0721 0%, #1a0a2e 40%, #0d1b3e 100%)",
      }}
    >
      <FloatingLotus />

      {/* Vrat Mode Banner */}
      {vratMode && (
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ background: "linear-gradient(90deg, #b45309, #c2410c)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🙏</span>
            <div>
              <p className="font-bold text-sm text-white">व्रत मोड सक्रिय है</p>
              <p className="text-xs text-amber-100">आज का व्रत विवरण</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setVratMode(false);
              localStorage.setItem("vratMode", "false");
            }}
            className="text-amber-100 text-xs border border-amber-200/40 rounded-full px-2 py-0.5"
          >
            बंद करें
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="h-52 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url(/assets/generated/mandala-hero.dim_1200x400.png)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,7,33,0.3) 0%, rgba(15,7,33,0.2) 50%, rgba(15,7,33,0.85) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div
              className="text-5xl mb-2 drop-shadow-lg"
              style={{ filter: "drop-shadow(0 0 12px rgba(255,215,0,0.6))" }}
            >
              🕉️
            </div>
            <h2
              className="text-3xl font-bold text-white drop-shadow-lg mb-1"
              style={{ textShadow: "0 0 20px rgba(255,153,51,0.6)" }}
            >
              जय श्री राम
            </h2>
            <p className="text-amber-300 text-sm font-medium drop-shadow">
              हर हर महादेव • राधे राधे
            </p>
          </div>
        </div>
      </div>

      {/* Panchang Strip */}
      <div
        className="px-4 py-3 mx-3 mt-3 rounded-2xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,153,51,0.15), rgba(255,215,0,0.1))",
          border: "1px solid rgba(255,153,51,0.3)",
        }}
      >
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-amber-400 text-xs font-medium">तिथि</p>
            <p className="text-white text-xs font-semibold">{tithi}</p>
          </div>
          <div className="w-px h-8 bg-amber-400/20" />
          <div>
            <p className="text-amber-400 text-xs font-medium">नक्षत्र</p>
            <p className="text-white text-xs font-semibold">{nakshatra}</p>
          </div>
          <div className="w-px h-8 bg-amber-400/20" />
          <div>
            <p className="text-amber-400 text-xs font-medium">वार</p>
            <p className="text-white text-xs font-semibold">{vara}</p>
          </div>
          <div className="w-px h-8 bg-amber-400/20" />
          <Link
            to="/panchang"
            className="text-amber-400 text-xs font-medium hover:text-amber-300 transition-colors"
          >
            पूरा →
          </Link>
        </div>
      </div>

      {/* Daily Shloka */}
      {shloka && (
        <div
          className="mx-4 mt-4 p-4 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,153,51,0.12), rgba(255,215,0,0.08))",
            border: "1px solid rgba(255,215,0,0.25)",
          }}
        >
          <p className="text-amber-400 text-xs font-semibold mb-2 uppercase tracking-wider">
            ✨ आज का श्लोक
          </p>
          <p className="text-white text-sm font-medium leading-relaxed font-hindi">
            {shloka.sanskrit}
          </p>
          <p className="text-amber-200/80 text-xs mt-1.5 leading-relaxed">
            {shloka.hindiMeaning}
          </p>
        </div>
      )}

      {/* Category Grid */}
      <div className="px-4 mt-5">
        <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
          <span>🙏</span> भक्ति सेवाएं
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="relative overflow-hidden rounded-2xl p-4 hover:scale-105 transition-all duration-300 group active:scale-95"
              style={{
                background: cat.gradient,
                boxShadow: `0 4px 16px ${cat.glow}`,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </span>
                <p className="text-white font-bold text-sm">{cat.label}</p>
                <p className="text-white/85 text-xs">{cat.desc}</p>
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-colors duration-300 rounded-2xl" />
            </Link>
          ))}
        </div>
      </div>

      {/* Dharma Quote */}
      <div className="px-4 mt-5">
        <DailyDharmaQuote />
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 mb-4">
        <h3 className="text-white font-bold text-base mb-3">⚡ त्वरित क्रियाएं</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            {
              path: "/jap" as const,
              label: "जाप शुरू करें",
              emoji: "📿",
              bg: "linear-gradient(135deg, rgba(194,65,12,0.5), rgba(255,153,51,0.3))",
              border: "rgba(255,153,51,0.4)",
            },
            {
              path: "/aarti" as const,
              label: "आरती करें",
              emoji: "🪔",
              bg: "linear-gradient(135deg, rgba(180,83,9,0.5), rgba(251,191,36,0.3))",
              border: "rgba(251,191,36,0.4)",
            },
            {
              path: "/kathayen" as const,
              label: "कथाएं",
              emoji: "📖",
              bg: "linear-gradient(135deg, rgba(6,78,59,0.5), rgba(16,185,129,0.3))",
              border: "rgba(16,185,129,0.4)",
            },
            {
              path: "/community" as const,
              label: "समुदाय",
              emoji: "🤝",
              bg: "linear-gradient(135deg, rgba(30,27,75,0.5), rgba(99,102,241,0.3))",
              border: "rgba(99,102,241,0.4)",
            },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="flex-shrink-0 rounded-xl px-4 py-3 flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:shadow-lg active:scale-95"
              style={{
                background: action.bg,
                border: `1px solid ${action.border}`,
              }}
            >
              <span className="text-xl">{action.emoji}</span>
              <span className="text-white text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-4 py-6 text-center border-t mt-4"
        style={{ borderColor: "rgba(255,153,51,0.15)" }}
      >
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} सनातन प्रो • Built with{" "}
          <span className="text-red-400">❤️</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
