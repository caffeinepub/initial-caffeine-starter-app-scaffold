import { LogOut, Shield, Star } from "lucide-react";
import React, { useState } from "react";
import VratModeDashboard from "../components/VratModeDashboard";
import VratModeToggle from "../components/VratModeToggle";
import { useAuth } from "../hooks/useAuth";
import { useGetJapStats } from "../hooks/useQueries";

export default function Profile() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [vratMode, setVratMode] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const { data: japStats } = useGetJapStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 pb-24">
        <div className="text-6xl">🕉️</div>
        <h2 className="text-xl font-bold text-foreground">प्रोफाइल</h2>
        <p className="text-foreground/70 text-center text-sm">
          अपनी प्रोफाइल देखने के लिए login करें।
        </p>
        <button
          type="button"
          onClick={() => setShowLoginHint(true)}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium"
        >
          Login करें
        </button>
        {showLoginHint && (
          <p className="text-xs text-muted-foreground text-center">
            Header में Login बटन दबाएँ।
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-accent px-4 pt-8 pb-10">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center text-4xl border-2 border-primary-foreground/40">
              {isAdmin ? "👑" : "🕉️"}
            </div>
            {isAdmin && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Shield size={12} className="text-yellow-900" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary-foreground">
              {user?.username}
            </h2>
            {isAdmin && (
              <div className="flex items-center justify-center gap-1.5 mt-1.5 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-3 py-1">
                <Shield size={12} className="text-yellow-300" />
                <span className="text-yellow-300 text-xs font-bold">ADMIN</span>
                <Star size={10} className="text-yellow-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-5">
        {/* Stats Card */}
        <div
          className="rounded-2xl p-4 mb-4 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1a0533 0%, #2d0a4e 80%)",
            border: "1px solid rgba(255,215,0,0.25)",
          }}
        >
          <h3 className="font-semibold text-amber-300 text-sm mb-3 flex items-center gap-1.5">
            📿 जाप आँकड़े
          </h3>

          {/* Lifetime — most prominent, never resets */}
          <div
            className="rounded-xl p-3 mb-3 text-center"
            style={{
              background: "linear-gradient(135deg, #3d1a6e, #1a0533)",
              border: "1.5px solid rgba(255,215,0,0.4)",
            }}
          >
            <p className="text-amber-200 text-xs font-medium mb-0.5">
              ⭐ जीवन भर जाप (कभी reset नहीं)
            </p>
            <p className="text-3xl font-bold text-amber-300">
              {(() => {
                const local = Number.parseInt(
                  localStorage.getItem("jap_lifetime_count") ?? "0",
                  10,
                );
                const backend = Number(japStats?.lifetime ?? 0);
                return Math.max(local, backend).toLocaleString("hi-IN");
              })()}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              className="text-center rounded-xl p-2.5"
              style={{
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            >
              <p className="text-lg font-bold text-blue-300">
                {(() => {
                  const local = Number.parseInt(
                    localStorage.getItem("jap_daily_count") ?? "0",
                    10,
                  );
                  const backend = Number(japStats?.daily ?? 0);
                  return Math.max(local, backend);
                })()}
              </p>
              <p className="text-xs text-blue-200/80 font-medium">📅 आज</p>
              <p className="text-xs text-blue-200/50">रात 12 बजे reset</p>
            </div>
            <div
              className="text-center rounded-xl p-2.5"
              style={{
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              <p className="text-lg font-bold text-amber-300">
                {(() => {
                  const local = Number.parseInt(
                    localStorage.getItem("jap_mala_count") ?? "0",
                    10,
                  );
                  const backend = Number(japStats?.mala ?? 0);
                  return Math.max(local, backend);
                })()}
              </p>
              <p className="text-xs text-amber-200/80 font-medium">📿 माला</p>
              <p className="text-xs text-amber-200/50">108 × माला</p>
            </div>
            <div
              className="text-center rounded-xl p-2.5"
              style={{
                background: "rgba(249,115,22,0.15)",
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              <p className="text-lg font-bold text-orange-300">
                {japStats?.streak?.toString() ?? "0"}
              </p>
              <p className="text-xs text-orange-200/80 font-medium">
                🔥 streak
              </p>
              <p className="text-xs text-orange-200/50">दिन</p>
            </div>
          </div>
        </div>

        {/* Vrat Mode */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-sm">
          <VratModeToggle enabled={vratMode} onToggle={setVratMode} />
        </div>

        {vratMode && (
          <div className="mb-4">
            <VratModeDashboard />
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield
                size={16}
                className="text-yellow-600 dark:text-yellow-400"
              />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
                Admin Controls
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/admin";
              }}
              className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Admin Panel खोलें
            </button>
          </div>
        )}

        {/* Devotional Ad Banner */}
        <a
          href="https://www.effectivegatecpm.com/q0qfvkuusi?key=8f08e2d7eccc660a461f2ef859645f38"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4"
          data-ocid="profile.banner.link"
        >
          <div
            className="relative rounded-2xl overflow-hidden shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #1a0a00 0%, #3d1a00 40%, #7a3500 70%, #1a0a00 100%)",
              border: "2px solid #FFD700",
              boxShadow: "0 0 18px 3px #FF993388, 0 2px 16px #FFD70055",
            }}
          >
            {/* Top glow line */}
            <div
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #FFD700, #FF9933, #FFD700, transparent)",
              }}
            />

            {/* Diya & flame animation */}
            <div className="flex flex-col items-center pt-4 pb-1 gap-1">
              <span
                style={{
                  fontSize: 38,
                  filter: "drop-shadow(0 0 10px #FFD700)",
                }}
              >
                🪔
              </span>
              <div
                style={{
                  width: 28,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse, #FFD70088 60%, transparent 100%)",
                  marginTop: -6,
                  animation: "pulse 1.5s infinite",
                }}
              />
            </div>

            {/* Main text */}
            <div className="text-center px-4 pb-2">
              <p
                className="text-base font-extrabold tracking-wide"
                style={{
                  color: "#FFD700",
                  textShadow: "0 0 12px #FF9933, 0 0 4px #FFD700",
                  fontFamily: "serif",
                  lineHeight: 1.3,
                }}
              >
                🙏 भगवान की कृपा पाएं
              </p>
              <p
                className="text-xs mt-1 font-semibold"
                style={{ color: "#FFC87A", letterSpacing: "0.05em" }}
              >
                दैवीय आशीर्वाद के लिए यहाँ स्पर्श करें
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, #FFD70066, transparent)",
                margin: "0 16px",
              }}
            />

            {/* CTA row */}
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 20 }}>🕉️</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#FFD700" }}>
                    सनातन धर्म
                  </p>
                  <p className="text-xs" style={{ color: "#FFC87A88" }}>
                    की जय हो
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "linear-gradient(90deg, #FF9933, #FFD700)",
                  color: "#1a0a00",
                  boxShadow: "0 0 10px #FF993388",
                  whiteSpace: "nowrap",
                }}
              >
                <span>✨</span> अभी देखें
              </div>
            </div>

            {/* Bottom glow line */}
            <div
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg, transparent, #FF9933, #FFD700, #FF9933, transparent)",
              }}
            />
          </div>
        </a>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-border rounded-2xl text-foreground hover:bg-muted transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* Made by credit with animation */}
        <div className="mt-6 mb-2 flex flex-col items-center gap-1">
          <MadeByCredit />
        </div>
      </div>
    </div>
  );
}

function MadeByCredit() {
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 60), 50);
    return () => clearInterval(id);
  }, []);

  // Floating Om symbols positions (deterministic, cycle-based)
  const symbols = ["🕉️", "✨", "🪷", "🌸", "⭐"];
  const positions = [
    { left: "8%", bottom: "60%" },
    { left: "80%", bottom: "70%" },
    { left: "45%", bottom: "80%" },
    { left: "20%", bottom: "40%" },
    { left: "70%", bottom: "45%" },
  ];

  const glowColors = ["#FF9933", "#FFD700", "#FF6B35", "#FFC107", "#FF8C00"];

  // Cycle through letters with a shimmer effect
  const text = "Made by Nitin Saharawat";
  const letters = text.split("");

  return (
    <div className="relative w-full flex flex-col items-center py-4 overflow-hidden select-none">
      {/* Floating animated symbols */}
      {symbols.map((sym, i) => {
        const angle =
          (frame / 60) * 2 * Math.PI + (i * 2 * Math.PI) / symbols.length;
        const yOffset = Math.sin(angle + i) * 8;
        const opacity = 0.5 + 0.5 * Math.sin(angle + i * 1.3);
        return (
          <span
            key={`sym-${i}-${sym}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: positions[i].left,
              bottom: positions[i].bottom,
              fontSize: "14px",
              opacity,
              transform: `translateY(${yOffset}px) scale(${0.8 + 0.2 * Math.abs(Math.sin(angle))})`,
              transition: "none",
              pointerEvents: "none",
            }}
          >
            {sym}
          </span>
        );
      })}

      {/* Glowing divider line */}
      <div
        className="w-2/3 h-px mb-3 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColors[frame % glowColors.length]}, transparent)`,
          boxShadow: `0 0 8px ${glowColors[frame % glowColors.length]}`,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      />

      {/* Animated shimmer text */}
      <p
        className="text-xs font-semibold tracking-widest text-center"
        style={{ letterSpacing: "0.15em" }}
      >
        {letters.map((ch, i) => {
          const wave = Math.sin((frame / 60) * 2 * Math.PI * 2 - i * 0.4);
          const brightness = 0.7 + 0.3 * wave;
          const color = i % 2 === 0 ? "#FF9933" : "#FFD700";
          return (
            <span
              key={`letter-${i}-${ch}`}
              style={{
                color,
                filter: `brightness(${brightness}) drop-shadow(0 0 ${3 + wave * 3}px ${color})`,
                display: "inline-block",
                transform: `translateY(${wave * 2}px)`,
                transition: "none",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        })}
      </p>

      {/* Subtitle */}
      <p
        className="text-xs mt-1"
        style={{
          color: `hsl(${(frame * 2) % 360}, 80%, 65%)`,
          transition: "color 0.1s",
          fontStyle: "italic",
          textShadow: "0 0 6px rgba(255,153,51,0.4)",
        }}
      >
        🙏 सनातन प्रो
      </p>

      {/* Glowing divider line bottom */}
      <div
        className="w-2/3 h-px mt-3 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColors[(frame + 2) % glowColors.length]}, transparent)`,
          boxShadow: `0 0 8px ${glowColors[(frame + 2) % glowColors.length]}`,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      />
    </div>
  );
}
