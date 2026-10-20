import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useDocumentVisibility } from '../../hooks/useDocumentVisibility';
import type { Guest } from '../../lib/supabase';
import config from '../../invitation.config';
import styles from './EnvelopeScene.module.css';

interface EnvelopeSceneProps {
  onOpen: () => void;
  guest?: Guest;
  onMarkOpened?: () => void;
}

const PetalSVG = ({ color = '#F3A1B5', opacity = 0.7 }: { color?: string; opacity?: number }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 2 C28 8 36 18 34 28 C32 36 24 38 20 38 C16 38 8 36 6 28 C4 18 12 8 20 2Z"
      fill={color}
      opacity={opacity}
    />
  </svg>
);

export default function EnvelopeScene({ onOpen, guest, onMarkOpened }: EnvelopeSceneProps) {
  const [opened, setOpened] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const autoProceedTimer = useRef<number | null>(null);

  const isOpeningRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const isVisible = useDocumentVisibility();

  // Explicitly ensure the closed state transforms on mount
  useEffect(() => {
    if (flapRef.current) {
      gsap.set(flapRef.current, { rotateX: 0, z: 4, zIndex: 15 });
    }
    if (cardRef.current) {
      gsap.set(cardRef.current, { y: 0, z: 1, zIndex: 4, rotationZ: 0 });
    }
    if (sealRef.current) {
      gsap.set(sealRef.current, { opacity: 1, scale: 1, rotation: 0 });
    }
  }, []);

  // Pause floating animation when tab is not active
  useEffect(() => {
    if (!wrapperRef.current || isOpeningRef.current) return;
    wrapperRef.current.style.animationPlayState = isVisible ? 'running' : 'paused';
  }, [isVisible]);

  // Clean up auto proceed timer
  useEffect(() => {
    return () => {
      if (autoProceedTimer.current) {
        clearTimeout(autoProceedTimer.current);
      }
    };
  }, []);

  const handleProceed = useCallback(() => {
    if (autoProceedTimer.current) {
      clearTimeout(autoProceedTimer.current);
      autoProceedTimer.current = null;
    }
    setIsHidden(true);
    setTimeout(() => {
      onOpen();
    }, 900);
  }, [onOpen]);

  const handleOpen = useCallback(() => {
    if (isOpeningRef.current) {
      if (canProceed) {
        handleProceed();
      }
      return;
    }

    isOpeningRef.current = true;
    setOpened(true);
    if (onMarkOpened) {
      onMarkOpened();
    }

    if (wrapperRef.current) {
      wrapperRef.current.style.animation = 'none';
    }

    if (reducedMotion) {
      if (sealRef.current) sealRef.current.style.opacity = '0';
      if (flapRef.current) {
        flapRef.current.style.transform = 'translateZ(-2px) rotateX(-180deg)';
        flapRef.current.style.zIndex = '1';
      }
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateY(-76%) translateZ(8px)';
        cardRef.current.style.zIndex = '25';
      }
      if (hintRef.current) hintRef.current.style.opacity = '0';
      setCanProceed(true);
      autoProceedTimer.current = window.setTimeout(handleProceed, 1200);
      return;
    }

    // GSAP master timeline for sequential, realistic envelope opening
    const tl = gsap.timeline({
      onComplete: () => {
        setCanProceed(true);
        // Automatically proceed after 3.6 seconds of reading, or user can click earlier
        autoProceedTimer.current = window.setTimeout(handleProceed, 3600);
      },
    });

    // Step 1: Text hints fade out
    if (hintRef.current) {
      tl.to(
        hintRef.current,
        {
          opacity: 0,
          y: 12,
          duration: 0.3,
          ease: 'power2.out',
        },
        0
      );
    }

    // Step 2: Gentle envelope lift anticipation
    if (wrapperRef.current) {
      tl.to(
        wrapperRef.current,
        {
          y: -10,
          scale: 1.02,
          duration: 0.35,
          ease: 'power2.out',
        },
        0
      );
    }

    // Step 3: Wax seal breaks and fades out cleanly
    if (sealRef.current) {
      tl.to(
        sealRef.current,
        {
          scale: 1.25,
          opacity: 0,
          rotation: 12,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.08
      );
    }

    // Step 4: Flap folds UPWARD and BACKWARD around the top fold line (rotateX: 0 -> -180deg)
    // Away from viewer, swinging over the top edge to rest behind EnvelopeBack (z: -2, zIndex: 1)
    if (flapRef.current) {
      tl.to(
        flapRef.current,
        {
          rotateX: -180,
          z: -2,
          duration: 0.72,
          ease: 'power2.inOut',
          onUpdate: function () {
            const progress = this.progress();
            // Once rotated past ~40%, place flap behind envelope back so it can NEVER block the card
            if (progress > 0.4 && flapRef.current) {
              flapRef.current.style.zIndex = '1';
            }
          },
        },
        0.22
      );
    }

    // Step 5: Card slides UP out of the envelope pocket
    // STARTS ONLY AFTER the flap has opened and cleared the opening!
    if (cardRef.current) {
      tl.to(
        cardRef.current,
        {
          y: '-76%',
          z: 8,
          duration: 1.1,
          ease: 'power3.out',
          onUpdate: function () {
            const progress = this.progress();
            // Once card emerges ~55% out of pocket, elevate in front of envelope front
            if (progress > 0.55 && cardRef.current) {
              cardRef.current.style.zIndex = '25';
            }
          },
        },
        0.86 // Sequential: starts after flap completes!
      );

      // Natural paper settle with slight tilt
      tl.fromTo(
        cardRef.current,
        {
          rotationZ: -1.2,
        },
        {
          rotationZ: 0,
          duration: 0.5,
          ease: 'power1.out',
        },
        1.45
      );
    }

    // Step 6: Burst petals float up gracefully
    if (burstRef.current) {
      const petals = burstRef.current.children;
      tl.fromTo(
        petals,
        {
          opacity: 0,
          y: 10,
          scale: 0.4,
        },
        {
          opacity: 0.8,
          y: -110,
          scale: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power2.out',
        },
        1.0
      );
    }
  }, [canProceed, handleProceed, reducedMotion]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  return (
    <div
      className={`${styles.envelopeScene} ${isHidden ? styles.hidden : ''}`}
      aria-label="Phong bì mời tốt nghiệp"
      onClick={canProceed ? handleProceed : undefined}
    >
      {/* Background & ambient light */}
      <div className={styles.background} />
      <div className={styles.backgroundGlow} />

      {/* Decorative ambient petals */}
      {[15, -20, 30, -10, 45, -35].map((rotation, i) => (
        <div
          key={i}
          className={styles.decorPetal}
          style={{ '--petal-rotation': `${rotation}deg` } as React.CSSProperties}
          aria-hidden="true"
        >
          <PetalSVG
            color={i % 2 === 0 ? '#F3A1B5' : '#F9CAD5'}
            opacity={0.4 + i * 0.08}
          />
        </div>
      ))}

      {/* Main interactive envelope container */}
      <div
        ref={containerRef}
        className={styles.envelopeContainer}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={opened ? 'Chạm để xem chi tiết lời mời' : 'Chạm vào phong bì để mở thư'}
      >
        {/* Soft shadow on the desk/surface below */}
        <div className={styles.envelopeShadow} />

        {/* 3D Envelope Wrapper */}
        <div
          ref={wrapperRef}
          className={styles.envelopeWrapper}
          style={reducedMotion ? { animation: 'none' } : undefined}
        >
          {/* =========================================================
              1. ENVELOPE BACK (Dusty pink base + inner lining) - z-index: 2, translateZ: 0
              ========================================================= */}
          <div className={styles.envelopeBack}>
            <div className={styles.innerLining} />
          </div>

          {/* =========================================================
              2. INVITATION CARD (Real HTML cardstock)
              Starts inside pocket (z-index: 4, translateZ: 1px)
              Slides UP and elevates to z-index: 25, translateZ: 8px
              ========================================================= */}
          <div
            ref={cardRef}
            className={styles.invitationCard}
            onClick={(e) => {
              if (canProceed) {
                e.stopPropagation();
                handleProceed();
              }
            }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardBadge}>You're Invited</span>
              <h2 className={styles.cardTitle}>{config.title}</h2>
              <p className={styles.cardScript}>{config.subtitle}</p>
            </div>

            <div className={styles.cardDivider}>
              <span className={styles.cardDiamond}>✦</span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.cardGreeting}>{guest?.greeting || config.senderGreeting}</p>
              <p className={styles.cardMessage}>
                {guest?.custom_message ||
                  config.invitationText[0] ||
                  'Một chặng đường thanh xuân khép lại, mở ra những hành trình mới rực rỡ...'}
              </p>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.cardTapHint}>
                {canProceed ? 'Chạm để mở toàn bộ thiệp mời ♡' : 'Graduation Celebration ✨'}
              </span>
            </div>
          </div>

          {/* =========================================================
              3. ENVELOPE FRONT (Front pocket: left, right, bottom flaps)
              Overlaps the bottom of the card, creating the V-notch (z-index: 10, translateZ: 2px)
              ========================================================= */}
          <div className={styles.envelopeFront}>
            <svg viewBox="0 0 440 275" preserveAspectRatio="none" className={styles.frontSvg}>
              <defs>
                <linearGradient id="frontLeftGrad" x1="0%" y1="20%" x2="100%" y2="80%">
                  <stop offset="0%" stopColor="#f8c6d1" />
                  <stop offset="100%" stopColor="#efa5b5" />
                </linearGradient>

                <linearGradient id="frontRightGrad" x1="100%" y1="20%" x2="0%" y2="80%">
                  <stop offset="0%" stopColor="#f6bfcb" />
                  <stop offset="100%" stopColor="#eb9eb1" />
                </linearGradient>

                <linearGradient id="frontBottomGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#f0a5b6" />
                  <stop offset="70%" stopColor="#f8bdcb" />
                  <stop offset="100%" stopColor="#fce0e7" />
                </linearGradient>

                <filter id="bottomFoldShadow" x="-10%" y="-20%" width="120%" height="140%">
                  <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="rgba(150, 45, 70, 0.16)" />
                </filter>
              </defs>

              {/* Left folding flap */}
              <path d="M 0 0 L 220 145 L 0 275 Z" fill="url(#frontLeftGrad)" />
              <line x1="0" y1="0" x2="220" y2="145" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

              {/* Right folding flap */}
              <path d="M 440 0 L 220 145 L 440 275 Z" fill="url(#frontRightGrad)" />
              <line x1="440" y1="0" x2="220" y2="145" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

              {/* Bottom flap: overlaps side flaps with realistic rounded corners */}
              <path
                d="M 0 263 Q 0 275 12 275 L 428 275 Q 440 275 440 263 L 227 120 Q 220 116 213 120 L 0 263 Z"
                fill="url(#frontBottomGrad)"
                filter="url(#bottomFoldShadow)"
              />
              <path
                d="M 0 263 L 213 120 Q 220 116 227 120 L 440 263"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          {/* =========================================================
              4. ENVELOPE FLAP (Upper triangular flap)
              In CLOSED state: sits IN FRONT of card & pocket (translateZ: 4px, z-index: 15)
              Attached at top horizontal fold line y = 0 (transform-origin: 50% 0%)
              Points DOWN to center (Y = 141px). Covers card completely!
              Rotates UPWARD and BACKWARD to rest behind EnvelopeBack.
              ========================================================= */}
          <div ref={flapRef} className={styles.envelopeFlap}>
            <svg viewBox="0 0 440 145" preserveAspectRatio="none" className={styles.flapSvg}>
              <defs>
                <linearGradient id="flapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#fce0e7" />
                  <stop offset="45%" stopColor="#f5b6c5" />
                  <stop offset="100%" stopColor="#ee9eb0" />
                </linearGradient>
                <filter id="flapTipShadow" x="-10%" y="0%" width="120%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(160, 50, 75, 0.22)" />
                </filter>
              </defs>
              {/* Flap triangle with gentle rounded tip pointing DOWN when closed */}
              <path
                d="M 12 0 L 428 0 Q 440 0 440 4 L 227 141 Q 220 145 213 141 L 0 4 Q 0 0 12 0 Z"
                fill="url(#flapGrad)"
                filter="url(#flapTipShadow)"
              />
              {/* Top fold line subtle highlight */}
              <line x1="0" y1="1" x2="440" y2="1" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            </svg>
          </div>

          {/* =========================================================
              5. WAX SEAL (Rose gold metallic wax seal)
              Sits right at the intersection of flap tip and pocket (translateZ: 6px, z-index: 20)
              ========================================================= */}
          <div ref={sealRef} className={styles.waxSeal}>
            <img src="/assets/envelope/wax-seal.png" alt="Con dấu sáp hoa hồng" />
          </div>

          {/* =========================================================
              6. BURST PETALS (Emerge when envelope opens)
              ========================================================= */}
          <div ref={burstRef} className={styles.burstContainer} aria-hidden="true">
            {[
              { left: '46%', delay: 0 },
              { left: '38%', delay: 0.1 },
              { left: '55%', delay: 0.15 },
              { left: '32%', delay: 0.2 },
              { left: '62%', delay: 0.25 },
            ].map((p, idx) => (
              <div
                key={idx}
                className={styles.burstPetal}
                style={{ left: p.left }}
              >
                <PetalSVG color={idx % 2 === 0 ? '#F3A1B5' : '#F9CAD5'} opacity={0.8} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opening hint & title beneath the envelope */}
      <div ref={hintRef} className={styles.textContent}>
        <div className={styles.surpriseText}>A Little Surprise For You</div>
        <div className={styles.subtitleText}>
          {guest?.name && guest.name !== config.senderName
            ? `Dành riêng cho ${guest.name} 💕`
            : 'Bạn có một lời mời đặc biệt.'}
        </div>
        <div className={styles.hintText}>Mở thiệp đi nè ♡</div>
      </div>
    </div>
  );
}
