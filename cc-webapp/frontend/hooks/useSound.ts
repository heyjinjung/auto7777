import { useEffect, useRef } from "react";

interface SoundOptions {
  volume?: number;
}

export function useSound(options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playSound = (soundName: string) => {
    const sounds: Record<string, string> = {
      win: "/sounds/win.mp3",
      spin: "/sounds/spin.mp3",
      click: "/sounds/click.mp3",
      lose: "/sounds/lose.mp3",
      common: "/sounds/common.mp3",
      rare: "/sounds/rare.mp3",
      epic: "/sounds/epic.mp3",
      legendary: "/sounds/legendary.mp3"
    };

    if (sounds[soundName] && typeof window !== "undefined") {
      const audio = new Audio(sounds[soundName]);
      audio.volume = options.volume || 0.5;
      audio.play().catch(() => {
        // Silent fail for browsers that block autoplay
      });
      audioRef.current = audio;
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return { playSound, stop, pause };
}
