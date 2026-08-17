import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, eventTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '1.5rem' }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>
              Delete Event?
            </h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
          lineHeight: 1.5,
          wordBreak: 'break-word'
        }}>
          Are you sure you want to delete <strong style={{ color: '#ffffff' }}>"{eventTitle}"</strong>? The countdown timer and history will be permanently removed.
        </p>

        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
          >
            <Trash2 size={16} />
            <span>{loading ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
