import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Utensils, MapPin, Users, Clock, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { statusColor } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function AnnadanamSection({ data }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.annadanam-head', {
        y: 30, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  if (!data?.length) return null;

  const current = data[idx] || data[0];

  return (
    <section ref={ref} id="annadanam" className="py-10 md:py-16 bg-[#1A0F0F] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6D071A]/40 via-transparent to-[#FF6B00]/10" />
        <div className="absolute -top-[30%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#FF6B00]/10 blur-[80px]" />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="annadanam-head flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FFB000]"><Heart size={14} className="fill-[#FFB000]" /> ANNA DANAM • MAHA PRASADAM</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-white mt-2">Annadanam</h2>
            <p className="mt-3 text-[14px] text-white/60 max-w-[560px]">Free meals for every devotee, every day. No one leaves hungry — Bappa’s prasadam is for all. Sponsored by devotees & local businesses.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 grid place-items-center text-white hover:bg-white hover:text-[#1A0F0F] transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={() => setIdx(i => Math.min(data.length - 1, i + 1))} className="w-10 h-10 rounded-full bg-white text-[#1A0F0F] grid place-items-center hover:bg-[#FFB000] transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
          {/* Main card */}
          <div className="bg-[#FFF8E7] rounded-[24px] p-6 md:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-gradient-to-br from-[#FFB000]/15 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide border ${statusColor(current.status)}`}>{(current.status || 'scheduled').toUpperCase()}</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8B7355]"><Clock size={14} /> {current.time}</span>
              {current.isTodaySpecial && <span className="bg-[#FF6B00] text-white px-3 py-1 rounded-full text-[11px] font-bold">TODAY SPECIAL</span>}
            </div>

            <h3 className="display font-bold text-[24px] md:text-[28px] leading-none tracking-[-0.02em] text-[#1A0F0F]">{current.dayLabel}</h3>
            <div className="mt-1 inline-flex items-center gap-2 text-[13px] font-semibold text-[#6D071A] bg-[#FFF3D4] border border-[#F0D9B5] px-3 py-1 rounded-full">
              <Utensils size={14} className="text-[#FF6B00]" /> {current.mealType?.toUpperCase() || 'LUNCH'} • {current.venue}
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-bold tracking-[0.14em] text-[#8B7355] mb-2">TODAY’S MENU</div>
              <div className="flex flex-wrap gap-2">
                {(current.menu || []).map((m, i) => (
                  <span key={i} className="bg-white border border-[#F0D9B5] px-3 py-2 rounded-full text-[13px] font-semibold text-[#1A0F0F] shadow-sm">🍛 {m}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-[#1A0F0F] text-white rounded-2xl p-4">
                <div className="text-[11px] tracking-[0.12em] font-bold opacity-60">EXPECTED</div>
                <div className="mono text-[22px] font-bold leading-none mt-1">{(current.expectedCount || 8000).toLocaleString('en-IN')}</div>
                <div className="text-[11px] opacity-60">Devotees</div>
              </div>
              <div className="bg-white border border-[#F0D9B5] rounded-2xl p-4">
                <div className="text-[11px] tracking-[0.12em] font-bold text-[#8B7355]">SERVED</div>
                <div className="mono text-[22px] font-bold leading-none mt-1 text-[#1A0F0F]">{(current.servedCount || 0).toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-[#8B7355]">Today</div>
              </div>
              <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFB000] text-white rounded-2xl p-4">
                <div className="text-[11px] tracking-[0.12em] font-bold opacity-80">SPONSOR</div>
                <div className="text-[13px] font-bold leading-tight mt-1 line-clamp-2">{current.sponsor || 'Devotees'}</div>
                <div className="text-[11px] opacity-80 mt-1">Dhanyavad</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {data.map((d, i) => (
                <button
                  key={d._id || i}
                  onClick={() => setIdx(i)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${idx === i ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#6D071A]/70 hover:bg-[#FFF3D4]'}`}
                >
                  {d.dayLabel?.split('—')[0]?.trim() || `Day ${i+1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Side info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-[24px] p-6 text-white">
              <div className="w-10 h-10 rounded-2xl bg-[#FFB000] grid place-items-center text-[#1A0F0F] text-[18px]">🙏</div>
              <h4 className="mt-4 font-bold text-[18px] leading-tight">Want to sponsor Annadanam?</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-white/70">Sponsor a day’s meals and receive special pooja prasadam + name displayed at mandapam. From ₹21,000 for 500 plates to Maha Annadanam for 10,000+.</p>
              <a href="tel:+919876543210" className="mt-4 inline-flex items-center gap-2 bg-white text-[#1A0F0F] px-5 py-3 rounded-full text-[13px] font-bold hover:bg-[#FFF3D4] transition-colors">Donate Annadanam →</a>
            </div>

            <div className="bg-[#FFF8E7] rounded-[24px] p-5 flex-1">
              <div className="text-[11px] font-bold tracking-[0.14em] text-[#8B7355]">VENUE & TIMINGS</div>
              <div className="mt-3 space-y-3 text-[13px]">
                <div className="flex gap-3"><MapPin size={16} className="text-[#FF6B00] mt-0.5 shrink-0" /><span className="font-medium text-[#1A0F0F]">{current.venue || 'Annadanam Mandapam, Khairatabad'}<br /><span className="text-[#8B7355] font-normal">Opposite Temple, Next to Queue Complex</span></span></div>
                <div className="flex gap-3"><Clock size={16} className="text-[#FF6B00] mt-0.5 shrink-0" /><span className="font-medium text-[#1A0F0F]">12:00 PM — 3:00 PM Daily<br /><span className="text-[#8B7355] font-normal">Tokens from 11 AM • First come, first served</span></span></div>
                <div className="flex gap-3"><Users size={16} className="text-[#FF6B00] mt-0.5 shrink-0" /><span className="font-medium text-[#1A0F0F]">All are welcome — No pass needed<br /><span className="text-[#8B7355] font-normal">Separate queue for women & elderly</span></span></div>
              </div>
              <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600" alt="annadanam" className="mt-4 w-full h-[160px] object-cover rounded-2xl border border-[#F0D9B5]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
