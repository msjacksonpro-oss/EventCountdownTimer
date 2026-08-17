import React from 'react';
import { CATEGORIES } from '../utils/timeUtils';
import { Search, ArrowUpDown, LayoutGrid, List, X } from 'lucide-react';

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
    <div className="filter-bar-wrapper">
      {/* Top row: Search, Status Tabs, Sorting & View mode */}
      <div className="filter-controls-row">
        {/* Search Box */}
        <div className="filter-search-box">
          <Search size={18} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
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
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Secondary controls row */}
        <div className="filter-secondary-group">
          {/* Status Tabs: All / Active / Completed */}
          <div
            className="filter-status-tabs"
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-glass)',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              gap: '0.25rem'
            }}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: '⏳ Active' },
              { id: 'completed', label: '🎉 Done' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className="filter-status-tab-btn"
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
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flex: '0 0 auto' }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                padding: '0.45rem 0.75rem',
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-md)',
                width: 'auto',
                minWidth: '130px'
              }}
            >
              <option value="nearest">Nearest First</option>
              <option value="farthest">Farthest First</option>
              <option value="newest">Newest Created</option>
              <option value="title">A-Z Name</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-glass)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            gap: '0.25rem',
            flexShrink: 0
          }}>
            <button
              onClick={() => setViewMode('grid')}
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                minWidth: '32px',
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
                minWidth: '32px',
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

      {/* Category Pills Row with smooth mobile scroll */}
      <div className="category-scroll-strip">
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
            flexShrink: 0,
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
                flexShrink: 0,
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
