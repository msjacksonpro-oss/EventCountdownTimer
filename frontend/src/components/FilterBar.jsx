import React from 'react';
import { CATEGORIES } from '../utils/timeUtils';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, X } from 'lucide-react';

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  countsByCategory,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
      {/* Top row: Search, Status Tabs, Sorting & View mode */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Search Box */}
        <div style={{
          position: 'relative',
          flex: '1 1 280px',
          maxWidth: '400px'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search events by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '2.75rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              borderRadius: '99px',
              fontSize: '0.875rem'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Tabs: All / Active / Completed */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-glass)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          gap: '0.25rem'
        }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: '⏳ Active' },
            { id: 'completed', label: '🎉 Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.825rem',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                background: statusFilter === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: statusFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort and View Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-md)',
                width: 'auto'
              }}
            >
              <option value="nearest">Nearest Event First</option>
              <option value="farthest">Farthest Event First</option>
              <option value="newest">Newest Created</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-glass)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            gap: '0.25rem'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                background: viewMode === 'list' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.85rem',
            fontSize: '0.825rem',
            fontWeight: '700',
            borderRadius: '99px',
            border: selectedCategory === 'all' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
            background: selectedCategory === 'all' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.03)',
            color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          <span>All Categories</span>
          <span style={{
            fontSize: '0.7rem',
            padding: '0.1rem 0.4rem',
            borderRadius: '99px',
            background: selectedCategory === 'all' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.08)'
          }}>
            {countsByCategory?.all || 0}
          </span>
        </button>

        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const isSelected = selectedCategory === key;
          const count = countsByCategory?.[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                fontSize: '0.825rem',
                fontWeight: '600',
                borderRadius: '99px',
                border: isSelected ? `1px solid ${cat.defaultColor}` : '1px solid var(--border-glass)',
                background: isSelected ? cat.bg : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? cat.text : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '99px',
                  background: isSelected ? `${cat.defaultColor}33` : 'rgba(255,255,255,0.08)',
                  color: isSelected ? cat.text : 'var(--text-muted)'
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
