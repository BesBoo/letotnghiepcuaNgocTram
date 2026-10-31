import { useEffect, useRef, useState, useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Guest } from '../lib/supabase';
import config, { type Memory } from '../invitation.config';
import styles from './MemoriesSection.module.css';

interface MemoriesSectionProps {
  guest?: Guest;
}

export default function MemoriesSection({ guest }: MemoriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [titleVisible, setTitleVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  // Partition memories into Left column (stacked smaller photos) and Right column (featured tall photo)
  const { leftPhotos, featuredPhoto } = useMemo(() => {
    const list = config.memories || [];
    if (list.length === 0) {
      return { leftPhotos: [], featuredPhoto: null };
    }
    if (list.length === 1) {
      return { leftPhotos: [], featuredPhoto: list[0] };
    }
    if (list.length === 2) {
      return { leftPhotos: [list[0]], featuredPhoto: list[1] };
    }
    // 3 or more photos: photo at index 1 is the tall featured image (memory-02.png)
    // Left column contains photo 0 and photo 2+
    const featured = list[1];
    const left = [list[0], ...list.slice(2)];
    return { leftPhotos: left, featuredPhoto: featured };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTitleVisible(true);
      setVisibleItems(new Set(config.memories.map((m) => m.id)));
      return;
    }

    // Title observer
    const titleEl = sectionRef.current?.querySelector(`.${styles.titleContainer}`);
    if (titleEl) {
      const titleObs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTitleVisible(true);
            titleObs.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      titleObs.observe(titleEl);
    }

    // Card items observer
    const cardEls = sectionRef.current?.querySelectorAll(`.${styles.cardItem}`);
    const observers: IntersectionObserver[] = [];

    cardEls?.forEach((card) => {
      const cardId = card.getAttribute('data-id');
      if (!cardId) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(cardId));
            obs.unobserve(entry.target);
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [reducedMotion]);

  const renderCard = (memory: Memory, isFeatured: boolean) => {
    const isVisible = visibleItems.has(memory.id);

    return (
      <div
        key={memory.id}
        data-id={memory.id}
        className={`${styles.cardItem} ${isFeatured ? styles.featuredCard : styles.leftCard}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo)',
        }}
      >
        {/* Washi tape on left cards for scrapbooking aesthetic */}
        {!isFeatured && <div className={styles.washiTape} aria-hidden="true" />}

        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src={memory.src}
            alt={memory.alt}
            loading="lazy"
            className={styles.imageCover}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <section ref={sectionRef} id="memories" className={styles.memoriesSection}>
        {/* Decorative sakura blossoms */}
        <div className={styles.decorBlossom} aria-hidden="true">
          <img
            src="/assets/flowers/sakura-blossoms.jpg"
            alt=""
            style={{ width: '100%', borderRadius: '50%' }}
          />
        </div>

        {/* Section Header */}
        <div
          className={styles.titleContainer}
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <h2 className="heading-display" style={{ marginBottom: 'var(--space-md)' }}>
            MEMORIES
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.35rem, 3.5vw, 1.95rem)',
              color: 'var(--pink-deep)',
              marginBottom: 'var(--space-xs)',
              letterSpacing: '0.01em',
            }}
          >
            {guest?.greeting ||
              (guest?.name && guest.name !== config.senderName
                ? `Thân gửi ${guest.name},`
                : 'Gửi bạn thân yêu,')}
          </p>

          <p className="text-script">Thanh xuân có bạn, thật đẹp.</p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: 'var(--space-lg)',
              opacity: 0.5,
            }}
          >
            <div style={{ width: '60px', height: '1px', background: 'var(--pink-primary)' }} />
            <svg viewBox="0 0 20 18" width="16" height="14" fill="var(--pink-primary)">
              <path d="M10 18 C10 18 0 11 0 5.5 C0 2.4 2.4 0 5.5 0 C7.2 0 8.8 0.8 10 2 C11.2 0.8 12.8 0 14.5 0 C17.6 0 20 2.4 20 5.5 C20 11 10 18 10 18Z" />
            </svg>
            <div style={{ width: '60px', height: '1px', background: 'var(--pink-primary)' }} />
          </div>
        </div>

        {/* Collage Album Grid Container */}
        <div className={styles.collageWrapper}>
          {/* Sticker "Mlem mlem!" - Top Left corner */}
          <img
            src="/assets/memories/sticker_4.png"
            alt=""
            aria-hidden="true"
            className={styles.stickerTopLeft}
          />

          {/* Asymmetric Collage Grid */}
          <div className={styles.collageGrid}>
            {/* Left Column: Stacked Photos */}
            {leftPhotos.length > 0 && (
              <div className={styles.leftColumn}>
                {leftPhotos.map((photo) => renderCard(photo, false))}
              </div>
            )}

            {/* Right Column: Featured Tall Photo */}
            {featuredPhoto && (
              <div className={styles.rightColumn}>
                {renderCard(featuredPhoto, true)}
              </div>
            )}
          </div>

          {/* Sticker "Thả tim" - Bottom Right corner */}
          <img
            src="/assets/memories/sticker_2.png"
            alt=""
            aria-hidden="true"
            className={styles.stickerBottomRight}
          />
        </div>
      </section>
    </>
  );
}
