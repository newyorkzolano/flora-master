'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

type SoundType = 'click' | 'correct' | 'incorrect' | 'win' | 'lose' | 'background';

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (sound: SoundType) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Helper to create audio elements safely on the client
const createAudio = (src: string, loop = false) => {
  const audio = new Audio(src);
  audio.loop = loop;
  audio.preload = 'auto';
  return audio;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    background: null,
    click: null,
    correct: null,
    incorrect: null,
    win: null,
    lose: null,
  });

  // This effect runs once on mount to initialize audio elements.
  useEffect(() => {
    audioRefs.current = {
      background: createAudio('/sounds/background-music.mp3', true),
      click: createAudio('/sounds/click.mp3'),
      correct: createAudio('/sounds/correct.mp3'),
      incorrect: createAudio('/sounds/incorrect.mp3'),
      win: createAudio('/sounds/win.mp3'),
      lose: createAudio('/sounds/lose.mp3'),
    };
    
    Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
            audio.volume = audio.src.includes('background') ? 0.1 : 0.5;
            audio.load();
        }
    });
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    const audio = audioRefs.current[sound];
    if (!audio || isMuted) return;

    if (sound === 'background') {
        if(audio.paused) {
            audio.play().catch(e => console.error("Background audio play failed:", e));
        }
        return;
    }
    
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error(`Audio play failed for ${sound}:`, error);
        });
    }

  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
        const newMutedState = !prev;
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) audio.muted = newMutedState;
        });
        
        const backgroundAudio = audioRefs.current.background;
        if (!newMutedState && backgroundAudio && backgroundAudio.paused) {
             backgroundAudio.play().catch(e => console.error("Audio play failed on unmute:", e));
        }
        return newMutedState;
    });
  }, []);

  const value = {
    isMuted,
    toggleMute,
    playSound,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};