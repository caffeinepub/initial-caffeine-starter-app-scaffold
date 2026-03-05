import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Music,
  Pause,
  Play,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KathaCategory } from "../backend";
import { useLocalKathayen } from "../hooks/useLocalKathayen";
import { useSpeechNarration } from "../hooks/useSpeechNarration";
import { STATIC_KATHAS } from "../lib/kathaData";

function getCategoryLabel(category: KathaCategory | string): string {
  const cat =
    typeof category === "object"
      ? Object.keys(category as object)[0]
      : category;
  if (cat === "puranik") return "पौराणिक";
  if (cat === "vrat") return "व्रत";
  return "अन्य";
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

interface KathaDisplay {
  id: string;
  title: string;
  deity: string;
  category: KathaCategory | string;
  emoji: string;
  hindiText: string;
  englishText: string;
  tags: string[];
  audioUrl?: string | null;
}

// Audio Player Component
function AudioPlayer({ audioUrl, title }: { audioUrl: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setError(true));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (s: number) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-xl text-destructive text-sm">
        <AlertCircle size={16} />
        <span>Audio load नहीं हो सका।</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4">
      {/* biome-ignore lint/a11y/useMediaCaption: audio katha narration, captions not applicable */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => setError(true)}
        preload="metadata"
      />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Music size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">Audio कथा</p>
        </div>
        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
        >
          {isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 rounded-full accent-primary cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-primary, #f97316) ${duration ? (currentTime / duration) * 100 : 0}%, #e5e7eb ${duration ? (currentTime / duration) * 100 : 0}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function KathaDetail() {
  const { kathaId } = useParams({ strict: false }) as { kathaId: string };
  const navigate = useNavigate();
  const [showEnglish, setShowEnglish] = useState(false);

  const {
    startNarration,
    stopNarration,
    narrationState,
    error: ttsError,
  } = useSpeechNarration();
  const isPlaying = narrationState === "playing";
  const isTTSError = narrationState === "error";

  // localStorage-based local kathayen (admin-added)
  const { getKatha: getLocalKatha } = useLocalKathayen();

  // Determine katha type
  const isStatic = kathaId?.startsWith("static-");
  const isLocal = kathaId?.startsWith("local_");

  // Find static katha
  const staticKatha = useMemo(
    () =>
      isStatic ? (STATIC_KATHAS.find((k) => k.id === kathaId) ?? null) : null,
    [isStatic, kathaId],
  );

  // Find local (admin-added) katha
  const localKatha = useMemo(
    () => (isLocal && kathaId ? (getLocalKatha(kathaId) ?? null) : null),
    [isLocal, kathaId, getLocalKatha],
  );

  // Build display katha
  const katha: KathaDisplay | null = useMemo(() => {
    if (isStatic && staticKatha) {
      return {
        id: staticKatha.id,
        title: staticKatha.title,
        deity: staticKatha.deity,
        category: staticKatha.category,
        emoji: staticKatha.emoji,
        hindiText: staticKatha.hindiText,
        englishText: staticKatha.englishText,
        tags: staticKatha.tags,
        audioUrl: null,
      };
    }
    if (isLocal && localKatha) {
      return {
        id: localKatha.id,
        title: localKatha.title,
        deity: localKatha.deity,
        category: localKatha.category,
        emoji: getDeityEmoji(localKatha.deity),
        hindiText: localKatha.hindiText,
        englishText: localKatha.englishText,
        tags: localKatha.tags,
        audioUrl: localKatha.audioDataUrl ?? null,
      };
    }
    return null;
  }, [isStatic, staticKatha, isLocal, localKatha]);

  const isLoading = false;

  const handleTTS = () => {
    if (isPlaying) {
      stopNarration();
    } else {
      const text = showEnglish ? katha?.englishText : katha?.hindiText;
      if (text) startNarration(text);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup only runs on unmount
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!katha) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">📖</div>
        <h2 className="text-xl font-semibold text-foreground">कथा नहीं मिली</h2>
        <p className="text-muted-foreground text-sm text-center">
          यह कथा उपलब्ध नहीं है।
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/kathayen" })}
          className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
        >
          वापस जाएँ
        </button>
      </div>
    );
  }

  const displayText = showEnglish ? katha.englishText : katha.hindiText;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/kathayen" })}
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-sm truncate">
            {katha.title}
          </h1>
          <p className="text-xs text-muted-foreground">{katha.deity}</p>
        </div>
        <button
          type="button"
          onClick={handleTTS}
          className={`p-2 rounded-full transition-colors ${
            isPlaying
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-foreground"
          }`}
          title={isPlaying ? "TTS रोकें" : "TTS सुनें"}
        >
          {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">
        {/* Katha Header Card */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-5 mb-5 text-center">
          <div className="text-5xl mb-3">{katha.emoji}</div>
          <h2 className="text-xl font-bold text-foreground mb-1">
            {katha.title}
          </h2>
          <p className="text-muted-foreground text-sm mb-3">{katha.deity}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
              {getCategoryLabel(katha.category)}
            </span>
            {katha.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* MP3 Audio Player — shown only when audio is available */}
        {katha.audioUrl && (
          <div className="mb-5">
            <AudioPlayer audioUrl={katha.audioUrl} title={katha.title} />
          </div>
        )}

        {/* Language Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowEnglish(false)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              !showEnglish
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => setShowEnglish(true)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              showEnglish
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-muted"
            }`}
          >
            English
          </button>
        </div>

        {/* Story Text */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {showEnglish ? "Story" : "कथा"}
            </span>
          </div>
          <div className="text-foreground text-sm leading-relaxed whitespace-pre-line">
            {displayText}
          </div>
        </div>

        {/* TTS Error State */}
        {isTTSError && ttsError && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span className="flex-1">{ttsError}</span>
            <button
              type="button"
              onClick={handleTTS}
              className="flex items-center gap-1 px-2 py-1 bg-destructive/10 hover:bg-destructive/20 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        )}

        {/* TTS Button */}
        <button
          type="button"
          onClick={handleTTS}
          className={`w-full mt-4 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            isPlaying
              ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
              : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX size={16} /> TTS रोकें
            </>
          ) : (
            <>
              <Volume2 size={16} /> TTS से सुनें ({showEnglish ? "English" : "हिंदी"}
              )
            </>
          )}
        </button>
      </div>
    </div>
  );
}
