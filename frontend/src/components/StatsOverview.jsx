import React from 'react';
import { Calendar, CheckCircle2, Clock, Zap } from 'lucide-react';
import { calculateTimeLeft } from '../utils/timeUtils';

const StatsOverview = ({ events }) => {
  const total = events.length;
  const activeEvents = events.filter((e) => !calculateTimeLeft(e.target_date).isExpired);
  const completedEvents = events.filter((e) => calculateTimeLeft(e.target_date).isExpired);

  const nearest = activeEvents.length > 0 ? activeEvents[0] : null;
  const nearestTime = nearest ? calculateTimeLeft(nearest.target_date) : null;

  const stats = [
    {
      label: 'Total Tracked Events',
      value: total,
      icon: Calendar,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
    },
    {
      label: 'Active Countdowns',
      value: activeEvents.length,
      icon: Clock,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)',
      pulse: activeEvents.length > 0,
    },
    {
      label: 'Completed Milestones',
      value: completedEvents.length,
      icon: CheckCircle2,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
      label: 'Nearest Event',
      value: nearest ? `${nearestTime?.days}d ${nearestTime?.hours}h Left` : 'None',
      icon: Zap,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.12)',
      subtext: nearest ? nearest.title : 'Add an upcoming event',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: stat.bg,
              color: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: stat.pulse ? `0 0 12px ${stat.color}44` : 'none'
            }}>
              <Icon size={22} className={stat.pulse ? 'ticking-second' : ''} />
            </div>

            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '1.35rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: stat.subtext ? 'var(--font-heading)' : 'var(--font-heading)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {stat.value}
              </div>
              {stat.subtext && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stat.subtext}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;
