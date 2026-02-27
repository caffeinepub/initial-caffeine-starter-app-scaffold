import { useState, useCallback, useEffect, useRef } from 'react';

export type NarrationState = 'idle' | 'playing' | 'paused';

interface UseSpeechNarrationReturn {
  narrationState: NarrationState;
  currentMessageId: string | null;
  speak: (text: string, messageId: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isSupported: boolean;
}

/**
 * Returns a Promise that resolves with the available voices.
 * Handles both sync (Firefox/Safari) and async (Chrome) voice loading.
 */
function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    // Chrome loads voices asynchronously — wait for the event
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      const loadedVoices = window.speechSynthesis.getVoices();
      resolve(loadedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    // Safety timeout: if event never fires, resolve with whatever is available
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 3000);
  });
}

/**
 * Detects if the text contains Devanagari (Hindi) script.
 */
function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Selects the best voice for the given text.
 * For Hindi/Devanagari: prefers exact hi-IN, then any hi-* locale, then 'Hindi' in name.
 * For English/other: prefers en-IN, then en-US, then any en-*.
 */
function selectBestVoice(
  voices: SpeechSynthesisVoice[],
  text: string
): { voice: SpeechSynthesisVoice | null; lang: string } {
  const isHindi = hasDevanagari(text);

  if (isHindi) {
    // Priority 1: exact hi-IN match
    const exactHiIN = voices.find(v => v.lang === 'hi-IN');
    if (exactHiIN) return { voice: exactHiIN, lang: 'hi-IN' };

    // Priority 2: any hi-* locale
    const anyHiLocale = voices.find(v => v.lang.startsWith('hi'));
    if (anyHiLocale) return { voice: anyHiLocale, lang: anyHiLocale.lang };

    // Priority 3: voice with 'Hindi' in the name (some browsers label it this way)
    const hindiByName = voices.find(
      v => v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('hi-')
    );
    if (hindiByName) return { voice: hindiByName, lang: 'hi-IN' };

    // Priority 4: no Hindi voice available — still set lang so browser attempts it
    // Use the default voice but force the lang tag
    return { voice: voices[0] ?? null, lang: 'hi-IN' };
  }

  // English / mixed content
  const enIN = voices.find(v => v.lang === 'en-IN');
  if (enIN) return { voice: enIN, lang: 'en-IN' };

  const enUS = voices.find(v => v.lang === 'en-US');
  if (enUS) return { voice: enUS, lang: 'en-US' };

  const anyEn = voices.find(v => v.lang.startsWith('en'));
  if (anyEn) return { voice: anyEn, lang: anyEn.lang };

  return { voice: voices[0] ?? null, lang: 'en-US' };
}

export function useSpeechNarration(): UseSpeechNarrationReturn {
  const [narrationState, setNarrationState] = useState<NarrationState>('idle');
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Warm up voice loading on mount so voices are ready when user clicks play
  useEffect(() => {
    if (!isSupported) return;
    // Trigger voice loading early (Chrome needs this)
    getVoicesAsync().then(() => {
      // voices loaded and cached by browser
    });
  }, [isSupported]);

  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setNarrationState('idle');
    setCurrentMessageId(null);
  }, [isSupported]);

  const speak = useCallback(
    async (text: string, messageId: string) => {
      if (!isSupported) return;

      // Cancel any currently playing speech immediately
      window.speechSynthesis.cancel();
      utteranceRef.current = null;

      // Set optimistic state so UI responds immediately
      setCurrentMessageId(messageId);
      setNarrationState('playing');

      try {
        // Wait for voices to be available (handles Chrome async loading)
        const voices = await getVoicesAsync();
        const { voice, lang } = selectBestVoice(voices, text);

        const utterance = new SpeechSynthesisUtterance(text);

        // CRITICAL: set lang on the utterance so the browser uses the right TTS engine
        utterance.lang = lang;

        // Apply the selected voice if found
        if (voice) {
          utterance.voice = voice;
        }

        // Tuned for clear, natural Hindi narration
        utterance.rate = hasDevanagari(text) ? 0.78 : 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          setNarrationState('playing');
          setCurrentMessageId(messageId);
        };

        utterance.onend = () => {
          setNarrationState('idle');
          setCurrentMessageId(null);
          utteranceRef.current = null;
        };

        utterance.onerror = (e) => {
          // 'interrupted' and 'canceled' are normal when stop() is called
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            console.warn('TTS error:', e.error);
          }
          setNarrationState('idle');
          setCurrentMessageId(null);
          utteranceRef.current = null;
        };

        utterance.onpause = () => {
          setNarrationState('paused');
        };

        utterance.onresume = () => {
          setNarrationState('playing');
        };

        utteranceRef.current = utterance;

        // Small delay to ensure cancel() has fully cleared the queue (Chrome quirk)
        await new Promise<void>(resolve => setTimeout(resolve, 50));

        // Re-check that this speak call is still the active one
        if (utteranceRef.current === utterance) {
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn('Speech narration failed:', err);
        setNarrationState('idle');
        setCurrentMessageId(null);
      }
    },
    [isSupported]
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setNarrationState('paused');
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setNarrationState('playing');
  }, [isSupported]);

  return {
    narrationState,
    currentMessageId,
    speak,
    pause,
    resume,
    stop,
    isSupported,
  };
}
