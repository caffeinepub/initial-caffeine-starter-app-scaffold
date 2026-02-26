import React from 'react';
import { Link } from '@tanstack/react-router';
import { Flower2 } from 'lucide-react';
import { KathaCategory } from '../backend';
import type { Katha } from '../backend';

interface KathaCardProps {
  katha: Katha;
}

export default function KathaCard({ katha }: KathaCardProps) {
  const isPuranik = katha.category === KathaCategory.puranik;

  const categoryLabel = isPuranik ? 'Puranik' : 'Vrat';
  const gradientClass = isPuranik
    ? 'from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-900/30'
    : 'from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-900/30';
  const badgeClass = isPuranik
    ? 'bg-amber-200 text-amber-800 dark:bg-amber-800/40 dark:text-amber-300'
    : 'bg-rose-200 text-rose-800 dark:bg-rose-800/40 dark:text-rose-300';

  return (
    <Link
      to="/kathayen/$id"
      params={{ id: katha.id.toString() }}
      className={`block rounded-xl bg-gradient-to-br ${gradientClass} border border-border p-4 hover:shadow-md transition-shadow relative overflow-hidden`}
    >
      {/* Decorative corner motif */}
      <Flower2 className="absolute top-2 right-2 w-6 h-6 text-amber-300/50 dark:text-amber-600/30" />

      <div className="space-y-2 pr-6">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {categoryLabel}
          </span>
          <span className="text-xs text-muted-foreground">{katha.deity}</span>
        </div>

        <h3 className="font-bold text-foreground text-base leading-snug">{katha.title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {katha.hindiText.slice(0, 120)}...
        </p>
      </div>
    </Link>
  );
}
