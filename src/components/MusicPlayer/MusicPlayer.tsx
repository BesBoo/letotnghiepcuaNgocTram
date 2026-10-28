import { useState, useEffect, useRef, useCallback } from 'react';
import { Music, VolumeX } from 'lucide-react';
import styles from './MusicPlayer.module.css';

interface MusicPlayerProps {
  src?: string;
  volume?: number;
  autoPlayOnInteract?: boolean;
  envelopeOpened?: boolean;
}

export default function MusicPlayer({
  src = '/music.mp3',
  volume = 0.6,
  autoPlayOnInteract = true,
  envelopeOpened = false,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Default to active (true) so the UI immediately indicates music is enabled
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [userMuted, setUserMuted] = useState<boolean>(false);
  const hasInteractedRef = useRef<boolean>(false);

  const playAudio = useCallback(() => {
    if (!audioRef.current || userMuted) return;
    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(volume, 0), 1);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay policy prevented immediate unprompted sound before user interaction.
          // Keep UI in music-ready mode, don't show muted icon unless user explicitly muted.
          console.log('Chờ tương tác đầu tiên của người dùng để phát nhạc:', err.message);
        });
    }
  }, [userMuted, volume]);

  // Attempt autoplay immediately on mount
  useEffect(() => {
    playAudio();
  }, [playAudio]);

  // Trigger when envelopeOpened transitions to true
  useEffect(() => {
    if (envelopeOpened && !userMuted) {
      playAudio();
    }
  }, [envelopeOpened, userMuted, playAudio]);

  // Listen to ANY early micro-interaction (touch, click, pointer, key, scroll) to unlock audio immediately
  useEffect(() => {
    if (!autoPlayOnInteract || userMuted) return;

    const handleFirstGesture = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        playAudio();
      }
    };

    const options = { capture: true, passive: true };
    const events = ['pointerdown', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown', 'wheel', 'scroll'];

    events.forEach((evt) => {
      window.addEventListener(evt, handleFirstGesture, options);
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleFirstGesture, true);
      });
    };
  }, [autoPlayOnInteract, userMuted, playAudio]);

  // Handle user toggling music manually
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying && !userMuted) {
      audioRef.current.pause();
      setIsPlaying(false);
      setUserMuted(true);
    } else {
      setUserMuted(false);
      audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Không thể phát nhạc:', err));
    }
  };

  // Determine active visual state: active if playing and not muted by user
  const isVisuallyActive = isPlaying && !userMuted;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        autoPlay
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (userMuted) {
            setIsPlaying(false);
          }
        }}
      />

      <button
        type="button"
        className={`${styles.musicButton} ${isVisuallyActive ? styles.isPlaying : styles.isPaused}`}
        onClick={togglePlay}
        title={isVisuallyActive ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền'}
        aria-label={isVisuallyActive ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền'}
      >
        <div className={styles.discCenter}>
          {isVisuallyActive ? (
            <Music size={20} strokeWidth={2.2} />
          ) : (
            <VolumeX size={20} strokeWidth={2.2} />
          )}

          {isVisuallyActive && (
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
