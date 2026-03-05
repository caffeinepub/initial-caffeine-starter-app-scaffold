import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface VratDate {
  name: string;
  date: Date;
  deity: string;
  emoji: string;
  mantras: string[];
}

const VRAT_DATES_2026: VratDate[] = [
  {
    name: "एकादशी",
    date: new Date("2026-03-12"),
    deity: "भगवान विष्णु",
    emoji: "🌸",
    mantras: ["ॐ नमो भगवते वासुदेवाय", "हरे कृष्ण हरे कृष्ण"],
  },
  {
    name: "महाशिवरात्रि",
    date: new Date("2026-02-26"),
    deity: "भगवान शिव",
    emoji: "🔱",
    mantras: ["ॐ नमः शिवाय", "ॐ त्र्यम्बकं यजामहे"],
  },
  {
    name: "नवरात्रि",
    date: new Date("2026-03-22"),
    deity: "माँ दुर्गा",
    emoji: "⚔️",
    mantras: ["ॐ दुं दुर्गायै नमः", "जय माता दी"],
  },
  {
    name: "जन्माष्टमी",
    date: new Date("2026-08-22"),
    deity: "भगवान कृष्ण",
    emoji: "🦚",
    mantras: ["हरे कृष्ण हरे कृष्ण", "ॐ नमो भगवते वासुदेवाय"],
  },
  {
    name: "राम नवमी",
    date: new Date("2026-03-29"),
    deity: "भगवान राम",
    emoji: "🏹",
    mantras: ["जय श्री राम", "ॐ रामाय नमः"],
  },
];

const SATTVIC_FOODS = {
  allowed: [
    "फल",
    "दूध",
    "दही",
    "साबूदाना",
    "मखाना",
    "सिंघाड़े का आटा",
    "आलू",
    "शकरकंद",
    "मेवे",
    "नारियल",
  ],
  restricted: [
    "अनाज",
    "लहसुन",
    "प्याज",
    "मांस",
    "मछली",
    "अंडे",
    "नमक (सेंधा नमक लें)",
    "तामसिक भोजन",
  ],
};

const VRAT_CHECKLIST = [
  { id: 1, task: "ब्रह्म मुहूर्त में उठें (4:00 - 5:30 AM)", emoji: "🌅" },
  { id: 2, task: "स्नान करें और स्वच्छ वस्त्र पहनें", emoji: "🚿" },
  { id: 3, task: "आरती करें", emoji: "🪔" },
  { id: 4, task: "मंत्र 108 बार जपें", emoji: "📿" },
  { id: 5, task: "सात्विक भोजन करें", emoji: "🥗" },
  { id: 6, task: "तामसिक भोजन से बचें", emoji: "🚫" },
  { id: 7, task: "संध्या आरती करें", emoji: "🌙" },
  { id: 8, task: "व्रत कथा पढ़ें", emoji: "📖" },
];

function CountdownTimer({
  targetDate,
  name,
  emoji,
}: { targetDate: Date; name: string; emoji: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const isPast = targetDate.getTime() < new Date().getTime();

  return (
    <div className="bg-card border border-amber-500/30 rounded-2xl p-4 hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="text-foreground font-bold text-sm">{name}</p>
          <p className="text-muted-foreground text-xs">
            {targetDate.toLocaleDateString("hi-IN")}
          </p>
        </div>
      </div>
      {isPast ? (
        <p className="text-muted-foreground text-xs text-center">
          यह व्रत बीत चुका है
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {[
            { val: timeLeft.days, label: "दिन" },
            { val: timeLeft.hours, label: "घंटे" },
            { val: timeLeft.minutes, label: "मिनट" },
            { val: timeLeft.seconds, label: "सेकंड" },
          ].map((t) => (
            <div
              key={t.label}
              className="bg-amber-900/30 rounded-xl p-2 text-center"
            >
              <p className="text-amber-300 font-bold text-lg leading-none">
                {String(t.val).padStart(2, "0")}
              </p>
              <p className="text-amber-200/70 text-xs mt-1">{t.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VratDashboard() {
  const [checkedTasks, setCheckedTasks] = useState<number[]>(() => {
    const stored = localStorage.getItem("vratChecklist");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleTask = (id: number) => {
    const updated = checkedTasks.includes(id)
      ? checkedTasks.filter((t) => t !== id)
      : [...checkedTasks, id];
    setCheckedTasks(updated);
    localStorage.setItem("vratChecklist", JSON.stringify(updated));
  };

  const upcomingVrats = VRAT_DATES_2026.filter(
    (v) => v.date.getTime() > new Date().getTime(),
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  const nextVrat = upcomingVrats[0];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-800 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">🙏 व्रत मोड</h1>
        <p className="text-amber-200 text-sm">व्रत की पूरी जानकारी और मार्गदर्शन</p>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {/* Brahma Muhurat */}
        <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌅</span>
            <h2 className="text-white font-bold">ब्रह्म मुहूर्त</h2>
          </div>
          <p className="text-indigo-200 text-sm">प्रातः 4:00 AM — 5:30 AM</p>
          <p className="text-indigo-300 text-xs mt-1">
            यह समय ध्यान, जाप और पूजा के लिए सर्वोत्तम है।
          </p>
        </div>

        {/* Next Vrat */}
        {nextVrat && (
          <div className="bg-gradient-to-r from-amber-900/60 to-orange-900/60 border border-amber-500/30 rounded-2xl p-4">
            <p className="text-amber-300 text-xs font-semibold mb-1 uppercase tracking-wider">
              अगला व्रत
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{nextVrat.emoji}</span>
              <div>
                <p className="text-white font-bold">{nextVrat.name}</p>
                <p className="text-amber-200 text-sm">{nextVrat.deity}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-amber-300 text-xs mb-2">व्रत के मंत्र:</p>
              {nextVrat.mantras.map((m) => (
                <p key={m} className="text-white text-sm font-medium">
                  {m}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Countdown Timers */}
        <div>
          <h2 className="text-foreground font-bold mb-3">⏰ व्रत काउंटडाउन</h2>
          <div className="space-y-3">
            {VRAT_DATES_2026.slice(0, 4).map((vrat) => (
              <CountdownTimer
                key={vrat.name}
                targetDate={vrat.date}
                name={vrat.name}
                emoji={vrat.emoji}
              />
            ))}
          </div>
        </div>

        {/* Food Guide */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3">
            🥗 सात्विक भोजन गाइड
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-green-400 text-xs font-semibold mb-2 flex items-center gap-1">
                ✅ अनुमत भोजन
              </p>
              <ul className="space-y-1">
                {SATTVIC_FOODS.allowed.map((food) => (
                  <li
                    key={food}
                    className="text-foreground text-xs flex items-center gap-1"
                  >
                    <span className="text-green-400">•</span> {food}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1">
                ❌ वर्जित भोजन
              </p>
              <ul className="space-y-1">
                {SATTVIC_FOODS.restricted.map((food) => (
                  <li
                    key={food}
                    className="text-foreground text-xs flex items-center gap-1"
                  >
                    <span className="text-red-400">•</span> {food}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-foreground font-bold mb-3">✅ व्रत चेकलिस्ट</h2>
          <div className="space-y-2">
            {VRAT_CHECKLIST.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleTask(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left hover:scale-[1.01] ${
                  checkedTasks.includes(item.id)
                    ? "bg-green-900/30 border border-green-500/30"
                    : "bg-muted/50 border border-border hover:border-amber-500/30"
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span
                  className={`text-sm flex-1 ${checkedTasks.includes(item.id) ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {item.task}
                </span>
                <span
                  className={`text-lg ${checkedTasks.includes(item.id) ? "text-green-400" : "text-muted-foreground"}`}
                >
                  {checkedTasks.includes(item.id) ? "✅" : "⬜"}
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs mt-3">
            {checkedTasks.length}/{VRAT_CHECKLIST.length} कार्य पूर्ण
          </p>
        </div>

        {/* Link to Jap */}
        <Link
          to="/jap"
          className="block bg-gradient-to-r from-saffron-700 to-gold-500 rounded-2xl p-4 text-center hover:scale-[1.02] transition-all duration-200"
        >
          <p className="text-white font-bold">📿 जाप शुरू करें</p>
          <p className="text-amber-100 text-sm">108 बार मंत्र जाप करें</p>
        </Link>
      </div>
    </div>
  );
}
