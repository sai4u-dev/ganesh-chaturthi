import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, MapPin, Calendar, ArrowRight, Sparkles, Clock3 } from 'lucide-react';
import { formatDate } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ settings, t = (k) => k }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const targetDate = settings?.startDate ? new Date(settings.startDate) : new Date('2026-09-14');
    const tick = () => {
      const now = Date.now();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) { setCountdown({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setCountdown({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [settings?.startDate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on hero image
      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // Title reveal
      gsap.from('.hero-line', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        delay: 0.3,
      });

      // Floating modaks
      gsap.to('.float-a', { y: -12, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.float-b', { y: -18, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.4 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="home" className="relative overflow-hidden bg-[#FFF8E7]">
      {/* decorative bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#FFB000]/20 via-[#FF6B00]/10 to-transparent blur-[80px]" />
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#6D071A]/10 to-transparent blur-[60px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #6D071A 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-12">
        {/* top meta bar */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[11px] md:text-[12px] font-semibold tracking-wide mb-6">
          <span className="inline-flex items-center gap-2 bg-white border border-[#F0D9B5] px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {settings?.status === 'live' ? 'LIVE NOW — Darshan Open' : 'UPCOMING • Sep 14-24, 2026'}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-[#FFF3D4] border border-[#FFB000]/30 px-3 py-1.5 rounded-full text-[#6D071A]">
            <Calendar size={12} /> {formatDate(settings?.startDate)} — {formatDate(settings?.endDate)}
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 bg-[#FFF3D4] border border-[#F0D9B5] px-3 py-1.5 rounded-full text-[#8B7355]">
            <MapPin size={12} /> Hyderabad • Khairatabad
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.16em] text-[#FF6B00] mb-3">
              <Sparkles size={14} /> 70TH YEAR • EKADASHA RUDRA AVATAR
            </div>

            <h1 ref={titleRef} className="display font-[800] leading-[0.9] tracking-[-0.04em] text-[#1A0F0F]">
              <span className="hero-line block text-[42px] md:text-[64px] lg:text-[74px]">{settings?.heroTitle?.split(' ')[0] || '॥ Ganpati'}</span>
              <span className="hero-line block text-[42px] md:text-[64px] lg:text-[74px] bg-gradient-to-r from-[#FF6B00] via-[#6D071A] to-[#FF6B00] bg-clip-text text-transparent">Bappa Morya ॥</span>
              <span className="hero-line block mt-3 text-[18px] md:text-[22px] font-semibold tracking-[-0.02em] text-[#6D071A]/80">70 Feet Maha Ganesh — Hyderabad’s Divine Icon</span>
            </h1>

            <p className="hero-line mt-5 text-[16px] md:text-[18px] leading-relaxed text-[#8B7355] max-w-[560px] text-balance">
              {settings?.heroDescription || 'Experience the divine grandeur where devotion meets art. 11 days of pooja, annadanam, and cultural ecstasy at Khairatabad.'}
            </p>
            <div className="hero-line mt-3 bg-[#FFF3D4] border border-[#F0D9B5] rounded-2xl p-3 max-w-[560px]">
              <div className="text-[13px] font-medium leading-relaxed text-[#6D071A]">🙏 {t('hero.invitationLine') || 'You and your family are warmly invited to celebrate Ganesh Chaturthi with us and seek the blessings of Lord Ganesha.'}</div>
            </div>

            {/* Countdown - Awwwards style */}
            <div className="hero-line mt-7">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-[#6D071A] mb-3"><Clock3 size={14} className="text-[#FF6B00]" /> {String(t('hero.countdownTo') || 'COUNTDOWN TO AGAMANAM').toUpperCase()}</div>
              <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-[440px]">
                {[
                  { label: 'Days', value: String(countdown.d).padStart(2, '0') },
                  { label: 'Hours', value: String(countdown.h).padStart(2, '0') },
                  { label: 'Mins', value: String(countdown.m).padStart(2, '0') },
                  { label: 'Secs', value: String(countdown.s).padStart(2, '0') },
                ].map(k => (
                  <div key={k.label} className="bg-[#1A0F0F] text-[#FFF8E7] rounded-[18px] md:rounded-[20px] p-3 md:p-4 text-center border border-white/10 shadow-xl">
                    <div className="mono text-[28px] md:text-[36px] font-bold leading-none tracking-[-0.04em]">{k.value}</div>
                    <div className="text-[10px] tracking-[0.18em] font-semibold opacity-60 mt-1">{k.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-line mt-7 flex flex-wrap gap-3">
              <a href="#pooja" className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-6 py-[14px] rounded-full font-bold text-[14px] hover:bg-[#E65100] transition-colors shadow-[0_12px_24px_rgba(255,107,0,0.3)]">
                {t('hero.ctaPooja') || 'View Pooja Timings'} <ArrowRight size={16} />
              </a>
              <a href="#annadanam" className="inline-flex items-center gap-2 bg-white border border-[#F0D9B5] px-6 py-[14px] rounded-full font-bold text-[14px] text-[#1A0F0F] hover:bg-[#FFF3D4] transition-colors">
                <Play size={16} className="fill-[#FF6B00] text-[#FF6B00]" /> {t('hero.ctaAnnadanam') || 'Annadanam Schedule'}
              </a>
            </div>

            {/* stats strip */}
            <div className="hero-line mt-8 grid grid-cols-3 gap-3 max-w-[560px]">
              {[
                { v: '70 FT', l: 'Maha Ganesh Height' },
                { v: '11 DAYS', l: 'Utsav Duration' },
                { v: '15 L+', l: 'Devotees Expected' },
              ].map(s => (
                <div key={s.v} className="bg-white border border-[#F0D9B5]/70 rounded-2xl p-4">
                  <div className="display font-bold text-[18px] text-[#6D071A]">{s.v}</div>
                  <div className="text-[11px] font-semibold tracking-wide text-[#8B7355] leading-tight mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative lg:sticky lg:top-[88px]">
            <div ref={imageRef} className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#6D071A] via-[#8B1A2B] to-[#1A0F0F] p-[1px] shadow-[0_24px_64px_rgba(109,7,26,0.25)]">
              <div className="rounded-[27px] overflow-hidden bg-[#FFF8E7] relative">
                <img
                  src="https://i.pinimg.com/1200x/7b/61/0f/7b610f30b15efe1b1986ced114cfe2bb.jpg"
                  alt="Ganesh Idol"
                  className="w-full h-[420px] md:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0F]/70 via-transparent to-transparent" />
                {/* floating badge */}
                <div className="float-a absolute top-4 left-4 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl border border-white/60">
                  <div className="text-[11px] font-bold tracking-[0.14em] text-[#FF6B00]">DARSHAN TIMINGS</div>
                  <div className="text-[12px] font-semibold text-[#1A0F0F]">Khairatabad Temple • 5:30 AM - 11 PM</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Open for Darshan</div>
                </div>
                <div className="float-b absolute bottom-4 right-4 left-4 bg-[#1A0F0F] text-white rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[12px] font-bold tracking-[0.12em] opacity-70">NEXT POoja</div>
                    <div className="font-bold leading-tight">Maha Aarti • 7:00 PM Tonight</div>
                    <div className="text-[12px] opacity-70">Madhyahna Aarti • 12:00 PM</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#FF6B00] grid place-items-center shrink-0">🪔</div>
                </div>
              </div>
            </div>

            {/* documentary card */}
            <div className="mt-4 bg-white border border-[#F0D9B5] rounded-[20px] p-3 flex items-center gap-3">
              <div className="w-[88px] h-[64px] rounded-xl overflow-hidden bg-zinc-900 relative shrink-0">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400" className="w-full h-full object-cover opacity-80" alt="" />
                <div className="absolute inset-0 grid place-items-center"><div className="w-8 h-8 rounded-full bg-white/90 grid place-items-center"><Play size={14} className="fill-[#FF6B00] text-[#FF6B00] ml-[2px]" /></div></div>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-bold leading-tight text-[#1A0F0F]">Making of 70FT Ganesh — Watch Documentary</div>
                <div className="text-[12px] text-[#8B7355]">4K • 3 min • 2.1M views</div>
              </div>
              <a href="#gallery" className="ml-auto w-9 h-9 rounded-full bg-[#FFF3D4] grid place-items-center text-[#FF6B00] border border-[#F0D9B5] shrink-0"><ArrowRight size={16} /></a>
            </div>
          </div>
        </div>

        {/* marquee duplicate for GSAP aesthetic */}
        <div className="mt-10 -mx-4 md:-mx-6 border-y border-[#F0D9B5] bg-white/60 backdrop-blur">
          <div className="py-3 marquee-track">
            <span className="whitespace-nowrap px-8 mono text-[12px] font-bold tracking-[0.16em] text-[#6D071A]/60">{settings?.marqueeText}</span>
            <span className="whitespace-nowrap px-8 mono text-[12px] font-bold tracking-[0.16em] text-[#6D071A]/60" aria-hidden>{settings?.marqueeText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
