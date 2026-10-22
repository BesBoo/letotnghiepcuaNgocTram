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
  const haloRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const topHeaderRef = useRef<HTMLDivElement>(null);
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
    if (haloRef.current) {
      gsap.set(haloRef.current, { opacity: 1, scale: 1, rotation: 0 });
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
      if (topHeaderRef.current) topHeaderRef.current.style.opacity = '0';
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
      // Wait 10 seconds so user can read card comfortably, or click to proceed sooner
      autoProceedTimer.current = window.setTimeout(handleProceed, 10000);
      return;
    }

    // GSAP master timeline for sequential, realistic envelope opening
    const tl = gsap.timeline({
      onComplete: () => {
        setCanProceed(true);
        // Automatically proceed after 10 seconds of reading, or user can click anytime to proceed sooner
        autoProceedTimer.current = window.setTimeout(handleProceed, 10000);
      },
    });

    // Step 1: Text hints beneath envelope fade out (keep topHeader visible)
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

    // Step 3: Wax seal & halo break and fade out cleanly
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
    if (haloRef.current) {
      tl.to(
        haloRef.current,
        {
          scale: 1.35,
          opacity: 0,
          rotation: 24,
          duration: 0.32,
          ease: 'power2.out',
        },
        0.06
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

      {/* Large background blossom flower (layered behind title and envelope) */}
      <div className={styles.bgBlossomBottomCenter} aria-hidden="true">
        <img
          src="/assets/flowers/Dew-Kissed%20Blush%20Blossom.png"
          alt=""
          className={styles.flowerImg}
        />
      </div>

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

      {/* Top title above the envelope */}
      <div ref={topHeaderRef} className={styles.topHeader}>
        <div className={styles.topGraduation}>Graduation</div>
        <div className={styles.topInvitations}>INVITATIONS</div>
      </div>

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
              3. ENVELOPE FRONT (White, Pale Pink, & Champagne Gold Foil)
              Overlaps the bottom of the card, creating the V-notch (z-index: 10, translateZ: 2px)
              ========================================================= */}
          <div className={styles.envelopeFront}>
            <svg viewBox="0 0 440 275" preserveAspectRatio="none" className={styles.frontSvg}>
              <defs>
                {/* Brilliant Metallic Champagne Gold Foil Gradient */}
                <linearGradient id="champagneGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF4DC" />
                  <stop offset="20%" stopColor="#F5D79E" />
                  <stop offset="45%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#FDE6B8" />
                  <stop offset="85%" stopColor="#C89736" />
                  <stop offset="100%" stopColor="#FFF0D0" />
                </linearGradient>

                {/* Pearlescent White to Soft Blush-Pink Gradients */}
                <linearGradient id="frontLeftGrad" x1="0%" y1="15%" x2="100%" y2="85%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="45%" stopColor="#FFF7F9" />
                  <stop offset="80%" stopColor="#FDEAF0" />
                  <stop offset="100%" stopColor="#F8DCE4" />
                </linearGradient>

                <linearGradient id="frontRightGrad" x1="100%" y1="15%" x2="0%" y2="85%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="45%" stopColor="#FFF6F8" />
                  <stop offset="80%" stopColor="#FCE7ED" />
                  <stop offset="100%" stopColor="#F6D9E2" />
                </linearGradient>

                <linearGradient id="frontBottomGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#FBDCE5" />
                  <stop offset="35%" stopColor="#FDF1F4" />
                  <stop offset="75%" stopColor="#FFF9FA" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>

                <filter id="bottomFoldShadow" x="-10%" y="-20%" width="120%" height="140%">
                  <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="rgba(195, 120, 145, 0.22)" />
                </filter>

                {/* Classical French Baroque Corner Filigree Bracket */}
                <g id="cornerOrnament">
                  <path
                    d="M 0,26 C 0,14 5,5 16,2 C 22,0.5 25,1 29,0"
                    fill="none"
                    stroke="url(#champagneGoldFoil)"
                    strokeWidth="0.85"
                  />
                  <path
                    d="M 26,0 C 14,0 5,5 2,16 C 0.5,22 1,25 0,29"
                    fill="none"
                    stroke="url(#champagneGoldFoil)"
                    strokeWidth="0.85"
                  />
                  <path
                    d="M 6,21 C 5,13 13,5 21,6 C 24,6.5 25,9.5 23,11 C 20,12.5 17,11 16,8.5"
                    fill="none"
                    stroke="url(#champagneGoldFoil)"
                    strokeWidth="0.6"
                    strokeDasharray="1.2 1.2"
                  />
                  {/* Corner Acanthus / Leaf motif */}
                  <path
                    d="M 3,3 C 9,8 11,11 14,14 C 11,11 8,9 3,3 Z"
                    fill="url(#champagneGoldFoil)"
                    opacity="0.85"
                  />
                  <circle cx="8" cy="8" r="1.1" fill="url(#champagneGoldFoil)" />
                  <circle cx="15" cy="15" r="0.9" fill="url(#champagneGoldFoil)" />
                  <circle cx="2" cy="30" r="1" fill="url(#champagneGoldFoil)" />
                  <circle cx="30" cy="2" r="1" fill="url(#champagneGoldFoil)" />
                </g>

                {/* Symmetrical Classical Graduation Laurel Branch */}
                <g id="laurelBranch">
                  {/* Curved stem */}
                  <path
                    d="M 54,75 C 72,110 73,165 54,200"
                    fill="none"
                    stroke="url(#champagneGoldFoil)"
                    strokeWidth="0.9"
                  />
                  {/* Pair 1 */}
                  <path d="M 58,92 C 51,87 47,91 52,96 C 55,97 58,94 58,92 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  <path d="M 62,94 C 69,89 74,92 70,98 C 67,99 63,96 62,94 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  {/* Pair 2 */}
                  <path d="M 65,114 C 56,110 53,114 59,119 C 62,120 65,117 65,114 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  <path d="M 68,116 C 76,111 80,116 75,121 C 72,122 68,119 68,116 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  {/* Pair 3 (Center swell) */}
                  <path d="M 67,137 C 58,135 55,140 61,144 C 64,145 67,141 67,137 Z" fill="url(#champagneGoldFoil)" opacity="0.85" />
                  <path d="M 69,139 C 78,137 81,142 76,146 C 73,147 69,143 69,139 Z" fill="url(#champagneGoldFoil)" opacity="0.85" />
                  {/* Pair 4 */}
                  <path d="M 65,160 C 56,161 54,166 60,169 C 63,169 65,164 65,160 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  <path d="M 67,162 C 76,163 79,169 73,171 C 70,171 67,166 67,162 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  {/* Pair 5 */}
                  <path d="M 59,181 C 52,184 49,189 54,192 C 57,192 59,186 59,181 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  <path d="M 61,183 C 69,186 73,191 67,194 C 64,193 61,188 61,183 Z" fill="url(#champagneGoldFoil)" opacity="0.8" />
                  {/* Base berries */}
                  <circle cx="53" cy="202" r="1.4" fill="url(#champagneGoldFoil)" />
                  <circle cx="57" cy="205" r="1.1" fill="url(#champagneGoldFoil)" />
                  <circle cx="50" cy="206" r="1.1" fill="url(#champagneGoldFoil)" />
                </g>
              </defs>

              {/* Perimeter Understated Double-Line Golden Border */}
              <rect
                x="8"
                y="8"
                width="424"
                height="259"
                rx="8"
                fill="none"
                stroke="url(#champagneGoldFoil)"
                strokeWidth="0.9"
                strokeOpacity="0.75"
              />
              <rect
                x="12"
                y="12"
                width="416"
                height="251"
                rx="6"
                fill="none"
                stroke="url(#champagneGoldFoil)"
                strokeWidth="0.5"
                strokeOpacity="0.45"
              />

              {/* Four Filigree Corner Ornaments */}
              <use href="#cornerOrnament" transform="translate(15, 15)" />
              <use href="#cornerOrnament" transform="translate(425, 15) scale(-1, 1)" />
              <use href="#cornerOrnament" transform="translate(15, 260) scale(1, -1)" />
              <use href="#cornerOrnament" transform="translate(425, 260) scale(-1, -1)" />

              {/* Left folding flap */}
              <path d="M 0 0 L 220 145 L 0 275 Z" fill="url(#frontLeftGrad)" />
              <line x1="0" y1="0" x2="220" y2="145" stroke="url(#champagneGoldFoil)" strokeWidth="0.75" strokeOpacity="0.45" />

              {/* Right folding flap */}
              <path d="M 440 0 L 220 145 L 440 275 Z" fill="url(#frontRightGrad)" />
              <line x1="440" y1="0" x2="220" y2="145" stroke="url(#champagneGoldFoil)" strokeWidth="0.75" strokeOpacity="0.45" />

              {/* Graduation Laurel Wreaths on Side Flaps */}
              <use href="#laurelBranch" opacity="0.85" />
              <use href="#laurelBranch" transform="translate(440, 0) scale(-1, 1)" opacity="0.85" />

              {/* Bottom flap: overlaps side flaps with realistic rounded corners */}
              <path
                d="M 0 263 Q 0 275 12 275 L 428 275 Q 440 275 440 263 L 227 120 Q 220 116 213 120 L 0 263 Z"
                fill="url(#frontBottomGrad)"
                filter="url(#bottomFoldShadow)"
              />

              {/* Delicate Champagne-Gold Foil Lines along bottom V-fold edge */}
              <path
                d="M 0 263 L 213 120 Q 220 116 227 120 L 440 263"
                fill="none"
                stroke="url(#champagneGoldFoil)"
                strokeWidth="1.5"
              />
              <path
                d="M 10 260 L 214 126 Q 220 123 226 126 L 430 260"
                fill="none"
                stroke="url(#champagneGoldFoil)"
                strokeWidth="0.7"
                strokeOpacity="0.65"
              />
              {/* Haute couture pearl beaded chain along bottom V-notch */}
              <path
                d="M 14 257 L 214 129 Q 220 126 226 129 L 426 257"
                fill="none"
                stroke="url(#champagneGoldFoil)"
                strokeWidth="1.2"
                strokeDasharray="1.5 4"
                strokeLinecap="round"
                strokeOpacity="0.75"
              />

              {/* Bottom Center Classical Ribbon Bow & Olive Flourish */}
              <g transform="translate(220, 240)">
                {/* Ribbon loops */}
                <path
                  d="M 0,0 C -7,-6 -17,-4 -15,3 C -13,8 -4,4 0,0 Z"
                  fill="url(#champagneGoldFoil)"
                  opacity="0.8"
                />
                <path
                  d="M 0,0 C 7,-6 17,-4 15,3 C 13,8 4,4 0,0 Z"
                  fill="url(#champagneGoldFoil)"
                  opacity="0.8"
                />
                {/* Center bead */}
                <circle cx="0" cy="0" r="1.8" fill="url(#champagneGoldFoil)" />
                {/* Flowing ribbon tails */}
                <path
                  d="M -2,2 C -6,8 -12,12 -16,14"
                  fill="none"
                  stroke="url(#champagneGoldFoil)"
                  strokeWidth="0.8"
                />
                <path
                  d="M 2,2 C 6,8 12,12 16,14"
                  fill="none"
                  stroke="url(#champagneGoldFoil)"
                  strokeWidth="0.8"
                />
                {/* Small laurel sprigs extending horizontally */}
                <path
                  d="M -16,0 C -28,-2 -40,3 -50,1"
                  fill="none"
                  stroke="url(#champagneGoldFoil)"
                  strokeWidth="0.75"
                  strokeDasharray="1.5 2"
                />
                <circle cx="-52" cy="1" r="1" fill="url(#champagneGoldFoil)" />
                <path
                  d="M 16,0 C 28,-2 40,3 50,1"
                  fill="none"
                  stroke="url(#champagneGoldFoil)"
                  strokeWidth="0.75"
                  strokeDasharray="1.5 2"
                />
                <circle cx="52" cy="1" r="1" fill="url(#champagneGoldFoil)" />
              </g>
            </svg>
          </div>

          {/* =========================================================
              4. ENVELOPE FLAP (Upper triangular flap - White, Blush & Gold)
              In CLOSED state: sits IN FRONT of card & pocket (translateZ: 4px, z-index: 15)
              Attached at top horizontal fold line y = 0 (transform-origin: 50% 0%)
              Points DOWN to center (Y = 141px). Covers card completely!
              Rotates UPWARD and BACKWARD to rest behind EnvelopeBack.
              ========================================================= */}
          <div ref={flapRef} className={styles.envelopeFlap}>
            <svg viewBox="0 0 440 145" preserveAspectRatio="none" className={styles.flapSvg}>
              <defs>
                <linearGradient id="flapGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF4DC" />
                  <stop offset="20%" stopColor="#F5D79E" />
                  <stop offset="45%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#FDE6B8" />
                  <stop offset="85%" stopColor="#C89736" />
                  <stop offset="100%" stopColor="#FFF0D0" />
                </linearGradient>

                <linearGradient id="flapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="45%" stopColor="#FFF8F9" />
                  <stop offset="85%" stopColor="#FDEAF0" />
                  <stop offset="100%" stopColor="#F9DCE4" />
                </linearGradient>
                <filter id="flapTipShadow" x="-10%" y="0%" width="120%" height="140%">
                  <feDropShadow dx="0" dy="3.5" stdDeviation="4.5" floodColor="rgba(195, 120, 145, 0.26)" />
                </filter>

                {/* Symmetrical Winged Laurel Flourish on Flap */}
                <g id="flapWing">
                  <path
                    d="M 207,48 C 196,48 186,43 174,45 C 166,47 160,51 154,49 C 149,47 148,42 153,40 C 158,38 162,42 160,45"
                    fill="none"
                    stroke="url(#flapGoldFoil)"
                    strokeWidth="0.85"
                  />
                  {/* Small gold leaves along wing */}
                  <path d="M 197,46 C 195,40 188,41 190,46 C 192,48 196,48 197,46 Z" fill="url(#flapGoldFoil)" opacity="0.8" />
                  <path d="M 188,44 C 187,38 180,39 181,45 C 183,47 187,46 188,44 Z" fill="url(#flapGoldFoil)" opacity="0.8" />
                  <path d="M 178,44 C 177,39 171,41 173,46 C 175,47 177,46 178,44 Z" fill="url(#flapGoldFoil)" opacity="0.8" />
                  <path d="M 168,46 C 166,42 161,43 162,47 C 164,48 167,48 168,46 Z" fill="url(#flapGoldFoil)" opacity="0.8" />
                  <path d="M 184,47 C 182,53 176,51 178,47 C 180,45 183,45 184,47 Z" fill="url(#flapGoldFoil)" opacity="0.7" />
                  {/* Dew drops */}
                  <circle cx="151" cy="40" r="1.3" fill="url(#flapGoldFoil)" />
                  <circle cx="146" cy="46" r="0.9" fill="url(#flapGoldFoil)" />
                </g>
              </defs>

              {/* Flap triangle with gentle rounded tip pointing DOWN when closed */}
              <path
                d="M 12 0 L 428 0 Q 440 0 440 4 L 227 141 Q 220 145 213 141 L 0 4 Q 0 0 12 0 Z"
                fill="url(#flapGrad)"
                filter="url(#flapTipShadow)"
              />
              {/* Brilliant Champagne-Gold Foil Edge along triangular flap */}
              <path
                d="M 0 4 Q 0 0 12 0 L 428 0 Q 440 0 440 4 L 227 141 Q 220 145 213 141 Z"
                fill="none"
                stroke="url(#flapGoldFoil)"
                strokeWidth="1.6"
              />
              {/* Refined parallel gold foil line for bespoke luxury stationery */}
              <path
                d="M 28 8 L 216 131 Q 220 133 224 131 L 412 8"
                fill="none"
                stroke="url(#flapGoldFoil)"
                strokeWidth="0.75"
                strokeOpacity="0.7"
              />
              {/* Top horizontal fold line champagne gold highlight */}
              <line x1="0" y1="1" x2="440" y2="1" stroke="url(#flapGoldFoil)" strokeWidth="1.6" strokeOpacity="0.9" />

              {/* Classical Flap Crest: Faceted 8-Point Star at (220, 48) */}
              <g>
                {/* 3D Faceted Star (Highlights) */}
                <path
                  d="M 220,36 L 222,46 L 220,48 L 218,46 Z
                     M 232,48 L 222,50 L 220,48 L 222,46 Z
                     M 220,60 L 218,50 L 220,48 L 222,50 Z
                     M 208,48 L 218,46 L 220,48 L 218,50 Z"
                  fill="#FFF7E6"
                />
                {/* 3D Faceted Star (Shades) */}
                <path
                  d="M 227,41 L 222,46 L 220,48 Z
                     M 227,55 L 220,48 L 222,50 Z
                     M 213,55 L 218,50 L 220,48 Z
                     M 213,41 L 220,48 L 218,46 Z"
                  fill="#D4AF37"
                />
                {/* Outer star stroke */}
                <path
                  d="M 220,36 L 222,46 L 227,41 L 222,46 L 232,48 L 222,50 L 227,55 L 222,50 L 220,60 L 218,50 L 213,55 L 218,50 L 208,48 L 218,46 L 213,41 L 218,46 Z"
                  fill="none"
                  stroke="url(#flapGoldFoil)"
                  strokeWidth="0.5"
                />

                {/* Symmetrical Winged Laurel Branches flanking Star */}
                <use href="#flapWing" />
                <use href="#flapWing" transform="translate(440, 0) scale(-1, 1)" />

                {/* Swag pendant garland beneath star */}
                <path
                  d="M 204,54 C 210,61 215,63 220,63 C 225,63 230,61 236,54"
                  fill="none"
                  stroke="url(#flapGoldFoil)"
                  strokeWidth="0.75"
                  strokeDasharray="1.5 2"
                />
                <circle cx="220" cy="67" r="1.5" fill="url(#flapGoldFoil)" />
                <circle cx="213" cy="61" r="1.0" fill="url(#flapGoldFoil)" />
                <circle cx="227" cy="61" r="1.0" fill="url(#flapGoldFoil)" />
              </g>
            </svg>
          </div>

          {/* =========================================================
              5. WAX SEAL & MEDALLION HALO (At center "Tâm Thiệp")
              Rose gold metallic wax seal is 100% PRESERVED.
              Surrounded by a radiant gold sunburst halo medallion.
              ========================================================= */}
          <div ref={haloRef} className={styles.sealHalo} aria-hidden="true">
            <svg viewBox="0 0 120 120" className={styles.haloSvg}>
              <defs>
                <linearGradient id="haloGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF8E8" />
                  <stop offset="25%" stopColor="#F5D79E" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="75%" stopColor="#FDE6B8" />
                  <stop offset="100%" stopColor="#C89736" />
                </linearGradient>
              </defs>
              {/* Concentric beaded rings */}
              <circle cx="60" cy="60" r="32.5" fill="none" stroke="url(#haloGold)" strokeWidth="0.85" strokeDasharray="2 2" opacity="0.85" />
              <circle cx="60" cy="60" r="36" fill="none" stroke="url(#haloGold)" strokeWidth="0.5" opacity="0.55" />
              <circle cx="60" cy="60" r="41" fill="none" stroke="url(#haloGold)" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.4" />

              {/* 16 Sunburst Radiant Rays */}
              {/* 0 deg */}
              <line x1="93" y1="60" x2="103" y2="60" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="106" cy="60" r="1.2" fill="url(#haloGold)" />
              {/* 22.5 deg */}
              <line x1="90.5" y1="72.6" x2="97" y2="75.3" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 45 deg */}
              <line x1="83.3" y1="83.3" x2="90.5" y2="90.5" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="92.8" cy="92.8" r="1.2" fill="url(#haloGold)" />
              {/* 67.5 deg */}
              <line x1="72.6" y1="90.5" x2="75.3" y2="97" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 90 deg */}
              <line x1="60" y1="93" x2="60" y2="103" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="60" cy="106" r="1.2" fill="url(#haloGold)" />
              {/* 112.5 deg */}
              <line x1="47.4" y1="90.5" x2="44.7" y2="97" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 135 deg */}
              <line x1="36.7" y1="83.3" x2="29.5" y2="90.5" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="27.2" cy="92.8" r="1.2" fill="url(#haloGold)" />
              {/* 157.5 deg */}
              <line x1="29.5" y1="72.6" x2="23" y2="75.3" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 180 deg */}
              <line x1="27" y1="60" x2="17" y2="60" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="14" cy="60" r="1.2" fill="url(#haloGold)" />
              {/* 202.5 deg */}
              <line x1="29.5" y1="47.4" x2="23" y2="44.7" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 225 deg */}
              <line x1="36.7" y1="36.7" x2="29.5" y2="29.5" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="27.2" cy="27.2" r="1.2" fill="url(#haloGold)" />
              {/* 247.5 deg */}
              <line x1="47.4" y1="29.5" x2="44.7" y2="23" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 270 deg */}
              <line x1="60" y1="27" x2="60" y2="17" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="60" cy="14" r="1.2" fill="url(#haloGold)" />
              {/* 292.5 deg */}
              <line x1="72.6" y1="29.5" x2="75.3" y2="23" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
              {/* 315 deg */}
              <line x1="83.3" y1="36.7" x2="90.5" y2="29.5" stroke="url(#haloGold)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="92.8" cy="27.2" r="1.2" fill="url(#haloGold)" />
              {/* 337.5 deg */}
              <line x1="90.5" y1="47.4" x2="97" y2="44.7" stroke="url(#haloGold)" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />

              {/* 4 Cardinal Diamond Stars */}
              <polygon points="60,8 61.5,12 65,12 62,14.5 63,18 60,15.5 57,18 58,14.5 55,12 58.5,12" fill="url(#haloGold)" opacity="0.85" />
              <polygon points="112,60 108,61.5 108,65 105.5,62 102,63 104.5,60 102,57 105.5,58 108,55 108,58.5" fill="url(#haloGold)" opacity="0.85" />
              <polygon points="60,112 58.5,108 55,108 58,105.5 57,102 60,104.5 63,102 62,105.5 65,108 61.5,108" fill="url(#haloGold)" opacity="0.85" />
              <polygon points="8,60 12,58.5 12,55 14.5,58 18,57 15.5,60 18,63 14.5,62 12,65 12,61.5" fill="url(#haloGold)" opacity="0.85" />
            </svg>
          </div>

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
