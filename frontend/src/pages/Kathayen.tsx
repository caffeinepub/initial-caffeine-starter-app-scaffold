import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import KathaCard from '../components/KathaCard';
import { useGetAllKathayen } from '../hooks/useQueries';
import { staticKathaData } from '../lib/kathaData';
import { KathaCategory } from '../backend';
import type { Katha } from '../backend';
import { Search, BookOpen } from 'lucide-react';

export default function Kathayen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'puranik' | 'vrat'>('all');

  const { data: backendKathayen, isLoading, isFetched } = useGetAllKathayen();

  // Only fall back to static data AFTER loading completes and backend returned 0 results
  // During loading: show skeleton
  // After load with data: show backend data
  // After load with 0 results: show static fallback
  const allKathayen: Katha[] = (() => {
    if (isLoading) return [];
    if (backendKathayen && backendKathayen.length > 0) return backendKathayen;
    if (isFetched) return staticKathaData;
    return staticKathaData;
  })();

  const filtered = allKathayen.filter((k) => {
    const matchesSearch =
      search === '' ||
      k.title.toLowerCase().includes(search.toLowerCase()) ||
      k.deity.toLowerCase().includes(search.toLowerCase()) ||
      k.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'puranik' && k.category === KathaCategory.puranik) ||
      (activeTab === 'vrat' && k.category === KathaCategory.vrat);

    return matchesSearch && matchesTab;
  });

  const puranikCount = allKathayen.filter((k) => k.category === KathaCategory.puranik).length;
  const vratCount = allKathayen.filter((k) => k.category === KathaCategory.vrat).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src="/assets/generated/kathayen-banner.dim_1200x400.png"
          alt="Kathayen Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex flex-col items-center justify-center">
          <img
            src="/assets/generated/om-lotus-ornament.dim_512x256.png"
            alt="Om Lotus"
            className="h-12 mb-2 opacity-90"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">कथाएँ</h1>
          <p className="text-white/80 text-sm mt-1">Sacred Stories &amp; Spiritual Narratives</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by title, deity, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'puranik' | 'vrat')}>
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="all" className="flex-1">
              All
              {!isLoading && allKathayen.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  {allKathayen.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="puranik" className="flex-1">
              Puranik
              {!isLoading && puranikCount > 0 && (
                <span className="ml-1.5 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                  {puranikCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="vrat" className="flex-1">
              Vrat
              {!isLoading && vratCount > 0 && (
                <span className="ml-1.5 text-xs bg-rose-500/20 text-rose-700 dark:text-rose-400 px-1.5 py-0.5 rounded-full">
                  {vratCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              /* Loading skeleton grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl border border-border overflow-hidden">
                    <Skeleton className="h-32 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex gap-2 pt-1">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  {search ? `"${search}" के लिए कोई कथा नहीं मिली` : 'कोई कथा उपलब्ध नहीं है'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((katha) => (
                  <KathaCard key={String(katha.id)} katha={katha} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
