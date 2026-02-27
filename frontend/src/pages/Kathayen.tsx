import React, { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, BookOpen, Star } from 'lucide-react';
import { useGetAllKathayen } from '../hooks/useQueries';
import { staticKathaData } from '../lib/kathaData';
import KathaCard from '../components/KathaCard';
import { KathaCategory, Katha } from '../backend';

type FilterTab = 'all' | 'puranik' | 'vrat' | 'krishna';

export default function Kathayen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const { data: backendKathayen, isLoading } = useGetAllKathayen();

  // Use backend data if available and non-empty, else fall back to static data
  const allKathayen: Katha[] = useMemo(() => {
    if (!isLoading && backendKathayen && backendKathayen.length > 0) {
      return backendKathayen;
    }
    return staticKathaData;
  }, [backendKathayen, isLoading]);

  const filteredKathayen = useMemo(() => {
    let list = allKathayen;

    // Category filter
    if (activeTab === 'puranik') {
      list = list.filter((k) => k.category === KathaCategory.puranik && k.deity !== 'Krishna');
    } else if (activeTab === 'vrat') {
      list = list.filter((k) => k.category === KathaCategory.vrat);
    } else if (activeTab === 'krishna') {
      list = list.filter((k) => k.deity === 'Krishna');
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (k) =>
          k.title.toLowerCase().includes(q) ||
          k.deity.toLowerCase().includes(q) ||
          k.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allKathayen, activeTab, search]);

  const counts = useMemo(
    () => ({
      all: allKathayen.length,
      puranik: allKathayen.filter((k) => k.category === KathaCategory.puranik && k.deity !== 'Krishna').length,
      vrat: allKathayen.filter((k) => k.category === KathaCategory.vrat).length,
      krishna: allKathayen.filter((k) => k.deity === 'Krishna').length,
    }),
    [allKathayen]
  );

  const tabs: { key: FilterTab; label: string; emoji: string }[] = [
    { key: 'all', label: 'सभी', emoji: '📖' },
    { key: 'puranik', label: 'पौराणिक', emoji: '🕉️' },
    { key: 'krishna', label: 'कृष्ण लीला', emoji: '🦚' },
    { key: 'vrat', label: 'व्रत कथाएँ', emoji: '🪔' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="/assets/generated/kathayen-banner.dim_1200x400.png"
          alt="Kathayen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-amber-300 drop-shadow-lg">कथाएँ</h1>
          <p className="text-amber-100/80 text-sm mt-1">पवित्र कथाएँ और लीलाएँ</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="कथा खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-background'
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Krishna Leela Banner */}
      {activeTab === 'krishna' && (
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden">
          <img
            src="/assets/generated/krishna-leela-banner.dim_800x400.png"
            alt="Krishna Leela"
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {/* Katha List */}
      <div className="px-4 py-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredKathayen.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">कोई कथा नहीं मिली</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredKathayen.map((katha) => (
              <KathaCard key={katha.id.toString()} katha={katha} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
