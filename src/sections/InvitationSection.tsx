import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Guest } from '../lib/supabase';
import config from '../invitation.config';
import { MapPin, Calendar, Check, ExternalLink, Send, Phone, AlertCircle } from 'lucide-react';
import styles from './InvitationSection.module.css';

interface InvitationSectionProps {
  guest?: Guest;
  onSubmitRSVP?: (status: 'attending' | 'declined', note?: string) => void;
}

export default function InvitationSection({ guest, onSubmitRSVP }: InvitationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [rsvpChoice, setRsvpChoice] = useState<'9:00–11:00' | '11:00–13:00' | 'Mình bận rồi' | null>(null);
  const [message, setMessage] = useState(guest?.rsvp_note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

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

  const handleSelectChoice = (choice: '9:00–11:00' | '11:00–13:00' | 'Mình bận rồi') => {
    setRsvpChoice(choice);
    setValidationError(null);
    setErrorMessage(null);
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpChoice) {
      setValidationError('Vui lòng chọn 1 trong 3 phương án trước khi gửi xác nhận.');
      return;
    }
    setValidationError(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          choice: rsvpChoice,
          message: message.trim(),
          guestName: guest?.name || config.senderName,
          slug: guest?.slug || '',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        if (onSubmitRSVP) {
          const status = rsvpChoice === 'Mình bận rồi' ? 'declined' : 'attending';
          onSubmitRSVP(status, `${rsvpChoice}${message.trim() ? `: ${message.trim()}` : ''}`);
        }
      } else {
        setErrorMessage(
          data.error || 'Có lỗi xảy ra khi gửi xác nhận. Vui lòng thử lại sau.'
        );
      }
    } catch {
      setErrorMessage(
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau.'
      );
    } finally {
      setIsSubmitting(false);
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
          {/* Thiệp mời header badge */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.6s var(--ease-out-expo) ${transitionDelay(1)}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 'var(--space-xs)',
              }}
            >
              <img
                src="/assets/invitation/thiep-moi.png"
                alt="Thiệp mời tốt nghiệp"
                style={{
                  width: 'clamp(110px, 22vw, 150px)',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
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
                marginBottom: 'var(--space-sm)',
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

            {/* Logo Trường ĐH Mở TP.HCM */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto var(--space-md)',
              }}
            >
              <img
                src="/assets/invitation/logo-ou.png"
                alt="Logo Trường Đại học Mở TP.HCM"
                style={{
                  width: 'clamp(110px, 22vw, 150px)',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
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
            {config.event.mapLink && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
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
              </div>
            )}

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

          {/* Interactive RSVP Area (Email dispatch to 2 mailboxes) */}
          <div
            style={{
              marginTop: 'var(--space-2xl)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.6s var(--ease-out-expo) ${transitionDelay(6)}`,
            }}
          >
            <div className={styles.rsvpContainer}>
              <h3 className={styles.rsvpTitle}>Bạn sẽ đến chung vui chứ? 💕</h3>
              <p className={styles.rsvpSubtitle}>
                Hãy chọn khung giờ bạn ghé để chúng mình chuẩn bị đón tiếp thật chu đáo nhé!
              </p>

              {submitSuccess ? (
                <div className={styles.successCard}>
                  <div className={styles.successTitle}>
                    <Check size={20} />
                    Đã gửi phản hồi thành công!
                  </div>
                  <p className={styles.successDesc}>
                    {rsvpChoice === 'Mình bận rồi'
                      ? 'Cảm ơn bạn đã phản hồi! Dù bận nhưng mình rất vui và trân quý tình cảm của bạn 💕'
                      : `Tuyệt vời! Chúng mình đã ghi nhận khung giờ ${rsvpChoice}. Hẹn gặp bạn ở buổi lễ tốt nghiệp nhé ✨`}
                  </p>
                  <button
                    type="button"
                    className={styles.changeChoiceBtn}
                    onClick={() => setSubmitSuccess(false)}
                  >
                    Thay đổi lựa chọn
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRSVP}>
                  {/* 3 Choice Buttons */}
                  <div className={styles.choicesGrid} role="radiogroup" aria-label="Khung giờ tham dự">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={rsvpChoice === '9:00–11:00'}
                      className={`${styles.choiceButton} ${
                        rsvpChoice === '9:00–11:00' ? styles.choiceActive : ''
                      }`}
                      onClick={() => handleSelectChoice('9:00–11:00')}
                    >
                      9:00–11:00
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={rsvpChoice === '11:00–13:00'}
                      className={`${styles.choiceButton} ${
                        rsvpChoice === '11:00–13:00' ? styles.choiceActive : ''
                      }`}
                      onClick={() => handleSelectChoice('11:00–13:00')}
                    >
                      11:00–13:00
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={rsvpChoice === 'Mình bận rồi'}
                      className={`${styles.choiceButton} ${
                        rsvpChoice === 'Mình bận rồi' ? styles.choiceActiveDeclined : ''
                      }`}
                      onClick={() => handleSelectChoice('Mình bận rồi')}
                    >
                      Mình bận rồi
                    </button>
                  </div>

                  {/* Message Field */}
                  <div className={styles.messageWrapper}>
                    <textarea
                      className={styles.textareaField}
                      placeholder="Để lại lời nhắn cho chúng mình nhé..."
                      value={message}
                      maxLength={500}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-label="Lời nhắn cho người gửi"
                    />
                    <div className={styles.counterRow}>
                      <span className={styles.counterText}>{message.length} / 500</span>
                    </div>
                  </div>

                  {/* Validation Error Notice */}
                  {validationError && (
                    <div className={styles.inlineError} role="alert">
                      <AlertCircle size={16} />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Backend Error Notice */}
                  {errorMessage && (
                    <div className={styles.inlineError} role="alert">
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className={styles.spinner} />
                        <span>Đang gửi xác nhận...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Gửi xác nhận</span>
                      </>
                    )}
                  </button>
                </form>
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
