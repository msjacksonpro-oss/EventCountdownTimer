import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import SpotlightEvent from '../components/SpotlightEvent';
import StatsOverview from '../components/StatsOverview';
import FilterBar from '../components/FilterBar';
import EventCard from '../components/EventCard';
import EventFormModal from '../components/EventFormModal';
import DeleteModal from '../components/DeleteModal';
import { calculateTimeLeft } from '../utils/timeUtils';
import { Plus, Sparkles, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nearest');
  const [viewMode, setViewMode] = useState('grid');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events/');
      setEvents(res.data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Seed sample events
  const handleSeedDemoEvents = async () => {
    try {
      setIsSeeding(true);
      await api.post('/events/seed/');
      await fetchEvents();
    } catch (err) {
      console.error('Error seeding demo events:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  // Create or Update Event
  const handleSaveEvent = async (eventData) => {
    if (editingEvent) {
      const res = await api.put(`/events/${editingEvent.id}/`, eventData);
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? res.data : e)));
    } else {
      const res = await api.post('/events/', eventData);
      setEvents((prev) => [...prev, res.data]);
    }
  };

  // Delete Event
  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    try {
      setIsDeleteLoading(true);
      await api.delete(`/events/${deletingEvent.id}/`);
      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
      setDeletingEvent(null);
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Counts by category for badges
  const countsByCategory = useMemo(() => {
    const counts = { all: events.length };
    events.forEach((ev) => {
      counts[ev.category] = (counts[ev.category] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Spotlight event: closest upcoming active event
  const spotlightEvent = useMemo(() => {
    const activeEvents = events
      .filter((e) => !calculateTimeLeft(e.target_date).isExpired)
      .sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());
    return activeEvents.length > 0 ? activeEvents[0] : null;
  }, [events]);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        // Category filter
        if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
          return false;
        }

        // Status filter
        const isExpired = calculateTimeLeft(ev.target_date).isExpired;
        if (statusFilter === 'active' && isExpired) return false;
        if (statusFilter === 'completed' && !isExpired) return false;

        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = ev.title.toLowerCase().includes(q);
          const matchDesc = ev.description ? ev.description.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') {
          return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        }
        if (sortBy === 'farthest') {
          return new Date(b.target_date).getTime() - new Date(a.target_date).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [events, selectedCategory, statusFilter, searchQuery, sortBy]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3.5rem', width: '100%' }}>
      <Navbar
        onOpenAddModal={() => {
          setEditingEvent(null);
          setIsModalOpen(true);
        }}
        onSeedDemoEvents={handleSeedDemoEvents}
        isSeeding={isSeeding}
      />

      <main className="dashboard-container">
        {/* Spotlight Hero Banner for nearest event */}
        {spotlightEvent && (
          <SpotlightEvent
            event={spotlightEvent}
            onEdit={(ev) => {
              setEditingEvent(ev);
              setIsModalOpen(true);
            }}
          />
        )}

        {/* Stats Overview */}
        <StatsOverview events={events} />

        {/* Filters and Controls */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          countsByCategory={countsByCategory}
        />

        {/* Events Grid / List Display */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--accent-primary)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading your countdown timers...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          /* Empty State */
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Calendar size={30} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              {events.length === 0 ? 'No Event Countdowns Yet' : 'No Matching Events Found'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {events.length === 0
                ? 'Create your first countdown timer or load our sample events to see live ticking cards!'
                : 'Try adjusting your search query, status filters, or category selection.'}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <Plus size={17} />
                <span>Create New Event</span>
              </button>

              {events.length === 0 && (
                <button
                  onClick={handleSeedDemoEvents}
                  disabled={isSeeding}
                  className="btn btn-secondary"
                >
                  <Sparkles size={16} style={{ color: '#f59e0b' }} />
                  <span>{isSeeding ? 'Populating...' : 'Load Sample Events'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Event Cards Container */
          <div className={viewMode === 'grid' ? 'events-grid-container' : 'events-list-container'}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                viewMode={viewMode}
                onEdit={(ev) => {
                  setEditingEvent(ev);
                  setIsModalOpen(true);
                }}
                onDelete={(ev) => setDeletingEvent(ev)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Event Modal */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleConfirmDelete}
        eventTitle={deletingEvent?.title}
        loading={isDeleteLoading}
      />
    </div>
  );
};

export default Dashboard;
