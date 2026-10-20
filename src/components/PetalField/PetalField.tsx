import { useEffect, useState, useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useDocumentVisibility } from '../../hooks/useDocumentVisibility';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  sway1: number;
  sway2: number;
  rotation: number;
  colorGrad: string[];
}

interface PetalFieldProps {
  count?: number;
  active?: boolean;
}

const PALETTES = [
  ['#ffe3ec', '#f8a5b8', '#e9889f'],
  ['#fff0f3', '#fbcad4', '#f19eaf'],
  ['#ffebf0', '#f4b2c1', '#db7b93'],
  ['#fde6ec', '#f39eb2', '#e57a93'],
];

export default function PetalField({ count = 12, active = true }: PetalFieldProps) {
  const reducedMotion = useReducedMotion();
  const isVisible = useDocumentVisibility();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const petals = useMemo<Petal[]>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const petalCount = isMobile ? Math.min(count, 8) : count;

    return Array.from({ length: petalCount }, (_, i) => {
      const duration = 10 + Math.random() * 8; // 10s - 18s
      // Negative delay ensures petals are already scattered mid-air upon first page load!
      const delay = -(Math.random() * duration);
      const swayDistance = 25 + Math.random() * 45;

      return {
        id: i,
        left: Math.random() * 96,
        delay,
        duration,
        size: 14 + Math.random() * 16,
        opacity: 0.35 + Math.random() * 0.45,
        sway1: (i % 2 === 0 ? 1 : -1) * swayDistance,
        sway2: (i % 2 === 0 ? -1 : 1) * (swayDistance * 0.8),
        rotation: Math.random() * 360,
        colorGrad: PALETTES[i % PALETTES.length],
      };
    });
  }, [count]);

  if (reducedMotion || !active || !mounted) return null;

  const shouldAnimate = isVisible;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 35, // Floats gracefully in front of envelope scene and main content
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          style={{
            position: 'absolute',
            left: `${petal.left}%`,
            top: '-40px',
            width: `${petal.size}px`,
            height: `${petal.size * 1.15}px`,
            animation: shouldAnimate
              ? `sakuraFall ${petal.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${petal.delay}s infinite`
              : 'none',
            ['--sway-1' as any]: `${petal.sway1}px`,
            ['--sway-2' as any]: `${petal.sway2}px`,
            ['--peak-opacity' as any]: petal.opacity,
          }}
        >
          <svg
            viewBox="0 0 40 46"
            fill="none"
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 2px 4px rgba(201, 104, 133, 0.15))',
              animation: shouldAnimate
                ? `sakuraFlutter ${petal.duration * 0.6}s ease-in-out ${petal.delay * 0.5}s infinite alternate`
                : 'none',
            }}
          >
            <defs>
              <linearGradient id={`sakuraGrad-${petal.id}`} x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor={petal.colorGrad[0]} />
                <stop offset="55%" stopColor={petal.colorGrad[1]} />
                <stop offset="100%" stopColor={petal.colorGrad[2]} />
              </linearGradient>
            </defs>
            {/* Elegant organic sakura petal with soft notch */}
            <path
              d="M20 2 C28 8 38 18 35 32 C33 41 24 44 20 42 C16 44 7 41 5 32 C2 18 12 8 20 2Z"
              fill={`url(#sakuraGrad-${petal.id})`}
            />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes sakuraFall {
          0% {
            transform: translate3d(0, -50px, 0) rotate(0deg);
            opacity: 0;
          }
          6% {
            opacity: var(--peak-opacity, 0.6);
          }
          30% {
            transform: translate3d(var(--sway-1, 30px), 32vh, 0) rotate(70deg);
          }
          60% {
            transform: translate3d(var(--sway-2, -25px), 65vh, 0) rotate(160deg);
          }
          90% {
            opacity: var(--peak-opacity, 0.6);
          }
          100% {
            transform: translate3d(var(--sway-1, 20px), 108vh, 0) rotate(260deg);
            opacity: 0;
          }
        }

        @keyframes sakuraFlutter {
          0% {
            transform: rotateY(0deg) rotateZ(-15deg) scaleX(1);
          }
          50% {
            transform: rotateY(70deg) rotateZ(10deg) scaleX(0.7);
          }
          100% {
            transform: rotateY(140deg) rotateZ(-5deg) scaleX(0.9);
          }
        }
      `}</style>
    </div>
  );
}
