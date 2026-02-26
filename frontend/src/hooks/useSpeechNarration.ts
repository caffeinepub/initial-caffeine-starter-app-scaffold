import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechNarrationReturn {
  isPlaying: boolean;
  isPaused: boolean;
  speechSupported: boolean;
  playNarration: (text: string, lang?: string) => void;
  pauseNarration: () => void;
  resumeNarration: () => void;
  stopNarration: () => void;
}

export function useSpeechNarration(): UseSpeechNarrationReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  const stopNarration = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
  }, [speechSupported]);

  const playNarration = useCallback((text: string, lang?: string) => {
    if (!speechSupported) return;

    // Stop any existing narration first
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);

    if (!text || text.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Set language — default to hi-IN for Hindi (Devanagari) text
    const targetLang = lang ?? 'hi-IN';
    utterance.lang = targetLang;

    // Try to find a matching voice for the language
    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prefer exact match, then language prefix match
        const exactMatch = voices.find((v) => v.lang === targetLang);
        const prefixMatch = voices.find((v) => v.lang.startsWith(targetLang.split('-')[0]));
        const selectedVoice = exactMatch ?? prefixMatch ?? null;
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        // If no matching voice found, the browser will use its default for the lang tag
      }
    };

    // Voices may not be loaded yet — try immediately and also after voiceschanged
    trySetVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', trySetVoice, { once: true });
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      // Ignore 'interrupted' / 'canceled' errors — these happen when we cancel intentionally
      if (event.error === 'interrupted' || event.error === 'canceled') return;
      // Log graceful fallback for unsupported language
      if (event.error === 'language-unavailable' || event.error === 'voice-unavailable') {
        console.warn(`Hindi TTS voice not available (${event.error}). Falling back to default voice.`);
        // Retry without a specific voice
        const fallback = new SpeechSynthesisUtterance(text);
        fallback.rate = 0.85;
        fallback.pitch = 1.0;
        fallback.volume = 1.0;
        fallback.onstart = () => { setIsPlaying(true); setIsPaused(false); };
        fallback.onend = () => { setIsPlaying(false); setIsPaused(false); utteranceRef.current = null; };
        fallback.onerror = () => { setIsPlaying(false); setIsPaused(false); utteranceRef.current = null; };
        utteranceRef.current = fallback;
        window.speechSynthesis.speak(fallback);
        return;
      }
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [speechSupported]);

  const pauseNarration = useCallback(() => {
    if (!speechSupported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [speechSupported]);

  const resumeNarration = useCallback(() => {
    if (!speechSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, [speechSupported]);

  return {
    isPlaying,
    isPaused,
    speechSupported,
    playNarration,
    pauseNarration,
    resumeNarration,
    stopNarration,
  };
}
