import { useState, useCallback } from 'react';
import { useGuest } from './hooks/useGuest';
import EnvelopeScene from './components/EnvelopeScene/EnvelopeScene';
import PetalField from './components/PetalField/PetalField';
import ReadingProgress from './components/ReadingProgress/ReadingProgress';
import MemoriesSection from './sections/MemoriesSection';
import InvitationSection from './sections/InvitationSection';
import GallerySection from './sections/GallerySection';
import ClosingSection from './sections/ClosingSection';

export default function App() {
  const { guest, markOpened, submitRSVP } = useGuest();
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const handleEnvelopeOpen = useCallback(() => {
    setEnvelopeOpened(true);
    document.body.classList.remove('scroll-locked');
    markOpened();
  }, [markOpened]);

  return (
    <>
      {/* Reading Progress Bar - only visible after envelope opens */}
      {envelopeOpened && <ReadingProgress />}

      {/* Floating Petals - always active, gentle falling blossom animation */}
      <PetalField count={12} active={true} />

      {/* Scene 1 & 2: Envelope */}
      <EnvelopeScene
        onOpen={handleEnvelopeOpen}
        guest={guest}
        onMarkOpened={markOpened}
      />

      {/* Main content - revealed after envelope opens */}
      <main
        style={{
          opacity: envelopeOpened ? 1 : 0,
          transform: envelopeOpened ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s var(--ease-out-expo) 0.3s, transform 1s var(--ease-out-expo) 0.3s',
          visibility: envelopeOpened ? 'visible' : 'hidden',
        }}
      >
        {/* Scene 3: Our Memories */}
        <MemoriesSection guest={guest} />

        {/* Scene 4: The Invitation */}
        <InvitationSection guest={guest} onSubmitRSVP={submitRSVP} />

        {/* Scene 5: Little Moments Gallery */}
        <GallerySection />

        {/* Scene 6: Until We Meet */}
        <ClosingSection />
      </main>
    </>
  );
}
