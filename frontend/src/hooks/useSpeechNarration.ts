import { useState, useRef, useEffect, useCallback } from 'react';

export type NarrationState = 'idle' | 'playing' | 'paused';

interface UseSpeechNarrationReturn {
  state: NarrationState;
  play: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function useSpeechNarration(lang: string = 'hi-IN'): UseSpeechNarrationReturn {
  const [state, setState] = useState<NarrationState>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const getPreferredVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!isSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    // Try to find a Hindi voice first
    const hindiVoice = voices.find(
      (v) => v.lang === 'hi-IN' || v.lang.startsWith('hi')
    );
    if (hindiVoice) return hindiVoice;
    // Fallback to any available voice
    return voices[0] || null;
  }, [isSupported]);

  const play = useCallback(
    (text: string) => {
      if (!isSupported) return;

      // Cancel any existing speech
      window.speechSynthesis.cancel();
      setState('idle');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to set voice
      const setVoiceAndSpeak = () => {
        const voice = getPreferredVoice();
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => setState('playing');
        utterance.onpause = () => setState('paused');
        utterance.onresume = () => setState('playing');
        utterance.onend = () => {
          setState('idle');
          utteranceRef.current = null;
        };
        utterance.onerror = (e) => {
          // Gracefully handle errors
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('Speech synthesis error:', e.error);
          }
          setState('idle');
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setState('playing');
      };

      // Voices may not be loaded yet
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          setVoiceAndSpeak();
        };
      } else {
        setVoiceAndSpeak();
      }
    },
    [isSupported, lang, getPreferredVoice]
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setState('paused');
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState('playing');
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setState('idle');
  }, [isSupported]);

  return { state, play, pause, resume, stop, isSupported };
}
