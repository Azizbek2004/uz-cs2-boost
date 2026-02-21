"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";

interface AudioContextType {
  isEnabled: boolean;
  toggle: () => void;
  playClick: () => void;
  playReload: () => void;
  playHit: () => void;
  playVictory: () => void;
  playError: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isEnabled: true,
  toggle: () => { },
  playClick: () => { },
  playReload: () => { },
  playHit: () => { },
  playVictory: () => { },
  playError: () => { },
});

export const useAudio = () => useContext(AudioContext);

// Generate sounds procedurally using Web Audio API
function createAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    return new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
  } catch {
    return null;
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem("uz-cs2-audio");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    }
  }, []);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = "sine",
      gain: number = 0.15,
    ) => {
      if (!isEnabled) return;
      const ctx = getAudioCtx();
      if (!ctx) return;

      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + duration,
        );

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
      } catch {
        // Audio playback failed silently
      }
    },
    [isEnabled, getAudioCtx],
  );

  const playClick = useCallback(() => {
    // Snappy CS2 UI hover/click
    playTone(1200, 0.03, "sine", 0.15);
    playTone(2000, 0.02, "triangle", 0.1);
  }, [playTone]);

  const playReload = useCallback(() => {
    // Structural clack of a weapon reload
    playTone(150, 0.1, "square", 0.08); // Mag out
    setTimeout(() => {
      // Mag in
      playTone(200, 0.05, "square", 0.1);
      playTone(800, 0.05, "triangle", 0.05);
    }, 150);
    setTimeout(() => {
      // Bolt catch
      playTone(400, 0.08, "sawtooth", 0.08);
      playTone(1200, 0.04, "sine", 0.05);
    }, 350);
  }, [playTone]);

  const playHit = useCallback(() => {
    // CS2 Headshot 'Dink'
    playTone(350, 0.05, "square", 0.15); // Initial thud
    playTone(1200, 0.3, "sine", 0.3); // Metallic ring
    playTone(2400, 0.4, "sine", 0.15); // Harmonics
    playTone(3600, 0.2, "sine", 0.05);
  }, [playTone]);

  const playVictory = useCallback(() => {
    // Triumphant round win motif
    playTone(440, 0.2, "square", 0.1); // A4
    setTimeout(() => playTone(554, 0.2, "square", 0.1), 150); // C#5
    setTimeout(() => {
      playTone(659, 0.4, "square", 0.15); // E5
      playTone(880, 0.4, "sine", 0.1); // A5
    }, 300);
  }, [playTone]);

  const playError = useCallback(() => {
    // Empty clip / dry fire click
    playTone(800, 0.02, "square", 0.1);
    setTimeout(() => playTone(600, 0.03, "sawtooth", 0.1), 30);
  }, [playTone]);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("uz-cs2-audio", String(next));
      return next;
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isEnabled,
        toggle,
        playClick,
        playReload,
        playHit,
        playVictory,
        playError,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
