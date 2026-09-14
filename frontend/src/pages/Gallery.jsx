import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Maximize2, Sparkles, Play, Film, Image as ImageIcon, Filter } from 'lucide-react';
import { api } from '../api/client';
import { fallbackGallery } from '../data/fallback';

const CATS = [
  { id: 'all', label: 'All Photos' },
  { id: 'ganesh', label: 'Ganesh Photos' },
  { id: 'idols', label: 'Ganesh Idols' },
  { id: 'darshan', label: 'Darshan' },
  { id: 'making', label: 'Making' },
  { id: 'pooja', label: 'Pooja' },
  { id: 'nimarjanam', label: 'Nimarjanam' },
  { id: 'crowd', label: 'Crowd' },
];

export default function Gallery() {
  const [gallery, setGallery] = useState(fallbackGallery);
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.getGallery()
      .then(data => {
        if (!cancelled && Array.isArray(data) && data.length) setGallery(data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return gallery;
    return gallery.filter(g => g.category === filter);
  }, [gallery, filter]);

  const ganeshCount = gallery.filter(g => g.category === 'ganesh').length;
  const idolsCount = gallery.filter(g => g.category === 'idols').length;

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1A0F0F] text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-semibold">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-2 text-[13px] font-bold">
            <ImageIcon size={16} className="text-[#FFB000]" /> Ganesh Gallery
            <span className="hidden sm:inline bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-[11px]">
              {filtered.length} photos
            </span>
          </div>
          <Link to="/admin" className="hidden md:inline-flex bg-white text-[#1A0F0F] px-3 py-1.5 rounded-full text-[12px] font-bold">Admin</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#6D071A] via-[#8B1A2B] to-[#FF6B00] text-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em]">
            <Sparkles size={14} className="text-[#FFB000]" /> GANESH PHOTOS & IDOLS • 2026 UTSAV
          </div>
          <h1 className="display font-[800] text-[32px] md:text-[48px] leading-[0.9] tracking-[-0.03em] mt-4">
            Ganesh Photos <span className="text-[#FFB000]">& Idols</span>
          </h1>
          <p className="mt-3 text-[14px] md:text-[15px] text-white/80 max-w-[640px] leading-relaxed">
            Explore divine moments captured during Khairatabad Utsav — from majestic 70-ft Ganesh idols to intimate darshan photos, all uploaded by the admin. Filter by category or year.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            <span className="bg-white text-[#6D071A] px-3 py-1.5 rounded-full font-bold">{gallery.length} total</span>
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">{ganeshCount} Ganesh Photos</span>
            <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">{idolsCount} Idol Photos</span>
            {loading && <span className="bg-amber-400 text-[#1A0F0F] px-3 py-1.5 rounded-full animate-pulse">Loading from MongoDB…</span>}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[56px] z-20 bg-[#FFF8E7]/80 backdrop-blur border-b border-[#F0D9B5] py-3">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex flex-wrap gap-2 items-center">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#8B7355] mr-1"><Filter size={14} /> Filter:</span>
          {CATS.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-full text-[12px] font-bold border capitalize transition-colors ${filter === c.id ? 'bg-[#1A0F0F] text-white border-[#1A0F0F]' : 'bg-white border-[#F0D9B5] text-[#6D071A] hover:bg-[#FFF3D4]'}`}
            >
              {c.label}
            </button>
          ))}
          <Link to="/" className="ml-auto hidden md:inline-flex text-[12px] font-semibold text-[#FF6B00] hover:underline">View on Home →</Link>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#F0D9B5] rounded-[20px]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF3D4] grid place-items-center text-[#FF6B00]"><ImageIcon size={20} /></div>
            <div className="mt-3 font-bold text-[#1A0F0F]">No photos in “{CATS.find(c=>c.id===filter)?.label}”</div>
            <div className="text-[13px] text-[#8B7355] mt-1">Admin can upload via Dashboard → Gallery. Try “All Photos”.</div>
            <button onClick={() => setFilter('all')} className="mt-4 bg-[#1A0F0F] text-white px-5 py-2.5 rounded-full text-[13px] font-bold">Show All</button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filtered.map(g => (
              <div
                key={g._id}
                onClick={() => setActive(g)}
                className="break-inside-avoid group relative rounded-[20px] overflow-hidden bg-white border border-[#F0D9B5]/60 cursor-pointer hover:shadow-[0_12px_32px_rgba(109,7,26,0.12)] transition-all"
              >
                <img src={g.imageUrl} alt={g.title} loading="lazy" className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                {g.videoUrl && (
                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white/95 grid place-items-center shadow-xl"><Play size={18} className="fill-[#FF6B00] text-[#FF6B00] ml-0.5" /></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="bg-white/95 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-2">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#1A0F0F] truncate flex items-center gap-1">{g.videoUrl && <Film size={12} className="text-[#FF6B00]" />}{g.title || g.category}</div>
                      <div className="text-[11px] font-semibold text-[#8B7355] capitalize">{g.category} {g.year ? `• ${g.year}` : ''}</div>
                    </div>
                    <div className="ml-auto w-8 h-8 rounded-full bg-[#1A0F0F] grid place-items-center text-white"><Maximize2 size={14} /></div>
                  </div>
                </div>
                <span className="absolute top-3 left-3 bg-[#1A0F0F]/80 backdrop-blur text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border border-white/20 capitalize">{g.category}</span>
                {g.year && <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#1A0F0F] text-[10px] font-bold px-2 py-1 rounded-full border border-[#F0D9B5]">{g.year}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white border border-[#F0D9B5] rounded-[20px] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-[#1A0F0F]">Want your Ganesh moment featured?</div>
            <div className="text-[13px] text-[#8B7355]">Admin uploads are live instantly. Contact committee to submit your photos.</div>
          </div>
          <Link to="/#gallery" className="bg-[#FFF3D4] border border-[#F0D9B5] text-[#6D071A] px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#FFEB99]">View on Home →</Link>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md grid place-items-center p-4" onClick={() => setActive(null)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} onClick={e => e.stopPropagation()} className="relative max-w-[960px] w-full bg-white rounded-[20px] overflow-hidden">
              {active.videoUrl ? (
                <div className="aspect-video bg-black"><iframe src={active.videoUrl} title={active.title} className="w-full h-full" allowFullScreen /></div>
              ) : (
                <img src={active.imageUrl} alt={active.title} className="w-full max-h-[70vh] object-contain bg-[#FFF8E7]" />
              )}
              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-[#1A0F0F] flex items-center gap-2">{active.videoUrl && <Film size={16} className="text-[#FF6B00]" />}{active.title}</div>
                  <div className="text-[12px] text-[#8B7355] capitalize">{active.category} {active.year ? `• ${active.year}` : ''}{active.description ? ` • ${active.description}` : ''}</div>
                </div>
                <button onClick={() => setActive(null)} className="w-10 h-10 rounded-full bg-[#1A0F0F] text-white grid place-items-center"><X size={18} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
