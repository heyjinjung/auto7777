import { useEffect, useRef } from "react";

export function useSound() {
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
      lose: "/sounds/lose.mp3"
    };

    if (sounds[soundName] && typeof window !== "undefined") {
      const audio = new Audio(sounds[soundName]);
      audio.volume = 0.5; // Default volume, can be parameterized
      audio.play().catch(() => {
        // Silent fail for browsers that block autoplay
      });
      audioRef.current = audio;
    }
  };

  return {
    playSound,
  };
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

  const playSound = (soundName: string) => {
    const sounds: Record<string, string> = {
      win: "/sounds/win.mp3",
      spin: "/sounds/spin.mp3",
      click: "/sounds/click.mp3",
      lose: "/sounds/lose.mp3"
    };

    if (sounds[soundName] && typeof window !== "undefined") {
      const audio = new Audio(sounds[soundName]);
      audio.volume = options.volume || 0.5;
      audio.play().catch(() => {
        // Silent fail for browsers that block autoplay
      });
    }
  };

  return { play, stop, pause, playSound };
}
