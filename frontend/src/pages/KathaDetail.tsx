import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Play, Pause, Square, Globe, BookOpen, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { staticKathaData } from '../lib/kathaData';
import { useSpeechNarration } from '../hooks/useSpeechNarration';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Katha } from '../backend';

const KATHA_NARRATION_ID = 'katha-detail-narration';

export default function KathaDetail() {
  const { id } = useParams({ from: '/kathayen/$id' });
  const [showHindi, setShowHindi] = useState(true);
  const { actor, isFetching: actorFetching } = useActor();

  const { data: backendKatha, isLoading } = useQuery({
    queryKey: ['katha', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getKatha(BigInt(id));
    },
    enabled: !!actor && !actorFetching && !isNaN(Number(id)),
  });

  // Use backend data if available, otherwise fall back to static data
  const staticKatha = staticKathaData.find((k) => k.id === BigInt(id));
  const katha: Katha | null = backendKatha ?? staticKatha ?? null;

  const hasEnglish = katha && katha.englishText && katha.englishText.trim().length > 0;
  const currentText = showHindi
    ? katha?.hindiText || ''
    : katha?.englishText || '';

  const { narrationState, currentMessageId, speak, pause, resume, stop, isSupported } =
    useSpeechNarration();

  const isPlaying = narrationState === 'playing' && currentMessageId === KATHA_NARRATION_ID;
  const isPaused = narrationState === 'paused' && currentMessageId === KATHA_NARRATION_ID;
  const isActive = currentMessageId === KATHA_NARRATION_ID;

  // Stop narration when language changes
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHindi]);

  // Stop narration on unmount
  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = () => {
    if (!currentText) return;
    if (isPaused) {
      resume();
    } else {
      speak(currentText, KATHA_NARRATION_ID);
    }
  };

  const handlePause = () => {
    pause();
  };

  const handleStop = () => {
    stop();
  };

  const handleLanguageToggle = () => {
    stop();
    setShowHindi((prev) => !prev);
  };

  if (isLoading && actorFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!katha) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <BookOpen className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">कथा नहीं मिली</h2>
        <p className="text-muted-foreground text-center">यह कथा उपलब्ध नहीं है।</p>
        <Link to="/kathayen">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            वापस जाएं
          </Button>
        </Link>
      </div>
    );
  }

  const isVrat = katha.category === 'vrat' || String(katha.category) === 'vrat';
  const categoryLabel = isVrat ? 'व्रत कथा' : 'पौराणिक कथा';
  const categoryColor = isVrat
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/kathayen">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">{katha.title}</h1>
          <p className="text-xs text-muted-foreground">{katha.deity}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColor}`}>
            {categoryLabel}
          </span>
          <Badge variant="outline" className="text-xs">
            {katha.deity}
          </Badge>
          {katha.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Narration controls */}
          {isSupported && (
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {isPlaying ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePause}
                  className="h-8 px-3 text-xs gap-1"
                  title="रोकें"
                >
                  <Pause className="w-3.5 h-3.5" />
                  रोकें
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlay}
                  className="h-8 px-3 text-xs gap-1 text-primary"
                  title="सुनें"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isPaused ? 'जारी रखें' : 'सुनें'}
                </Button>
              )}
              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStop}
                  className="h-8 px-3 text-xs gap-1 text-destructive"
                  title="बंद करें"
                >
                  <Square className="w-3.5 h-3.5" />
                  बंद
                </Button>
              )}
            </div>
          )}

          {/* Language toggle */}
          {hasEnglish && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLanguageToggle}
              className="h-8 px-3 text-xs gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {showHindi ? 'English' : 'हिंदी'}
            </Button>
          )}

          {/* Narration status indicator */}
          {isPlaying && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <span className="inline-flex gap-0.5">
                <span
                  className="w-1 h-3 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-1 h-3 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1 h-3 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </span>
              <span>सुन रहे हैं...</span>
            </div>
          )}
          {isPaused && (
            <span className="text-xs text-muted-foreground">⏸ रुका हुआ</span>
          )}
        </div>

        {/* Katha Text */}
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="prose prose-sm max-w-none">
            {currentText.split('\n').map((para, i) =>
              para.trim() ? (
                <p
                  key={i}
                  className={`mb-4 leading-relaxed text-foreground ${
                    showHindi ? 'text-base' : 'text-sm'
                  }`}
                >
                  {para}
                </p>
              ) : (
                <br key={i} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
