import React, { useState, useEffect } from 'react';
import { calculateTimeLeft, formatDateForDisplay, calculateProgress, CATEGORIES } from '../utils/timeUtils';
import { triggerConfetti } from './ConfettiCelebration';
import { Calendar, Clock, Edit3, Trash2, Share2, CheckCircle2, Check } from 'lucide-react';

const EventCard = ({ event, onEdit, onDelete, viewMode = 'grid' }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(event?.target_date));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event?.target_date));
    }, 1000);

    return () => clearInterval(interval);
  }, [event?.target_date]);

  if (!event) return null;

  const categoryMeta = CATEGORIES[event.category] || CATEGORIES.other;
  const accentColor = event.color || categoryMeta.defaultColor;
  const progress = calculateProgress(event.created_at, event.target_date);

  const handleShare = () => {
    const text = `⏳ Countdown to ${event.title}: ${timeLeft.isExpired ? 'Event Completed!' : `${timeLeft.formattedTime} left`} (${formatDateForDisplay(event.target_date)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pad = (n) => String(n).padStart(2, '0');

  // List View Format
  if (viewMode === 'list') {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '1.15rem 1.25rem',
          borderLeft: `4px solid ${accentColor}`,
          width: '100%',
        }}
      >
        <div className="list-card-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1 1 260px', minWidth: 0 }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: categoryMeta.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              border: `1px solid ${accentColor}33`,
              flexShrink: 0
            }}>
              {categoryMeta.emoji}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', wordBreak: 'break-word' }}>
                  {event.title}
                </h3>
                <span style={{
                  fontSize: '0.675rem',
                  fontWeight: '600',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '99px',
                  background: categoryMeta.bg,
                  color: categoryMeta.text,
                  flexShrink: 0
                }}>
                  {categoryMeta.label}
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} style={{ flexShrink: 0 }} />
                <span>{formatDateForDisplay(event.target_date)}</span>
              </p>
            </div>
          </div>

          {/* List Countdown & Actions */}
          <div className="list-card-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {timeLeft.isExpired ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '99px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontSize: '0.825rem',
                fontWeight: '700'
              }}>
                <CheckCircle2 size={15} />
                Completed
              </span>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: '700',
                color: accentColor,
                background: 'rgba(0,0,0,0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${accentColor}33`,
                whiteSpace: 'nowrap'
              }}>
                <Clock size={15} className="ticking-second" style={{ flexShrink: 0 }} />
                <span>{timeLeft.formattedTime}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handleShare}
                className="btn btn-icon btn-secondary"
                title={copied ? 'Copied!' : 'Share / Copy'}
                style={{ width: '34px', height: '34px' }}
              >
                {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Share2 size={15} />}
              </button>
              <button
                onClick={() => onEdit(event)}
                className="btn btn-icon btn-secondary"
                title="Edit Event"
                style={{ width: '34px', height: '34px' }}
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => onDelete(event)}
                className="btn btn-icon btn-danger"
                title="Delete Event"
                style={{ width: '34px', height: '34px' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Format (Default)
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `4px solid ${accentColor}`,
        width: '100%',
      }}
    >
      {/* Background ambient corner glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: accentColor,
        filter: 'blur(60px)',
        opacity: 0.1,
        pointerEvents: 'none',
        borderRadius: '50%'
      }} />

      {/* Header */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '99px',
            fontSize: '0.725rem',
            fontWeight: '700',
            background: categoryMeta.bg,
            color: categoryMeta.text,
            border: `1px solid ${accentColor}33`
          }}>
            <span>{categoryMeta.emoji}</span>
            <span>{categoryMeta.label}</span>
          </span>

          {timeLeft.isExpired ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.725rem',
              fontWeight: '700',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.12)',
              padding: '0.2rem 0.55rem',
              borderRadius: '99px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              Completed
            </span>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.725rem',
              fontWeight: '700',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.2rem 0.55rem',
              borderRadius: '99px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }}></span>
              Active
            </span>
          )}
        </div>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          lineHeight: 1.3,
          marginBottom: '0.35rem',
          color: '#ffffff',
          wordBreak: 'break-word'
        }}>
          {event.title}
        </h3>

        {event.description && (
          <p style={{
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.85rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}>
            {event.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem'
        }}>
          <Calendar size={13} style={{ flexShrink: 0 }} />
          <span>{formatDateForDisplay(event.target_date)}</span>
        </div>
      </div>

      {/* Countdown Timer Blocks */}
      <div>
        {timeLeft.isExpired ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px dashed rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            textAlign: 'center',
            marginBottom: '0.85rem'
          }}>
            <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.2rem' }}>🎉</span>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171' }}>
              Event Has Concluded
            </div>
            <button
              onClick={() => triggerConfetti(0.5)}
              style={{
                marginTop: '0.4rem',
                fontSize: '0.725rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Throw Confetti
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.35rem',
            marginBottom: '0.85rem',
            width: '100%'
          }}>
            <div className="timer-box">
              <span className="timer-digits">{pad(timeLeft.days)}</span>
              <span className="timer-label">Days</span>
            </div>
            <div className="timer-box">
              <span className="timer-digits">{pad(timeLeft.hours)}</span>
              <span className="timer-label">Hours</span>
            </div>
            <div className="timer-box">
              <span className="timer-digits">{pad(timeLeft.minutes)}</span>
              <span className="timer-label">Mins</span>
            </div>
            <div className="timer-box ticking-second" style={{ borderColor: `${accentColor}88` }}>
              <span className="timer-digits" style={{ color: accentColor }}>{pad(timeLeft.seconds)}</span>
              <span className="timer-label" style={{ color: accentColor }}>Secs</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div style={{ marginBottom: '1rem' }}>
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

        {/* Card Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '0.75rem'
        }}>
          <button
            onClick={handleShare}
            className="btn btn-icon btn-secondary"
            title={copied ? 'Copied!' : 'Copy countdown text'}
            style={{ width: '32px', height: '32px', minWidth: '32px' }}
          >
            {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Share2 size={14} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => onEdit(event)}
              className="btn btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', minHeight: '32px' }}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(event)}
              className="btn btn-icon btn-danger"
              title="Delete Event"
              style={{ width: '32px', height: '32px', minWidth: '32px' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
