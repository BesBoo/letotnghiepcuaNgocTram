import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Guest } from '../lib/supabase';
import config from '../invitation.config';
import { MapPin, Clock, Calendar, Copy, Check, ExternalLink, Heart, Send, Phone } from 'lucide-react';

interface InvitationSectionProps {
  guest?: Guest;
  onSubmitRSVP?: (status: 'attending' | 'declined', note?: string) => void;
}

export default function InvitationSection({ guest, onSubmitRSVP }: InvitationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rsvpState, setRsvpState] = useState<'attending' | 'declined' | 'pending'>(
    guest?.rsvp_status || 'pending'
  );
  const [rsvpNote, setRsvpNote] = useState(guest?.rsvp_note || '');
  const [noteSubmitted, setNoteSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (guest?.rsvp_status) {
      setRsvpState(guest.rsvp_status);
    }
  }, [guest?.rsvp_status]);

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(config.event.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = config.event.address;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const handleSelectRSVP = (status: 'attending' | 'declined') => {
    setRsvpState(status);
    if (onSubmitRSVP) {
      onSubmitRSVP(status, rsvpNote);
    }
  };

  const handleSendNote = () => {
    if (onSubmitRSVP && rsvpState !== 'pending') {
      onSubmitRSVP(rsvpState, rsvpNote);
      setNoteSubmitted(true);
      setTimeout(() => setNoteSubmitted(false), 3000);
    }
  };

  const transitionDelay = (step: number) =>
    reducedMotion ? '0ms' : `${300 + step * 150}ms`;

  return (
    <section
      ref={sectionRef}
      id="invitation"
      style={{
        padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem)',
        background: 'var(--cream)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Main invitation card */}
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(2rem, 6vw, 4rem)',
          position: 'relative',
          boxShadow: '0 8px 40px rgba(201, 104, 133, 0.12), 0 2px 8px rgba(0,0,0,0.04)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.96)',
          transition: `opacity 0.8s var(--ease-out-expo), transform 0.8s var(--ease-out-expo)`,
        }}
      >
        {/* Floral border background */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/assets/invitation/floral-border.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
          }}
        />

        {/* Inner border */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '16px',
            border: '1px solid var(--pink-soft)',
            borderRadius: 'var(--radius-md)',
            pointerEvents: 'none',
            opacity: isVisible ? 0.6 : 0,
            transition: `opacity 0.8s ${transitionDelay(0)}`,
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* You're Invited */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s var(--ease-out-expo) ${transitionDelay(1)}`,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.8rem, 2vw, 0.95rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--rose-gold)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              You're Invited
            </p>
            <h2 className="heading-display" style={{ marginBottom: 'var(--space-md)' }}>
              {config.title}
            </h2>

            {/* Personalized greeting for this guest */}
            {guest?.name && guest.name !== config.senderName && (
              <p
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
                  color: 'var(--pink-deep)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                {guest.greeting || `Thân gửi ${guest.name},`}
              </p>
            )}
          </div>

          {/* Decorative divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              margin: 'var(--space-md) 0 var(--space-lg)',
              opacity: isVisible ? 0.5 : 0,
              transition: `opacity 0.6s ${transitionDelay(2)}`,
            }}
          >
            <div style={{ width: '50px', height: '1px', background: 'var(--pink-primary)' }} />
            <svg viewBox="0 0 20 18" width="14" height="12" fill="var(--pink-primary)">
              <path d="M10 18C10 18 0 11 0 5.5C0 2.4 2.4 0 5.5 0C7.2 0 8.8.8 10 2C11.2.8 12.8 0 14.5 0C17.6 0 20 2.4 20 5.5C20 11 10 18 10 18Z" />
            </svg>
            <div style={{ width: '50px', height: '1px', background: 'var(--pink-primary)' }} />
          </div>

          {/* Invitation text */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: `all 0.6s var(--ease-out-expo) ${transitionDelay(3)}`,
            }}
          >
            {guest?.custom_message ? (
              <p
                className="text-body"
                style={{
                  marginBottom: 'var(--space-md)',
                  maxWidth: '520px',
                  margin: '0 auto var(--space-md)',
                  fontStyle: 'italic',
                }}
              >
                "{guest.custom_message}"
              </p>
            ) : (
              config.invitationText.map((text, i) => (
                <p
                  key={i}
                  className="text-body"
                  style={{
                    marginBottom: 'var(--space-md)',
                    maxWidth: '520px',
                    margin: '0 auto var(--space-md)',
                  }}
                >
                  {text}
                </p>
              ))
            )}
          </div>

          {/* Event Details */}
          <div
            style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-xl)',
              background: 'var(--pink-light)',
              borderRadius: 'var(--radius-md)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: `all 0.6s var(--ease-out-expo) ${transitionDelay(4)}`,
            }}
          >
            {/* Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: 'var(--space-md)',
              }}
            >
              <Calendar size={18} color="var(--pink-deep)" />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {config.event.date}
              </span>
            </div>

            {/* Time */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: 'var(--space-md)',
              }}
            >
              <Clock size={18} color="var(--pink-deep)" />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {guest?.start_time
                  ? guest.end_time
                    ? `${guest.start_time} — ${guest.end_time}`
                    : guest.start_time
                  : config.event.endTime
                    ? `${config.event.time} — ${config.event.endTime}`
                    : config.event.time}
              </span>
            </div>

            {/* Venue */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: 'var(--space-sm)',
              }}
            >
              <MapPin size={18} color="var(--pink-deep)" />
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {config.event.venue}
              </span>
            </div>

            {/* Address */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-md)',
              }}
            >
              {config.event.address}
            </p>

            {/* Address actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={copyAddress}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--pink-deep)',
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--pink-soft)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--pink-soft)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--white)';
                  e.currentTarget.style.color = 'var(--pink-deep)';
                }}
                aria-label="Sao chép địa chỉ"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Đã sao chép!' : 'Sao chép địa chỉ'}
              </button>

              {config.event.mapLink && (
                <a
                  href={config.event.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    color: 'var(--white)',
                    background: 'var(--pink-deep)',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--rose-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--pink-deep)';
                  }}
                >
                  <ExternalLink size={14} />
                  Mở bản đồ
                </a>
              )}
            </div>

            {/* Contact Phone or Dress Code */}
            {config.event.contactPhone ? (
              <div
                style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Phone size={15} color="var(--pink-deep)" />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>SDT liên hệ: </span>
                <a
                  href={`tel:${config.event.contactPhone.replace(/\s+/g, '')}`}
                  style={{
                    color: 'var(--pink-deep)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    letterSpacing: '0.5px',
                  }}
                >
                  {config.event.contactPhone}
                </a>
              </div>
            ) : config.event.dressCode ? (
              <div
                style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dress code: </span>
                {config.event.dressCode}
              </div>
            ) : null}
          </div>

          {/* Note */}
          {config.event.note && (
            <p
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-xl)',
                opacity: isVisible ? 1 : 0,
                transition: `opacity 0.6s ${transitionDelay(5)}`,
              }}
            >
              {config.event.note}
            </p>
          )}

          {/* Interactive RSVP Area (Connected to Supabase) */}
          <div
            style={{
              marginTop: 'var(--space-2xl)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.6s var(--ease-out-expo) ${transitionDelay(6)}`,
            }}
          >
            <div
              style={{
                maxWidth: '460px',
                margin: '0 auto',
                padding: 'var(--space-lg)',
                background: 'rgba(255, 240, 243, 0.5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(243, 161, 181, 0.35)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--pink-deep)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                Bạn sẽ đến chung vui chứ? 💕
              </p>

              {/* Attendance Choice Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-md)',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => handleSelectRSVP('attending')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    background:
                      rsvpState === 'attending'
                        ? 'linear-gradient(135deg, var(--pink-deep), var(--rose-gold))'
                        : 'var(--white)',
                    color: rsvpState === 'attending' ? 'var(--white)' : 'var(--text-primary)',
                    border: '1px solid var(--pink-soft)',
                    boxShadow:
                      rsvpState === 'attending'
                        ? '0 4px 14px rgba(201, 104, 133, 0.35)'
                        : 'none',
                  }}
                >
                  <Heart size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Mình sẽ đến nhé!
                </button>

                <button
                  onClick={() => handleSelectRSVP('declined')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    background:
                      rsvpState === 'declined' ? 'var(--text-secondary)' : 'var(--white)',
                    color: rsvpState === 'declined' ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(141, 105, 116, 0.3)',
                  }}
                >
                  Tiếc quá, mình bận mất rồi
                </button>
              </div>

              {/* Status feedback & optional wishes note */}
              {rsvpState !== 'pending' && (
                <div style={{ marginTop: 'var(--space-md)' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      color:
                        rsvpState === 'attending' ? 'var(--pink-deep)' : 'var(--text-secondary)',
                      marginBottom: 'var(--space-sm)',
                      fontWeight: 500,
                    }}
                  >
                    {rsvpState === 'attending'
                      ? '✨ Tuyệt vời! Hẹn gặp bạn ở buổi lễ tốt nghiệp nhé!'
                      : 'Cảm ơn bạn! Dù bận nhưng mình rất vui vì bạn đã xem thiệp 💕'}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      maxWidth: '360px',
                      margin: '0 auto',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Gửi vài lời chúc đến mình..."
                      value={rsvpNote}
                      onChange={(e) => setRsvpNote(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--pink-soft)',
                        fontSize: '0.85rem',
                        outline: 'none',
                        background: 'var(--white)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      onClick={handleSendNote}
                      style={{
                        padding: '8px 14px',
                        background: 'var(--pink-deep)',
                        color: 'var(--white)',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {noteSubmitted ? <Check size={14} /> : <Send size={14} />}
                      {noteSubmitted ? 'Đã gửi' : 'Gửi'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticker "Thả tim" - top left of invitation card */}
        <img
          src="/assets/memories/sticker_2.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-30px',
            left: '-25px',
            width: 'clamp(105px, 17vw, 145px)',
            height: 'auto',
            transform: 'rotate(-12deg)',
            zIndex: 10,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 6px 16px rgba(201, 104, 133, 0.28))',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s var(--ease-out-expo) 1.2s, transform 0.6s var(--ease-out-expo) 1.2s',
          }}
        />

        {/* Sticker "Yêu quá!" - bottom right of invitation card */}
        <img
          src="/assets/memories/sticker_1.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-25px',
            right: '-20px',
            width: 'clamp(115px, 18vw, 155px)',
            height: 'auto',
            transform: 'rotate(10deg)',
            zIndex: 10,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 6px 16px rgba(201, 104, 133, 0.28))',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s var(--ease-out-expo) 1.5s, transform 0.6s var(--ease-out-expo) 1.5s',
          }}
        />
      </div>
    </section>
  );
}
