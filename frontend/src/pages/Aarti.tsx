import React from 'react';
import AartiCard from '../components/AartiCard';
import { AARTIS } from '../lib/staticData';

export default function Aarti() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)' }}>
      
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '160px' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 50%, #FFD700 100%)' }}
        />
        {/* Diya decoration */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-30"
          style={{
            backgroundImage: 'url(/assets/generated/diya-glow.dim_256x256.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/diya-icon.dim_128x128.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 px-5 py-8 text-center">
          <div className="text-4xl mb-2 animate-flame-flicker">🪔</div>
          <h1
            className="font-devanagari text-white text-2xl font-bold"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            आरती संग्रह
          </h1>
          <p className="text-white/80 text-sm font-poppins mt-1">
            Divine Aarti Collection
          </p>
        </div>
      </section>

      {/* Aarti List */}
      <section className="px-4 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 rounded-full" style={{ background: '#FF6B00' }} />
          <h2 className="font-devanagari text-lg font-bold" style={{ color: '#8B3A00' }}>
            सभी आरतियाँ
          </h2>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
        </div>

        <div className="space-y-3">
          {AARTIS.map((aarti) => (
            <AartiCard key={aarti.id} aarti={aarti} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center" style={{ borderTop: '1px solid #FFD700' }}>
        <p className="text-xs font-poppins" style={{ color: '#A0522D' }}>
          🙏 जय माता दी • हर हर महादेव 🙏
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
