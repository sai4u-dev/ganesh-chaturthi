import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Sparkles, Play, Film, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection({ data }) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const years = useMemo(() => {
    const ys = [...new Set((data||[]).map(d=>d.year).filter(Boolean))].sort((a,b)=>b-a);
    return ['all', ...ys];
  }, [data]);

  const filtered = useMemo(() => {
    let f = data || [];
    if (filter !== 'all') f = f.filter(d => d.category === filter);
    if (yearFilter !== 'all') f = f.filter(d => String(d.year) === String(yearFilter));
    return f;
  }, [data, filter, yearFilter]);

  const cats = ['all', 'ganesh', 'idols', 'darshan', 'making', 'pooja', 'annadanam', 'nimarjanam', 'crowd'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        y: 20, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' }
      });
    }, ref);
    return () => ctx.revert();
  }, [filtered]);

  return (
    <section ref={ref} id="gallery" className="py-10 md:py-16 bg-[#FFF8E7]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-[#FF6B00]"><Sparkles size={14} /> GANESH PHOTOS • IDOLS • DARSHAN</div>
            <h2 className="display font-[750] text-[32px] md:text-[44px] leading-[0.9] tracking-[-0.03em] text-[#1A0F0F]">Gallery</h2>
            <p className="mt-3 text-[14px] text-[#8B7355] max-w-[520px]">Ganesh photos, idol highlights, previous years and current year — all photos uploaded by admin. <Link to="/gallery" className="font-bold text-[#FF6B00] hover:underline inline-flex items-center gap-1">Open full Ganesh Gallery <ArrowRight size={12} /></Link></p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold capitalize border ${filter === c ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#8B7355]'}`}>{c}</button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[11px] font-bold tracking-wide text-[#8B7355]">YEAR:</span>
              {years.map(y => (
                <button key={y} onClick={() => setYearFilter(y)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${String(yearFilter)===String(y) ? 'bg-[#FF6B00] text-white border-[#FF6B00]' : 'bg-white border-[#F0D9B5] text-[#6D071A]'}`}>{y==='all'?'All':y}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered?.map((g) => (
            <div key={g._id} className="gallery-item break-inside-avoid relative group rounded-[20px] overflow-hidden bg-white border border-[#F0D9B5]/60 cursor-pointer" onClick={() => setActive(g)}>
              <img src={g.imageUrl} alt={g.title} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
              {g.videoUrl && (
                <div className="absolute inset-0 grid place-items-center bg-black/20">
                  <div className="w-12 h-12 rounded-full bg-white/95 grid place-items-center shadow-xl"><Play size={18} className="fill-[#FF6B00] text-[#FF6B00] ml-0.5" /></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-2">
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-[#1A0F0F] leading-tight truncate flex items-center gap-1">{g.videoUrl && <Film size={12} className="text-[#FF6B00]" />}{g.title || g.category}</div>
                    <div className="text-[11px] font-semibold text-[#8B7355]">{g.category} • {g.year}{g.videoUrl ? ' • Video' : ''}</div>
                  </div>
                  <div className="ml-auto w-8 h-8 rounded-full bg-[#1A0F0F] grid place-items-center text-white"><Maximize2 size={14} /></div>
                </div>
              </div>
              <span className="absolute top-3 left-3 bg-[#1A0F0F]/80 backdrop-blur text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border border-white/20">{g.category}</span>
              {g.year && <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#1A0F0F] text-[10px] font-bold px-2 py-1 rounded-full border border-[#F0D9B5]">{g.year}</span>}
            </div>
          ))}
        </div>

        {filtered?.length === 0 && <div className="text-center py-12 text-[#8B7355] bg-white border border-[#F0D9B5] rounded-2xl mt-4">No images in this filter.</div>}
        <div className="mt-6 text-center">
          <Link to="/gallery" className="inline-flex items-center gap-2 bg-[#1A0F0F] text-white px-6 py-3 rounded-full text-[13px] font-bold hover:bg-black transition-colors">View All Ganesh Photos & Idols <ArrowRight size={14} /></Link>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md grid place-items-center p-4" onClick={() => setActive(null)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} onClick={e => e.stopPropagation()} className="relative max-w-[960px] w-full bg-white rounded-[20px] overflow-hidden">
              {active.videoUrl ? (
                <div className="aspect-video bg-black">
                  <iframe src={active.videoUrl} title={active.title} className="w-full h-full" allowFullScreen />
                </div>
              ) : (
                <img src={active.imageUrl} alt={active.title} className="w-full max-h-[70vh] object-contain bg-[#FFF8E7]" />
              )}
              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#1A0F0F] flex items-center gap-2">{active.videoUrl && <Film size={16} className="text-[#FF6B00]" />}{active.title}</div>
                  <div className="text-[12px] text-[#8B7355]">{active.category} • {active.year}{active.videoUrl ? ' • Video Highlight' : ''}</div>
                </div>
                <button onClick={() => setActive(null)} className="w-10 h-10 rounded-full bg-[#1A0F0F] text-white grid place-items-center"><X size={18} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
