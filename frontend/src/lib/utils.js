export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const formatDate = (d, opts) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' });
};

export const timeToMinutes = (t) => {
  if (!t) return 0;
  const [time, mod] = t.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (mod === 'PM' && h !== 12) h += 12;
  if (mod === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

export const statusColor = (s) => {
  const map = {
    upcoming: 'bg-amber-100 text-amber-800 border-amber-200',
    live: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    serving: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    scheduled: 'bg-amber-100 text-amber-800 border-amber-200',
    preparing: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    planned: 'bg-amber-100 text-amber-800',
    procession: 'bg-emerald-100 text-emerald-800 animate-pulse',
    immersed: 'bg-zinc-900 text-white',
  };
  return map[s?.toLowerCase()] || 'bg-zinc-100 text-zinc-600 border-zinc-200';
};
