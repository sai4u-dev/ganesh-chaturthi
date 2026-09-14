import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  LayoutDashboard, Settings, Clock, Utensils, Waves, Megaphone,
  Image as ImageIcon, LogOut, Plus, Trash2, Save, RefreshCw, ExternalLink, X, Check, CalendarDays, ClipboardList, Filter
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'settings', label: 'Festival Settings', icon: Settings },
  { id: 'schedule', label: 'Event Schedule', icon: CalendarDays },
  { id: 'pooja', label: 'Pooja Timings', icon: Clock },
  { id: 'annadanam', label: 'Annadanam', icon: Utensils },
  { id: 'nimarjanam', label: 'Nimarjanam', icon: Waves },
  { id: 'promotions', label: 'Promotions', icon: Megaphone },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'registrations', label: 'Registrations', icon: ClipboardList },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [pooja, setPooja] = useState([]);
  const [annadanam, setAnnadanam] = useState([]);
  const [nimarjanam, setNimarjanam] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [regFilter, setRegFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const [s, p, a, n, pr, g, sch] = await Promise.all([
        api.getSettings(),
        api.getPooja(),
        api.getAnnadanam(),
        api.getNimarjanam(),
        api.getPromotions(),
        api.getGallery(),
        api.getSchedule(),
      ]);
      setSettings(s); setPooja(p); setAnnadanam(a); setNimarjanam(n); setPromotions(pr); setGallery(g); setSchedule(sch);
      // registrations separate (admin only) — fetch if possible
      try {
        const regs = await api.getRegistrations();
        setRegistrations(regs);
      } catch { /* ignore if offline */ }
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  const loadRegs = async () => {
    try {
      const params = regFilter === 'all' ? {} : { type: regFilter };
      const regs = await api.getRegistrations(params);
      setRegistrations(regs);
    } catch (e) { setMsg(e.message); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (tab === 'registrations') loadRegs(); }, [regFilter, tab]);

  useEffect(() => {
    const token = localStorage.getItem('ganesh_token');
    if (!token) { navigate('/admin'); return; }
    api.me().then(u => setUser(u)).catch(() => { localStorage.removeItem('ganesh_token'); navigate('/admin'); });
    load();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ganesh_token');
    localStorage.removeItem('ganesh_user');
    navigate('/admin');
  };

  const saveSettings = async () => {
    setSaving(true);
    try { const updated = await api.updateSettings(settings); setSettings(updated); setMsg('✅ Settings saved & updated on website'); setTimeout(() => setMsg(''), 3000); } catch (e) { setMsg(e.response?.data?.message || e.message); } finally { setSaving(false); }
  };
  const saveNimarjanam = async () => {
    setSaving(true);
    try { const updated = await api.updateNimarjanam(nimarjanam); setNimarjanam(updated); setMsg('✅ Nimarjanam updated'); setTimeout(() => setMsg(''), 3000); } catch (e) { setMsg(e.message); } finally { setSaving(false); }
  };

  // CRUD helpers
  const addPooja = async () => {
    const title = prompt('Pooja title?'); if (!title) return;
    const time = prompt('Time (e.g., 06:00 AM)', '06:00 AM'); if (!time) return;
    try { const doc = await api.createPooja({ title, time, description: 'New pooja', category: 'nitya', dayLabel: 'Daily', icon: '🪔', status: 'upcoming' }); setPooja(prev => [...prev, doc]); } catch (e) { alert(e.message); }
  };
  const deletePooja = async (id) => { if (!confirm('Delete this pooja?')) return; await api.deletePooja(id); setPooja(prev => prev.filter(p => p._id !== id)); };
  const updatePoojaStatus = async (id, status) => { const doc = await api.patchPoojaStatus(id, status); setPooja(prev => prev.map(p => p._id === id ? doc : p)); };

  const addAnnadanam = async () => {
    const dateStr = prompt('Date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10)); if (!dateStr) return;
    try { const doc = await api.createAnnadanam({ date: new Date(dateStr), time: '12:00 PM - 3:00 PM', menu: ['Pulihora', 'Sambar'], mealType: 'lunch', status: 'scheduled', sponsor: 'New Sponsor' }); setAnnadanam(prev => [...prev, doc]); } catch (e) { alert(e.message); }
  };
  const deleteAnnadanam = async (id) => { if (!confirm('Delete?')) return; await api.deleteAnnadanam(id); setAnnadanam(prev => prev.filter(a => a._id !== id)); };

  const addPromotion = async () => {
    const title = prompt('Promotion title?'); if (!title) return;
    const brand = prompt('Brand?', 'New Brand') || 'New Brand';
    try { const doc = await api.createPromotion({ title, brand, description: 'New promo', category: 'sponsor', tier: 'gold', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', isActive: true }); setPromotions(prev => [...prev, doc]); } catch (e) { alert(e.message); }
  };
  const deletePromotion = async (id) => { if (!confirm('Delete promotion?')) return; await api.deletePromotion(id); setPromotions(prev => prev.filter(p => p._id !== id)); };

  const addGallery = async () => {
    const url = prompt('Image URL (https://...)'); if (!url) return;
    const title = prompt('Title?', 'Ganesh Darshan') || 'Ganesh Darshan';
    const year = prompt('Year?', '2026') || '2026';
    const cat = prompt('Category? (ganesh/idols/darshan/making/pooja/annadanam/nimarjanam/crowd)', 'ganesh') || 'ganesh';
    try { const doc = await api.createGallery({ imageUrl: url, title, category: cat, year: Number(year) }); setGallery(prev => [doc, ...prev]); } catch (e) { alert(e.message); }
  };
  const deleteGallery = async (id) => { if (!confirm('Delete image?')) return; await api.deleteGallery(id); setGallery(prev => prev.filter(g => g._id !== id)); };

  const addSchedule = async () => {
    const title = prompt('Event title?'); if (!title) return;
    const dateStr = prompt('Date YYYY-MM-DD', '2026-09-14'); if (!dateStr) return;
    const time = prompt('Time (e.g., 06:00 AM)', '06:00 AM') || '06:00 AM';
    try { const doc = await api.createSchedule({ title, date: new Date(dateStr), time, category: 'other', description: 'New event', icon: '🪔', status: 'upcoming', venue: 'Khairatabad' }); setSchedule(prev => [...prev, doc].sort((a,b)=> new Date(a.date)-new Date(b.date))); } catch(e){ alert(e.message); }
  };
  const deleteSchedule = async (id) => { if(!confirm('Delete schedule event?')) return; await api.deleteSchedule(id); setSchedule(prev=>prev.filter(s=>s._id!==id)); };

  const updateRegStatus = async (id, status) => {
    await api.updateRegistration(id, { status });
    setRegistrations(prev=>prev.map(r=> r._id===id ? {...r, status} : r));
  };
  const deleteReg = async (id) => { if(!confirm('Delete registration?')) return; await api.deleteRegistration(id); setRegistrations(prev=>prev.filter(r=>r._id!==id)); };

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#FFF8E7]"><div className="animate-pulse text-[#6D071A] font-semibold">Loading admin...</div></div>;

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex">
      <aside className="hidden lg:flex w-[280px] shrink-0 bg-[#1A0F0F] text-white flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FFB000] grid place-items-center text-[#1A0F0F] font-bold">ॐ</div>
            <div>
              <div className="display font-bold text-[14px] leading-none">GANESH UTSAV</div>
              <div className="text-[11px] tracking-[0.12em] opacity-60">ADMIN CONSOLE</div>
            </div>
          </div>
          <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="text-[11px] font-bold tracking-wide opacity-60">LOGGED IN</div>
            <div className="text-[13px] font-semibold truncate">{user?.name || 'Admin'} • {user?.email}</div>
            <div className="text-[11px] opacity-60">{user?.role}</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${tab === t.id ? 'bg-white text-[#1A0F0F]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <t.icon size={16} /> {t.label}
              {t.id==='registrations' && registrations.length>0 && <span className="ml-auto bg-[#FF6B00] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{registrations.length}</span>}
              {t.id==='schedule' && <span className="ml-auto bg-white/10 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{schedule.length}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" target="_blank" className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white py-2.5 rounded-full text-[13px] font-semibold hover:bg-white hover:text-[#1A0F0F] transition-colors"><ExternalLink size={14} /> View Website</Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2.5 rounded-full text-[13px] font-bold hover:bg-[#E65100] transition-colors"><LogOut size={14} /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-30 bg-[#1A0F0F] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-[#FFB000] grid place-items-center text-[#1A0F0F] font-bold text-[14px]">ॐ</div><span className="font-bold text-[13px]">ADMIN</span></div>
          <div className="flex items-center gap-2">
            <Link to="/" className="w-8 h-8 rounded-full bg-white/10 grid place-items-center"><ExternalLink size={14} /></Link>
            <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-[#FF6B00] grid place-items-center"><LogOut size={14} /></button>
          </div>
        </div>
        <div className="lg:hidden flex gap-2 overflow-auto p-3 bg-white border-b border-[#F0D9B5] sticky top-[56px] z-20 scrollbar-none">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border whitespace-nowrap ${tab === t.id ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#6D071A]'}`}>{t.label}</button>
          ))}
        </div>

        <div className="max-w-[1100px] mx-auto p-4 md:p-8">
          {msg && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-[13px] font-medium flex items-center gap-2"><Check size={16} /> {msg} <button onClick={() => setMsg('')} className="ml-auto"><X size={14} /></button></div>}

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h1 className="display font-bold text-[22px] md:text-[28px] tracking-[-0.02em] text-[#1A0F0F] flex items-center gap-3">
              {(() => { const C = TABS.find(t => t.id === tab)?.icon || LayoutDashboard; return <C size={22} className="text-[#FF6B00]" />; })()}
              {TABS.find(t => t.id === tab)?.label}
            </h1>
            <button onClick={load} className="inline-flex items-center gap-2 bg-white border border-[#F0D9B5] px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-[#FFF3D4]"><RefreshCw size={14} /> Refresh</button>
          </div>

          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#F0D9B5] rounded-[20px] p-5">
                  <div className="text-[11px] font-bold tracking-[0.12em] text-[#8B7355]">SCHEDULE EVENTS</div>
                  <div className="mono text-[28px] font-bold text-[#1A0F0F] mt-1">{schedule.length}</div>
                  <div className="text-[12px] text-[#8B7355]">{schedule.filter(s=>s.isMainEvent).length} main • {schedule.filter(s=>s.status==='live').length} live</div>
                </div>
                <div className="bg-white border border-[#F0D9B5] rounded-[20px] p-5">
                  <div className="text-[11px] font-bold tracking-[0.12em] text-[#8B7355]">POOJA TIMINGS</div>
                  <div className="mono text-[28px] font-bold text-[#1A0F0F] mt-1">{pooja.length}</div>
                  <div className="text-[12px] text-[#8B7355]">{pooja.filter(p => p.status === 'live').length} live</div>
                </div>
                <div className="bg-[#1A0F0F] text-white rounded-[20px] p-5">
                  <div className="text-[11px] font-bold tracking-[0.12em] opacity-60">REGISTRATIONS</div>
                  <div className="mono text-[28px] font-bold mt-1">{registrations.length}</div>
                  <div className="text-[12px] opacity-60">{registrations.filter(r=>r.status==='pending').length} pending</div>
                </div>
                <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFB000] text-white rounded-[20px] p-5">
                  <div className="text-[11px] font-bold tracking-[0.12em] opacity-80">PROMOTIONS / GALLERY</div>
                  <div className="mono text-[28px] font-bold mt-1">{promotions.length} / {gallery.length}</div>
                  <div className="text-[12px] opacity-80">{promotions.filter(p => p.isActive).length} active</div>
                </div>
              </div>

              <div className="bg-white border border-[#F0D9B5] rounded-[20px] p-6">
                <h3 className="font-bold text-[#1A0F0F]">Quick Actions — Change Status & Dates</h3>
                <p className="text-[13px] text-[#8B7355] mt-1">All changes are dynamic (MongoDB). Public site updates instantly on refresh.</p>
                <div className="mt-4 grid md:grid-cols-3 gap-3 text-[13px]">
                  <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-4">
                    <div className="font-bold text-[#1A0F0F]">Festival Status</div>
                    <div className="mt-1 text-[#8B7355]">Current: <span className="font-bold text-[#1A0F0F]">{settings?.status}</span> • {settings?.startDate ? new Date(settings.startDate).toLocaleDateString('en-IN') : ''} → {settings?.endDate ? new Date(settings.endDate).toLocaleDateString('en-IN') : ''}</div>
                    <button onClick={() => setTab('settings')} className="mt-3 bg-[#1A0F0F] text-white px-4 py-2 rounded-full text-[12px] font-bold">Edit Dates & Status →</button>
                  </div>
                  <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-4">
                    <div className="font-bold text-[#1A0F0F]">Registrations</div>
                    <div className="mt-1 text-[#8B7355]">{registrations.length} total • {registrations.filter(r=>r.type==='volunteer').length} volunteers</div>
                    <button onClick={() => setTab('registrations')} className="mt-3 bg-[#FF6B00] text-white px-4 py-2 rounded-full text-[12px] font-bold">View Registrations →</button>
                  </div>
                  <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-2xl p-4">
                    <div className="font-bold text-[#1A0F0F]">Nimarjanam</div>
                    <div className="mt-1 text-[#8B7355]">Status: <span className="font-bold text-[#1A0F0F]">{nimarjanam?.status}</span> • {nimarjanam?.currentLocation}</div>
                    <button onClick={() => setTab('nimarjanam')} className="mt-3 bg-[#0EA5E9] text-white px-4 py-2 rounded-full text-[12px] font-bold">Update Location →</button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F0D9B5] rounded-[20px] p-6">
                <h3 className="font-bold text-[#1A0F0F]">Recent Registrations</h3>
                <div className="mt-3 space-y-2">
                  {registrations.slice(0,5).map(r=>(
                    <div key={r._id} className="flex items-center justify-between bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]">
                      <span><strong>{r.name}</strong> • {r.type} • {r.phone} • {new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${r.status==='pending'?'bg-amber-100 text-amber-800':r.status==='confirmed'?'bg-emerald-100 text-emerald-800':'bg-zinc-100 text-zinc-600'}`}>{r.status}</span>
                    </div>
                  ))}
                  {registrations.length===0 && <div className="text-[13px] text-[#8B7355]">No registrations yet — submit via website forms.</div>}
                </div>
              </div>
            </div>
          )}

          {tab === 'settings' && settings && (
            <div className="bg-white border border-[#F0D9B5] rounded-[20px] p-6 md:p-7 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">FESTIVAL NAME</span><input value={settings.festivalName || ''} onChange={e => setSettings({ ...settings, festivalName: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" /></label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">TAGLINE</span><input value={settings.tagline || ''} onChange={e => setSettings({ ...settings, tagline: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" /></label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">VENUE</span><input value={settings.venue || ''} onChange={e => setSettings({ ...settings, venue: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" /></label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">STATUS</span>
                  <select value={settings.status || 'upcoming'} onChange={e => setSettings({ ...settings, status: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none">
                    <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option>
                  </select>
                </label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">START DATE</span><input type="date" value={settings.startDate ? new Date(settings.startDate).toISOString().slice(0, 10) : ''} onChange={e => setSettings({ ...settings, startDate: new Date(e.target.value).toISOString() })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">END DATE</span><input type="date" value={settings.endDate ? new Date(settings.endDate).toISOString().slice(0, 10) : ''} onChange={e => setSettings({ ...settings, endDate: new Date(e.target.value).toISOString() })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">NIMARJANAM DATE</span><input type="date" value={settings.nimarjanamDate ? new Date(settings.nimarjanamDate).toISOString().slice(0, 10) : ''} onChange={e => setSettings({ ...settings, nimarjanamDate: new Date(e.target.value).toISOString() })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">CONTACT PHONE</span><input value={settings.contactPhone || ''} onChange={e => setSettings({ ...settings, contactPhone: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">HERO TITLE (Telugu/Sanskrit)</span><input value={settings.heroTitle || ''} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">HERO SUBTITLE</span><input value={settings.heroSubtitle || ''} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">HERO DESCRIPTION</span><textarea value={settings.heroDescription || ''} onChange={e => setSettings({ ...settings, heroDescription: e.target.value })} rows={3} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"> <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">ANNOUNCEMENT MARQUEE</span><input value={settings.announcement || ''} onChange={e => setSettings({ ...settings, announcement: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
              </div>
              <button onClick={saveSettings} disabled={saving} className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-6 py-3 rounded-full font-bold hover:bg-[#E65100] disabled:opacity-60"><Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}</button>
            </div>
          )}

          {tab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-[#8B7355]">Unified timeline — Pran Pratishtha to Nimajjanam. Controls Home → Event Schedule section.</p>
                <button onClick={addSchedule} className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-4 py-2.5 rounded-full text-[13px] font-bold"><Plus size={14} /> Add Event</button>
              </div>
              <div className="grid gap-3">
                {schedule.map(ev=>(
                  <div key={ev._id} className="bg-white border border-[#F0D9B5] rounded-[20px] p-4 flex flex-wrap gap-4 items-start">
                    <div className="flex-1 min-w-[260px]">
                      <input value={ev.title} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,title:e.target.value}:x))} className="font-bold text-[14px] w-full bg-transparent border-b border-transparent focus:border-[#F0D9B5] outline-none" />
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                        <input type="date" value={ev.date ? new Date(ev.date).toISOString().slice(0,10):''} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,date:new Date(e.target.value).toISOString()}:x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]" />
                        <input value={ev.time} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,time:e.target.value}:x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]" placeholder="Time" />
                        <select value={ev.category} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,category:e.target.value}:x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[12px]">
                          <option value="pran_pratishtha">pran_pratishtha</option><option value="daily_pooja">daily_pooja</option><option value="special_pooja">special_pooja</option><option value="aarti">aarti</option><option value="cultural">cultural</option><option value="annadanam">annadanam</option><option value="nimajjanam">nimajjanam</option><option value="other">other</option>
                        </select>
                        <select value={ev.status} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,status:e.target.value}:x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[12px]">
                          <option value="upcoming">upcoming</option><option value="live">live</option><option value="completed">completed</option><option value="cancelled">cancelled</option>
                        </select>
                      </div>
                      <textarea value={ev.description||''} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,description:e.target.value}:x))} rows={2} className="mt-2 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px] outline-none" />
                      <label className="mt-2 flex items-center gap-2 text-[12px] font-semibold"><input type="checkbox" checked={!!ev.isMainEvent} onChange={e=> setSchedule(prev=>prev.map(x=>x._id===ev._id?{...x,isMainEvent:e.target.checked}:x))} /> Main Event (highlighted)</label>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={async()=>{ await api.updateSchedule(ev._id, ev); setMsg('✅ Schedule saved'); setTimeout(()=>setMsg(''),2000);}} className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center"><Save size={14} /></button>
                      <button onClick={()=>deleteSchedule(ev._id)} className="w-9 h-9 rounded-full bg-white border border-red-200 text-red-600 grid place-items-center"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {schedule.length===0 && <div className="text-center py-8 text-[#8B7355] bg-white border border-[#F0D9B5] rounded-2xl">No schedule events — click Add Event.</div>}
              </div>
            </div>
          )}

          {tab === 'pooja' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-[#8B7355]">Change <strong>status</strong> to update indicator on homepage.</p>
                <button onClick={addPooja} className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-4 py-2.5 rounded-full text-[13px] font-bold"><Plus size={14} /> Add Pooja</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {pooja.map(p => (
                  <div key={p._id} className="bg-white border border-[#F0D9B5] rounded-[20px] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <input value={p.title} onChange={e => setPooja(prev => prev.map(x => x._id === p._id ? { ...x, title: e.target.value } : x))} className="w-full font-bold text-[15px] bg-transparent border-b border-transparent focus:border-[#F0D9B5] outline-none" />
                        <div className="flex gap-2 mt-2">
                          <input value={p.time} onChange={e => setPooja(prev => prev.map(x => x._id === p._id ? { ...x, time: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-full px-3 py-1.5 text-[12px] font-semibold w-[120px]" />
                          <input value={p.dayLabel || ''} onChange={e => setPooja(prev => prev.map(x => x._id === p._id ? { ...x, dayLabel: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-full px-3 py-1.5 text-[12px] font-medium flex-1" placeholder="Day label" />
                        </div>
                        <textarea value={p.description || ''} onChange={e => setPooja(prev => prev.map(x => x._id === p._id ? { ...x, description: e.target.value } : x))} rows={2} className="mt-3 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px] outline-none" />
                        <div className="mt-3 flex flex-wrap gap-2">
                          {['upcoming', 'live', 'completed', 'cancelled'].map(s => (
                            <button key={s} onClick={() => updatePoojaStatus(p._id, s)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold capitalize border ${p.status === s ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#8B7355]'}`}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={async () => { await api.updatePooja(p._id, p); setMsg('✅ Pooja saved'); setTimeout(() => setMsg(''), 2000); }} className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center hover:bg-emerald-600"><Save size={14} /></button>
                        <button onClick={() => deletePooja(p._id)} className="w-9 h-9 rounded-full bg-white border border-red-200 text-red-600 grid place-items-center hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#8B7355]">
                      <span className="bg-[#FFF3D4] border border-[#F0D9B5] px-2 py-1 rounded-full">{p.category}</span>
                      {p.isSpecial && <span className="bg-[#FF6B00] text-white px-2 py-1 rounded-full">SPECIAL</span>}
                      <span className="ml-auto mono">{p.icon}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'annadanam' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[13px] text-[#8B7355]">Edit menu, sponsor, counts. Status drives badge on site.</p>
                <button onClick={addAnnadanam} className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-4 py-2.5 rounded-full text-[13px] font-bold"><Plus size={14} /> Add Day</button>
              </div>
              <div className="grid gap-4">
                {annadanam.map(a => (
                  <div key={a._id} className="bg-white border border-[#F0D9B5] rounded-[20px] p-5">
                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="flex-1 min-w-[240px]">
                        <input value={a.dayLabel || ''} onChange={e => setAnnadanam(prev => prev.map(x => x._id === a._id ? { ...x, dayLabel: e.target.value } : x))} className="font-bold text-[15px] w-full bg-transparent border-b border-transparent focus:border-[#F0D9B5] outline-none" />
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <input value={a.time || ''} onChange={e => setAnnadanam(prev => prev.map(x => x._id === a._id ? { ...x, time: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]" placeholder="Time" />
                          <input value={a.sponsor || ''} onChange={e => setAnnadanam(prev => prev.map(x => x._id === a._id ? { ...x, sponsor: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]" placeholder="Sponsor" />
                          <input type="number" value={a.expectedCount || 0} onChange={e => setAnnadanam(prev => prev.map(x => x._id === a._id ? { ...x, expectedCount: Number(e.target.value) } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]" placeholder="Expected" />
                          <select value={a.status} onChange={e => setAnnadanam(prev => prev.map(x => x._id === a._id ? { ...x, status: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]">
                            <option value="scheduled">scheduled</option><option value="preparing">preparing</option><option value="serving">serving</option><option value="completed">completed</option><option value="cancelled">cancelled</option>
                          </select>
                        </div>
                        <div className="mt-3">
                          <div className="text-[11px] font-bold tracking-wide text-[#8B7355]">MENU (comma separated)</div>
                          <input value={(a.menu || []).join(', ')} onChange={e => setAnnadanam(prev => prev.map(x => x._id === a._id ? { ...x, menu: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } : x))} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px]" />
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={async () => { await api.updateAnnadanam(a._id, a); setMsg('✅ Annadanam saved'); setTimeout(() => setMsg(''), 2000); }} className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center"><Save size={14} /></button>
                        <button onClick={() => deleteAnnadanam(a._id)} className="w-9 h-9 rounded-full bg-white border border-red-200 text-red-600 grid place-items-center"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'nimarjanam' && nimarjanam && (
            <div className="bg-white border border-[#F0D9B5] rounded-[20px] p-6 md:p-7 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">TITLE</span><input value={nimarjanam.title || ''} onChange={e => setNimarjanam({ ...nimarjanam, title: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">DATE</span><input type="date" value={nimarjanam.date ? new Date(nimarjanam.date).toISOString().slice(0,10) : ''} onChange={e => setNimarjanam({ ...nimarjanam, date: new Date(e.target.value).toISOString() })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">START TIME</span><input value={nimarjanam.startTime || ''} onChange={e => setNimarjanam({ ...nimarjanam, startTime: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">STATUS</span>
                  <select value={nimarjanam.status} onChange={e => setNimarjanam({ ...nimarjanam, status: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none">
                    <option value="planned">planned</option><option value="preparing">preparing</option><option value="procession">procession</option><option value="immersed">immersed</option><option value="completed">completed</option>
                  </select>
                </label>
                <label className="block"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">CURRENT LOCATION</span><input value={nimarjanam.currentLocation || ''} onChange={e => setNimarjanam({ ...nimarjanam, currentLocation: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" placeholder="e.g., Tank Bund" /></label>
                <label className="block"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">EXPECTED CROWD</span><input value={nimarjanam.expectedCrowd || ''} onChange={e => setNimarjanam({ ...nimarjanam, expectedCrowd: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">ROUTE (comma separated stops)</span><input value={(nimarjanam.route || []).join(', ')} onChange={e => setNimarjanam({ ...nimarjanam, route: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">DESCRIPTION</span><textarea value={nimarjanam.description || ''} onChange={e => setNimarjanam({ ...nimarjanam, description: e.target.value })} rows={3} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" /></label>
                <label className="block md:col-span-2"><span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">LOCATION URL (Google maps share)</span><input value={nimarjanam.liveLocationUrl || ''} onChange={e => setNimarjanam({ ...nimarjanam, liveLocationUrl: e.target.value })} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none font-mono" /></label>
              </div>
              <button onClick={saveNimarjanam} disabled={saving} className="inline-flex items-center gap-2 bg-[#0EA5E9] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0284C7] disabled:opacity-60"><Save size={16} /> {saving ? 'Saving...' : 'Save Nimarjanam'}</button>
            </div>
          )}

          {tab === 'promotions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[13px] text-[#8B7355]">Manage sponsors & events.</p>
                <button onClick={addPromotion} className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-4 py-2.5 rounded-full text-[13px] font-bold"><Plus size={14} /> Add Promotion</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {promotions.map(p => (
                  <div key={p._id} className="bg-white border border-[#F0D9B5] rounded-[20px] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-[160px] object-cover" />
                    <div className="p-4">
                      <input value={p.title} onChange={e => setPromotions(prev => prev.map(x => x._id === p._id ? { ...x, title: e.target.value } : x))} className="font-bold text-[14px] w-full bg-transparent border-b border-transparent focus:border-[#F0D9B5] outline-none" />
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input value={p.brand} onChange={e => setPromotions(prev => prev.map(x => x._id === p._id ? { ...x, brand: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[12px]" placeholder="Brand" />
                        <select value={p.tier} onChange={e => setPromotions(prev => prev.map(x => x._id === p._id ? { ...x, tier: e.target.value } : x))} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[12px]">
                          <option value="title">title</option><option value="platinum">platinum</option><option value="gold">gold</option><option value="silver">silver</option><option value="community">community</option>
                        </select>
                      </div>
                      <textarea value={p.description || ''} onChange={e => setPromotions(prev => prev.map(x => x._id === p._id ? { ...x, description: e.target.value } : x))} rows={2} className="mt-2 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[13px] outline-none" />
                      <input value={p.offer || ''} onChange={e => setPromotions(prev => prev.map(x => x._id === p._id ? { ...x, offer: e.target.value } : x))} placeholder="Offer" className="mt-2 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 text-[12px]" />
                      <label className="mt-2 flex items-center gap-2 text-[12px] font-semibold"><input type="checkbox" checked={!!p.isActive} onChange={e => setPromotions(prev => prev.map(x => x._id === p._id ? { ...x, isActive: e.target.checked } : x))} /> Active</label>
                      <div className="mt-3 flex gap-2">
                        <button onClick={async () => { await api.updatePromotion(p._id, p); setMsg('✅ Promotion saved'); setTimeout(() => setMsg(''), 2000); }} className="flex-1 bg-emerald-500 text-white py-2 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5"><Save size={14} /> Save</button>
                        <button onClick={() => deletePromotion(p._id)} className="px-4 bg-white border border-red-200 text-red-600 rounded-full"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[13px] text-[#8B7355]">Images & videos — add year/category.</p>
                <button onClick={addGallery} className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-4 py-2.5 rounded-full text-[13px] font-bold"><Plus size={14} /> Add Image</button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {gallery.map(g => (
                  <div key={g._id} className="bg-white border border-[#F0D9B5] rounded-[20px] overflow-hidden">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-[180px] object-cover" />
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold truncate">{g.title}</div>
                        <div className="text-[11px] text-[#8B7355]">{g.category} • {g.year}</div>
                      </div>
                      <button onClick={() => deleteGallery(g._id)} className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-600 grid place-items-center"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[12px] font-bold text-[#8B7355] flex items-center gap-1"><Filter size={14} /> Filter:</span>
                {['all','volunteer','annadanam','event_participation','sponsorship','contact'].map(k=>(
                  <button key={k} onClick={()=>setRegFilter(k)} className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize border ${regFilter===k ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#6D071A]'}`}>{k.replace('_',' ')}</button>
                ))}
                <span className="ml-auto text-[12px] font-semibold text-[#8B7355]">{registrations.length} records</span>
              </div>
              <div className="grid gap-3">
                {registrations.map(r=>(
                  <div key={r._id} className="bg-white border border-[#F0D9B5] rounded-[20px] p-4">
                    <div className="flex flex-wrap gap-2 items-start justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${r.type==='volunteer'?'bg-emerald-100 text-emerald-800':r.type==='annadanam'?'bg-amber-100 text-amber-800':r.type==='sponsorship'?'bg-[#FF6B00] text-white':'bg-zinc-100 text-zinc-700'}`}>{r.type.replace('_',' ')}</span>
                          <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${r.status==='pending'?'bg-amber-100 text-amber-800':r.status==='confirmed'?'bg-emerald-100 text-emerald-800':'bg-zinc-100'}`}>{r.status}</span>
                          <span className="text-[11px] text-[#8B7355]">{new Date(r.createdAt).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="font-bold text-[#1A0F0F] mt-2">{r.name} • {r.phone} {r.email && `• ${r.email}`}</div>
                        <div className="text-[13px] text-[#6D071A]/70 mt-1 space-y-1">
                          {r.volunteerActivity && <div>Activity: <b>{r.volunteerActivity}</b> • Available: {(r.availableDates||[]).join(', ')}</div>}
                          {r.annadanamDate && <div>Annadanam: {new Date(r.annadanamDate).toLocaleDateString('en-IN')} • {r.annadanamPersons} persons</div>}
                          {r.eventName && <div>Event: <b>{r.eventName}</b> • Age {r.age} • {r.category}</div>}
                          {r.sponsorshipType && <div>Sponsor: <b>{r.sponsorshipType}</b> • ₹{r.amount} • {r.company}</div>}
                          {r.participants && r.type!=='annadanam' && <div>Participants: {r.participants}</div>}
                          {r.message && <div className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-3 py-2 mt-2">“{r.message}”</div>}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <select value={r.status} onChange={e=>updateRegStatus(r._id, e.target.value)} className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-full px-3 py-2 text-[12px] font-semibold">
                          <option value="pending">pending</option><option value="contacted">contacted</option><option value="confirmed">confirmed</option><option value="cancelled">cancelled</option>
                        </select>
                        <button onClick={()=>deleteReg(r._id)} className="w-9 h-9 rounded-full bg-white border border-red-200 text-red-600 grid place-items-center"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <a href={`tel:${r.phone}`} className="text-[12px] font-bold text-[#0EA5E9]">Call</a>
                      <a href={`https://wa.me/91${r.phone.replace(/\D/g,'').slice(-10)}?text=${encodeURIComponent(`Namaste ${r.name}, regarding your ${r.type} registration for Ganesh Utsav`)}`} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-[#25D366]">WhatsApp</a>
                      {r.email && <a href={`mailto:${r.email}`} className="text-[12px] font-bold text-[#6D071A]">Email</a>}
                    </div>
                  </div>
                ))}
                {registrations.length===0 && <div className="text-center py-12 text-[#8B7355] bg-white border border-[#F0D9B5] rounded-2xl">No registrations yet. Submit forms on website to see them here.</div>}
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-[11px] text-[#8B7355]">All data stored in MongoDB • Changes reflect instantly at <Link to="/" className="font-bold text-[#FF6B00]">/</Link> • QR & WhatsApp sharing enabled ✨</div>
        </div>
      </div>
    </div>
  );
}
