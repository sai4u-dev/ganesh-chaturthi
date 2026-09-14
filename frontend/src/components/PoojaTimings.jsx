import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Filter } from 'lucide-react';
import { statusColor } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function PoojaTimings({ data }) {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'nitya', 'aarti', 'abhishekam', 'special'];

  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filtered = useMemo(() => {
    if (filter === 'all') return safeData;
    return safeData.filter(d => d.category === filter || (filter === 'special' && d.isSpecial));
  }, [safeData, filter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // only animate cards, not header text
      const cards = sectionRef.current?.querySelectorAll('.pooja-card');
      if (!cards || cards.length === 0) return;
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [filtered]);

  return (
    <section ref={sectionRef} id="pooja" className="py-10 md:py-16 bg-white scroll-mt-24 overflow-visible">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Header — fixed layout: stacked on mobile, row on desktop, ensures paragraph always visible */}
        <div className="grid lg:grid-cols-[1.4fr_auto] gap-6 lg:gap-8 items-end mb-8">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FF6B00] mb-2">
              <Sparkles size={14} aria-hidden="true" /> DAILY POOJA & AARTI
            </div>
            <h2 className="display font-[750] text-[30px] sm:text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F] text-balance">
              Pooja Timings
            </h2>
            <p className="mt-3 text-[14px] md:text-[15px] leading-[1.6] text-[#8B7355] max-w-[60ch] text-pretty break-words">
              All timings are IST. Status updated by admin in real-time. Join aarti — free entry for all devotees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8B7355] mr-1">
              <Filter size={14} aria-hidden="true" /> Filter:
            </span>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={`px-4 py-2 rounded-full text-[13px] font-semibold capitalize border transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 ${filter === c ? 'bg-[#1A0F0F] text-white border-[#1A0F0F] shadow-sm' : 'bg-white border-[#F0D9B5] text-[#6D071A]/70 hover:bg-[#FFF3D4] hover:text-[#6D071A]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 min-h-[120px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((p) => (
              <motion.div
                key={p._id || p.title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="pooja-card group relative bg-[#FFF8E7] border border-[#F0D9B5]/70 rounded-[20px] p-5 overflow-hidden hover:shadow-[0_16px_32px_rgba(109,7,26,0.08)] hover:border-[#FFB000]/40 transition-[box-shadow,border-color] flex flex-col"
              >
                {p.isSpecial && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FF6B00] to-[#FFB000] text-white text-[10px] font-bold tracking-[0.12em] px-3 py-1 rounded-bl-xl">SPECIAL</div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-[#F0D9B5] grid place-items-center text-[18px] shadow-sm group-hover:scale-105 transition-transform shrink-0">{p.icon || '🪔'}</div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border text-center leading-none ${statusColor(p.status)}`}>{(p.status || 'upcoming').toUpperCase()}</span>
                </div>

                <h3 className="mt-4 font-bold text-[16px] leading-tight text-[#1A0F0F] text-pretty break-words">{p.title}</h3>
                {p.titleTelugu && <div className="text-[12px] text-[#FF6B00] font-medium mt-0.5 break-words">{p.titleTelugu}</div>}

                <div className="mt-3 inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-3 py-1.5 rounded-full text-[13px] font-bold self-start max-w-full">
                  <Clock size={14} className="text-[#FFB000] shrink-0" /> <span className="truncate">{p.time} {p.endTime ? `— ${p.endTime}` : ''}</span>
                </div>

                <div className="mt-2 text-[12px] font-semibold tracking-wide text-[#8B7355] break-words">{p.dayLabel || 'Daily'} • {p.category}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6D071A]/70 break-words flex-1">{p.description}</p>

                <div className="mt-4 h-[3px] w-full bg-[#F0D9B5]/60 rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-gradient-to-r from-[#FF6B00] to-[#FFB000]" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#8B7355] bg-[#FFF8E7] border border-[#F0D9B5]/60 rounded-2xl mt-4">No poojas in this category.</div>
        )}

        <div className="mt-8 bg-gradient-to-r from-[#6D071A] to-[#1A0F0F] rounded-[20px] p-[1px]">
          <div className="rounded-[19px] bg-gradient-to-br from-[#FFF8E7] to-[#FFF3D4] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-bold text-[#6D071A] text-[15px]">Want to sponsor a pooja?</div>
              <div className="text-[13px] leading-relaxed text-[#8B7355] mt-1">Abhishekam sponsorship includes prasadam + family darshan pass</div>
            </div>
            <a href="tel:+919876543210" className="inline-flex justify-center items-center shrink-0 bg-[#FF6B00] text-white px-6 py-3 rounded-full font-bold text-[13px] hover:bg-[#E65100] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2">Contact Committee →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
