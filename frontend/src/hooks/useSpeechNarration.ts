import { useState, useEffect, useRef, useCallback } from 'react';

export type NarrationState = 'idle' | 'playing' | 'paused' | 'error';

interface UseSpeechNarrationReturn {
  narrationState: NarrationState;
  startNarration: (text: string) => void;
  pauseNarration: () => void;
  resumeNarration: () => void;
  stopNarration: () => void;
  errorMessage: string | null;
}

function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function getHindiVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  // Priority 1: exact hi-IN
  const hiIN = voices.find(v => v.lang === 'hi-IN');
  if (hiIN) return hiIN;
  // Priority 2: hi-* prefix
  const hiAny = voices.find(v => v.lang.startsWith('hi'));
  if (hiAny) return hiAny;
  // Priority 3: voice name contains 'Hindi'
  const namedHindi = voices.find(v => v.name.toLowerCase().includes('hindi'));
  if (namedHindi) return namedHindi;
  return null;
}

export function useSpeechNarration(): UseSpeechNarrationReturn {
  const [narrationState, setNarrationState] = useState<NarrationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>('');
  const voicesLoadedRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  // Warm up voices on mount — critical for PWA/Chrome Android
  useEffect(() => {
    isMountedRef.current = true;

    const synth = window.speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    };

    // Try immediately
    loadVoices();

    // Listen for voiceschanged event (fires in most browsers)
    synth.addEventListener('voiceschanged', loadVoices);

    // PWA fix: Chrome Android sometimes needs a dummy utterance to unlock voices
    // We schedule a silent warm-up after a short delay
    const warmUpTimer = setTimeout(() => {
      if (!voicesLoadedRef.current) {
        try {
          const dummy = new SpeechSynthesisUtterance('');
          dummy.volume = 0;
          dummy.onend = () => {
            loadVoices();
          };
          synth.speak(dummy);
        } catch {
          // ignore
        }
      }
    }, 500);

    // Page Visibility API: resume synthesis when app comes back to foreground
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Re-load voices after coming back to foreground
        loadVoices();
        // If synthesis was paused by the browser (PWA background), resume it
        if (synth.paused) {
          synth.resume();
        }
      } else {
        // App going to background — pause to avoid silent blocking
        if (synth.speaking && !synth.paused) {
          synth.pause();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      clearTimeout(warmUpTimer);
      synth.removeEventListener('voiceschanged', loadVoices);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      synth.cancel();
    };
  }, []);

  const stopNarration = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    // Small delay after cancel to let Chrome clear its queue
    setTimeout(() => {
      if (isMountedRef.current) {
        setNarrationState('idle');
        setErrorMessage(null);
      }
    }, 50);
    utteranceRef.current = null;
  }, []);

  const startNarration = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setNarrationState('error');
      setErrorMessage('आपके browser में Text-to-Speech उपलब्ध नहीं है।');
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();
    setTimeout(() => {
      if (!isMountedRef.current) return;

      textRef.current = text;
      const utterance = new SpeechSynthesisUtterance(text);

      // Voice selection
      const voices = synth.getVoices();
      const isHindi = isDevanagari(text);

      if (isHindi) {
        const hindiVoice = getHindiVoice(voices);
        if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = hindiVoice.lang;
        } else {
          utterance.lang = 'hi-IN';
        }
        utterance.rate = 0.85;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
      }

      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        if (isMountedRef.current) {
          setNarrationState('playing');
          setErrorMessage(null);
        }
      };

      utterance.onend = () => {
        if (isMountedRef.current) {
          setNarrationState('idle');
          utteranceRef.current = null;
        }
      };

      utterance.onerror = (event) => {
        if (!isMountedRef.current) return;
        // 'interrupted' and 'canceled' are not real errors
        if (event.error === 'interrupted' || event.error === 'canceled') {
          setNarrationState('idle');
          return;
        }
        setNarrationState('error');
        if (event.error === 'not-allowed') {
          setErrorMessage('Narration के लिए user interaction आवश्यक है। कृपया पुनः try करें।');
        } else if (event.error === 'network') {
          setErrorMessage('Network error: Online voice unavailable। Offline voice try हो रही है।');
        } else {
          setErrorMessage(`Narration error: ${event.error}। कृपया पुनः try करें।`);
        }
      };

      utterance.onpause = () => {
        if (isMountedRef.current) setNarrationState('paused');
      };

      utterance.onresume = () => {
        if (isMountedRef.current) setNarrationState('playing');
      };

      utteranceRef.current = utterance;
      setNarrationState('playing');

      try {
        synth.speak(utterance);

        // PWA Chrome Android fix: sometimes speak() silently fails
        // Check after 1s if synthesis actually started
        setTimeout(() => {
          if (!isMountedRef.current) return;
          if (utteranceRef.current === utterance && !synth.speaking && !synth.pending) {
            // Try again once
            try {
              synth.cancel();
              setTimeout(() => {
                if (isMountedRef.current && utteranceRef.current === utterance) {
                  synth.speak(utterance);
                }
              }, 100);
            } catch {
              setNarrationState('error');
              setErrorMessage('Narration शुरू नहीं हो सकी। कृपया पुनः try करें।');
            }
          }
        }, 1000);
      } catch {
        setNarrationState('error');
        setErrorMessage('Narration शुरू नहीं हो सकी। कृपया पुनः try करें।');
      }
    }, 50);
  }, []);

  const pauseNarration = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setNarrationState('paused');
    }
  }, []);

  const resumeNarration = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (synth.paused) {
      synth.resume();
      setNarrationState('playing');
    }
  }, []);

  return {
    narrationState,
    startNarration,
    pauseNarration,
    resumeNarration,
    stopNarration,
    errorMessage,
  };
}
