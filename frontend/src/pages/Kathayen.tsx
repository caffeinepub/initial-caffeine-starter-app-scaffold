import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import KathaCard from '../components/KathaCard';
import { useGetAllKathayen } from '../hooks/useQueries';
import staticKathaData from '../lib/kathaData';
import { KathaCategory } from '../backend';
import type { Katha } from '../backend';
import { Search } from 'lucide-react';

export default function Kathayen() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'puranik' | 'vrat'>('all');

  const { data: backendKathayen, isLoading } = useGetAllKathayen();

  // Use backend data if available, otherwise fall back to static data
  const allKathayen: Katha[] = (backendKathayen && backendKathayen.length > 0)
    ? backendKathayen
    : staticKathaData;

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
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="puranik" className="flex-1">Puranik</TabsTrigger>
            <TabsTrigger value="vrat" className="flex-1">Vrat</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No kathayen found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((katha) => (
                  <KathaCard key={katha.id.toString()} katha={katha} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
