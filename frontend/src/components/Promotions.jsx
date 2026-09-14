import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, BadgeCheck, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Promotions({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.promo-card', {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' }
      });
    }, ref);
    return () => ctx.revert();
  }, [data]);

  const tierStyle = (t) => {
    const m = {
      title: 'bg-gradient-to-r from-[#FF6B00] to-[#FFB000] text-white border-transparent',
      platinum: 'bg-[#1A0F0F] text-white border-[#1A0F0F]',
      gold: 'bg-[#FFB000] text-[#1A0F0F] border-[#FFB000]',
      silver: 'bg-white text-[#6D071A] border-[#F0D9B5]',
      community: 'bg-[#E6F7FF] text-[#0369A1] border-[#BAE6FD]',
    };
    return m[t] || m.gold;
  };

  return (
    <section ref={ref} id="promotions" className="py-10 md:py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FF6B00]"><Star size={14} /> SPONSORS • PARTNERS • STALLS</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F] mt-2">Promotions & Events</h2>
            <p className="mt-3 text-[14px] text-[#8B7355] max-w-[560px]">Proudly supported by Hyderabad’s finest. Festive offers, cultural nights, and food stalls — powered by our sponsors.</p>
          </div>
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-5 py-3 rounded-full text-[13px] font-bold">Become a Sponsor <ArrowRight size={14} /></a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.map((p) => (
            <div key={p._id} className="promo-card group bg-[#FFF8E7] border border-[#F0D9B5]/70 rounded-[24px] overflow-hidden hover:shadow-[0_16px_40px_rgba(109,7,26,0.10)] hover:border-[#FFB000]/30 transition-all flex flex-col">
              <div className="relative h-[190px] overflow-hidden bg-zinc-100">
                <img src={p.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] border ${tierStyle(p.tier)}`}>{(p.tier || 'gold').toUpperCase()}</span>
                  {p.isFeatured && <span className="bg-white/95 backdrop-blur text-[#1A0F0F] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Sparkles size={12} className="text-[#FF6B00]" /> FEATURED</span>}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-2 border border-white/60">
                    <div className="w-8 h-8 rounded-full bg-[#1A0F0F] grid place-items-center text-white text-[11px] font-bold">{p.brand?.[0] || 'S'}</div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold tracking-wide text-[#8B7355] leading-none">{p.category?.toUpperCase()}</div>
                      <div className="text-[13px] font-bold text-[#1A0F0F] leading-none truncate">{p.brand}</div>
                    </div>
                    <BadgeCheck size={16} className="ml-auto text-emerald-600 shrink-0" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[16px] leading-tight text-[#1A0F0F]">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6D071A]/70 line-clamp-2">{p.description}</p>

                {p.offer && (
                  <div className="mt-3 bg-gradient-to-r from-[#FF6B00]/10 to-[#FFB000]/10 border border-[#FFB000]/20 rounded-2xl px-3 py-2.5">
                    <div className="text-[11px] font-bold tracking-[0.12em] text-[#FF6B00]">OFFER</div>
                    <div className="text-[13px] font-semibold text-[#1A0F0F] leading-tight">{p.offer}</div>
                  </div>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.12em] text-[#8B7355]">VALID {p.validFrom ? new Date(p.validFrom).toLocaleDateString('en-IN') : 'Sep 14-24'}</span>
                  <a href={p.ctaLink || '#'} className="inline-flex items-center gap-1.5 bg-[#1A0F0F] text-white px-4 py-2 rounded-full text-[12px] font-bold hover:bg-black transition-colors">
                    {p.ctaText || 'Know More'} <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sponsors marquee */}
        <div className="mt-10 bg-[#1A0F0F] rounded-[20px] overflow-hidden border border-white/10">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
            <div className="text-[11px] font-bold tracking-[0.14em] text-[#FFB000]">TRUSTED BY</div>
            <div className="h-px flex-1 bg-white/10" />
            <div className="text-[11px] font-semibold text-white/60">Title • Platinum • Gold Partners</div>
          </div>
          <div className="py-4 marquee-track">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8">
                {['Malabar Gold', 'Kowshik Foundation', 'Pixel Lens', 'Utsav Events', 'Shri Balaji Jewellers', 'Hyderabad Devotees', 'Telangana Tourism'].map(brand => (
                  <span key={brand + dup} className="whitespace-nowrap mono text-[13px] font-bold tracking-[0.08em] text-white/80 border border-white/10 rounded-full px-4 py-2 bg-white/5">✦ {brand}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
