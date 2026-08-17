import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Plus, Sparkles, LogOut } from 'lucide-react';

const Navbar = ({ onOpenAddModal, onSeedDemoEvents, isSeeding }) => {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedClock = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(currentTime);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(currentTime);

  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="navbar-brand-group">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
            flexShrink: 0
          }}>
            <Clock size={22} className="ticking-second" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2
              }}>
                ChronoPulse
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                padding: '0.1rem 0.4rem',
                borderRadius: '99px'
              }}>
                Live
              </span>
            </div>
            <p className="navbar-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-time Event Countdown & Tracker
            </p>
          </div>
        </div>

        {/* Live Clock Pill */}
        <div className="navbar-clock-pill">
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981',
            flexShrink: 0
          }}></span>
          <span className="navbar-date-text" style={{ color: 'var(--text-secondary)' }}>{formattedDate}</span>
          <span className="navbar-date-divider" style={{ color: 'var(--border-glass)' }}>|</span>
          <span style={{ fontWeight: '700', color: '#ffffff' }}>{formattedClock}</span>
        </div>

        {/* Actions & User */}
        <div className="navbar-actions-group">
          {/* Seed demo events button */}
          <button
            onClick={onSeedDemoEvents}
            disabled={isSeeding}
            className="btn btn-secondary"
            title="Populate sample countdown events"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.85rem' }}
          >
            <Sparkles size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <span className="btn-text-hide-mobile">{isSeeding ? 'Seeding...' : 'Load Demo'}</span>
          </button>

          {/* New Event Button */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.95rem' }}
          >
            <Plus size={16} style={{ flexShrink: 0 }} />
            <span>New<span className="btn-text-hide-mobile"> Event</span></span>
          </button>

          {/* User profile & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.25)',
              color: '#a5b4fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.725rem',
              flexShrink: 0
            }}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="btn-text-hide-mobile" style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {user?.username}
            </span>
            <button
              onClick={logout}
              className="btn btn-icon"
              title="Logout"
              style={{
                width: '26px',
                height: '26px',
                minWidth: '26px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
