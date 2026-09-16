export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const CATEGORIES = [
  'Adventure',
  'Family',
  'Honeymoon',
  'Pilgrimage',
  'Wildlife',
  'Heritage',
  'Culture'
];

export const DURATIONS = [
  { label: '1 - 3 days', min: 1, max: 3 },
  { label: '4 - 7 days', min: 4, max: 7 },
  { label: '8+ days', min: 8, max: 30 }
];
