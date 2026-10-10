import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { clsx as clsxBase } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDuration(minutes) {
  if (!minutes) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMM d, yyyy');
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'h:mm a');
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getRelativeDate(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function getMoodEmoji(mood) {
  const moods = {
    1: '😫',
    2: '😔',
    3: '😐',
    4: '🙂',
    5: '😄'
  };
  return moods[mood] || '😐';
}

export function getMoodLabel(mood) {
  const labels = {
    1: 'Terrible',
    2: 'Low',
    3: 'Okay',
    4: 'Good',
    5: 'Excellent'
  };
  return labels[mood] || 'Okay';
}

export function getCategoryColor(category) {
  const colors = {
    work: 'bg-blue-500',
    study: 'bg-indigo-500',
    health: 'bg-emerald-500',
    finance: 'bg-amber-500',
    personal: 'bg-violet-500',
    social: 'bg-pink-500',
    leisure: 'bg-cyan-500'
  };
  return colors[category?.toLowerCase()] || 'bg-slate-500';
}

export function getCategoryIcon(category) {
  const icons = {
    work: 'Briefcase',
    study: 'BookOpen',
    health: 'Heart',
    finance: 'Wallet',
    personal: 'User',
    social: 'Users',
    leisure: 'Coffee'
  };
  return icons[category?.toLowerCase()] || 'Circle';
}

export function clsx(...classes) {
  return twMerge(clsxBase(classes));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
