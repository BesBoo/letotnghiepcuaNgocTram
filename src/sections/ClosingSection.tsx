import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import config from '../invitation.config';
import { ArrowUp, MapPin, ExternalLink } from 'lucide-react';
import ParkingMap from '../components/ParkingMap/ParkingMap';

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pathDrawn, setPathDrawn] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) { setIsVisible(true); setPathDrawn(true); return; }
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setPathDrawn(true), 600);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="closing"
      style={{
        minHeight: '100vh',
        padding: 'clamp(2.5rem, 6vw, 5rem) clamp(0.5rem, 3vw, 2.5rem)',
        background: 'linear-gradient(180deg, var(--pink-light) 0%, var(--pink-soft) 40%, #f7c5d4 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Paper plane SVG animation */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 'min(80%, 500px)',
          height: '200px',
          pointerEvents: 'none',
          opacity: isVisible ? 0.3 : 0,
          transition: 'opacity 1s',
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 500 200" fill="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M20 180 Q100 160 180 120 Q280 60 350 80 Q420 100 480 30"
            stroke="var(--pink-deep)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="600"
            strokeDashoffset={pathDrawn ? '0' : '600'}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 3s ease-out',
            }}
          />
          {/* Paper plane icon */}
          <g
            style={{
              opacity: pathDrawn ? 1 : 0,
              transition: 'opacity 0.5s 2.5s',
            }}
          >
            <path
              d="M475 25 L495 15 L483 25 L487 35 Z"
              fill="var(--pink-deep)"
              opacity="0.6"
              transform="rotate(-30, 485, 25)"
            />
          </g>
        </svg>
      </div>

      {/* Graduation caps floating */}
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: `${15 + n * 12}%`,
            right: `${10 + n * 15}%`,
            fontSize: `${1.2 + n * 0.3}rem`,
            opacity: isVisible ? 0.15 + n * 0.05 : 0,
            transform: isVisible ? `translateY(0) rotate(${n * 8 - 12}deg)` : 'translateY(30px)',
            transition: `all 0.8s var(--ease-out-expo) ${300 + n * 200}ms`,
            pointerEvents: 'none',
          }}
        >
          🎓
        </div>
      ))}

      {/* Main content wrapper */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Top closing letter content */}
        <div style={{ maxWidth: '620px', width: '100%', margin: '0 auto clamp(1.8rem, 4vw, 2.8rem)', textAlign: 'center' }}>
          <p
            className="text-script"
            style={{
              fontSize: 'clamp(1.4rem, 3.8vw, 1.95rem)',
              marginBottom: 'var(--space-md)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s var(--ease-out-expo) 200ms',
              color: 'var(--text-primary)',
              lineHeight: 1.35,
            }}
          >
            Hẹn gặp lại ở một cột mốc thật đặc biệt nhé!
          </p>

          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.15rem, 3vw, 1.45rem)',
              color: 'var(--pink-deep)',
              marginBottom: 'var(--space-xs)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.8s var(--ease-out-expo) 400ms',
            }}
          >
            {config.signOff}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.02rem, 2.5vw, 1.25rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.8s var(--ease-out-expo) 600ms',
            }}
          >
            — {config.senderName}
          </p>
        </div>

        {/* Event Venue Card (Trường ĐH Mở TP.HCM - 97 Võ Văn Tần) */}
        <div style={{ maxWidth: '620px', width: '100%', margin: '0 auto' }}>
          <div
            style={{
              margin: '0 auto calc(var(--space-xl) + 10px)',
              padding: 'clamp(1.2rem, 3.5vw, 1.8rem)',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 8px 30px rgba(201, 104, 133, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              textAlign: 'left',
              position: 'relative',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.8s var(--ease-out-expo) 200ms',
            }}
          >
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <MapPin size={20} color="var(--pink-deep)" />
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Địa điểm tổ chức lễ tốt nghiệp
              </h3>
            </div>

            <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              {config.event.venue}
            </p>
            <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {config.event.address}
            </p>

            {/* Interactive Google Map iframe */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '220px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.08)',
                marginBottom: '14px',
              }}
            >
              <iframe
                src="https://maps.google.com/maps?q=HCMC+Open+University+-+Campus+1,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n,+Xu%C3%A2n+H%C3%B2a,+H%E1%BB%93+Ch%C3%AD+Minh&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ HCMC Open University - Campus 1"
              />
            </div>

            {/* Direct link button */}
            <div style={{ textAlign: 'center' }}>
              <a
                href={config.event.mapLink || "https://www.google.com/maps/search/?api=1&query=HCMC+Open+University+-+Campus+1,+97+V%C3%B5+V%C4%83n+T%E1%BA%A7n"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--white)',
                  background: 'var(--pink-deep)',
                  borderRadius: 'var(--radius-xl)',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(201, 104, 133, 0.3)',
                  transition: 'all 0.2s',
                }}
              >
                <ExternalLink size={14} />
                Mở chỉ đường trên Google Maps
              </a>
            </div>

            {/* Sticker "Cảm ơn!" - bottom right of venue card */}
            <img
              src="/assets/memories/sticker_3.png"
              alt="Cảm ơn!"
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-28px',
                right: '-18px',
                width: 'clamp(110px, 16vw, 145px)',
                height: 'auto',
                transform: 'rotate(8deg)',
                zIndex: 10,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 6px 16px rgba(201, 104, 133, 0.28))',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.6s var(--ease-out-expo) 1.4s, transform 0.6s var(--ease-out-expo) 1.4s',
              }}
            />
          </div>
        </div>

        {/* =========================================================
            SƠ ĐỒ BÃI ĐỖ XE (PARKING MAP & INTERACTIVE BUTTONS)
            Replaces old static text with modern Transparent Glassmorphism UI
            ========================================================= */}
        <div
          style={{
            width: '100%',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.9s var(--ease-out-expo) 800ms',
          }}
        >
          <ParkingMap />
        </div>

        {/* Decorative heart divider */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '12px', marginTop: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'var(--space-2xl)',
          opacity: isVisible ? 0.4 : 0,
          transition: 'opacity 1s 1s',
        }}>
          <div style={{ width: '40px', height: '1px', background: 'var(--pink-deep)' }} />
          <svg viewBox="0 0 20 18" width="14" height="12" fill="var(--pink-deep)">
            <path d="M10 18C10 18 0 11 0 5.5C0 2.4 2.4 0 5.5 0C7.2 0 8.8.8 10 2C11.2.8 12.8 0 14.5 0C17.6 0 20 2.4 20 5.5C20 11 10 18 10 18Z" />
          </svg>
          <div style={{ width: '40px', height: '1px', background: 'var(--pink-deep)' }} />
        </div>

        {/* Scroll back to top */}
        <button
          onClick={scrollToTop}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--pink-deep)',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--pink-soft)',
            borderRadius: 'var(--radius-xl)',
            cursor: 'pointer',
            transition: 'all 0.3s var(--ease-out-expo)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 104, 133, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <ArrowUp size={16} />
          Mở lại lá thư
        </button>
      </div>

      {/* Bottom skyline silhouette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          opacity: 0.08,
        }}
      >
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M0 80 L0 50 L80 48 L100 35 L120 48 L200 46 L220 30 L240 46 L350 44 L380 20 L400 25 L420 15 L440 25 L460 44 L600 42 L630 28 L650 42 L800 40 L830 22 L860 40 L950 38 L970 25 L1000 38 L1100 36 L1120 20 L1140 36 L1200 34 L1200 80 Z"
            fill="var(--text-primary)"
          />
        </svg>
      </div>
    </section>
  );
}
