import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin, Sparkles, Filter } from 'lucide-react';
import { statusColor } from '../lib/utils';
gsap.registerPlugin(ScrollTrigger);

const categoryMeta = {
  pran_pratishtha: { label: 'Pran Pratishtha', color: 'bg-[#6D071A] text-white' },
  daily_pooja: { label: 'Daily Pooja', color: 'bg-[#FF6B00] text-white' },
  special_pooja: { label: 'Special Pooja', color: 'bg-[#FFB000] text-[#1A0F0F]' },
  aarti: { label: 'Aarti', color: 'bg-amber-600 text-white' },
  cultural: { label: 'Cultural', color: 'bg-violet-600 text-white' },
  annadanam: { label: 'Annadanam', color: 'bg-emerald-600 text-white' },
  nimajjanam: { label: 'Nimajjanam', color: 'bg-[#0EA5E9] text-white' },
  other: { label: 'Other', color: 'bg-zinc-600 text-white' },
};

export default function ScheduleSection({ data, t }) {
  const ref = useRef(null);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('timeline'); // timeline | calendar

  const filtered = useMemo(() => {
    if (filter === 'all') return data || [];
    return (data || []).filter(d => d.category === filter);
  }, [data, filter]);

  // group by date for calendar
  const grouped = useMemo(() => {
    const m = {};
    filtered.forEach(d => {
      const key = d.date ? new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short', year: 'numeric' }) : 'TBA';
      if (!m[key]) m[key] = [];
      m[key].push(d);
    });
    return Object.entries(m);
  }, [filtered]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.schedule-item', {
        y: 20, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
    }, ref);
    return () => ctx.revert();
  }, [filtered, view]);

  const cats = ['all', 'pran_pratishtha', 'daily_pooja', 'special_pooja', 'cultural', 'annadanam', 'nimajjanam'];

  return (
    <section ref={ref} id="schedule" className="py-12 md:py-16 bg-[#FFF8E7] border-y border-[#F0D9B5]/60">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FF6B00]"><Calendar size={14} /> TIMELINE FORMAT</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F]">{t('schedule.title')}</h2>
            <p className="mt-2 text-[14px] text-[#8B7355] max-w-[560px]">{t('schedule.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#F0D9B5] rounded-full p-1">
            <button onClick={() => setView('timeline')} className={`px-4 py-2 rounded-full text-[13px] font-bold ${view === 'timeline' ? 'bg-[#1A0F0F] text-white' : 'text-[#8B7355]'}`}>{t('schedule.viewTimeline')}</button>
            <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-full text-[13px] font-bold ${view === 'calendar' ? 'bg-[#1A0F0F] text-white' : 'text-[#8B7355]'}`}>{t('schedule.viewCalendar')}</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8B7355] mr-1"><Filter size={14} /> Filter:</span>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3.5 py-2 rounded-full text-[12px] font-semibold capitalize border ${filter === c ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#6D071A]/70'}`}>
              {(t(`schedule.categories.${c}`) || c).replace('_', ' ')}
            </button>
          ))}
        </div>

        {view === 'timeline' ? (
          <div className="relative">
            <div className="absolute left-[18px] md:left-1/2 md:-translate-x-px top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#FF6B00] via-[#F0D9B5] to-transparent hidden md:block" />
            <div className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-[#F0D9B5] md:hidden" />
            <div className="space-y-4">
              {filtered.map((ev, idx) => {
                const isEven = idx % 2 === 0;
                const meta = categoryMeta[ev.category] || categoryMeta.other;
                return (
                  <div key={ev._id || idx} className={`schedule-item relative flex gap-4 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* dot */}
                    <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-6 w-[18px] h-[18px] rounded-full bg-white border-[3px] border-[#FF6B00] shadow-[0_0_0_4px_rgba(255,107,0,0.15)] z-10">
                      {ev.isMainEvent && <span className="absolute inset-[3px] rounded-full bg-[#FF6B00] animate-pulse" />}
                    </div>

                    <div className={`ml-10 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
                      <div className={`bg-white border rounded-[20px] p-5 hover:shadow-[0_12px_32px_rgba(109,7,26,0.08)] hover:border-[#FFB000]/40 transition-all ${ev.isMainEvent ? 'border-[#FFB000] shadow-[0_8px_24px_rgba(255,176,0,0.15)]' : 'border-[#F0D9B5]/70'}`}>
                        {ev.isMainEvent && <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FFB000] text-white text-[10px] font-bold tracking-[0.12em] px-2.5 py-1 rounded-full mb-3"><Sparkles size={12} /> MAIN EVENT</div>}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${meta.color}`}>{meta.label}</span>
                          <span className={`px-2 py-1 rounded-full text-[11px] font-bold border ${statusColor(ev.status)}`}>{(ev.status || 'upcoming').toUpperCase()}</span>
                        </div>
                        <h3 className="font-bold text-[16px] leading-tight text-[#1A0F0F] flex items-start gap-2"><span className="text-[18px] leading-none mt-0.5">{ev.icon}</span><span>{ev.title}<br />{ev.titleTelugu && <span className="text-[#FF6B00] font-medium text-[13px]">{ev.titleTelugu}</span>}</span></h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-[#6D071A]/70">{ev.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold">
                          <span className="inline-flex items-center gap-1.5 bg-[#1A0F0F] text-white px-3 py-1.5 rounded-full"><Clock size={12} className="text-[#FFB000]" /> {ev.time}{ev.endTime ? ` — ${ev.endTime}` : ''}</span>
                          <span className="inline-flex items-center gap-1.5 bg-[#FFF3D4] border border-[#F0D9B5] px-3 py-1.5 rounded-full text-[#6D071A]"><Calendar size={12} /> {ev.date ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBA'}</span>
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8B7355]"><MapPin size={12} /> {ev.venue}</div>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
            {filtered.length === 0 && <div className="text-center py-12 text-[#8B7355] bg-white border border-[#F0D9B5] rounded-2xl mt-4">No events in this category.</div>}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped.map(([dateLabel, events]) => (
              <div key={dateLabel} className="schedule-item bg-white border border-[#F0D9B5]/70 rounded-[20px] overflow-hidden">
                <div className="bg-[#1A0F0F] text-white px-4 py-3 flex items-center gap-2">
                  <Calendar size={14} className="text-[#FFB000]" />
                  <span className="font-bold text-[13px]">{dateLabel}</span>
                  <span className="ml-auto bg-white/15 px-2 py-0.5 rounded-full text-[11px] font-bold">{events.length} events</span>
                </div>
                <div className="p-3 space-y-3">
                  {events.map(ev => (
                    <div key={ev._id} className={`rounded-2xl p-3 border ${ev.isMainEvent ? 'bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] border-[#FFB000]/40' : 'bg-[#FFF8E7]/60 border-[#F0D9B5]/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px]">{ev.icon}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryMeta[ev.category]?.color || categoryMeta.other.color}`}>{categoryMeta[ev.category]?.label || ev.category}</span>
                        {ev.isMainEvent && <Sparkles size={12} className="text-[#FF6B00]" />}
                      </div>
                      <div className="font-bold text-[13px] leading-tight text-[#1A0F0F]">{ev.title}</div>
                      <div className="inline-flex items-center gap-1.5 bg-[#1A0F0F] text-white px-2.5 py-1 rounded-full text-[11px] font-bold mt-2"><Clock size={10} /> {ev.time}</div>
                      <div className="text-[11px] text-[#8B7355] mt-1 line-clamp-2">{ev.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
