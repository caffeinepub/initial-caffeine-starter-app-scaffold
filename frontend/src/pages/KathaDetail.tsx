import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, MicOff, Pause, Play, Square, Volume2, AlertCircle } from 'lucide-react';
import { useGetKatha } from '../hooks/useQueries';
import { staticKathaData } from '../lib/kathaData';
import { KathaCategory } from '../backend';
import type { Katha } from '../backend';
import { useSpeechNarration } from '../hooks/useSpeechNarration';

// Helper: detect if a katha is a Ramayan katha
function isRamayanKatha(katha: Katha): boolean {
  return (
    katha.tags.some((t) => t === 'रामायण') ||
    katha.title.startsWith('रामायण')
  );
}

// Helper: detect if a katha is a Krishna Leela katha (Hindi-only)
function isKrishnaLeelaKatha(katha: Katha): boolean {
  return (
    katha.tags.some((t) => t === 'कृष्ण लीला') ||
    katha.title === 'श्री कृष्ण लीला'
  );
}

// Helper: detect if a katha is Hindi-only (no English text)
function isHindiOnly(katha: Katha): boolean {
  return isRamayanKatha(katha) || isKrishnaLeelaKatha(katha) || !katha.englishText || katha.englishText.trim() === '';
}

export default function KathaDetail() {
  const { id } = useParams({ from: '/kathayen/$id' });
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');

  const kathaId = BigInt(id);
  const { data: backendKatha, isLoading } = useGetKatha(kathaId);

  // Find static fallback
  const staticKatha = staticKathaData.find((k) => k.id === kathaId);
  const katha: Katha | null = backendKatha ?? staticKatha ?? null;

  // Determine if this is a Ramayan katha (Hindi-only)
  const isRamayan = katha ? isRamayanKatha(katha) : false;
  // Determine if this is a Krishna Leela katha (Hindi-only)
  const isKrishnaLeela = katha ? isKrishnaLeelaKatha(katha) : false;
  // Determine if this katha is Hindi-only (no language toggle)
  const hindiOnly = katha ? isHindiOnly(katha) : false;

  const {
    isPlaying,
    isPaused,
    speechSupported,
    playNarration,
    pauseNarration,
    resumeNarration,
    stopNarration,
  } = useSpeechNarration();

  // Stop narration when navigating away
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, [stopNarration]);

  // Stop narration when language changes
  useEffect(() => {
    stopNarration();
  }, [language, stopNarration]);

  // For Hindi-only kathas, always use Hindi
  const effectiveLanguage = hindiOnly ? 'hindi' : language;

  const handleNarrate = () => {
    if (!katha) return;
    if (isPlaying) {
      pauseNarration();
      return;
    }
    if (isPaused) {
      resumeNarration();
      return;
    }
    const text = effectiveLanguage === 'hindi' ? katha.hindiText : katha.englishText;

    // Guard: ensure text is not empty
    if (!text || text.trim() === '') return;

    // Use hi-IN for Hindi text, en-IN for English text in an Indian context
    const lang = effectiveLanguage === 'hindi' ? 'hi-IN' : 'en-IN';
    playNarration(text, lang);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!katha) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">कथा नहीं मिली</p>
        <Button onClick={() => navigate({ to: '/kathayen' })}>कथाओं पर वापस जाएँ</Button>
      </div>
    );
  }

  const categoryLabel = katha.category === KathaCategory.puranik ? 'पौराणिक' : 'व्रत';
  const categoryColor =
    katha.category === KathaCategory.puranik
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';

  const getNarrationButtonLabel = () => {
    if (!speechSupported) return '🔇 उपलब्ध नहीं';
    if (isPlaying) return 'रोकें';
    if (isPaused) return 'जारी रखें';
    return '🎙️ सुनें';
  };

  const getNarrationIcon = () => {
    if (!speechSupported) return <MicOff className="w-4 h-4" />;
    if (isPlaying) return <Pause className="w-4 h-4" />;
    if (isPaused) return <Play className="w-4 h-4" />;
    return <Mic className="w-4 h-4" />;
  };

  // Determine if narration text is available
  const narrationText = effectiveLanguage === 'hindi' ? katha.hindiText : katha.englishText;
  const hasNarrationText = !!narrationText && narrationText.trim() !== '';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/kathayen' })}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold text-foreground truncate">{katha.title}</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColor}`}>
              {categoryLabel}
            </span>
            <Badge variant="outline" className="text-xs">
              {katha.deity}
            </Badge>
            {isRamayan && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                🏹 रामायण
              </span>
            )}
            {isKrishnaLeela && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                🦚 कृष्ण लीला
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{katha.title}</h2>

          {/* Tags */}
          {katha.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {katha.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Toggle — hidden for Hindi-only kathas */}
          {!hindiOnly && (
            <>
              <Button
                variant={language === 'hindi' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('hindi')}
              >
                हिंदी
              </Button>
              <Button
                variant={language === 'english' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('english')}
              >
                English
              </Button>
            </>
          )}

          {/* Hindi-only label */}
          {hindiOnly && (
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
              🇮🇳 हिंदी में
            </span>
          )}

          <div className={`flex items-center gap-2 ${hindiOnly ? '' : 'ml-auto'}`}>
            {/* Main narrate/pause/resume button */}
            <Button
              size="sm"
              onClick={handleNarrate}
              disabled={!speechSupported || !hasNarrationText}
              className={`font-semibold gap-2 shadow-md transition-all ${
                isPlaying
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : isPaused
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {getNarrationIcon()}
              {getNarrationButtonLabel()}
              {isPlaying && (
                <span className="flex gap-0.5 items-end h-4">
                  <span className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '60%' }} />
                  <span className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.1s_infinite]" style={{ height: '100%' }} />
                  <span className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.2s_infinite]" style={{ height: '70%' }} />
                  <span className="w-0.5 bg-white rounded-full animate-[bounce_0.6s_ease-in-out_0.3s_infinite]" style={{ height: '40%' }} />
                </span>
              )}
            </Button>

            {/* Stop button — only shown when playing or paused */}
            {(isPlaying || isPaused) && (
              <Button
                size="sm"
                variant="outline"
                onClick={stopNarration}
                className="gap-1 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                बंद करें
              </Button>
            )}
          </div>
        </div>

        {/* Narration Status Banner */}
        {isPlaying && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
            <Volume2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                कथा सुनाई जा रही है...
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                रोकने के लिए "रोकें" दबाएं
              </p>
            </div>
          </div>
        )}

        {isPaused && (
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
            <Pause className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                कथा रुकी हुई है
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                जारी रखने के लिए "जारी रखें" दबाएं
              </p>
            </div>
          </div>
        )}

        {/* No Speech Support Banner */}
        {!speechSupported && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                वाणी उपलब्ध नहीं
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                आपका ब्राउज़र वाणी (Speech) का समर्थन नहीं करता। कृपया Chrome या Edge ब्राउज़र का उपयोग करें।
              </p>
            </div>
          </div>
        )}

        {/* Story Text */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="bg-card border border-border rounded-xl p-5 leading-relaxed text-foreground whitespace-pre-line">
            {effectiveLanguage === 'hindi' ? katha.hindiText : katha.englishText}
          </div>
        </div>

        {/* Narration Info Card — shown when idle and supported */}
        {speechSupported && !isPlaying && !isPaused && hasNarrationText && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                कथा सुनें
              </h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              इस कथा को आवाज़ में सुनने के लिए ऊपर "🎙️ सुनें" बटन दबाएं।
              {effectiveLanguage === 'hindi' && (
                <span className="block mt-1 text-xs opacity-75">हिंदी आवाज़ (hi-IN) में सुनाई जाएगी।</span>
              )}
            </p>
            <Button
              size="sm"
              onClick={handleNarrate}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2"
            >
              <Mic className="w-4 h-4" />
              🎙️ कथा सुनें
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
