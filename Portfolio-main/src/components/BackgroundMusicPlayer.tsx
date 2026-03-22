import { useEffect, useRef, useState } from "react";

type BackgroundMusicPlayerProps = {
  isThemeTransitioning?: boolean;
};

const MUSIC_STORAGE_KEY = "portfolio-music-playing";
const DEFAULT_VOLUME = 0.62;
const TRACKS = [
  {
    src: `${import.meta.env.BASE_URL}music/music1.mp3`,
    label: "music1.mp3",
  },
  {
    src: `${import.meta.env.BASE_URL}music/music2.mp3`,
    label: "music2.mp3",
  },
] as const;

const BackgroundMusicPlayer = ({
  isThemeTransitioning = false,
}: BackgroundMusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const hasInteractedRef = useRef(false);
  const mountedRef = useRef(false);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(MUSIC_STORAGE_KEY) !== "false";
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  const clearFade = () => {
    if (fadeIntervalRef.current !== null) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeVolume = (
    audio: HTMLAudioElement,
    from: number,
    to: number,
    durationMs = 420,
    onComplete?: () => void
  ) => {
    clearFade();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      audio.volume = to;
      onComplete?.();
      return;
    }

    const steps = 12;
    const stepDuration = durationMs / steps;
    let step = 0;

    audio.volume = from;
    fadeIntervalRef.current = window.setInterval(() => {
      step += 1;
      const progress = Math.min(step / steps, 1);
      audio.volume = from + (to - from) * progress;

      if (progress >= 1) {
        clearFade();
        onComplete?.();
      }
    }, stepDuration);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MUSIC_STORAGE_KEY, String(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    mountedRef.current = true;

    const handleFirstInteraction = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      setHasInteracted(true);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      mountedRef.current = false;
      clearFade();
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !hasInteracted;

    if (!isPlaying) {
      if (!audio.paused) {
        fadeVolume(audio, audio.volume || DEFAULT_VOLUME, 0, 280, () => {
          audio.pause();
        });
      }
      return;
    }

    const startPlayback = async () => {
      clearFade();

      if (hasInteracted) {
        audio.volume = 0;
      }

      try {
        await audio.play();
        if (hasInteracted) {
          fadeVolume(audio, 0, DEFAULT_VOLUME, 540);
        }
      } catch {
        if (mountedRef.current) {
          setIsPlaying(false);
        }
      }
    };

    void startPlayback();
  }, [currentTrackIndex, hasInteracted, isPlaying]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      setHasInteracted(true);
    }

    audio.muted = false;
    setIsPlaying(true);
  };

  const handleTrackEnded = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].src}
        preload="auto"
        autoPlay={isPlaying}
        muted
        playsInline
        onEnded={handleTrackEnded}
      />

      <button
        type="button"
        onClick={() => void togglePlayback()}
        className={`fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-white/50 bg-white/90 text-black shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_20px_46px_rgba(15,23,42,0.22)] active:scale-[0.98] dark:border-white/12 dark:bg-slate-950/86 dark:text-white dark:shadow-[0_18px_48px_rgba(2,6,23,0.52)] ${
          isThemeTransitioning ? "theme-widget-switching" : ""
        }`}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        title={
          isPlaying
            ? `Pause background music (${TRACKS[currentTrackIndex].label})`
            : "Play background music"
        }
      >
        <span className="sr-only">
          {isPlaying ? "Pause background music" : "Play background music"}
        </span>
        <span aria-hidden="true" className="text-lg sm:text-xl leading-none">
          {isPlaying ? "🔊" : "🔇"}
        </span>
      </button>
    </>
  );
};

export default BackgroundMusicPlayer;
