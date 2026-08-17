import React, { useState, useEffect } from 'react';
import { calculateTimeLeft, formatDateForDisplay, calculateProgress, CATEGORIES } from '../utils/timeUtils';
import { triggerConfetti } from './ConfettiCelebration';
import { Calendar, Clock, Edit3, Trash2, Share2, CheckCircle2, Sparkles } from 'lucide-react';

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
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderLeft: `4px solid ${accentColor}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
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

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
                {event.title}
              </h3>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                padding: '0.15rem 0.5rem',
                borderRadius: '99px',
                background: categoryMeta.bg,
                color: categoryMeta.text,
              }}>
                {categoryMeta.label}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={13} />
              {formatDateForDisplay(event.target_date)}
            </p>
          </div>
        </div>

        {/* List Countdown display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
              fontSize: '1.1rem',
              fontWeight: '700',
              color: accentColor,
              background: 'rgba(0,0,0,0.3)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${accentColor}33`
            }}>
              <Clock size={16} className="ticking-second" />
              <span>{timeLeft.formattedTime}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={handleShare}
              className="btn btn-icon btn-secondary"
              title="Share / Copy"
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={() => onEdit(event)}
              className="btn btn-icon btn-secondary"
              title="Edit Event"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => onDelete(event)}
              className="btn btn-icon btn-danger"
              title="Delete Event"
            >
              <Trash2 size={15} />
            </button>
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
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `4px solid ${accentColor}`,
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
          marginBottom: '1rem'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
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

          {timeLeft.isExpired ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
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
          fontSize: '1.25rem',
          fontWeight: '700',
          lineHeight: 1.3,
          marginBottom: '0.4rem',
          color: '#ffffff'
        }}>
          {event.title}
        </h3>

        {event.description && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {event.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.775rem',
          color: 'var(--text-muted)',
          marginBottom: '1.25rem'
        }}>
          <Calendar size={14} />
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
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>🎉</span>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f87171' }}>
              Event Has Concluded
            </div>
            <button
              onClick={() => triggerConfetti(0.5)}
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
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
            gap: '0.4rem',
            marginBottom: '1rem'
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
        <div style={{ marginBottom: '1.25rem' }}>
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
          paddingTop: '0.85rem'
        }}>
          <button
            onClick={handleShare}
            className="btn btn-icon btn-secondary"
            title="Copy countdown text"
            style={{ width: '34px', height: '34px' }}
          >
            <Share2 size={15} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => onEdit(event)}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(event)}
              className="btn btn-icon btn-danger"
              title="Delete Event"
              style={{ width: '34px', height: '34px' }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
