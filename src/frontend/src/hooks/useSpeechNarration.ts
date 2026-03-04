import { useCallback, useEffect, useRef, useState } from "react";

export type NarrationState = "idle" | "playing" | "paused" | "error";

export interface SpeechNarrationControls {
  narrationState: NarrationState;
  isPlaying: boolean;
  isPaused: boolean;
  error: string | null;
  isSupported: boolean;
  startNarration: (text: string) => void;
  pauseNarration: () => void;
  resumeNarration: () => void;
  stopNarration: () => void;
}

export function useSpeechNarration(): SpeechNarrationControls {
  const [narrationState, setNarrationState] = useState<NarrationState>("idle");
  const [error, setError] = useState<string | null>(null);
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const retryCountRef = useRef(0);
  const currentTextRef = useRef<string>("");
  const voicesReadyRef = useRef(false);

  // Warm up voices on mount (PWA fix) — wait for voices to load
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesReadyRef.current = true;
      }
    };

    loadVoices();

    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };
    }

    // Fallback: mark voices ready after 2s even if event never fires
    const fallbackTimer = setTimeout(() => {
      voicesReadyRef.current = true;
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  // Page Visibility API for PWA — pause/resume on background/foreground
  useEffect(() => {
    if (!isSupported) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (narrationState === "playing") {
          try {
            window.speechSynthesis.pause();
            setNarrationState("paused");
          } catch {
            // ignore
          }
        }
      } else {
        if (narrationState === "paused") {
          try {
            window.speechSynthesis.resume();
            setNarrationState("playing");
          } catch {
            // If resume fails, restart from beginning
            if (currentTextRef.current) {
              window.speechSynthesis.cancel();
              setTimeout(() => {
                if (currentTextRef.current) {
                  startNarrationInternal(currentTextRef.current, 0);
                }
              }, 300);
            }
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrationState, isSupported]);

  const getHindiVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "hi-IN") ||
      voices.find((v) => v.lang.startsWith("hi")) ||
      voices.find((v) => v.lang.includes("IN")) ||
      null
    );
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: getHindiVoice is a stable inline fn, intentionally omitted
  const startNarrationInternal = useCallback(
    (text: string, retryCount: number) => {
      if (!isSupported) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voice = getHindiVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        setNarrationState("playing");
        setError(null);
      };

      utterance.onend = () => {
        setNarrationState("idle");
        utteranceRef.current = null;
        currentTextRef.current = "";
      };

      utterance.onerror = (e) => {
        // Ignore intentional cancellations
        if (e.error === "interrupted" || e.error === "canceled") {
          setNarrationState("idle");
          return;
        }
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = 2 ** retryCount * 300;
          setTimeout(() => {
            window.speechSynthesis.cancel();
            startNarrationInternal(text, retryCount + 1);
          }, delay);
          return;
        }
        setNarrationState("error");
        setError(
          "TTS में समस्या आई। कृपया Chrome browser में try करें या audio player use करें।",
        );
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

      // Chrome Android PWA fix: resume if stuck after 150ms
      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 150);

      // Additional Chrome fix: re-trigger if still not speaking after 1s
      setTimeout(() => {
        if (
          utteranceRef.current === utterance &&
          !window.speechSynthesis.speaking &&
          narrationState !== "playing"
        ) {
          window.speechSynthesis.cancel();
          if (retryCount < 3) {
            startNarrationInternal(text, retryCount + 1);
          }
        }
      }, 1000);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isSupported],
  );

  const startNarration = useCallback(
    (text: string) => {
      if (!isSupported) {
        setError("आपका browser TTS support नहीं करता।");
        setNarrationState("error");
        return;
      }

      window.speechSynthesis.cancel();
      retryCountRef.current = 0;
      currentTextRef.current = text;
      setError(null);
      setNarrationState("idle");

      // If voices not ready yet, wait briefly then speak
      const doSpeak = () => startNarrationInternal(text, 0);

      if (
        voicesReadyRef.current ||
        window.speechSynthesis.getVoices().length > 0
      ) {
        doSpeak();
      } else {
        // Wait for voices to load
        const timeout = setTimeout(doSpeak, 500);
        const handler = () => {
          clearTimeout(timeout);
          doSpeak();
        };
        window.speechSynthesis.onvoiceschanged = handler;
      }
    },
    [isSupported, startNarrationInternal],
  );

  const pauseNarration = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.pause();
      setNarrationState("paused");
    } catch {
      // ignore
    }
  }, [isSupported]);

  const resumeNarration = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.resume();
      setNarrationState("playing");
    } catch {
      // If resume fails, restart
      if (currentTextRef.current) {
        window.speechSynthesis.cancel();
        setTimeout(
          () => startNarrationInternal(currentTextRef.current, 0),
          200,
        );
      }
    }
  }, [isSupported, startNarrationInternal]);

  const stopNarration = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
    utteranceRef.current = null;
    currentTextRef.current = "";
    setNarrationState("idle");
    setError(null);
  }, [isSupported]);

  return {
    narrationState,
    isPlaying: narrationState === "playing",
    isPaused: narrationState === "paused",
    error,
    isSupported,
    startNarration,
    pauseNarration,
    resumeNarration,
    stopNarration,
  };
}
