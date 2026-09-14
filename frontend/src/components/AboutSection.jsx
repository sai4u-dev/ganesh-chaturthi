import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Award, Users, Calendar, Ruler } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);

export default function AboutSection({ t, settings }) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-card', {
        y: 28, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about" className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #6D071A 1px, transparent 0)`, backgroundSize: '26px 26px' }} />
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FF6B00]"><Sparkles size={14} /> {t('about.subtitle')}</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F] mt-2">{t('about.title')}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6D071A]/75">{t('about.p1')}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#8B7355]">{t('about.p2')}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Award, v: '70+', l: t('about.statsYears') },
                { icon: Ruler, v: '70 FT', l: t('about.statsHeight') },
                { icon: Users, v: '15L+', l: t('about.statsDevotees') },
                { icon: Calendar, v: '11', l: t('about.statsDays') },
              ].map(s => (
                <div key={s.l} className="about-card bg-[#FFF8E7] border border-[#F0D9B5]/70 rounded-2xl p-4 text-center">
                  <s.icon size={18} className="mx-auto text-[#FF6B00]" />
                  <div className="mono font-bold text-[18px] text-[#1A0F0F] mt-1">{s.v}</div>
                  <div className="text-[11px] font-semibold tracking-wide text-[#8B7355] leading-tight">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="about-card mt-6 bg-gradient-to-r from-[#6D071A] to-[#1A0F0F] rounded-2xl p-[1px]">
              <div className="rounded-[15px] bg-white px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
                <div className="text-[13px]"><span className="font-bold text-[#6D071A]">📍 {settings?.venue}</span> <span className="text-[#8B7355]">• {settings?.startDate ? new Date(settings.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : 'Sep 14'} — {settings?.endDate ? new Date(settings.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Sep 24, 2026'}</span></div>
                <span className="text-[11px] font-bold tracking-wide bg-[#FFB000] text-[#1A0F0F] px-3 py-1 rounded-full">FREE DARSHAN FOR ALL</span>
              </div>
            </div>
          </div>

          <div className="about-card relative">
            <div className="rounded-[24px] overflow-hidden border border-[#F0D9B5] shadow-[0_20px_60px_rgba(109,7,26,0.12)]">
              <img src="https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800" alt="Khairatabad Ganesh idol making" className="w-full h-[380px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-[24px]" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-2xl p-4 border border-white/60">
                <div className="text-[11px] font-bold tracking-[0.12em] text-[#FF6B00]">DID YOU KNOW?</div>
                <div className="text-[13px] font-semibold text-[#1A0F0F] leading-tight mt-1">Khairatabad Ganesh started in 1954 with a 1-ft idol. Today it’s India’s tallest — made with eco-friendly clay.</div>
              </div>
            </div>
            {/* floating mini cards */}
            <div className="hidden md:block absolute -top-4 -right-4 bg-white border border-[#F0D9B5] rounded-2xl px-4 py-3 shadow-lg rotate-[-2deg]">
              <div className="text-[11px] font-bold tracking-wide text-[#8B7355]">DARSHAN TIME</div>
              <div className="font-bold text-[#1A0F0F]">5:30 AM — 11 PM</div>
              <div className="text-[11px] text-emerald-600 font-semibold">● Open Daily</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
