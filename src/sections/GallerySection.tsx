import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import config from '../invitation.config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './GallerySection.module.css';

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const photos = config.galleryPhotos || [];
  const total = photos.length;

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const lockAnimation = useCallback(() => {
    isAnimatingRef.current = true;
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 550);
  }, []);

  const nextSlide = useCallback(() => {
    if (total <= 1 || isAnimatingRef.current) return;
    lockAnimation();
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total, lockAnimation]);

  const prevSlide = useCallback(() => {
    if (total <= 1 || isAnimatingRef.current) return;
    lockAnimation();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total, lockAnimation]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex || isAnimatingRef.current) return;
      lockAnimation();
      setActiveIndex(index);
    },
    [activeIndex, lockAnimation]
  );

  // Preload adjacent images
  useEffect(() => {
    if (total <= 1) return;
    const nextIdx = (activeIndex + 1) % total;
    const prevIdx = (activeIndex - 1 + total) % total;
    if (photos[nextIdx]?.src) {
      const imgNext = new Image();
      imgNext.src = photos[nextIdx].src;
    }
    if (photos[prevIdx]?.src) {
      const imgPrev = new Image();
      imgPrev.src = photos[prevIdx].src;
    }
  }, [activeIndex, photos, total]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    },
    [prevSlide, nextSlide]
  );

  // Touch swipe events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Title observer
  useEffect(() => {
    if (reducedMotion) {
      setTitleVisible(true);
      return;
    }

    const titleEl = sectionRef.current?.querySelector(`.${styles.galleryTitle}`);
    if (titleEl) {
      const titleObs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTitleVisible(true);
            titleObs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      titleObs.observe(titleEl);
    }
  }, [reducedMotion]);

  if (total === 0) return null;

  /**
   * Calculate 3D Scrapbook role for each card:
   * diff === 0 -> Center Active
   * diff === -1 -> Left Polaroid
   * diff === 1 -> Right Polaroid
   * diff < -1 -> Hidden Offscreen Left
   * diff > 1 -> Hidden Offscreen Right
   */
  const getCardStyleClass = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return styles.cardActive;
    if (diff === -1) return styles.cardPrev;
    if (diff === 1) return styles.cardNext;
    if (diff < -1) return styles.cardHiddenLeft;
    return styles.cardHiddenRight;
  };

  return (
    <>
      <section ref={sectionRef} id="gallery" className={styles.gallerySection}>
        {/* Title */}
        <div
          className={styles.galleryTitle}
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(25px)',
          }}
        >
          <h2 className="heading-display" style={{ marginBottom: 'var(--space-md)' }}>
            THE CHAPTER BEFORE THE NEXT
          </h2>
          <p className="text-script">Cảm ơn vì đã là một phần trong thanh xuân của nhau.</p>
        </div>

        {/* 3D Scrapbook Carousel Stage */}
        <div
          className={styles.carouselStage}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Album ảnh scrapbook 3D, bấm vào ảnh hoặc dùng phím mũi tên để lật ảnh"
        >
          {/* Previous Arrow Button */}
          <button
            type="button"
            className={`${styles.navButton} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Lật ảnh trước"
          >
            <ChevronLeft size={22} />
          </button>

          {/* 3D Track with Layered Polaroid Cards */}
          <div className={styles.carouselTrack}>
            {photos.map((photo, index) => {
              let diff = (index - activeIndex) % total;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;
              const isActive = diff === 0;
              const isPrev = diff === -1;
              const isNext = diff === 1;

              return (
                <div
                  key={photo.id}
                  className={`${styles.polaroidCard} ${getCardStyleClass(index)}`}
                  onClick={() => {
                    if (isPrev) {
                      prevSlide();
                    } else if (isNext) {
                      nextSlide();
                    }
                  }}
                  role={isActive ? undefined : 'button'}
                  tabIndex={isActive ? -1 : 0}
                  aria-label={
                    isActive
                      ? `Ảnh đang xem: ${photo.caption}`
                      : `Chuyển đến ảnh: ${photo.caption}`
                  }
                  onKeyDown={(e) => {
                    if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      if (isPrev) prevSlide();
                      if (isNext) nextSlide();
                    }
                  }}
                >
                  {/* Washi Paper Tape at Top */}
                  <div className={styles.washiTape} aria-hidden="true" />

                  {/* Photo Picture Box */}
                  <div className={styles.photoBox}>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className={styles.photoImg}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                    {/* Mini classic ribbon bow decoration on active photo */}
                    {isActive && (
                      <svg
                        className={styles.miniBowDecor}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 12C10 7 4 7 4 11C4 14 10 13 12 12ZM12 12C14 7 20 7 20 11C20 14 14 13 12 12Z"
                          fill="#D4AF37"
                        />
                        <circle cx="12" cy="12" r="2.2" fill="#B38728" />
                        <path d="M11 13L9 20M13 13L15 20" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  {/* Polaroid Chin / Caption */}
                  <div className={styles.polaroidChin}>
                    <p className={styles.polaroidCaption}>{photo.caption}</p>
                    <span className={styles.polaroidChinTag}>A memory to keep ♡</span>
                  </div>

                  {/* Sticker "Yêu quá!" on Active Photo */}
                  {isActive && (
                    <img
                      src="/assets/memories/sticker_1.png"
                      alt=""
                      aria-hidden="true"
                      className={styles.stickerDecor}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className={`${styles.navButton} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Lật ảnh kế tiếp"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Footer Controls: Dots & Tap Hint */}
        <div className={styles.footerControls}>
          <div className={styles.dotsContainer} role="tablist" aria-label="Danh sách ảnh scrapbook">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                type="button"
                className={`${styles.dotButton} ${idx === activeIndex ? styles.dotActive : ''}`}
                onClick={() => goToSlide(idx)}
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Chuyển đến ảnh ${idx + 1}`}
              />
            ))}
          </div>

          <span className={styles.tapNotice}>Dùng phím mũi tên hoặc lướt chạm để xem ảnh ✨</span>
        </div>

        {/* Decorative doodle hearts */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '4%',
            width: '40px',
            height: '40px',
            opacity: 0.15,
            pointerEvents: 'none',
          }}
        >
          <img src="/assets/decorations/doodle-heart.svg" alt="" />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '12%',
            right: '6%',
            width: '32px',
            height: '32px',
            opacity: 0.1,
            transform: 'rotate(15deg)',
            pointerEvents: 'none',
          }}
        >
          <img src="/assets/decorations/doodle-heart.svg" alt="" />
        </div>
      </section>
    </>
  );
}
