import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  Copy,
  RefreshCw,
  Share2,
} from "lucide-react";
import React, { useState } from "react";
import { useSpeechNarration } from "../hooks/useSpeechNarration";
import { AARTIS } from "../lib/staticData";

export default function AartiDetail() {
  const { id } = useParams({ from: "/aarti/$id" });
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const aarti = AARTIS.find((a) => String(a.id) === String(id));
  const textToDisplay = aarti ? aarti.hindiText : "";

  const {
    narrationState,
    startNarration,
    stopNarration,
    error: ttsError,
  } = useSpeechNarration();
  const isPlaying = narrationState === "playing";
  const isPaused = narrationState === "paused";
  const isTTSError = narrationState === "error";

  const handleCopy = async () => {
    if (!aarti) return;
    await navigator.clipboard.writeText(textToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!aarti) return;
    const text = `🪔 ${aarti.name}\n\n${textToDisplay}`;
    if (navigator.share) {
      await navigator.share({ title: aarti.name, text });
    } else {
      await handleCopy();
    }
  };

  const handleTTS = () => {
    if (isPlaying || isPaused) {
      stopNarration();
    } else {
      startNarration(textToDisplay);
    }
  };

  if (!aarti) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl mb-3">🪔</div>
          <p className="text-lg text-foreground">आरती नहीं मिली</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/aarti" })}
            className="mt-4 px-4 py-2 rounded-full text-white text-sm bg-gradient-to-r from-saffron to-gold"
          >
            वापस जाएँ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-maroon to-saffron shadow-md">
        <button
          type="button"
          onClick={() => navigate({ to: "/aarti" })}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={18} className="text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base truncate">
            {aarti.name}
          </h1>
          <p className="text-white/70 text-xs">{aarti.deity}</p>
        </div>
        <span className="text-xl">🪔</span>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap bg-card border-b border-border">
        {/* TTS Button */}
        <button
          type="button"
          onClick={handleTTS}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isPlaying || isPaused
              ? "bg-destructive text-white"
              : "bg-gradient-to-r from-saffron to-gold text-white"
          }`}
        >
          {isPlaying || isPaused ? "⏹ रोकें" : "▶ सुनें (हिंदी)"}
        </button>

        {/* Copy */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-all"
        >
          <Copy size={14} />
          {copied ? "कॉपी!" : "कॉपी"}
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 text-foreground transition-all"
        >
          <Share2 size={14} />
          शेयर
        </button>
      </div>

      {/* TTS Error */}
      {isTTSError && ttsError && (
        <div className="mx-4 mt-3 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
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

      {/* Aarti Text */}
      <div className="px-4 py-6">
        <div className="bg-card border border-gold/30 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{aarti.emoji}</span>
            <h2 className="text-foreground font-bold">{aarti.name}</h2>
          </div>
          <p className="text-foreground text-base leading-loose whitespace-pre-line font-hindi">
            {textToDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}
