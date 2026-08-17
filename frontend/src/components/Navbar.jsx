import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Plus, Sparkles, LogOut, User, Calendar, Bell } from 'lucide-react';

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
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(9, 13, 22, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.85rem 1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
          }}>
            <Clock size={24} className="ticking-second" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ChronoPulse
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                padding: '0.15rem 0.45rem',
                borderRadius: '99px'
              }}>
                Live
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-time Event Countdown & Tracker
            </p>
          </div>
        </div>

        {/* Live Clock Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.45rem 0.9rem',
          borderRadius: '99px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.825rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>{formattedDate}</span>
          <span style={{ color: 'var(--border-glass)' }}>|</span>
          <span style={{ fontWeight: '700', color: '#ffffff' }}>{formattedClock}</span>
        </div>

        {/* Actions & User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Seed demo events button */}
          <button
            onClick={onSeedDemoEvents}
            disabled={isSeeding}
            className="btn btn-secondary"
            title="Populate sample countdown events"
            style={{ fontSize: '0.825rem', padding: '0.55rem 0.9rem' }}
          >
            <Sparkles size={15} style={{ color: '#f59e0b' }} />
            <span>{isSeeding ? 'Seeding...' : 'Load Demo Events'}</span>
          </button>

          {/* New Event Button */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
          >
            <Plus size={17} />
            <span>New Event</span>
          </button>

          {/* User profile & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.25)',
              color: '#a5b4fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.75rem'
            }}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              {user?.username}
            </span>
            <button
              onClick={logout}
              className="btn btn-icon"
              title="Logout"
              style={{
                width: '28px',
                height: '28px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
