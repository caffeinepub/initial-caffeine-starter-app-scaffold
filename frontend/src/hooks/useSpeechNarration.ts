import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechNarrationReturn {
  isPlaying: boolean;
  isPaused: boolean;
  speechSupported: boolean;
  playNarration: (text: string) => void;
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

  const playNarration = useCallback((text: string) => {
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
      // Ignore 'interrupted' errors — these happen when we cancel intentionally
      if (event.error === 'interrupted' || event.error === 'canceled') return;
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
