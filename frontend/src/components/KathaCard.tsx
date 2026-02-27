import { Link } from '@tanstack/react-router';
import { BookOpen, ChevronRight } from 'lucide-react';

interface KathaCardProps {
  katha: {
    id: number | bigint;
    title: string;
    category: string | { vrat: null } | { puranik: null };
    deity: string;
    hindiText: string;
    englishText?: string;
    tags?: string[];
  };
}

function getCategoryString(category: KathaCardProps['katha']['category']): string {
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category !== null) {
    if ('vrat' in category) return 'vrat';
    if ('puranik' in category) return 'puranik';
  }
  return 'puranik';
}

export default function KathaCard({ katha }: KathaCardProps) {
  const categoryStr = getCategoryString(katha.category);
  const isVrat = categoryStr === 'vrat';

  const previewText = katha.hindiText
    ? katha.hindiText.replace(/\n/g, ' ').slice(0, 100) + '...'
    : katha.englishText
    ? katha.englishText.replace(/\n/g, ' ').slice(0, 100) + '...'
    : '';

  const categoryLabel = isVrat ? 'व्रत कथा' : 'पौराणिक';
  const categoryStyle = isVrat
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';

  const deityEmoji: Record<string, string> = {
    शिव: '🕉️',
    Shiva: '🕉️',
    विष्णु: '🪷',
    Vishnu: '🪷',
    कृष्ण: '🦚',
    Krishna: '🦚',
    राम: '🏹',
    Ram: '🏹',
    दुर्गा: '🌺',
    Durga: '🌺',
    लक्ष्मी: '🌸',
    Lakshmi: '🌸',
    सत्यनारायण: '🪷',
    Satyanarayan: '🪷',
    संतोषी: '🌼',
    Santoshi: '🌼',
  };

  const emoji = Object.entries(deityEmoji).find(([key]) =>
    katha.deity?.includes(key)
  )?.[1] || '📖';

  return (
    <Link to="/kathayen/$id" params={{ id: String(katha.id) }}>
      <div
        className={`group flex items-start gap-3 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
          isVrat
            ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400 dark:bg-amber-950/20 dark:border-amber-800 dark:hover:border-amber-600'
            : 'bg-card border-border hover:border-primary/40'
        }`}
      >
        {/* Icon */}
        <div
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            isVrat
              ? 'bg-amber-100 dark:bg-amber-900/40'
              : 'bg-orange-100 dark:bg-orange-900/40'
          }`}
        >
          {emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
              {katha.title}
            </h3>
            <ChevronRight className="shrink-0 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryStyle}`}>
              {categoryLabel}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {katha.deity}
            </span>
          </div>

          {previewText && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {previewText}
            </p>
          )}

          {katha.tags && katha.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {katha.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
