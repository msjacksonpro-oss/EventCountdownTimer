import React, { useState, useEffect } from 'react';
import { calculateTimeLeft, formatDateForDisplay, calculateProgress, CATEGORIES } from '../utils/timeUtils';
import { triggerConfetti, triggerBigCelebration } from './ConfettiCelebration';
import { Sparkles, Calendar, Edit3, Share2, Flame, PartyPopper } from 'lucide-react';

const SpotlightEvent = ({ event, onEdit }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(event?.target_date));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!event) return;
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(event.target_date);
      setTimeLeft(remaining);

      // Trigger confetti if event just hit 0s
      if (remaining.isExpired && remaining.totalSeconds === 0) {
        triggerBigCelebration();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event?.target_date]);

  if (!event) return null;

  const categoryMeta = CATEGORIES[event.category] || CATEGORIES.other;
  const accentColor = event.color || categoryMeta.defaultColor;
  const progress = calculateProgress(event.created_at, event.target_date);

  const handleShare = () => {
    const text = `⏳ Countdown to ${event.title}: ${timeLeft.formattedTime} remaining! (${formatDateForDisplay(event.target_date)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        marginBottom: '2.5rem',
        border: `1px solid ${accentColor}44`,
        background: `linear-gradient(135deg, ${accentColor}15 0%, rgba(15, 23, 42, 0.9) 60%)`,
        boxShadow: `0 12px 35px -8px ${accentColor}33`,
      }}
    >
      {/* Background glow orb */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '240px',
        height: '240px',
        background: accentColor,
        filter: 'blur(80px)',
        opacity: 0.18,
        pointerEvents: 'none',
        borderRadius: '50%'
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left info column */}
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: `${accentColor}25`,
              color: '#ffffff',
              border: `1px solid ${accentColor}66`
            }}>
              <Flame size={14} style={{ color: '#f59e0b' }} />
              Next Major Milestone
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: '700',
              background: categoryMeta.bg,
              color: categoryMeta.text,
              border: `1px solid ${accentColor}33`
            }}>
              <span>{categoryMeta.emoji}</span>
              <span>{categoryMeta.label}</span>
            </span>
          </div>

          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
            color: '#ffffff'
          }}>
            {event.title}
          </h2>

          {event.description && (
            <p style={{
              fontSize: '0.925rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              maxWidth: '550px',
              lineHeight: 1.5
            }}>
              {event.description}
            </p>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginTop: '0.75rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              color: 'var(--text-muted)'
            }}>
              <Calendar size={16} />
              <span>Target: <strong style={{ color: 'var(--text-primary)' }}>{formatDateForDisplay(event.target_date)}</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onEdit(event)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>

              <button
                onClick={handleShare}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              >
                <Share2 size={14} />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => triggerConfetti(0.4)}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', borderColor: `${accentColor}55` }}
              >
                <PartyPopper size={14} style={{ color: accentColor }} />
                <span>Celebrate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Big Live Countdown Digits */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          flex: '0 0 auto'
        }}>
          {timeLeft.isExpired ? (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 2rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <h3 style={{ fontSize: '1.25rem', color: '#f87171', fontWeight: '800' }}>
                Event Completed!
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                This milestone has arrived.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="timer-box" style={{ minWidth: '85px', padding: '0.9rem 0.75rem' }}>
                <span className="timer-digits" style={{ fontSize: '2.5rem', color: '#ffffff' }}>
                  {pad(timeLeft.days)}
                </span>
                <span className="timer-label" style={{ fontSize: '0.75rem' }}>Days</span>
              </div>

              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: accentColor }}>:</span>

              <div className="timer-box" style={{ minWidth: '85px', padding: '0.9rem 0.75rem' }}>
                <span className="timer-digits" style={{ fontSize: '2.5rem', color: '#ffffff' }}>
                  {pad(timeLeft.hours)}
                </span>
                <span className="timer-label" style={{ fontSize: '0.75rem' }}>Hours</span>
              </div>

              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: accentColor }}>:</span>

              <div className="timer-box" style={{ minWidth: '85px', padding: '0.9rem 0.75rem' }}>
                <span className="timer-digits" style={{ fontSize: '2.5rem', color: '#ffffff' }}>
                  {pad(timeLeft.minutes)}
                </span>
                <span className="timer-label" style={{ fontSize: '0.75rem' }}>Minutes</span>
              </div>

              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: accentColor }}>:</span>

              <div className="timer-box ticking-second" style={{ minWidth: '85px', padding: '0.9rem 0.75rem', borderColor: accentColor }}>
                <span className="timer-digits" style={{ fontSize: '2.5rem', color: accentColor }}>
                  {pad(timeLeft.seconds)}
                </span>
                <span className="timer-label" style={{ fontSize: '0.75rem', color: accentColor }}>Seconds</span>
              </div>
            </div>
          )}

          {/* Progress bar info */}
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              <span>Timeline Progress</span>
              <span>{progress}% Elapsed</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${accentColor}, #06b6d4)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotlightEvent;
