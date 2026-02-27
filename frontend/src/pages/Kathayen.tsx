import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { staticKathaData } from '../lib/kathaData';
import KathaCard from '../components/KathaCard';
import { KathaCategory } from '../backend';
import { BookOpen, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

type FilterTab = 'all' | 'puranik' | 'vrat' | 'krishna';

// Normalised katha shape used throughout this page
interface NormalisedKatha {
  id: number;
  title: string;
  category: string;
  deity: string;
  hindiText: string;
  englishText: string;
  tags: string[];
}

export default function Kathayen() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { actor, isFetching: actorFetching } = useActor();

  const { data: backendKathayen, isLoading } = useQuery({
    queryKey: ['kathayen'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKathayen();
    },
    enabled: !!actor && !actorFetching,
  });

  // Normalise backend kathas (bigint ids → number, enum category → string)
  const normalisedBackend: NormalisedKatha[] = (backendKathayen || []).map((k) => ({
    id: Number(k.id),
    title: k.title,
    category: k.category === KathaCategory.vrat ? 'vrat' : 'puranik',
    deity: k.deity,
    hindiText: k.hindiText,
    englishText: k.englishText,
    tags: Array.from(k.tags),
  }));

  // Normalise static kathas (bigint ids → number)
  const normalisedStatic: NormalisedKatha[] = staticKathaData.map((k) => ({
    id: Number(k.id),
    title: k.title,
    category: k.category === KathaCategory.vrat ? 'vrat' : 'puranik',
    deity: k.deity,
    hindiText: k.hindiText,
    englishText: k.englishText,
    tags: Array.from(k.tags),
  }));

  // Backend ids as a Set<number> for deduplication
  const backendIds = new Set(normalisedBackend.map((k) => k.id));
  const staticFallback = normalisedStatic.filter((k) => !backendIds.has(k.id));
  const allKathayen: NormalisedKatha[] = [...normalisedBackend, ...staticFallback];

  // Filter by tab
  const tabFiltered = allKathayen.filter((k) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'puranik') return k.category === 'puranik';
    if (activeTab === 'vrat') return k.category === 'vrat';
    if (activeTab === 'krishna')
      return (
        k.deity?.toLowerCase().includes('krishna') ||
        k.deity?.toLowerCase().includes('कृष्ण')
      );
    return true;
  });

  // Filter by search
  const filtered = searchQuery.trim()
    ? tabFiltered.filter(
        (k) =>
          k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.deity?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          k.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tabFiltered;

  const tabs: { id: FilterTab; label: string; emoji: string }[] = [
    { id: 'all', label: 'सभी', emoji: '📖' },
    { id: 'puranik', label: 'पौराणिक', emoji: '🕉️' },
    { id: 'vrat', label: 'व्रत', emoji: '🪔' },
    { id: 'krishna', label: 'कृष्ण लीला', emoji: '🦚' },
  ];

  const counts = {
    all: allKathayen.length,
    puranik: allKathayen.filter((k) => k.category === 'puranik').length,
    vrat: allKathayen.filter((k) => k.category === 'vrat').length,
    krishna: allKathayen.filter(
      (k) =>
        k.deity?.toLowerCase().includes('krishna') ||
        k.deity?.toLowerCase().includes('कृष्ण')
    ).length,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/kathayen-banner.dim_1200x400.png"
          alt="Kathayen"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">कथाएँ</h1>
          <p className="text-white/80 text-sm mt-1">पवित्र कथाओं का संग्रह</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="कथा खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-background text-muted-foreground'
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Krishna Leela Banner */}
        {activeTab === 'krishna' && (
          <div className="rounded-xl overflow-hidden">
            <img
              src="/assets/generated/krishna-leela-banner.dim_800x400.png"
              alt="Krishna Leela"
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Katha List */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery ? 'कोई कथा नहीं मिली' : 'इस श्रेणी में कोई कथा नहीं है'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((katha) => (
            <KathaCard key={katha.id} katha={katha} />
          ))}
        </div>
      </div>
    </div>
  );
}
