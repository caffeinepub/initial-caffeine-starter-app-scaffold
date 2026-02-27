import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import KathaCard from '../components/KathaCard';
import { staticKathaData } from '../lib/kathaData';
import { useGetAllKathayen } from '../hooks/useQueries';

type FilterTab = 'all' | 'puranik' | 'vrat' | 'krishna';

interface NormalisedKatha {
  id: number;
  title: string;
  category: string;
  deity: string;
  hindiText: string;
  englishText: string;
  tags: string[];
}

function normaliseCategory(cat: unknown): string {
  if (typeof cat === 'string') return cat;
  if (cat && typeof cat === 'object') {
    if ('puranik' in cat) return 'puranik';
    if ('vrat' in cat) return 'vrat';
    if ('krishna' in cat) return 'krishna';
  }
  return 'puranik';
}

export default function Kathayen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const { data: backendKathayen = [] } = useGetAllKathayen();

  const allKathayen: NormalisedKatha[] = useMemo(() => {
    const staticNorm: NormalisedKatha[] = staticKathaData.map((k) => ({
      id: Number(k.id),
      title: k.title,
      category: normaliseCategory(k.category),
      deity: k.deity,
      hindiText: k.hindiText,
      englishText: k.englishText,
      tags: k.tags ?? [],
    }));

    const backendNorm: NormalisedKatha[] = backendKathayen.map((k) => ({
      id: Number(k.id),
      title: k.title,
      category: normaliseCategory(k.category),
      deity: k.deity,
      hindiText: k.hindiText,
      englishText: k.englishText,
      tags: k.tags ?? [],
    }));

    const backendIds = new Set(backendNorm.map((k) => k.id));
    const merged = [...staticNorm.filter((k) => !backendIds.has(k.id)), ...backendNorm];
    return merged;
  }, [backendKathayen]);

  const filtered = useMemo(() => {
    return allKathayen.filter((k) => {
      const matchesTab =
        activeTab === 'all' ||
        k.category === activeTab;
      const matchesSearch =
        !search ||
        k.title.toLowerCase().includes(search.toLowerCase()) ||
        k.deity.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [allKathayen, activeTab, search]);

  const tabs: { key: FilterTab; label: string; emoji: string }[] = [
    { key: 'all', label: 'सभी', emoji: '📚' },
    { key: 'puranik', label: 'पौराणिक', emoji: '🕉️' },
    { key: 'vrat', label: 'व्रत', emoji: '🙏' },
    { key: 'krishna', label: 'कृष्ण', emoji: '🦚' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D4 100%)' }}>
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden" style={{ minHeight: '150px' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/assets/generated/kathayen-banner.dim_1200x400.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.85) 0%, rgba(255,140,0,0.75) 50%, rgba(255,215,0,0.7) 100%)' }}
        />
        <div className="relative z-10 px-5 py-8 text-center">
          <div className="text-3xl mb-2">📖</div>
          <h1
            className="font-devanagari text-white text-2xl font-bold"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          >
            कथाएँ एवं कहानियाँ
          </h1>
          <p className="text-white/80 text-sm font-poppins mt-1">
            Sacred Stories & Kathas
          </p>
        </div>
      </section>

      {/* Search */}
      <div className="px-4 py-4">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: 'white',
            border: '2px solid #FFD700',
            boxShadow: '0 2px 8px rgba(255,215,0,0.2)',
          }}
        >
          <Search size={16} style={{ color: '#FF6B00' }} />
          <input
            type="text"
            placeholder="कथा खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none font-devanagari"
            style={{ color: '#5D2E0C' }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={{
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg, #FF6B00, #FFD700)'
                  : 'rgba(255,215,0,0.15)',
                color: activeTab === tab.key ? 'white' : '#8B3A00',
                border: activeTab === tab.key ? 'none' : '1px solid #FFD700',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(255,107,0,0.3)' : 'none',
              }}
            >
              <span>{tab.emoji}</span>
              <span className="font-devanagari">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Katha List */}
      <section className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-6 rounded-full" style={{ background: '#FF6B00' }} />
          <h2 className="font-devanagari text-base font-bold" style={{ color: '#8B3A00' }}>
            {filtered.length} कथाएँ
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📖</div>
            <p className="font-devanagari text-base" style={{ color: '#8B3A00' }}>
              कोई कथा नहीं मिली
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((katha) => (
              <KathaCard key={katha.id} katha={katha} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center" style={{ borderTop: '1px solid #FFD700' }}>
        <p className="text-xs font-poppins" style={{ color: '#A0522D' }}>
          🙏 जय श्री राम • हरे कृष्ण 🙏
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
