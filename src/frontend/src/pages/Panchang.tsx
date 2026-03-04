import { useState } from "react";
import {
  formatDateReadable,
  getAbhijitMuhurat,
  getBrahmaMuhurat,
  getKarana,
  getNakshatra,
  getPaksha,
  getPanchangData,
  getSunrise,
  getSunset,
  getTithi,
  getVara,
  getYoga,
} from "../lib/panchangEngine";

export default function Panchang() {
  const [date, setDate] = useState(new Date());

  const navigateDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate);
  };

  // All values are strings — no Date conversion needed
  const fields: { label: string; value: string; emoji: string }[] = [
    { label: "तिथि", value: getTithi(date), emoji: "🌙" },
    { label: "नक्षत्र", value: getNakshatra(date), emoji: "⭐" },
    { label: "वार", value: getVara(date), emoji: "📅" },
    { label: "योग", value: getYoga(date), emoji: "🕉️" },
    { label: "करण", value: getKarana(date), emoji: "🌿" },
    { label: "पक्ष", value: getPaksha(date), emoji: "🌗" },
    { label: "सूर्योदय", value: getSunrise(date), emoji: "🌅" },
    { label: "सूर्यास्त", value: getSunset(date), emoji: "🌇" },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">📅 पंचांग</h1>
        <p className="text-blue-200 text-sm">हिंदू पंचांग — आज की तिथि और मुहूर्त</p>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <button
          type="button"
          onClick={() => navigateDate(-1)}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all duration-200 hover:scale-110"
        >
          ← पिछला
        </button>
        <div className="text-center">
          <p className="text-foreground font-bold text-sm">
            {formatDateReadable(date)}
          </p>
          <button
            type="button"
            onClick={() => setDate(new Date())}
            className="text-gold text-xs hover:text-gold/80 transition-colors"
          >
            आज पर जाएं
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigateDate(1)}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all duration-200 hover:scale-110"
        >
          अगला →
        </button>
      </div>

      {/* Panchang Fields */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div
            key={field.label}
            className="bg-card border border-border rounded-2xl p-4 hover:border-gold/50 hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{field.emoji}</span>
              <p className="text-muted-foreground text-xs">{field.label}</p>
            </div>
            <p className="text-foreground font-bold text-sm">{field.value}</p>
          </div>
        ))}
      </div>

      {/* Auspicious Periods */}
      <div className="px-4 pb-8">
        <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-500/30 rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3">✨ शुभ मुहूर्त</h2>
          <div className="space-y-2">
            {[
              { name: "ब्रह्म मुहूर्त", time: getBrahmaMuhurat(date), emoji: "🌅" },
              {
                name: "अभिजित मुहूर्त",
                time: getAbhijitMuhurat(date),
                emoji: "☀️",
              },
              { name: "गोधूलि मुहूर्त", time: getSunset(date), emoji: "🌇" },
            ].map((period) => (
              <div
                key={period.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{period.emoji}</span>
                  <p className="text-foreground text-sm">{period.name}</p>
                </div>
                <p className="text-gold text-xs font-medium">{period.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-border">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} दिव्य दर्शन • Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
