import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Phone, Sparkles, Languages, Image as ImageIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ settings, t, lang, setLang }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: t('nav.home'), href: '#home', id: 'home' },
    { label: t('nav.about'), href: '#about', id: 'about' },
    { label: t('nav.schedule'), href: '#schedule', id: 'schedule' },
    { label: t('nav.pooja'), href: '#pooja', id: 'pooja' },
    { label: t('nav.annadanam'), href: '#annadanam', id: 'annadanam' },
    { label: t('nav.nimajjanam'), href: '#nimarjanam', id: 'nimarjanam' },
    { label: t('nav.invitation'), href: '#invitation', id: 'invitation' },
    { label: t('nav.register'), href: '#register', id: 'register' },
    { label: t('nav.gallery'), href: '#gallery', id: 'gallery' },
    { label: t('nav.contact'), href: '#contact', id: 'contact' },
  ];

  const scrollToHash = (href) => {
    const id = href.replace('#', '') || 'home';
    const el = document.getElementById(id);
    const lenis = window.__lenis;
    if (el) {
      if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.1 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
    } else if (id === 'home') {
      if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      history.pushState(null, '', window.location.pathname);
    }
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    // small delay to allow drawer to close before scroll (avoids layout shift)
    setTimeout(() => scrollToHash(href), 80);
  };

  if (isAdmin) return null;

  return (
    <>
      <div className="bg-[#6D071A] text-[#FFF8E7] text-[12px] md:text-[13px] font-medium tracking-wide py-2 overflow-hidden relative z-50">
        <div className="marquee-track">
          <span className="whitespace-nowrap px-6">{settings?.announcement || '✨ Ganpati Bappa Morya — Khairatabad Maha Ganesh 2026 • 70 Years • Sep 14-24 • Annadanam Daily ✨'}</span>
          <span className="whitespace-nowrap px-6" aria-hidden>{settings?.announcement || '✨ Ganpati Bappa Morya — Khairatabad Maha Ganesh 2026 • 70 Years • Sep 14-24 • Annadanam Daily ✨'}</span>
          <span className="whitespace-nowrap px-6" aria-hidden>{settings?.announcement || '✨ Ganpati Bappa Morya — Khairatabad Maha Ganesh 2026 • 70 Years • Sep 14-24 • Annadanam Daily ✨'}</span>
          <span className="whitespace-nowrap px-6" aria-hidden>{settings?.announcement || '✨ Ganpati Bappa Morya — Khairatabad Maha Ganesh 2026 • 70 Years • Sep 14-24 • Annadanam Daily ✨'}</span>
        </div>
      </div>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${scrolled ? 'glass shadow-[0_8px_32px_rgba(109,7,26,0.08)] border-[#F0D9B5]/60 py-2' : 'bg-[#FFF8E7]/80 backdrop-blur-md border-transparent py-3'}`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-[12px] bg-gradient-to-br from-[#FF6B00] to-[#6D071A] grid place-items-center text-white text-[18px] shadow-lg group-hover:rotate-[-6deg] transition-transform">ॐ</div>
            <div className="leading-none hidden sm:block">
              <div className="display font-bold text-[15px] md:text-[17px] tracking-[-0.02em] text-[#6D071A]">KHAIRATABAD</div>
              <div className="text-[10px] tracking-[0.16em] font-semibold text-[#FF6B00] -mt-[2px]">GANESH UTSAV 2026 • 70TH YEAR</div>
            </div>
            <div className="sm:hidden leading-none">
              <div className="display font-bold text-[14px] text-[#6D071A]">KHAIRATABAD</div>
              <div className="text-[10px] tracking-[0.14em] font-semibold text-[#FF6B00]">2026 • 70TH YEAR</div>
            </div>
          </a>

          <div className="hidden xl:flex items-center gap-1 bg-white/70 rounded-full p-1 border border-[#F0D9B5] overflow-hidden">
            {links.slice(0, 6).map(l => (
              <a
                key={l.id}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className="px-2.5 py-2 rounded-full text-[12px] font-semibold tracking-wide whitespace-nowrap transition-colors text-[#6D071A]/70 hover:text-[#6D071A] hover:bg-[#FFF3D4]"
              >
                {l.label}
              </a>
            ))}
            <div className="w-px h-6 bg-[#F0D9B5] mx-1" />
            {links.slice(6).map(l => (
              <a key={l.id} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="px-2.5 py-2 rounded-full text-[12px] font-semibold tracking-wide text-[#6D071A]/70 hover:text-[#6D071A] hover:bg-[#FFF3D4] transition-colors whitespace-nowrap">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/gallery" className="hidden lg:inline-flex items-center gap-1.5 bg-white border border-[#F0D9B5] px-3 py-[9px] rounded-full text-[12px] font-bold text-[#6D071A] hover:bg-[#FFF3D4] transition-colors">
              <ImageIcon size={14} /> Gallery
            </Link>
            <button
              onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
              className="inline-flex items-center gap-1.5 bg-white border border-[#F0D9B5] px-3 py-[9px] rounded-full text-[12px] font-bold text-[#6D071A] hover:bg-[#FFF3D4] transition-colors"
              title="Toggle English / Telugu"
            >
              <Languages size={14} /> {lang === 'en' ? 'తెలుగు' : 'EN'}
            </button>
            <div className="hidden xl:flex items-center gap-2 text-[12px] font-medium text-[#8B7355] max-w-[160px] truncate">
              <MapPin size={14} className="text-[#FF6B00] shrink-0" /> {settings?.venue || 'Khairatabad, Hyderabad'}
            </div>
            <Link to="/admin" className="hidden xl:inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-4 py-[10px] rounded-full text-[12px] font-semibold hover:bg-black transition-colors">
              <Sparkles size={14} /> Admin
            </Link>
            <a href={`tel:${settings?.contactPhone}`} className="inline-flex items-center gap-2 bg-[#FF6B00] text-white px-4 py-[10px] rounded-full text-[12px] font-bold hover:bg-[#E65100] transition-colors shadow-[0_8px_20px_rgba(255,107,0,0.3)]">
              <Phone size={14} /> {lang === 'en' ? 'Contact' : 'సంప్రదించండి'}
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setLang(lang === 'en' ? 'te' : 'en')} className="w-9 h-9 grid place-items-center rounded-full bg-white border border-[#F0D9B5] text-[#6D071A] text-[11px] font-bold">
              {lang === 'en' ? 'తె' : 'EN'}
            </button>
            <button onClick={() => setOpen(v => !v)} className="w-10 h-10 grid place-items-center rounded-full bg-white border border-[#F0D9B5] text-[#6D071A]">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <button onClick={() => setOpen(v => !v)} className="hidden md:inline-flex xl:hidden w-10 h-10 grid place-items-center rounded-full bg-white border border-[#F0D9B5] text-[#6D071A]">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="xl:hidden overflow-hidden border-t border-[#F0D9B5] bg-[#FFF8E7] max-h-[70vh] overflow-y-auto"
            >
              <div className="px-4 py-4 grid grid-cols-2 gap-2">
                {links.map(l => (
                  <a key={l.id} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="py-3 px-4 rounded-2xl font-semibold text-[13px] text-center bg-white border border-[#F0D9B5] text-[#6D071A]">{l.label}</a>
                ))}
                <Link to="/gallery" onClick={() => setOpen(false)} className="col-span-2 text-center bg-gradient-to-r from-[#FF6B00] to-[#FFB000] text-white py-3 rounded-full font-bold">Ganesh Photos & Idols →</Link>
                <Link to="/admin" onClick={() => setOpen(false)} className="col-span-2 mt-2 text-center bg-[#1A0F0F] text-white py-3 rounded-full font-semibold">Admin Login</Link>
                <a href={`tel:${settings?.contactPhone}`} className="col-span-2 text-center bg-[#FF6B00] text-white py-3 rounded-full font-bold">Contact • {settings?.contactPhone}</a>
                <div className="col-span-2 text-center text-[11px] text-[#8B7355] pt-2">📍 {settings?.venue} • {settings?.startDate ? new Date(settings.startDate).toLocaleDateString('en-IN') : 'Sep 14'} — {settings?.endDate ? new Date(settings.endDate).toLocaleDateString('en-IN') : 'Sep 24'}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
