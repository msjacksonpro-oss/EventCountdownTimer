import React, { useState, useEffect } from 'react';
import { CATEGORIES, COLOR_PRESETS, formatDateForInput } from '../utils/timeUtils';
import { X, Calendar, Sparkles, Clock, Palette, Tag } from 'lucide-react';

const EventFormModal = ({ isOpen, onClose, onSave, editingEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('birthday');
  const [color, setColor] = useState('#6366f1');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || '');
      setDescription(editingEvent.description || '');
      setCategory(editingEvent.category || 'birthday');
      setColor(editingEvent.color || '#6366f1');
      setTargetDate(formatDateForInput(editingEvent.target_date));
    } else {
      // Default: 7 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      defaultDate.setHours(12, 0, 0, 0);

      setTitle('');
      setDescription('');
      setCategory('birthday');
      setColor('#3b82f6');
      setTargetDate(formatDateForInput(defaultDate));
    }
    setError('');
  }, [editingEvent, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (!editingEvent) {
      setColor(CATEGORIES[newCat]?.defaultColor || '#6366f1');
    }
  };

  const applyPresetTime = (hoursToAdd) => {
    const now = new Date();
    now.setHours(now.getHours() + hoursToAdd);
    setTargetDate(formatDateForInput(now));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (!targetDate) {
      setError('Please select a target date and time.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        color,
        target_date: new Date(targetDate).toISOString(),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.response?.data?.detail || err.response?.data?.title?.[0] || 'Failed to save event. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Clock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                {editingEvent ? 'Edit Event Countdown' : 'Create New Event'}
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Set your target milestone and watch the live countdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          {/* Event Title */}
          <div className="form-group">
            <label className="form-label">
              Event Title <span style={{ color: 'var(--accent-rose)' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. My 25th Birthday, Goa Trip, Product Launch..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Category Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={15} />
              <span>Category</span>
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '0.5rem'
            }}>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const isSelected = category === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? `2px solid ${cat.defaultColor}` : '1px solid var(--border-glass)',
                      background: isSelected ? cat.bg : 'rgba(0, 0, 0, 0.25)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Accent Picker */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Palette size={15} />
              <span>Theme Accent Color</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COLOR_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.hex}
                  onClick={() => setColor(preset.hex)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: preset.hex,
                    border: color === preset.hex ? '3px solid #ffffff' : '2px solid transparent',
                    boxShadow: color === preset.hex ? `0 0 10px ${preset.hex}` : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                    transform: color === preset.hex ? 'scale(1.15)' : 'scale(1)'
                  }}
                  title={preset.name}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: 'transparent'
                }}
                title="Custom color"
              />
            </div>
          </div>

          {/* Target Date & Time */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} />
              <span>Target Date & Time <span style={{ color: 'var(--accent-rose)' }}>*</span></span>
            </label>
            <input
              type="datetime-local"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="form-input"
              style={{ colorScheme: 'dark' }}
            />

            {/* Quick date presets */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.45rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Quick add:</span>
              {[
                { label: '+1 Hour', hours: 1 },
                { label: 'Tomorrow', hours: 24 },
                { label: 'In 3 Days', hours: 72 },
                { label: 'In 1 Week', hours: 168 },
                { label: 'In 1 Month', hours: 720 },
              ].map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => applyPresetTime(preset.hours)}
                  style={{
                    fontSize: '0.725rem',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '99px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add key details, venue, reminder notes, or checklist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Form Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            borderTop: '1px solid var(--border-glass)',
            paddingTop: '1.25rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ minWidth: '130px', background: `linear-gradient(135deg, ${color}, #8b5cf6)` }}
            >
              {loading ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Countdown'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
