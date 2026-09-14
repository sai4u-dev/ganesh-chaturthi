import axios from 'axios';
import { API_BASE } from '../lib/utils';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ganesh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  getSettings: () => client.get('/settings').then(r => r.data),
  updateSettings: (data) => client.put('/settings', data).then(r => r.data),

  getPooja: () => client.get('/pooja').then(r => r.data),
  createPooja: (data) => client.post('/pooja', data).then(r => r.data),
  updatePooja: (id, data) => client.put(`/pooja/${id}`, data).then(r => r.data),
  deletePooja: (id) => client.delete(`/pooja/${id}`).then(r => r.data),
  patchPoojaStatus: (id, status) => client.patch(`/pooja/${id}/status`, { status }).then(r => r.data),

  getAnnadanam: () => client.get('/annadanam').then(r => r.data),
  createAnnadanam: (d) => client.post('/annadanam', d).then(r => r.data),
  updateAnnadanam: (id, d) => client.put(`/annadanam/${id}`, d).then(r => r.data),
  deleteAnnadanam: (id) => client.delete(`/annadanam/${id}`).then(r => r.data),

  getNimarjanam: () => client.get('/nimarjanam').then(r => r.data),
  updateNimarjanam: (data) => client.put('/nimarjanam', data).then(r => r.data),

  getPromotions: (active) => client.get('/promotions', { params: active ? { active: true } : {} }).then(r => r.data),
  createPromotion: (d) => client.post('/promotions', d).then(r => r.data),
  updatePromotion: (id, d) => client.put(`/promotions/${id}`, d).then(r => r.data),
  deletePromotion: (id) => client.delete(`/promotions/${id}`).then(r=>r.data),

  getGallery: () => client.get('/gallery').then(r => r.data),
  createGallery: (d) => client.post('/gallery', d).then(r => r.data),
  deleteGallery: (id) => client.delete(`/gallery/${id}`).then(r=>r.data),

  getCommittee: () => client.get('/committee').then(r => r.data),
  createCommittee: (d) => client.post('/committee', d).then(r => r.data),
  updateCommittee: (id, d) => client.put(`/committee/${id}`, d).then(r => r.data),
  deleteCommittee: (id) => client.delete(`/committee/${id}`).then(r=>r.data),

  getSchedule: () => client.get('/schedule').then(r => r.data),
  createSchedule: (d) => client.post('/schedule', d).then(r => r.data),
  updateSchedule: (id, d) => client.put(`/schedule/${id}`, d).then(r => r.data),
  deleteSchedule: (id) => client.delete(`/schedule/${id}`).then(r => r.data),

  submitRegistration: (data) => client.post('/registrations', data).then(r => r.data),
  getRegistrations: (params) => client.get('/registrations', { params }).then(r => r.data),
  updateRegistration: (id, d) => client.put(`/registrations/${id}`, d).then(r => r.data),
  deleteRegistration: (id) => client.delete(`/registrations/${id}`).then(r => r.data),

  login: (email, password) => client.post('/auth/login', { email, password }).then(r => r.data),
  me: () => client.get('/auth/me').then(r => r.data),
  health: () => client.get('/health').then(r => r.data),
};

export default client;
