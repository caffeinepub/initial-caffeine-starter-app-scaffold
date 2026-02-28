import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { getTithi, getNakshatra, getVara } from '../lib/panchangEngine';
import { SHLOKAS } from '../lib/staticData';
import DailyDharmaQuote from '../components/DailyDharmaQuote';
import FloatingLotus from '../components/FloatingLotus';
import EkadashiReminderBanner from '../components/EkadashiReminderBanner';

const categories = [
  { path: '/jap', label: 'जाप', emoji: '📿', desc: 'मंत्र जाप करें', color: 'from-orange-900/80 to-orange-700/60' },
  { path: '/aarti', label: 'आरती', emoji: '🪔', desc: 'आरती पाठ करें', color: 'from-yellow-900/80 to-yellow-700/60' },
  { path: '/mantras', label: 'मंत्र', emoji: '🕉️', desc: 'पवित्र मंत्र', color: 'from-purple-900/80 to-purple-700/60' },
  { path: '/bhajans', label: 'भजन', emoji: '🎵', desc: 'भक्ति भजन', color: 'from-pink-900/80 to-pink-700/60' },
  { path: '/chalisa', label: 'चालीसा', emoji: '📜', desc: 'हनुमान चालीसा', color: 'from-red-900/80 to-red-700/60' },
  { path: '/kathayen', label: 'कथाएं', emoji: '📖', desc: 'पौराणिक कथाएं', color: 'from-green-900/80 to-green-700/60' },
  { path: '/panchang', label: 'पंचांग', emoji: '📅', desc: 'आज का पंचांग', color: 'from-blue-900/80 to-blue-700/60' },
  { path: '/mandir', label: 'मंदिर', emoji: '🛕', desc: 'मंदिर दर्शन', color: 'from-teal-900/80 to-teal-700/60' },
  { path: '/community', label: 'समाज', emoji: '🤝', desc: 'भक्त समुदाय', color: 'from-indigo-900/80 to-indigo-700/60' },
  { path: '/ai-guru', label: 'AI गुरु', emoji: '🔮', desc: 'आध्यात्मिक मार्गदर्शन', color: 'from-violet-900/80 to-violet-700/60' },
];

export default function Home() {
  const [vratMode, setVratMode] = useState(false);
  const today = new Date();
  const tithi = getTithi(today);
  const nakshatra = getNakshatra(today);
  const vara = getVara(today);
  const shloka = SHLOKAS[0];

  useEffect(() => {
    const stored = localStorage.getItem('vratMode');
    setVratMode(stored === 'true');
  }, []);

  return (
    <div className="animate-fade-in relative">
      <FloatingLotus />

      {/* Vrat Mode Banner */}
      {vratMode && (
        <Link to="/vrat-dashboard" className="block">
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 py-3 flex items-center justify-between animate-slide-down">
            <div className="flex items-center gap-2">
              <span className="text-xl">🙏</span>
              <div>
                <p className="font-bold text-sm">व्रत मोड सक्रिय है</p>
                <p className="text-xs text-amber-100">आज का व्रत विवरण देखें</p>
              </div>
            </div>
            <span className="text-amber-100 text-sm">→</span>
          </div>
        </Link>
      )}

      <EkadashiReminderBanner />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="h-52 bg-cover bg-center relative"
          style={{ backgroundImage: 'url(/assets/generated/mandala-hero.dim_1200x400.png)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="animate-shimmer-text">
              <h2 className="text-white text-3xl font-bold drop-shadow-lg mb-1">🕉️ जय श्री राम</h2>
              <p className="text-amber-200 text-sm font-medium drop-shadow">हर हर महादेव • राधे राधे</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panchang Strip */}
      <div className="bg-gradient-to-r from-saffron-800 to-saffron-700 px-4 py-2">
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-amber-200 text-xs">तिथि</p>
            <p className="text-white text-xs font-semibold">{tithi}</p>
          </div>
          <div className="w-px h-8 bg-amber-400/30" />
          <div>
            <p className="text-amber-200 text-xs">नक्षत्र</p>
            <p className="text-white text-xs font-semibold">{nakshatra}</p>
          </div>
          <div className="w-px h-8 bg-amber-400/30" />
          <div>
            <p className="text-amber-200 text-xs">वार</p>
            <p className="text-white text-xs font-semibold">{vara}</p>
          </div>
          <div className="w-px h-8 bg-amber-400/30" />
          <Link to="/panchang" className="text-amber-300 text-xs font-medium hover:text-amber-100 transition-colors">
            पूरा पंचांग →
          </Link>
        </div>
      </div>

      {/* Daily Shloka */}
      {shloka && (
        <div className="mx-4 mt-4 p-4 bg-card border border-gold-500/30 rounded-2xl shadow-lg animate-slide-up">
          <p className="text-gold-400 text-xs font-semibold mb-1 uppercase tracking-wider">आज का श्लोक</p>
          <p className="text-foreground text-sm font-medium leading-relaxed">{shloka.sanskrit}</p>
          <p className="text-muted-foreground text-xs mt-1">{shloka.hindiMeaning}</p>
        </div>
      )}

      {/* Category Grid */}
      <div className="px-4 mt-4">
        <h3 className="text-foreground font-bold text-base mb-3">🙏 भक्ति सेवाएं</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${cat.color} border border-white/10 hover:scale-105 hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                <p className="text-white font-bold text-sm">{cat.label}</p>
                <p className="text-white/70 text-xs">{cat.desc}</p>
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-2xl" />
            </Link>
          ))}
        </div>
      </div>

      {/* Dharma Quote */}
      <div className="px-4 mt-4">
        <DailyDharmaQuote />
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 mb-4">
        <h3 className="text-foreground font-bold text-base mb-3">⚡ त्वरित क्रियाएं</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { path: '/jap', label: 'जाप शुरू करें', emoji: '📿', bg: 'bg-orange-900/50' },
            { path: '/aarti', label: 'आरती करें', emoji: '🪔', bg: 'bg-yellow-900/50' },
            { path: '/vrat-dashboard', label: 'व्रत देखें', emoji: '🙏', bg: 'bg-amber-900/50' },
            { path: '/community', label: 'समुदाय', emoji: '🤝', bg: 'bg-blue-900/50' },
          ].map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className={`flex-shrink-0 ${action.bg} border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:shadow-lg`}
            >
              <span className="text-xl">{action.emoji}</span>
              <span className="text-white text-sm font-medium whitespace-nowrap">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-border mt-4">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} श्री मंदिर • Built with{' '}
          <span className="text-red-400">❤️</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
