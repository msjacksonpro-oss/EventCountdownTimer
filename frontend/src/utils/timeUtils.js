export const CATEGORIES = {
  birthday: { label: 'Birthday', emoji: '🎂', defaultColor: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd' },
  trip: { label: 'Trip', emoji: '✈️', defaultColor: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7' },
  exam: { label: 'Exam', emoji: '📚', defaultColor: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5' },
  meeting: { label: 'Meeting', emoji: '💼', defaultColor: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d' },
  launch: { label: 'Product Launch', emoji: '🚀', defaultColor: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', text: '#c4b5fd' },
  holiday: { label: 'Holiday', emoji: '🌴', defaultColor: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9' },
  anniversary: { label: 'Anniversary', emoji: '❤️', defaultColor: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6' },
  other: { label: 'Other', emoji: '🎯', defaultColor: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc' },
};

export const COLOR_PRESETS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Sky Blue', hex: '#3b82f6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
];

export function calculateTimeLeft(targetDate) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0 || isNaN(difference)) {
    return {
      isExpired: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedTime: '00:00:00',
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  const pad = (n) => String(n).padStart(2, '0');

  return {
    isExpired: false,
    totalSeconds: Math.floor(difference / 1000),
    days,
    hours,
    minutes,
    seconds,
    formattedTime: `${days > 0 ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
  };
}

export function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateForInput(dateObj) {
  if (!dateObj) return '';
  const date = new Date(dateObj);
  if (isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function calculateProgress(createdAt, targetDate) {
  if (!createdAt || !targetDate) return 0;
  const start = new Date(createdAt).getTime();
  const end = new Date(targetDate).getTime();
  const now = new Date().getTime();

  if (end <= start) return 100;
  if (now >= end) return 100;
  if (now <= start) return 0;

  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}
