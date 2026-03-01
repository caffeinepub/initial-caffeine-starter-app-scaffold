import React, { useState, useMemo } from 'react';
import { Search, BookOpen } from 'lucide-react';
import KathaCard from '../components/KathaCard';
import { useGetAllKathayen } from '../hooks/useQueries';
import { staticKathaData } from '../lib/kathaData';
import type { Katha } from '../backend';
import { KathaCategory } from '../backend';

type FilterTab = 'all' | 'puranik' | 'vrat';

function isCategoryMatch(cat: unknown, target: 'puranik' | 'vrat'): boolean {
  if (typeof cat === 'string') return cat === target;
  if (typeof cat === 'object' && cat !== null) return target in cat;
  return false;
}

export default function Kathayen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Public query — no auth required
  const { data: backendKathas, isLoading } = useGetAllKathayen();

  const allKathas = useMemo((): Katha[] => {
    const backend = backendKathas ?? [];
    // Merge static + backend, backend takes precedence for same id
    const staticAsKatha: Katha[] = staticKathaData.map(k => ({
      ...k,
      id: typeof k.id === 'bigint' ? k.id : BigInt(k.id as number),
      createdAt: BigInt(0),
    }));
    const backendIds = new Set(backend.map(k => k.id.toString()));
    const uniqueStatic = staticAsKatha.filter(k => !backendIds.has(k.id.toString()));
    return [...backend, ...uniqueStatic];
  }, [backendKathas]);

  const filtered = useMemo(() => {
    let result = allKathas;

    if (activeTab === 'puranik') {
      result = result.filter(k => {
        const cat = k.category;
        return cat === KathaCategory.puranik || isCategoryMatch(cat, 'puranik');
      });
    } else if (activeTab === 'vrat') {
      result = result.filter(k => {
        const cat = k.category;
        return cat === KathaCategory.vrat || isCategoryMatch(cat, 'vrat');
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        k =>
          k.title.toLowerCase().includes(q) ||
          k.deity.toLowerCase().includes(q) ||
          k.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allKathas, activeTab, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/kathayen-banner.dim_1200x400.png"
          alt="Kathayen"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/60 to-amber-900/80 flex flex-col items-center justify-center">
          <h1 className="text-white font-bold text-2xl drop-shadow">कथाएं</h1>
          <p className="text-amber-100 text-sm mt-1">पवित्र कथाओं का संग्रह</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="कथा खोजें..."
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'puranik', 'vrat'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-amber-500 text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'all' ? 'सभी' : tab === 'puranik' ? 'पौराणिक' : 'व्रत'}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Kathas Grid */}
        {!isLoading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">कोई कथा नहीं मिली</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filtered.map(katha => (
                  <KathaCard key={katha.id.toString()} katha={katha as any} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
