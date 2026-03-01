import React, { useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Volume2, Pause, Play, Square, AlertCircle } from 'lucide-react';
import { useGetKatha } from '../hooks/useQueries';
import { useSpeechNarration } from '../hooks/useSpeechNarration';
import { staticKathaData } from '../lib/kathaData';
import { KathaCategory } from '../backend';

export default function KathaDetail() {
  const { id } = useParams({ from: '/katha/$id' });
  const navigate = useNavigate();

  const numericId = useMemo(() => {
    try { return BigInt(id); } catch { return null; }
  }, [id]);

  const { data: backendKatha, isLoading } = useGetKatha(numericId);

  // Fallback to static data
  const katha = useMemo(() => {
    if (backendKatha) return backendKatha;
    const staticMatch = staticKathaData.find(k => k.id.toString() === id);
    if (!staticMatch) return null;
    return {
      ...staticMatch,
      id: typeof staticMatch.id === 'bigint' ? staticMatch.id : BigInt(staticMatch.id),
      createdAt: BigInt(0),
    };
  }, [backendKatha, id]);

  const { narrationState, startNarration, pauseNarration, resumeNarration, stopNarration, errorMessage } =
    useSpeechNarration();

  const handleNarration = () => {
    if (!katha) return;
    if (narrationState === 'idle' || narrationState === 'error') {
      startNarration(katha.hindiText || katha.englishText || katha.title);
    } else if (narrationState === 'playing') {
      pauseNarration();
    } else if (narrationState === 'paused') {
      resumeNarration();
    }
  };

  const getCategoryLabel = (cat: unknown) => {
    if (cat === KathaCategory.vrat || cat === 'vrat' || (typeof cat === 'object' && cat !== null && 'vrat' in cat)) {
      return 'व्रत कथा';
    }
    return 'पौराणिक कथा';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">कथा लोड हो रही है...</p>
        </div>
      </div>
    );
  }

  if (!katha) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-foreground font-medium">कथा नहीं मिली</p>
          <button
            onClick={() => navigate({ to: '/kathayen' })}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm"
          >
            वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-600 to-orange-500 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/kathayen' })}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base truncate">{katha.title}</h1>
          <p className="text-amber-100 text-xs">{getCategoryLabel(katha.category)}</p>
        </div>

        {/* TTS Controls */}
        <div className="flex items-center gap-1.5">
          {narrationState !== 'idle' && narrationState !== 'error' && (
            <button
              onClick={stopNarration}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              title="बंद करें"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleNarration}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
              narrationState === 'playing'
                ? 'bg-amber-400 hover:bg-amber-300'
                : narrationState === 'paused'
                ? 'bg-blue-400 hover:bg-blue-300'
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title={
              narrationState === 'playing' ? 'रोकें' :
              narrationState === 'paused' ? 'जारी रखें' : 'सुनें'
            }
          >
            {narrationState === 'playing' ? (
              <Pause className="w-3.5 h-3.5" />
            ) : narrationState === 'paused' ? (
              <Play className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* TTS Error */}
      {errorMessage && (
        <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300 text-xs">{errorMessage}</p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          {katha.deity && (
            <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 rounded-full font-medium">
              🙏 {katha.deity}
            </span>
          )}
          <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full">
            {getCategoryLabel(katha.category)}
          </span>
          {katha.tags.map(tag => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Hindi Text */}
        {katha.hindiText && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
            <h2 className="text-amber-700 dark:text-amber-300 font-semibold text-sm mb-3">हिंदी</h2>
            <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap font-serif">
              {katha.hindiText}
            </p>
          </div>
        )}

        {/* English Text */}
        {katha.englishText && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="text-muted-foreground font-semibold text-sm mb-3">English</h2>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {katha.englishText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
