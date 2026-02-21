"use client";

import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";

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
        return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
        (frequency: number, duration: number, type: OscillatorType = "sine", gain: number = 0.15) => {
            if (!isEnabled) return;
            const ctx = getAudioCtx();
            if (!ctx) return;

            try {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.type = type;
                oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
                gainNode.gain.setValueAtTime(gain, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + duration);
            } catch {
                // Audio playback failed silently
            }
        },
        [isEnabled, getAudioCtx]
    );

    const playClick = useCallback(() => {
        playTone(800, 0.08, "square", 0.08);
        setTimeout(() => playTone(600, 0.05, "square", 0.05), 20);
    }, [playTone]);

    const playReload = useCallback(() => {
        playTone(200, 0.15, "sawtooth", 0.1);
        setTimeout(() => playTone(400, 0.2, "sawtooth", 0.08), 150);
        setTimeout(() => playTone(300, 0.15, "sawtooth", 0.06), 350);
    }, [playTone]);

    const playHit = useCallback(() => {
        playTone(1000, 0.1, "sine", 0.12);
        setTimeout(() => playTone(1400, 0.08, "sine", 0.08), 50);
    }, [playTone]);

    const playVictory = useCallback(() => {
        playTone(523, 0.15, "sine", 0.12);
        setTimeout(() => playTone(659, 0.15, "sine", 0.12), 150);
        setTimeout(() => playTone(784, 0.3, "sine", 0.15), 300);
    }, [playTone]);

    const playError = useCallback(() => {
        playTone(300, 0.2, "sawtooth", 0.1);
        setTimeout(() => playTone(200, 0.3, "sawtooth", 0.08), 100);
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
            value={{ isEnabled, toggle, playClick, playReload, playHit, playVictory, playError }}
        >
            {children}
        </AudioContext.Provider>
    );
}
