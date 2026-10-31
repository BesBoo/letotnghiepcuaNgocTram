import { useState, useCallback, useEffect } from 'react';
import { useGuest } from './hooks/useGuest';
import EnvelopeScene from './components/EnvelopeScene/EnvelopeScene';
import PetalField from './components/PetalField/PetalField';
import ReadingProgress from './components/ReadingProgress/ReadingProgress';
import MemoriesSection from './sections/MemoriesSection';
import InvitationSection from './sections/InvitationSection';
import GallerySection from './sections/GallerySection';
import ClosingSection from './sections/ClosingSection';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import config from './invitation.config';

export default function App() {
  const { guest, markOpened, submitRSVP } = useGuest();
  const [envelopeOpened, setEnvelopeOpened] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('opened') === '1' || params.get('preview') === 'all';
    }
    return false;
  });

  const handleEnvelopeOpen = useCallback(() => {
    setEnvelopeOpened(true);
    document.body.classList.remove('scroll-locked');
    markOpened();
  }, [markOpened]);

  useEffect(() => {
    if (envelopeOpened) {
      document.body.classList.remove('scroll-locked');
    }
  }, [envelopeOpened]);

  return (
    <>
      {/* Background Music Player */}
      {config.music?.enabled && (
        <MusicPlayer
          src={config.music.src}
          volume={config.music.volume ?? 0.6}
          envelopeOpened={envelopeOpened}
        />
      )}

      {/* Reading Progress Bar - only visible after envelope opens */}
      {envelopeOpened && <ReadingProgress />}

      {/* Floating Petals - always active, gentle falling blossom animation */}
      <PetalField count={12} active={true} />

      {/* Scene 1 & 2: Envelope */}
      {!envelopeOpened && (
        <EnvelopeScene
          onOpen={handleEnvelopeOpen}
          guest={guest}
          onMarkOpened={markOpened}
        />
      )}

      {/* Main content - revealed after envelope opens */}
      <main
        style={{
          opacity: envelopeOpened ? 1 : 0,
          transform: envelopeOpened ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s var(--ease-out-expo) 0.3s, transform 1s var(--ease-out-expo) 0.3s',
          visibility: envelopeOpened ? 'visible' : 'hidden',
        }}
      >
        {/* 1. Thiệp mời tốt nghiệp */}
        <InvitationSection guest={guest} onSubmitRSVP={submitRSVP} />

        {/* 2. MEMORIES */}
        <MemoriesSection guest={guest} />

        {/* 3. THE CHAPTER BEFORE THE NEXT */}
        <GallerySection />

        {/* 4. ĐỊA ĐIỂM & SƠ ĐỒ BÃI ĐỖ XE */}
        <ClosingSection />
      </main>
    </>
  );
}
