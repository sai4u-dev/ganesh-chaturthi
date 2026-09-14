import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Utensils, CalendarDays, HeartHandshake, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

const FORMS = [
  { key: 'volunteer', label: 'Volunteer', icon: Users, desc: 'Seva for Bappa' },
  { key: 'annadanam', label: 'Annadanam', icon: Utensils, desc: 'Donate / Register meals' },
  { key: 'event_participation', label: 'Event Participation', icon: CalendarDays, desc: 'Cultural programs' },
  { key: 'sponsorship', label: 'Sponsorship', icon: HeartHandshake, desc: 'Donate / Sponsor' },
  { key: 'contact', label: 'Contact', icon: Mail, desc: 'Ask us anything' },
];

export default function RegistrationSection({ t }) {
  const [active, setActive] = useState('volunteer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // {type: 'success'|'error', msg}
  const [form, setForm] = useState({
    name: '', phone: '', email: '', participants: 1, message: '',
    volunteerActivity: '', availableDates: '',
    annadanamDate: '', annadanamPersons: '',
    eventName: '', age: '', category: '',
    sponsorshipType: '', amount: '', company: ''
  });

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!form.name || !form.phone) { setResult({ type: 'error', msg: t('forms.error') }); return; }
    setLoading(true);
    try {
      const payload = {
        type: active,
        name: form.name, phone: form.phone, email: form.email,
        participants: Number(form.participants) || 1,
        message: form.message,
        volunteerActivity: form.volunteerActivity,
        availableDates: form.availableDates ? form.availableDates.split(',').map(s => s.trim()) : [],
        annadanamDate: form.annadanamDate ? new Date(form.annadanamDate) : undefined,
        annadanamPersons: form.annadanamPersons ? Number(form.annadanamPersons) : undefined,
        eventName: form.eventName, age: form.age ? Number(form.age) : undefined, category: form.category,
        sponsorshipType: form.sponsorshipType, amount: form.amount, company: form.company,
      };
      await api.submitRegistration(payload);
      setResult({ type: 'success', msg: t('forms.success') });
      setForm({ name: '', phone: '', email: '', participants: 1, message: '', volunteerActivity: '', availableDates: '', annadanamDate: '', annadanamPersons: '', eventName: '', age: '', category: '', sponsorshipType: '', amount: '', company: '' });
      setTimeout(() => setResult(null), 5000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed. Try again.';
      // fallback to local success if API offline (demo mode)
      if (msg.includes('Network Error') || msg.includes('timeout')) {
        setResult({ type: 'success', msg: t('forms.success') + ' (demo mode — backend offline, data not saved)' });
      } else {
        setResult({ type: 'error', msg });
      }
    } finally { setLoading(false); }
  };

  return (
    <section id="register" className="py-12 md:py-16 bg-[#FFF8E7] border-y border-[#F0D9B5]/60">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-[#F0D9B5] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em] text-[#FF6B00]">REGISTRATION FORMS • ALL DYNAMIC</div>
          <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F] mt-3">{t('forms.title')}</h2>
          <p className="mt-3 text-[14px] text-[#8B7355]">{t('forms.subtitle')}</p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FORMS.map(f => (
            <button
              key={f.key}
              onClick={() => { setActive(f.key); setResult(null); }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold border transition-all ${active === f.key ? 'bg-[#1A0F0F] text-white border-[#1A0F0F] shadow-lg' : 'bg-white border-[#F0D9B5] text-[#6D071A]/70 hover:bg-[#FFF3D4]'}`}
            >
              <f.icon size={14} /> {t(`forms.${f.key === 'event_participation' ? 'event' : f.key === 'sponsorship' ? 'sponsorship' : f.key}`) || f.label}
            </button>
          ))}
        </div>

        <div className="mt-6 max-w-[880px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.form
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="bg-white border border-[#F0D9B5]/70 rounded-[24px] p-6 md:p-7 shadow-[0_16px_40px_rgba(109,7,26,0.06)]"
            >
              <div className="flex items-center gap-3 mb-5">
                {(() => { const C = FORMS.find(f => f.key === active)?.icon || Users; return <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white grid place-items-center"><C size={18} /></div>; })()}
                <div>
                  <div className="font-bold text-[#1A0F0F]">{FORMS.find(f => f.key === active)?.label} Form</div>
                  <div className="text-[12px] text-[#8B7355]">{FORMS.find(f => f.key === active)?.desc} • All fields saved to MongoDB, visible in Admin → Registrations</div>
                </div>
              </div>

              {/* honeypot hidden */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" onChange={() => {}} />

              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">{t('forms.name')} *</span>
                  <input required value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="Full name" className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">{t('forms.phone')} *</span>
                  <input required value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">{t('forms.email')}</span>
                  <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="you@example.com" className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">{t('forms.participants')}</span>
                  <input type="number" min={1} value={form.participants} onChange={e => handleChange('participants', e.target.value)} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                </label>

                {/* Conditional fields */}
                {active === 'volunteer' && (
                  <>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">{t('forms.activity')}</span>
                      <select value={form.volunteerActivity} onChange={e => handleChange('volunteerActivity', e.target.value)} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none">
                        <option value="">Select activity</option>
                        <option value="pooja_assistance">Pooja Assistance</option>
                        <option value="annadanam_service">Annadanam Service</option>
                        <option value="crowd_management">Crowd Management</option>
                        <option value="decoration">Decoration</option>
                        <option value="cultural_coordination">Cultural Coordination</option>
                        <option value="nimajjanam_help">Nimajjanam Help</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Available Dates (comma separated)</span>
                      <input value={form.availableDates} onChange={e => handleChange('availableDates', e.target.value)} placeholder="Sep 14, Sep 15..." className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                    </label>
                  </>
                )}

                {active === 'annadanam' && (
                  <>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Preferred Date</span>
                      <input type="date" value={form.annadanamDate} onChange={e => handleChange('annadanamDate', e.target.value)} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Persons / Plates</span>
                      <input type="number" value={form.annadanamPersons} onChange={e => handleChange('annadanamPersons', e.target.value)} placeholder="e.g., 50" className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                    </label>
                  </>
                )}

                {active === 'event_participation' && (
                  <>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Event Name</span>
                      <input value={form.eventName} onChange={e => handleChange('eventName', e.target.value)} placeholder="Dance, Singing, Drama..." className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Age / Category</span>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        <input type="number" value={form.age} onChange={e => handleChange('age', e.target.value)} placeholder="Age" className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                        <input value={form.category} onChange={e => handleChange('category', e.target.value)} placeholder="Solo/Group" className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                      </div>
                    </label>
                  </>
                )}

                {active === 'sponsorship' && (
                  <>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Sponsorship Type</span>
                      <select value={form.sponsorshipType} onChange={e => handleChange('sponsorshipType', e.target.value)} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none">
                        <option value="">Select</option>
                        <option value="title_sponsor">Title Sponsor</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="annadanam_sponsor">Annadanam Sponsor</option>
                        <option value="pooja_sponsor">Pooja Sponsor</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">Amount / Company</span>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        <input value={form.amount} onChange={e => handleChange('amount', e.target.value)} placeholder="₹ Amount" className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                        <input value={form.company} onChange={e => handleChange('company', e.target.value)} placeholder="Company/Name" className="bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none" />
                      </div>
                    </label>
                  </>
                )}

                <label className="block md:col-span-2">
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#6D071A]">{t('forms.message')}</span>
                  <textarea value={form.message} onChange={e => handleChange('message', e.target.value)} rows={3} placeholder={active === 'contact' ? 'How can we help you?' : 'Any special instructions or details...'} className="mt-1 w-full bg-[#FFF8E7] border border-[#F0D9B5] rounded-xl px-4 py-3 text-[14px] outline-none focus:bg-white focus:border-[#FF6B00]" />
                </label>
              </div>

              {result && (
                <div className={`mt-4 flex items-start gap-2 px-4 py-3 rounded-2xl text-[13px] font-medium border ${result.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {result.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />} <span>{result.msg}</span>
                </div>
              )}

              <button disabled={loading} className="mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#FF6B00] text-white px-8 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#E65100] disabled:opacity-60 transition-colors">
                <Send size={16} /> {loading ? 'Submitting...' : t('forms.submit')}
              </button>

              <div className="mt-4 text-[11px] text-[#8B7355]">By submitting, you agree to be contacted by organizers. Your data is securely stored in MongoDB and visible only to admins.</div>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
