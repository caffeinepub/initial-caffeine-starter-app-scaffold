import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { KathaCategory } from "../backend";
import { useLocalKathayen } from "../hooks/useLocalKathayen";
import { STATIC_KATHAS } from "../lib/kathaData";

type FilterTab = "all" | "puranik" | "vrat";

interface DisplayKatha {
  id: string;
  title: string;
  deity: string;
  category: KathaCategory;
  emoji: string;
  excerpt: string;
  isStatic: boolean;
}

function getCategoryLabel(category: KathaCategory): string {
  switch (category) {
    case KathaCategory.puranik:
      return "पौराणिक";
    case KathaCategory.vrat:
      return "व्रत";
    default:
      return "अन्य";
  }
}

function getCategoryColor(category: KathaCategory): string {
  switch (category) {
    case KathaCategory.puranik:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case KathaCategory.vrat:
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getDeityEmoji(deity: string): string {
  const lower = deity.toLowerCase();
  if (lower.includes("राम") || lower.includes("ram")) return "🏹";
  if (lower.includes("कृष्ण") || lower.includes("krishna")) return "🪷";
  if (lower.includes("शिव") || lower.includes("shiv")) return "🔱";
  if (lower.includes("दुर्गा") || lower.includes("durga")) return "🌺";
  if (lower.includes("हनुमान") || lower.includes("hanuman")) return "🚩";
  if (lower.includes("गणेश") || lower.includes("ganesh")) return "🐘";
  if (lower.includes("विष्णु") || lower.includes("vishnu")) return "🌸";
  if (lower.includes("राधा") || lower.includes("radha")) return "🪷";
  return "🕉️";
}

export default function Kathayen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // localStorage-based kathayen (admin-added)
  const { kathayen: localKathayen } = useLocalKathayen();

  const allKathas = useMemo((): DisplayKatha[] => {
    // Static kathas
    const staticDisplay: DisplayKatha[] = STATIC_KATHAS.map((k) => ({
      id: k.id,
      title: k.title,
      deity: k.deity,
      category: k.category,
      emoji: k.emoji,
      excerpt: `${k.hindiText.slice(0, 120)}...`,
      isStatic: true,
    }));

    // Admin-added local kathayen (newest first)
    const localDisplay: DisplayKatha[] = localKathayen.map((k) => ({
      id: k.id,
      title: k.title,
      deity: k.deity,
      category: k.category,
      emoji: getDeityEmoji(k.deity),
      excerpt: `${k.hindiText.slice(0, 120)}...`,
      isStatic: false,
    }));

    // Local (admin-added) kathayen shown first, then static
    return [...localDisplay, ...staticDisplay];
  }, [localKathayen]);

  const filtered = useMemo(() => {
    let list = allKathas;
    if (activeTab !== "all") {
      list = list.filter((k) => k.category === activeTab);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (k) =>
          k.title.toLowerCase().includes(q) ||
          k.deity.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allKathas, activeTab, search]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "सभी" },
    { key: "puranik", label: "पौराणिक" },
    { key: "vrat", label: "व्रत" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src="/assets/generated/kathayen-banner.dim_1200x400.png"
          alt="Kathayen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            📖 कथाएँ
          </h1>
          <p className="text-white/90 text-sm mt-1">पौराणिक और व्रत कथाएँ</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="कथा खोजें..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-amber-600 text-white"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Katha Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-foreground/70">
            <div className="text-4xl mb-3">📖</div>
            <p>कोई कथा नहीं मिली</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((katha) => (
              <button
                key={katha.id}
                type="button"
                onClick={() => navigate({ to: `/katha/${katha.id}` })}
                className="w-full text-left bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-amber-400/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0 mt-0.5">
                    {katha.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {katha.title}
                      </h3>
                      {!katha.isStatic && (
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">
                          नई
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-foreground/65 font-medium">
                        {katha.deity}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(katha.category)}`}
                      >
                        {getCategoryLabel(katha.category)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/65 line-clamp-2 leading-relaxed">
                      {katha.excerpt}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
