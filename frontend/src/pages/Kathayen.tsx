import React, { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGetAllKathayen } from '../hooks/useQueries';
import KathaCard from '../components/KathaCard';
import { staticKathaData } from '../lib/kathaData';
import type { Katha } from '../backend';
import { KathaCategory } from '../backend';

type NormalisedKatha = {
  id: number;
  title: string;
  category: KathaCategory | string;
  deity: string;
  hindiText: string;
  englishText: string;
  tags: string[];
  source: 'static' | 'backend';
};

function normaliseBackend(k: Katha): NormalisedKatha {
  return {
    id: Number(k.id),
    title: k.title,
    category: k.category,
    deity: k.deity,
    hindiText: k.hindiText,
    englishText: k.englishText,
    tags: k.tags,
    source: 'backend',
  };
}

function normaliseStatic(k: typeof staticKathaData[0]): NormalisedKatha {
  return {
    id: Number(k.id),
    title: k.title,
    category: typeof k.category === 'object' ? Object.keys(k.category)[0] : String(k.category),
    deity: k.deity,
    hindiText: k.hindiText,
    englishText: k.englishText,
    tags: k.tags,
    source: 'static',
  };
}

const FILTER_TABS = [
  { key: 'all', label: 'सभी' },
  { key: 'puranik', label: 'पौराणिक' },
  { key: 'vrat', label: 'व्रत कथा' },
];

export default function Kathayen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: backendKathas, isLoading } = useGetAllKathayen();

  const allKathas = useMemo<NormalisedKatha[]>(() => {
    const backendNorm = (backendKathas ?? []).map(normaliseBackend);
    const backendIds = new Set(backendNorm.map(k => k.id));
    const staticNorm = staticKathaData
      .map(normaliseStatic)
      .filter(k => !backendIds.has(k.id));
    return [...backendNorm, ...staticNorm];
  }, [backendKathas]);

  const filtered = useMemo(() => {
    let list = allKathas;
    if (activeFilter !== 'all') {
      list = list.filter(k => {
        const cat = typeof k.category === 'string'
          ? k.category
          : Object.keys(k.category as object)[0];
        return cat === activeFilter;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        k =>
          k.title.toLowerCase().includes(q) ||
          k.deity.toLowerCase().includes(q) ||
          k.tags.some(t => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [allKathas, activeFilter, search]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="/assets/generated/kathayen-banner.dim_1200x400.png"
          alt="Kathayen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl font-bold drop-shadow">📖 कथाएं</h1>
          <p className="text-amber-200 text-sm mt-1">पवित्र कथाओं का संग्रह</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="कथा खोजें..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">कथाएं लोड हो रही हैं...</span>
          </div>
        )}

        {/* Count */}
        {!isLoading && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} कथाएं मिलीं
            {backendKathas && backendKathas.length > 0 && (
              <span className="ml-2 text-primary">• {backendKathas.length} admin द्वारा add की गई</span>
            )}
          </p>
        )}

        {/* Grid — KathaCard handles its own navigation internally */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(katha => (
            <KathaCard
              key={`${katha.source}-${katha.id}`}
              katha={katha as any}
            />
          ))}
        </div>

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>कोई कथा नहीं मिली</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-primary text-sm underline"
              >
                Search clear करें
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
