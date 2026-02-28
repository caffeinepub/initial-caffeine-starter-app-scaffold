import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Volume2, Play, Pause, Square, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllKathayen } from '../hooks/useQueries';
import { staticKathaData } from '../lib/kathaData';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

type KathaLike = {
  id: number;
  title: string;
  category: string;
  deity: string;
  hindiText: string;
  englishText: string;
  tags: string[];
};

const BANNER_MAP: Record<string, string> = {
  ramayan: '/assets/generated/ramayan-banner.dim_800x400.png',
  mahabharat: '/assets/generated/mahabharat-banner.dim_800x400.png',
  krishna: '/assets/generated/krishna-leela-banner.dim_800x400.png',
  default: '/assets/generated/kathayen-banner.dim_1200x400.png',
};

function getBanner(katha: KathaLike): string {
  const title = katha.title.toLowerCase();
  if (title.includes('ramayan') || title.includes('राम')) return BANNER_MAP.ramayan;
  if (title.includes('mahabharat') || title.includes('महाभारत')) return BANNER_MAP.mahabharat;
  if (title.includes('krishna') || title.includes('कृष्ण')) return BANNER_MAP.krishna;
  return BANNER_MAP.default;
}

function getCategoryLabel(category: string): string {
  if (category === 'puranik') return 'पौराणिक';
  if (category === 'vrat') return 'व्रत कथा';
  return category;
}

export default function KathaDetail() {
  const { id } = useParams({ from: '/katha/$id' });
  const navigate = useNavigate();
  const [lang, setLang] = useState<'hindi' | 'english'>('hindi');

  const { data: backendKathas } = useGetAllKathayen();

  const katha = React.useMemo<KathaLike | null>(() => {
    const numId = Number(id);
    // Check backend first
    if (backendKathas) {
      const found = backendKathas.find(k => Number(k.id) === numId);
      if (found) {
        return {
          id: Number(found.id),
          title: found.title,
          category: typeof found.category === 'string'
            ? found.category
            : Object.keys(found.category as object)[0],
          deity: found.deity,
          hindiText: found.hindiText,
          englishText: found.englishText,
          tags: found.tags,
        };
      }
    }
    // Fallback to static
    const staticFound = staticKathaData.find(k => Number(k.id) === numId);
    if (staticFound) {
      return {
        id: Number(staticFound.id),
        title: staticFound.title,
        category: typeof staticFound.category === 'string'
          ? staticFound.category
          : Object.keys(staticFound.category as object)[0],
        deity: staticFound.deity,
        hindiText: staticFound.hindiText,
        englishText: staticFound.englishText,
        tags: staticFound.tags,
      };
    }
    return null;
  }, [id, backendKathas]);

  const displayText = lang === 'hindi'
    ? (katha?.hindiText ?? '')
    : ((katha?.englishText || katha?.hindiText) ?? '');

  const { narrationState, speak, pause, resume, stop } = useSpeechNarration();
  const isPlaying = narrationState === 'playing';
  const isPaused = narrationState === 'paused';
  const isIdle = narrationState === 'idle';

  // Stop narration when language changes
  useEffect(() => {
    stop();
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!katha) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">कथा नहीं मिली</p>
          <Button onClick={() => navigate({ to: '/kathayen' })}>वापस जाएं</Button>
        </div>
      </div>
    );
  }

  const bannerSrc = getBanner(katha);
  const categoryLabel = getCategoryLabel(katha.category);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Banner */}
      <div className="relative h-52 overflow-hidden">
        <img src={bannerSrc} alt={katha.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80" />
        <button
          onClick={() => navigate({ to: '/kathayen' })}
          className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/80 text-white text-xs px-2 py-0.5 rounded-full">{categoryLabel}</span>
            <span className="text-amber-300 text-xs">🙏 {katha.deity}</span>
          </div>
          <h1 className="text-xl font-bold drop-shadow">{katha.title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Language Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setLang('hindi')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                lang === 'hindi'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              हिंदी
            </button>
            {katha.englishText && (
              <button
                onClick={() => setLang('english')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  lang === 'english'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                English
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Languages className="w-3 h-3" />
            <span>{lang === 'hindi' ? 'हिंदी' : 'English'}</span>
          </div>
        </div>

        {/* TTS Controls */}
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/20 border border-amber-700/40 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold">
              🎙️ {lang === 'hindi' ? 'हिंदी में सुनें' : 'Listen in English'}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {isIdle && (
              <Button
                size="sm"
                onClick={() => speak(displayText, `katha-${id}-${lang}`)}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <Play className="w-4 h-4" />
                {lang === 'hindi' ? 'सुनें ▶️' : 'Play ▶️'}
              </Button>
            )}
            {isPlaying && (
              <Button
                size="sm"
                onClick={pause}
                className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
              >
                <Pause className="w-4 h-4" />
                {lang === 'hindi' ? 'रोकें ⏸️' : 'Pause ⏸️'}
              </Button>
            )}
            {isPaused && (
              <Button
                size="sm"
                onClick={resume}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <Play className="w-4 h-4" />
                {lang === 'hindi' ? 'जारी रखें ▶️' : 'Resume ▶️'}
              </Button>
            )}
            {(isPlaying || isPaused) && (
              <Button
                size="sm"
                variant="outline"
                onClick={stop}
                className="border-amber-700/50 text-amber-400 gap-2"
              >
                <Square className="w-4 h-4" />
                {lang === 'hindi' ? 'बंद करें ⏹️' : 'Stop ⏹️'}
              </Button>
            )}
          </div>
          {isPlaying && (
            <p className="text-xs text-amber-400/70 mt-2 animate-pulse">
              🔊 {lang === 'hindi' ? 'कथा सुनाई जा रही है...' : 'Narrating...'}
            </p>
          )}
          {isPaused && (
            <p className="text-xs text-amber-400/70 mt-2">
              ⏸️ {lang === 'hindi' ? 'रुकी हुई है' : 'Paused'}
            </p>
          )}
        </div>

        {/* Tags */}
        {katha.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {katha.tags.map(tag => (
              <span
                key={tag}
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs px-3 py-1 rounded-full border border-amber-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Katha Text */}
        <div className="bg-card border border-amber-700/30 rounded-2xl p-5">
          <div className="border-b border-amber-700/20 pb-3 mb-4">
            <h2 className="text-lg font-bold text-foreground">
              {lang === 'hindi' ? '📖 कथा पाठ' : '📖 Katha Text'}
            </h2>
          </div>
          <div
            className={`leading-relaxed text-foreground whitespace-pre-wrap ${
              lang === 'hindi' ? 'text-base font-medium' : 'text-sm'
            }`}
            style={{ fontFamily: lang === 'hindi' ? "'Noto Sans Devanagari', serif" : 'inherit' }}
          >
            {displayText}
          </div>
        </div>

        {/* Bottom TTS reminder */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">
            💡 ऊपर दिए गए <strong className="text-amber-500">🎙️ सुनें</strong> बटन से कथा को सुन सकते हैं
          </p>
        </div>
      </div>
    </div>
  );
}
