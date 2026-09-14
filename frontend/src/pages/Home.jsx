import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ScheduleSection from '../components/ScheduleSection';
import PoojaTimings from '../components/PoojaTimings';
import AnnadanamSection from '../components/AnnadanamSection';
import NimarjanamSection from '../components/NimarjanamSection';
import InvitationSection from '../components/InvitationSection';
import Promotions from '../components/Promotions';
import RegistrationSection from '../components/RegistrationSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import useSmoothScroll from '../hooks/useSmoothScroll';
import { api } from '../api/client';
import { useT } from '../lib/i18n';
import { fallbackSettings, fallbackPooja, fallbackAnnadanam, fallbackNimarjanam, fallbackPromotions, fallbackGallery, fallbackSchedule } from '../data/fallback';

export default function Home() {
  useSmoothScroll();
  const [lang, setLang] = useState('en');
  const t = useT(lang);

  const [settings, setSettings] = useState(fallbackSettings);
  const [pooja, setPooja] = useState(fallbackPooja);
  const [annadanam, setAnnadanam] = useState(fallbackAnnadanam);
  const [nimarjanam, setNimarjanam] = useState(fallbackNimarjanam);
  const [promotions, setPromotions] = useState(fallbackPromotions);
  const [gallery, setGallery] = useState(fallbackGallery);
  const [schedule, setSchedule] = useState(fallbackSchedule);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const results = await Promise.allSettled([
          api.getSettings(),
          api.getPooja(),
          api.getAnnadanam(),
          api.getNimarjanam(),
          api.getPromotions(),
          api.getGallery(),
          api.getSchedule(),
        ]);

        if (cancelled) return;
        const [s, p, a, n, pr, g, sch] = results;
        if (s.status === 'fulfilled' && s.value) setSettings(s.value);
        if (p.status === 'fulfilled' && Array.isArray(p.value) && p.value.length) setPooja(p.value);
        if (a.status === 'fulfilled' && Array.isArray(a.value) && a.value.length) setAnnadanam(a.value);
        if (n.status === 'fulfilled' && n.value) setNimarjanam(n.value);
        if (pr.status === 'fulfilled' && Array.isArray(pr.value) && pr.value.length) setPromotions(pr.value);
        if (g.status === 'fulfilled' && Array.isArray(g.value) && g.value.length) setGallery(g.value);
        if (sch.status === 'fulfilled' && Array.isArray(sch.value) && sch.value.length) setSchedule(sch.value);

        const anyOk = results.some(r => r.status === 'fulfilled' && r.value);
        setApiStatus(anyOk ? 'connected' : 'fallback');
      } catch {
        setApiStatus('fallback');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Persist lang
  useEffect(() => {
    const saved = localStorage.getItem('ganesh_lang');
    if (saved && (saved === 'en' || saved === 'te')) setLang(saved);
  }, []);
  useEffect(() => { localStorage.setItem('ganesh_lang', lang); }, [lang]);

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <Navbar settings={settings} t={t} lang={lang} setLang={setLang} />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {apiStatus === 'fallback' && (
          <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-[12px] font-medium px-4 py-2 rounded-full inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Demo mode — showing sample data. Connect MongoDB backend at localhost:5000 for updates.
          </div>
        )}
        {apiStatus === 'connected' && !loading && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected — Data from MongoDB
          </div>
        )}
      </div>

      <Hero settings={settings} t={t} lang={lang} />
      <AboutSection settings={settings} t={t} />
      <ScheduleSection data={schedule} t={t} />
      <PoojaTimings data={pooja} t={t} />
      <AnnadanamSection data={annadanam} t={t} />
      <NimarjanamSection data={nimarjanam} t={t} />
      <InvitationSection settings={settings} t={t} />
      <Promotions data={promotions} t={t} />
      <RegistrationSection t={t} />
      <GallerySection data={gallery} t={t} />
      <ContactSection settings={settings} t={t} />

      <Footer settings={settings} t={t} lang={lang} />
    </div>
  );
}
