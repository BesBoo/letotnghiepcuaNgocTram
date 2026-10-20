import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Guest } from '../lib/supabase';
import config from '../invitation.config';
import PhotoLightbox from '../components/PhotoLightbox/PhotoLightbox';

interface MemoriesSectionProps {
  guest?: Guest;
}

export default function MemoriesSection({ guest }: MemoriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption: string } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisibleItems(new Set(config.memories.map((_, i) => i)));
      return;
    }

    const observers: IntersectionObserver[] = [];
    const cards = sectionRef.current?.querySelectorAll('.memory-card');
    if (!cards) return;

    cards.forEach((card, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems((prev) => new Set(prev).add(index));
            }, index * 150);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [reducedMotion]);

  // Section title observer
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) { setTitleVisible(true); return; }
    if (!titleRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTitleVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(titleRef.current);
    return () => obs.disconnect();
  }, [reducedMotion]);

  return (
    <>
      <section
        ref={sectionRef}
        id="memories"
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: 'linear-gradient(180deg, var(--cream) 0%, var(--pink-light) 50%, var(--cream) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blossoms */}
        <div style={{
          position: 'absolute', top: '5%', right: '-2%', width: '150px', height: '150px',
          opacity: 0.15, transform: 'rotate(25deg)', pointerEvents: 'none',
        }} aria-hidden="true">
          <img src="/assets/flowers/sakura-blossoms.jpg" alt="" style={{ width: '100%', borderRadius: '50%' }} />
        </div>

        {/* Title */}
        <div
          ref={titleRef}
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto var(--space-3xl)',
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo)',
          }}
        >
          <h2
            className="heading-display"
            style={{ marginBottom: 'var(--space-md)' }}
          >
            Our Little Memories
          </h2>

          {/* Lời chào/gửi đích danh khách mời */}
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

          <p className="text-script">
            Thanh xuân có bạn, thật đẹp.
          </p>
          <p className="text-body" style={{ marginTop: 'var(--space-lg)' }}>
            Có những ngày tháng trôi qua thật nhẹ, nhưng khi nhìn lại, mới thấy đó là những khoảnh khắc đẹp nhất.
            Cảm ơn vì đã cùng nhau tạo nên những kỷ niệm không bao giờ phai.
          </p>

          {/* Decorative heart line */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', marginTop: 'var(--space-lg)', opacity: 0.5,
          }}>
            <div style={{ width: '60px', height: '1px', background: 'var(--pink-primary)' }} />
            <svg viewBox="0 0 20 18" width="16" height="14" fill="var(--pink-primary)">
              <path d="M10 18 C10 18 0 11 0 5.5 C0 2.4 2.4 0 5.5 0 C7.2 0 8.8 0.8 10 2 C11.2 0.8 12.8 0 14.5 0 C17.6 0 20 2.4 20 5.5 C20 11 10 18 10 18Z" />
            </svg>
            <div style={{ width: '60px', height: '1px', background: 'var(--pink-primary)' }} />
          </div>
        </div>

        {/* Photo Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {config.memories.map((memory, index) => {
            const isVisible = visibleItems.has(index);
            return (
              <div
                key={memory.id}
                className="memory-card"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? `translateY(0) rotate(${memory.rotation || 0}deg)`
                    : `translateY(50px) rotate(${(memory.rotation || 0) + 5}deg)`,
                  transition: `opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo)`,
                  cursor: 'pointer',
                }}
                onClick={() =>
                  setLightbox({ src: memory.src, alt: memory.alt, caption: memory.caption })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightbox({ src: memory.src, alt: memory.alt, caption: memory.caption });
                  }
                }}
                aria-label={`Xem ảnh: ${memory.caption}`}
              >
                {/* Polaroid frame */}
                <div
                  className="polaroid-hover"
                  style={{
                    background: 'white',
                    padding: '12px 12px 40px',
                    borderRadius: '2px',
                    boxShadow: '0 4px 16px rgba(201, 104, 133, 0.12), 0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'transform 0.3s var(--ease-out-expo), box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px) rotate(0deg)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(201, 104, 133, 0.2), 0 4px 8px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Photo */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      background: 'linear-gradient(135deg, var(--pink-light) 0%, var(--pink-soft) 100%)',
                      borderRadius: '1px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={memory.src}
                      alt={memory.alt}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        // Hide broken image, show gradient placeholder
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Placeholder overlay for missing images */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2rem', opacity: 0.3, pointerEvents: 'none',
                    }}>
                      📷
                    </div>
                  </div>

                  {/* Caption */}
                  <p
                    style={{
                      fontFamily: 'var(--font-script)',
                      fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      marginTop: '12px',
                      lineHeight: 1.4,
                    }}
                  >
                    {memory.caption}
                  </p>
                </div>

                {/* Paper tape decoration */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-2deg)',
                    width: '50px',
                    height: '18px',
                    background: 'rgba(249, 202, 213, 0.6)',
                    borderRadius: '1px',
                    zIndex: 2,
                  }}
                />
              </div>
            );
          })}
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
