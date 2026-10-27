import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import config from '../invitation.config';
import PhotoLightbox from '../components/PhotoLightbox/PhotoLightbox';

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [titleVisible, setTitleVisible] = useState(false);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption: string } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setTitleVisible(true);
      setVisibleItems(new Set(config.galleryPhotos.map((_, i) => i)));
      return;
    }

    // Title observer
    const titleEl = sectionRef.current?.querySelector('.gallery-title');
    if (titleEl) {
      const titleObs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setTitleVisible(true); titleObs.disconnect(); } },
        { threshold: 0.3 }
      );
      titleObs.observe(titleEl);
    }

    // Photo observers
    const photos = sectionRef.current?.querySelectorAll('.gallery-photo');
    const observers: IntersectionObserver[] = [];
    photos?.forEach((photo, index) => {
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => setVisibleItems((prev) => new Set(prev).add(index)), index * 120);
            obs.unobserve(e.target);
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(photo);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [reducedMotion]);

  // Layout assignments
  const getPhotoStyle = (index: number): React.CSSProperties => {
    const rotations = [0, -1.5, 1, -1, 1.5];
    const rotation = config.galleryPhotos[index]?.rotation || rotations[index % rotations.length];

    return {
      transform: visibleItems.has(index)
        ? `rotate(${rotation}deg)`
        : `translateY(40px) rotate(${rotation + 3}deg)`,
      opacity: visibleItems.has(index) ? 1 : 0,
      transition: 'all 0.7s var(--ease-out-expo)',
    };
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="gallery"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: 'linear-gradient(180deg, var(--cream) 0%, var(--pink-light) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        <div
          className="gallery-title"
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto var(--space-3xl)',
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(25px)',
            transition: 'all 0.8s var(--ease-out-expo)',
          }}
        >
          <h2 className="heading-display" style={{ marginBottom: 'var(--space-md)' }}>
            A Few Moments to Keep
          </h2>
          <p className="text-script">
            Cảm ơn vì đã là một phần trong thanh xuân của nhau.
          </p>
        </div>

        {/* Gallery grid with responsive columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1.2rem, 3vw, 2.2rem)',
            maxWidth: '1000px',
            margin: '0 auto',
            alignItems: 'start',
            position: 'relative',
          }}
        >
          {config.galleryPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="gallery-photo"
              style={{
                ...getPhotoStyle(index),
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() =>
                setLightbox({ src: photo.src, alt: photo.alt, caption: photo.caption })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightbox({ src: photo.src, alt: photo.alt, caption: photo.caption });
                }
              }}
              aria-label={`Xem ảnh: ${photo.caption}`}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(201, 104, 133, 0.12)',
                  transition: 'transform 0.3s var(--ease-out-expo), box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(201, 104, 133, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: photo.aspectRatio || '3/4',
                    background: 'linear-gradient(135deg, var(--pink-light) 0%, var(--pink-soft) 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      transition: 'transform 0.5s var(--ease-out-expo)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                {/* Caption below image */}
                <div style={{
                  padding: '10px 14px 14px',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                  }}>
                    {photo.caption}
                  </p>
                </div>
              </div>

              {/* Sticker "Yêu quá!" - attached to featured photo */}
              {index === 0 && (
                <img
                  src="/assets/memories/sticker_1.png"
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-25px',
                    right: '-20px',
                    width: 'clamp(100px, 16vw, 140px)',
                    height: 'auto',
                    transform: 'rotate(8deg)',
                    zIndex: 10,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 6px 16px rgba(201, 104, 133, 0.28))',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Decorative doodle hearts */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: '40px',
            height: '40px',
            opacity: 0.15,
          }}
        >
          <img src="/assets/decorations/doodle-heart.svg" alt="" />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: '30px',
            height: '30px',
            opacity: 0.1,
            transform: 'rotate(15deg)',
          }}
        >
          <img src="/assets/decorations/doodle-heart.svg" alt="" />
        </div>
      </section>

      {lightbox && (
        <PhotoLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
