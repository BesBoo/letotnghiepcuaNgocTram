import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface PhotoLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

export default function PhotoLightbox({ src, alt, caption, onClose }: PhotoLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.body.classList.add('scroll-locked');
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('scroll-locked');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(87, 60, 69, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease-out',
        cursor: 'pointer',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
    >
      <button
        onClick={onClose}
        aria-label="Đóng"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
          zIndex: 101,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
      >
        <X size={22} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'default',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        />
        {caption && (
          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '1.1rem',
              color: 'white',
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            {caption}
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
