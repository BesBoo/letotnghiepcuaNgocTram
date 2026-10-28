import { useState, useEffect, useRef, useCallback } from 'react';
import { Music, VolumeX } from 'lucide-react';
import styles from './MusicPlayer.module.css';

interface MusicPlayerProps {
  src?: string;
  volume?: number;
  autoPlayOnInteract?: boolean;
}

export default function MusicPlayer({
  src = '/music.mp3',
  volume = 0.6,
  autoPlayOnInteract = true,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const startAudio = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(volume, 0), 1);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay policy prevented immediate playback or audio file not found
          console.log('Chờ tương tác người dùng để phát nhạc nền hoặc chưa có file /music.mp3:', err.message);
          setIsPlaying(false);
        });
    }
  }, [volume]);

  // Attempt initial play & listen for first user interaction (touch/click)
  useEffect(() => {
    // 1. Try playing right away
    startAudio();

    if (!autoPlayOnInteract) return;

    // 2. Fallback: Listen for first user gesture anywhere on screen
    const handleFirstGesture = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        startAudio();
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, [autoPlayOnInteract, hasInteracted, startAudio]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Không thể phát nhạc:', err));
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        className={`${styles.musicButton} ${isPlaying ? styles.isPlaying : styles.isPaused}`}
        onClick={togglePlay}
        title={isPlaying ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền'}
        aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền'}
      >
        <div className={styles.discCenter}>
          {isPlaying ? (
            <Music size={20} strokeWidth={2.2} />
          ) : (
            <VolumeX size={20} strokeWidth={2.2} />
          )}

          {isPlaying && (
            <div className={styles.waveIndicator}>
              <span className={styles.waveBar} />
              <span className={styles.waveBar} />
              <span className={styles.waveBar} />
            </div>
          )}
        </div>
      </button>
    </>
  );
}
