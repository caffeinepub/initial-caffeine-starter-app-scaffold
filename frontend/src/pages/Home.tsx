import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getTithi, getNakshatra, getVara } from '../lib/panchangEngine';
import DailyDharmaQuote from '../components/DailyDharmaQuote';
import ShlokaCard from '../components/ShlokaCard';
import { SHLOKAS, AARTIS } from '../lib/staticData';

const categories = [
  {
    title: 'मंत्र / श्लोक',
    subtitle: 'Sacred Mantras',
    emoji: '🕉️',
    path: '/jap',
    gradient: 'linear-gradient(135deg, #FF6B00, #FF8C00)',
    border: '#FF6B00',
  },
  {
    title: 'आरती',
    subtitle: 'Divine Aarti',
    emoji: '🪔',
    path: '/aarti',
    gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    border: '#FFD700',
  },
  {
    title: 'पूजा विधि',
    subtitle: 'Puja Vidhi',
    emoji: '🙏',
    path: '/panchang',
    gradient: 'linear-gradient(135deg, #C0392B, #E74C3C)',
    border: '#C0392B',
  },
  {
    title: 'भजन / कथाएँ',
    subtitle: 'Bhajans & Kathas',
    emoji: '📖',
    path: '/kathayen',
    gradient: 'linear-gradient(135deg, #8B4513, #A0522D)',
    border: '#8B4513',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const today = new Date();
  const tithi = getTithi(today);
  const nakshatra = getNakshatra(today);
  const vara = getVara(today);

  const todayShloka = SHLOKAS[0];
  const featuredAarti = AARTIS[0];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)' }}>
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden" style={{ minHeight: '220px' }}>
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 40%, #FFD700 100%)',
          }}
        />
        {/* Mandala background */}
        <div
          className="absolute inset-0 opacity-10 animate-sacred-spin"
          style={{
            backgroundImage: 'url(/assets/generated/mandala-bg.dim_512x512.png)',
            backgroundSize: '400px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Lotus decoration */}
        <div
          className="absolute right-0 top-0 w-40 h-40 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/lotus-hero.dim_1200x400.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
          }}
        />

        <div className="relative z-10 px-5 py-8 text-center">
          {/* Om Symbol */}
          <div className="flex justify-center mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center animate-divine-pulse"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.7)',
                boxShadow: '0 0 20px rgba(255,215,0,0.5)',
              }}
            >
              <img
                src="/assets/generated/om-symbol.dim_256x256.png"
                alt="OM"
                className="w-10 h-10 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                    '<span style="color:white;font-size:32px;font-family:serif">ॐ</span>';
                }}
              />
            </div>
          </div>

          {/* Greeting */}
          <h2
            className="font-devanagari text-white text-2xl font-bold mb-1"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            ॐ श्री गणेशाय नमः
          </h2>
          <p className="text-white/90 text-sm font-poppins mb-4">
            🙏 जय श्री राम • हर हर महादेव • राधे राधे 🙏
          </p>

          {/* Panchang Strip */}
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              color: 'white',
            }}
          >
            <span>📅 {vara}</span>
            <span className="opacity-50">|</span>
            <span>🌙 {tithi}</span>
            <span className="opacity-50">|</span>
            <span>⭐ {nakshatra}</span>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="px-4 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 rounded-full" style={{ background: '#FF6B00' }} />
          <h3 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
            भक्ति के द्वार
          </h3>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.path}
              onClick={() => navigate({ to: cat.path })}
              className="relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-200 active:scale-95"
              style={{
                background: cat.gradient,
                border: `2px solid ${cat.border}`,
                boxShadow: `0 4px 15px ${cat.border}40`,
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
                style={{ background: 'rgba(255,255,255,0.4)' }}
              />
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="font-devanagari text-white font-bold text-sm leading-tight">
                {cat.title}
              </div>
              <div className="text-white/80 text-xs mt-0.5 font-poppins">
                {cat.subtitle}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Daily Dharma Quote */}
      <section className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full" style={{ background: '#FFD700' }} />
          <h3 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
            आज का सुविचार
          </h3>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
        </div>
        <DailyDharmaQuote />
      </section>

      {/* Featured Shloka */}
      {todayShloka && (
        <section className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 rounded-full" style={{ background: '#C0392B' }} />
            <h3 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
              आज का श्लोक
            </h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
          </div>
          <ShlokaCard shloka={todayShloka} />
        </section>
      )}

      {/* Featured Aarti */}
      {featuredAarti && (
        <section className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 rounded-full" style={{ background: '#FF6B00' }} />
            <h3 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
              आरती
            </h3>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
          </div>
          <button
            onClick={() => navigate({ to: '/aarti' })}
            className="w-full rounded-2xl p-4 text-left transition-all duration-200 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 15px rgba(255,215,0,0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FFD700)' }}
              >
                🪔
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-devanagari font-bold text-base" style={{ color: '#8B3A00' }}>
                  {featuredAarti.name}
                </div>
                <div className="text-xs mt-0.5 font-poppins line-clamp-2" style={{ color: '#A0522D' }}>
                  {featuredAarti.hindiText.substring(0, 80)}...
                </div>
              </div>
              <div className="text-saffron-600 text-lg">›</div>
            </div>
          </button>
        </section>
      )}

      {/* Quick Actions */}
      <section className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full" style={{ background: '#8B4513' }} />
          <h3 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
            त्वरित क्रियाएँ
          </h3>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { emoji: '📿', label: 'जप करें', path: '/jap' },
            { emoji: '🛕', label: 'मंदिर', path: '/mandir' },
            { emoji: '🤖', label: 'AI गुरु', path: '/ai-guru' },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate({ to: action.path })}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FFF8E7, #FFF3D4)',
                border: '1.5px solid #FFD700',
                boxShadow: '0 2px 8px rgba(255,215,0,0.2)',
              }}
            >
              <span className="text-2xl">{action.emoji}</span>
              <span className="font-devanagari text-xs font-semibold" style={{ color: '#8B3A00' }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center" style={{ borderTop: '1px solid #FFD700' }}>
        <p className="text-xs font-poppins" style={{ color: '#A0522D' }}>
          🙏 हरे कृष्ण हरे राम 🙏
        </p>
        <p className="text-xs mt-2" style={{ color: '#C0A060' }}>
          Built with{' '}
          <span style={{ color: '#FF6B00' }}>❤️</span>
          {' '}using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FF6B00', textDecoration: 'underline' }}
          >
            caffeine.ai
          </a>
          {' '}© {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
